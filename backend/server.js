const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { initSocket, emitBinStatusUpdate } = require('../src/components/SocketService'); // Adjust path as needed
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app); // Initialize the server first

// Initialize socket.io with the server
initSocket(server);

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to your front-end's URL
}));

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD, // Be careful with sensitive information
    database: process.env.DB_NAME,
});
console.log(process.env.DB_NAME);  // Access the variable

// Handle connection pool errors
pool.on('error', (err) => {
    console.error('Database connection pool error:', err);
});

// Function to execute queries
const queryDB = (query, values) => {
    return new Promise((resolve, reject) => {
        pool.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

///////////////////////
/////////LOGIN AND REG SECTION////
////////////////////////
// Simple API to register a new user (No password hashing for simplicity)

// Inside the register route:
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Check if username already exists
        const userCheckQuery = 'SELECT * FROM users WHERE username = ?';
        const existingUser = await queryDB(userCheckQuery, [username]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new user with hashed password in the DB
        const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
        await queryDB(insertUserQuery, [username, hashedPassword]);
        console.log(hashedPassword);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Simple API to login (no token authentication for simplicity)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const query = `
        SELECT
            users.id,
            users.email,
            users.password,
            roles.name AS role,
            roles.id AS role_id,
            GROUP_CONCAT(permissions.name) AS permissions
        FROM users
        JOIN roles ON users.role_id = roles.id
        LEFT JOIN role_permissions ON roles.id = role_permissions.role_id
        LEFT JOIN permissions ON role_permissions.permission_id = permissions.id
        WHERE users.email = ?
        GROUP BY users.id, roles.id;
    `;

    pool.query(query, [email], async (err, results) => {  // Use pool.query here
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = results[0];  // Assuming only one user is found

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, role: user.role, permissions: user.permissions.split(',') }, // Permissions are a comma-separated string
            'password1',  // Replace with a secure secret key
            { expiresIn: '1h' }  // Token expiration time
        );

        // Respond with user data and token
        res.json({
            message: 'Login successful',
            user: {
                email: user.email,
                role: user.role,
                permissions: user.permissions.split(','), // Split comma-separated permissions into an array
            },
            token,
        });
    });
});


//////////////////////
// Fetch Report Data Endpoint
app.get('/api/report/:parishName', async (req, res) => {
    const parishName = req.params.parishName;

    // SQL Query to fetch waste collection data by month
    const eachMonthByTotal_SQL = `
        SELECT
            MONTH(wc.collection_date) AS collection_month,
            SUM(wc.amount) AS total_amount
        FROM
            waste_collection wc
        JOIN
            parish p ON wc.parish_id = p.parish_id
        WHERE
            p.parish_name = ?
        GROUP BY
            collection_month
        ORDER BY
            collection_month
    `;

    // Getting recyclables vs non-recyclables
    const recy_vrs_nonRecy_SQL = `
        SELECT
            b.bin_type,
            SUM(wc.amount) AS total_amount
        FROM
            bins b
        LEFT JOIN
            waste_collection wc ON wc.waste_type_id IN (
                SELECT waste_type_id FROM waste_types WHERE bin_id = b.bin_id
            )
        GROUP BY
            b.bin_type
    `;

    // SQL Query to fetch total waste by type
    const wasteTypeByTotal_SQL = `
        SELECT
            wt.waste_type_name AS name,
            SUM(wc.amount) AS value
        FROM
            parish p
        JOIN
            waste_collection wc ON p.parish_id = wc.parish_id
        JOIN
            waste_types wt ON wc.waste_type_id = wt.id
        WHERE
            p.parish_name = ?
        GROUP BY
            wt.waste_type_name
    `;

    try {
        // Fetching waste trends
        const monthResults = await queryDB(eachMonthByTotal_SQL, [parishName]);

        // Fetching recyclables vs non-recyclables
        const recyclables = await queryDB(recy_vrs_nonRecy_SQL);

        // Fetching waste by type
        const typeResults = await queryDB(wasteTypeByTotal_SQL, [parishName]);

        // Preparing waste trends
        const wasteTrends = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(0, i).toLocaleString('default', { month: 'long' }),
            amount: monthResults.find(r => r.collection_month === (i + 1))?.total_amount || 0
        }));

        // Preparing waste by type
        const wasteByType = typeResults.map(row => ({
            name: row.name,
            value: row.value || 0
        }));

        // Calculating total waste
        const totalWaste = monthResults.reduce((sum, row) => sum + (row.total_amount || 0), 0);

        // Prepare response data
        const responseData = {
            totalWaste,
            wasteByType,
            wasteTrends,
            recyclables
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching report data:', error);
        res.status(500).json({ error: 'Error fetching report data' });
    }
});


///////////////////////////

app.get('/api/report/report-details', async (req, res) => {
    try {
        // Queries for fetching different data
        const binDetailsQuery = 'SELECT bin_id, latitude, longitude, status FROM bins';
        const healthBreakdownQuery = `
            SELECT c.community_name, COUNT(b.bin_id) AS total,
                   SUM(CASE WHEN b.status = 'needs maintenance' THEN 1 ELSE 0 END) AS needsMaintenance
            FROM community c
            JOIN bins b ON c.community_id = b.community_id
            GROUP BY c.community_name;
        `;
        const fullBinsQuery = `
            SELECT c.community_name, b.bin_id, b.status
            FROM community c
            JOIN bins b ON c.community_id = b.community_id
            WHERE b.status = 'full';
        `;
        //const historicalDataQuery = 'SELECT date,status, bin_id, COUNT(*) AS count_per_day FROM historical_data GROUP BY date';
        const locationBreakdownQuery = `
            SELECT c.community_name, COUNT(b.bin_id) AS bin_count_per_community
            FROM community c
            JOIN bins b ON c.community_id = b.community_id
            GROUP BY c.community_name;
        `;
        const activeRoutesQuery = 'SELECT * FROM active_routes WHERE status = "active"';

        // Fetch all data concurrently
        const [binDetails, healthBreakdown, fullBins, historicalData, locationBreakdown, activeRoutes] = await Promise.all([
            queryDB(binDetailsQuery),
            queryDB(healthBreakdownQuery),
            queryDB(fullBinsQuery),
            //queryDB(historicalDataQuery),
            queryDB(locationBreakdownQuery),
            queryDB(activeRoutesQuery)
        ]);

        // Send the data back to the frontend
        res.json({
            binDetails,
            healthBreakdown,
            fullBins,
            //historicalData,
            locationBreakdown,
            activeRoutes
        });
    } catch (error) {
        console.error('Error fetching bin details:', error);
        res.status(500).json({ error: 'Failed to fetch bin details' });
    }
});

///////////
app.get('/api/bin-details', async (req, res) => {
    try {
        // Queries for fetching different data
        const binDetailsQuery = 'SELECT bin_id, latitude, longitude, status FROM bins';
        const healthBreakdownQuery = `
            SELECT c.community_name, COUNT(b.bin_id) AS total,
                   SUM(CASE WHEN b.status = 'needs maintenance' THEN 1 ELSE 0 END) AS needsMaintenance
            FROM community c
            JOIN bins b ON c.community_id = b.community_id
            GROUP BY c.community_name;
        `;
        const fullBinsQuery = `
            SELECT c.community_name, b.bin_id, b.status
            FROM community c
            JOIN bins b ON c.community_id = b.community_id
            WHERE b.status = 'full';
        `;
        //const historicalDataQuery = 'SELECT date,status, bin_id, COUNT(*) AS count_per_day FROM historical_data GROUP BY date';
        const locationBreakdownQuery = `
            SELECT c.community_name, COUNT(b.bin_id) AS bin_count_per_community
            FROM community c
            JOIN bins b ON c.community_id = b.community_id
            GROUP BY c.community_name;
        `;
        const activeRoutesQuery = 'SELECT * FROM active_routes WHERE status = "active"';

        // Fetch all data concurrently
        const [binDetails, healthBreakdown, fullBins, historicalData, locationBreakdown, activeRoutes] = await Promise.all([
            queryDB(binDetailsQuery),
            queryDB(healthBreakdownQuery),
            queryDB(fullBinsQuery),
            //queryDB(historicalDataQuery),
            queryDB(locationBreakdownQuery),
            queryDB(activeRoutesQuery)
        ]);

        // Send the data back to the frontend
        res.json({
            binDetails,
            healthBreakdown,
            fullBins,
            //historicalData,
            locationBreakdown,
            activeRoutes
        });
    } catch (error) {
        console.error('Error fetching bin details:', error);
        res.status(500).json({ error: 'Failed to fetch bin details' });
    }
});

// Route to update bin status
app.put('/api/bins/:bin_id', async (req, res) => {
    const binId = req.params.bin_id;
    const { status, longitude, latitude } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    try {
        const result = await queryDB('UPDATE bins SET status = ?, longitude = ?, latitude = ? WHERE bin_id = ?', [status, longitude, latitude, binId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Bin with ID ${binId} not found` });
        }

        // Emit the bin status update
        emitBinStatusUpdate({
            binId: binId,
            status: status,
            location: { lat: latitude, lng: longitude },
        });

        res.status(200).json({ message: `Bin ${binId} updated successfully`, result });
    } catch (error) {
        console.error('Database update error:', error);
        res.status(500).json({ error: 'Failed to update bin' });
    }
});

// Route to update bin status
app.put('/api/test/:bin_id', async (req, res) => {
    const binId = req.params.bin_id;
    const { status } = req.body;

    try {
        // Emit the bin status update
        emitBinStatusUpdate({
            binId: binId,
        // Replace with actual location if available
        });

    } catch (error) {
        console.error('eror emiting notification:', error);
        res.status(500).json({ error: 'Failed to update bin' });
    }

});
// Route to fetch all bins
app.get('/api/bins', async (req, res) => {
    try {
        const results = await queryDB('SELECT * FROM bins');
        res.json(results);
    } catch (error) {
        console.error('Error fetching bins:', error);
        res.status(500).json({ error: 'Failed to fetch bins' });
    }
});

// Route to get total bins monitored
app.get('/api/bins/totalBinsMonitored', async (req, res) => {
    try {
        const rows = await queryDB('SELECT COUNT(*) AS total FROM bins');
        res.json({ total: rows[0]?.total || 0 });
    } catch (error) {
        console.error('Error fetching total bins monitored:', error);
        res.status(500).json({ message: 'Could not fetch total bins monitored: ' + error.message });
    }
});

// Route to fetch total full bins
app.get('/api/bins/totalFullBins', async (req, res) => {
    try {
        const rows = await queryDB('SELECT COUNT(*) AS total FROM bins WHERE status = "full"');
        res.json({ total: rows[0]?.total || 0 });
    } catch (error) {
        console.error('Error fetching total full bins:', error);
        res.status(500).json({ message: 'Could not fetch total full bins: ' + error.message });
    }
});

// Route to fetch total near full bins
app.get('/api/bins/totalNearFullBins', async (req, res) => {
    try {
        const rows = await queryDB('SELECT COUNT(*) AS total FROM bins WHERE status = "near full"');
        res.json({ total: rows[0]?.total || 0 });
    } catch (error) {
        console.error('Error fetching total near full bins:', error);
        res.status(500).json({ message: 'Could not fetch total near full bins: ' + error.message });
    }
});

// Route to fetch near full bins details
app.get('/api/bins/nearFullBinsDetails', async (req, res) => {
    try {
        const nearFullQuery = 'SELECT  c.community_name, p.parish_name,c.community_id ,b.bin_id,b.status FROM community c   join bins b on  b.community_id = c.community_id  join parish p  WHERE status = "near full"';
            const [nearFullDetails] = await Promise.all([
                  queryDB(nearFullQuery),
            ]);
            res.json({ nearFullDetails,  });

    } catch (error) {
        console.error('Error fetching near full bins details:', error);
        res.status(500).json({ message: 'Could not fetch near full bins details: ' + error.message });
    }
});



// Route to fetch full bins details
app.get('/api/bins/fullBinsDetails', async (req, res) => {
    try {
           const fullBinDetailsQuery = 'SELECT  c.community_name, p.parish_name,c.community_id ,b.bin_id,b.status FROM community c   join bins b on  b.community_id = c.community_id  join parish p  WHERE status = "full"';
            // Fetch all data concurrently
            const [fullBinDetails] = await Promise.all([
                  queryDB(fullBinDetailsQuery),
            ]);
            // Send the data back to the frontend
            res.json({
               fullBinDetails,
            });
    } catch (error) {
        console.error('Error fetching active routes details:', error);
        res.status(500).json({ message: 'Could not fetch active routes details: ' + error.message });
    }
});
// Route to fetch bins by parish
app.get('/api/bins/binsByParish/:parish', async (req, res) => {
    const parish = req.params.parish;
    try {
        const rows = await queryDB('SELECT b.bin_id, b.latitude,b.last_emptied, b.longitude, b.status FROM bins b JOIN community c ON b.community_id = c.community_id JOIN parish p ON c.parish_id = p.parish_id WHERE p.parish_name   = ?', [parish]);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching bins by parish:', error);
        res.status(500).json({ message: 'Could not fetch bins by parish: ' + error.message });
    }
});
// Route to fetch all bins
app.get('/api/bins/allBins', async (req, res) => {
    try {
        const rows = await queryDB('SELECT b.bin_id, b.latitude,b.last_emptied, b.longitude, b.status FROM bins b  ');

        res.json(rows);
    } catch (error) {
        console.error('Error fetching all bins: ', error);
        res.status(500).json({ message: 'Could not fetch all bins : ' + error.message });
    }
});
// Route to fetch parish coordinates
app.get('/api/parish/:parishName', async (req, res) => {
    const parishName = req.params.parishName;
    try {
        const rows = await queryDB('SELECT latitude, longitude FROM parish WHERE parish_name = ?', [parishName]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Parish not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching parish coordinates:', error);
        res.status(500).json({ message: 'Could not fetch parish coordinates: ' + error.message });
    }
});

// Route to fetch active routes
app.get('/api/active-routes', async (req, res) => {
    try {
        const rows = await queryDB('SELECT * FROM active_routes WHERE status = "active"');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching active routes:', error);
        res.status(500).json({ message: 'Could not fetch active routes: ' + error.message });
    }
});
// Route to fetch e routes
app.get('/api/routes', async (req, res) => {
    try {
        const rows = await queryDB('SELECT * FROM routes');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching active routes:', error);
        res.status(500).json({ message: 'Could not fetch active routes: ' + error.message });
    }
});

// Collection history API
app.get('/api/collection-history', async (req, res) => {
    try {
        // SQL queries
        const collectionHistorySQL = 'SELECT * FROM collection_historical_data'; // Get all collection history records
        //const totalSQL = 'SELECT COUNT(*) AS total FROM collection_historical_data'; // Get total count of records
        const totalSQL = 'SELECT SUM(collected_waste_volume) AS total_collected_waste FROM collection_historical_data';
        // Fetch data concurrently using Promise.all
        const [collectionHistoryData, totalData] = await Promise.all([
            queryDB(collectionHistorySQL),  // Results of collection history query
            queryDB(totalSQL),               // Results of total records query
        ]);

        // Get the total value from the query result (default to 0 if no result is found)
        const total = totalData[0]?.total_collected_waste || 0;

        // Send the response with the collection history and the total number of records
        res.json({
            collectionHistory: collectionHistoryData,  // The collection history records
            total,  // The total number of records
        });
    } catch (error) {
        console.error('Error fetching collection history details:', error);
        res.status(500).json({ message: 'Could not fetch collection history details: ' + error.message });
    }
});

// Route to fetch active route details and the total number of routes
app.get('/api/activeRoutesDetails', async (req, res) => {
    try {
        // SQL queries
        const activeRoutesDetailsQuery = 'SELECT * FROM active_routes'; // Get all routes
        const totalQuery = 'SELECT COUNT(*) AS total FROM active_routes'; // Get total count of routes

        // Fetch data concurrently
        const [activeRoutsDetails, totalQueryResult] = await Promise.all([
            queryDB(activeRoutesDetailsQuery),
            queryDB(totalQuery), // Query to calculate the total number of routes
        ]);

        // Get the total value from the query result
        const total = totalQueryResult[0]?.total || 0; // Default to 0 if there's no result

        // Send the response with the active route details and the total
        res.json({
            activeRoutsDetails,
            total, // Include the total number of routes in the response
        });
    } catch (error) {
        console.error('Error fetching active routes details:', error);
        res.status(500).json({ message: 'Could not fetch active routes details: ' + error.message });
    }
});

/////////////////////////////////////
// Route to fetch active route details and the total number of routes


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
