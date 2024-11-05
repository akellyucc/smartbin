const mysql = require('mysql');
/*
// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10,  // Adjust the limit based on your needs
  host: 'localhost',    // Replace with your MySQL host, e.g., '127.0.0.1'
  user: 'smrlsmc_smartbin',         // Your MySQL username
  password: 'andrew@kelly', // Your MySQL password
  database: 'smarlsmc_smartbin', // Your MySQL database name
});
*/

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD, // Be careful with sensitive information
    database: process.env.DB_NAME,
});

// Function to connect to the database
const connectDB = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject('Error connecting to the database: ' + err.message);
      } else {
        console.log('Connected to the MySQL database');
        resolve(connection);
        connection.release();  // Release connection back to the pool
      }
    });
  });
};

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

module.exports = {
  connectDB,
  queryDB,
};
