import React from 'react';
import '../styles/BinsDetails.css';

// Reusable Table Component
const Table = ({ columns, data }) => (
  <table>
    <thead>
      <tr>
        {columns.map((col, idx) => (
          <th key={idx}>{col}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          {Object.keys(item).map((key, idx) => (
            <td key={idx}>{item[key] || 'N/A'}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const BinDetails = ({ data }) => {
  console.log('test active data', data);
  if (!data) {
    return <p>No data available.</p>;
  }

  console.log('Bin Details Data:', data); // Log the incoming data

  return (
    <div className="bin-details">
      {/* Bin Details Section */}
      {data.binDetails && data.binDetails.length > 0 && (
        <section>
          <h3>Bin Details</h3>
          <Table
            columns={['Bin ID', 'Location', 'Status']}
            data={data.binDetails.map(bin => ({
              bin_id: bin.bin_id,
              location: `Latitude: ${bin.latitude}, Longitude: ${bin.longitude}`,
              status: bin.status,
            }))}
          />
        </section>
      )}

      {/* Health Breakdown Section */}
      {data.healthBreakdown && data.healthBreakdown.length > 0 && (
        <section>
          <h3>Health Breakdown</h3>
          <Table
            columns={['Community', 'Total Bins', 'Needs Maintenance']}
            data={data.healthBreakdown.map(item => ({
              community_name: item.community_name,
              total: item.total,
              needsMaintenance: item.needsMaintenance,
            }))}
          />
        </section>
      )}
{data.activeRoutsDetails && data.activeRoutsDetails.length > 0 && (
  <section>
    <h3>Active Routes Details</h3>
    <Table
      columns={['Route', 'Location', 'Status', 'Start Time', 'End Time']}
      data={data.activeRoutsDetails.map(route => ({
        route: route.route,
        location: route.location,
        status: route.status,
        start_time: route.start_time ? new Date(route.start_time).toLocaleString() : 'N/A',
        end_time: route.end_time ? new Date(route.end_time).toLocaleString() : 'N/A',
      }))}
    />
  </section>
)}

      {/* Full Bins Breakdown Section */}
      {data.fullBins && data.fullBins.length > 0 && (
        <section>
          <h3>Full Bins Breakdown</h3>
          <Table
            columns={['Community', 'Bin ID', 'Bin Status']}
            data={data.fullBins.map(item => ({
              community_name: item.community_name,
              bin_id: item.bin_id,
              status: item.status,
            }))}
          />
        </section>
      )}

      {/* Historical Data Section */}
      {data.historicalData && data.historicalData.length > 0 && (
        <section>
          <h3>Historical Data</h3>
          <Table
            columns={['Date', 'Count Per Day']}
            data={data.historicalData.map(entry => ({
              date: new Date(entry.date).toLocaleDateString(),
              count_per_day: entry.count_per_day,
            }))}
          />
        </section>
      )}


    {/* Collection History Section */}
    {data.collectionHistory && data.collectionHistory.length > 0 && (
      <section>
        <h3>Collection History</h3>
        <Table
          columns={['Bin ID', 'Collection Date', 'Status', 'Waste Collected (kg)', 'Comments']}
          data={data.collectionHistory.map(entry => ({
            bin_id: entry.bin_id,
            collection_date: new Date(entry.date).toLocaleDateString(),  // Format the date
            status: entry.status,
            waste_collected: entry.collected_waste_volume,  // Show the collected waste volume
            comments: entry.comments,
          }))}
        />
      </section>
    )}


      {/* Active Routes Details Section (Fixed typo) */}
      {data.activeRoutesDetails && data.activeRoutesDetails.length > 0 && (
        <section>
          <h3>Active Routes Details</h3>
          <Table
            columns={['Route', 'Location', 'Status', 'Start Time', 'End Time']}
            data={data.activeRoutesDetails.map(route => ({
              route: route.route,
              location: route.location,
              status: route.status,
              start_time: route.start_time ? new Date(route.start_time).toLocaleString() : 'N/A',
              end_time: route.end_time ? new Date(route.end_time).toLocaleString() : 'N/A',
            }))}
          />
        </section>
      )}

      {/* Full Bin Details Section */}
      {data.fullBinDetails && data.fullBinDetails.length > 0 && (
        <section>
          <h3>Full Bin Details</h3>
          <Table
            columns={['Bin ID', 'Community Name', 'Parish', 'Status']}
            data={data.fullBinDetails.map(bin => ({
              bin_id: bin.bin_id,
              community_name: bin.community_name,
              parish_name: bin.parish_name,
              status: bin.status,
            }))}
          />
        </section>
      )}

      {/* Near Full Bins Section */}
      {data.nearFullDetails && data.nearFullDetails.length > 0 && (
        <section>
          <h3>Near Full Bins</h3>
          <Table
            columns={['Bin ID', 'Community Name', 'Location', 'Status']}
            data={data.nearFullDetails.map(bin => ({
              bin_id: bin.bin_id,
              community_name: bin.community_name,
              parish_name: bin.parish_name,
              status: bin.status,
            }))}
          />
        </section>
      )}
    </div>
  );
};

export default BinDetails;
