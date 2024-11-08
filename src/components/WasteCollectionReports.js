import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; // For notifications
import Modal from './Modal'; // Import the Modal component
import '../styles/WasteCollectionReport.css';

// Example data for waste collection reports (this would be fetched from an API in a real application)
const initialReports = [
  {
    id: 'WCR-001',
    collectionDate: '2024-11-05',
    location: 'Kingston',
    wasteType: 'Household',
    quantityCollected: '1500 kg',
    binIds: 'BIN-001, BIN-002',
    collectionVehicle: 'TRK-01',
    driverName: 'John Doe',
    startTime: '08:00 AM',
    endTime: '11:00 AM',
    recyclingRate: '35%',
    customerFeedback: 'No complaints',
  },
  {
    id: 'WCR-002',
    collectionDate: '2024-11-06',
    location: 'Montego Bay',
    wasteType: 'Recyclables',
    quantityCollected: '800 kg',
    binIds: 'BIN-003, BIN-004',
    collectionVehicle: 'TRK-02',
    driverName: 'Jane Smith',
    startTime: '09:00 AM',
    endTime: '11:30 AM',
    recyclingRate: '50%',
    customerFeedback: 'Some complaints about delays',
  },
  // Add more example data as needed...
];

const WasteCollectionReport = () => {
  const [reports, setReports] = useState(initialReports);
  const [filteredReports, setFilteredReports] = useState(initialReports);
  const [selectedReport, setSelectedReport] = useState(null); // For the selected report to view
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state

  const [filter, setFilter] = useState({
    startDate: '',
    endDate: '',
    location: '',
    wasteType: '',
  });

  useEffect(() => {
    // This would be where you fetch data, for example:
    // fetch('/api/waste-collection-reports')
    //   .then(response => response.json())
    //   .then(data => setReports(data));
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const applyFilters = () => {
    let filtered = reports;

    if (filter.startDate) {
      filtered = filtered.filter((report) => new Date(report.collectionDate) >= new Date(filter.startDate));
    }

    if (filter.endDate) {
      filtered = filtered.filter((report) => new Date(report.collectionDate) <= new Date(filter.endDate));
    }

    if (filter.location) {
      filtered = filtered.filter((report) => report.location.toLowerCase().includes(filter.location.toLowerCase()));
    }

    if (filter.wasteType) {
      filtered = filtered.filter((report) => report.wasteType.toLowerCase().includes(filter.wasteType.toLowerCase()));
    }

    setFilteredReports(filtered);
  };

  const openModal = (report) => {
    setSelectedReport(report);  // Set the report to be viewed
    setIsModalOpen(true);        // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);       // Close the modal
    setSelectedReport(null);     // Clear selected report
  };

  return (
    <div className="waste-collection-report">
      <h1 className="page-title">Waste Collection Report</h1>

      {/* Filter Section */}
      <div className="filter-section">
        <h2>Filter Reports</h2>
        <div className="filter-inputs">
          <input
            type="date"
            name="startDate"
            value={filter.startDate}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="endDate"
            value={filter.endDate}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="location"
            value={filter.location}
            placeholder="Location"
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="wasteType"
            value={filter.wasteType}
            placeholder="Waste Type"
            onChange={handleFilterChange}
          />
          <button onClick={applyFilters}>Apply Filters</button>
        </div>
      </div>

      {/* Waste Collection Report Table */}
      <div className="report-table">
        <h2>Collection Reports</h2>
        {filteredReports.length === 0 ? (
          <p>No reports found for the selected filters.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Collection Date</th>
                <th>Location</th>
                <th>Waste Type</th>
                <th>Quantity Collected</th>
                <th>Collection Vehicle</th>
                <th>Driver</th>
                <th>Recycling Rate</th>
                <th>Feedback</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.collectionDate}</td>
                  <td>{report.location}</td>
                  <td>{report.wasteType}</td>
                  <td>{report.quantityCollected}</td>
                  <td>{report.collectionVehicle}</td>
                  <td>{report.driverName}</td>
                  <td>{report.recyclingRate}</td>
                  <td>{report.customerFeedback}</td>
                  <td>
                    <button onClick={() => openModal(report)} className="view-btn">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal with Report Details */}
      <Modal
        show={isModalOpen}
        onClose={closeModal}
        report={selectedReport}
      />
    </div>
  );
};

export default WasteCollectionReport;
