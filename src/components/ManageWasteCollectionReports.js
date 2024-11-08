import React, { useState } from 'react';
import '../styles/ManageWasteCollectionReports.css'; // Add your CSS for styling
import { toast } from 'react-toastify'; // For notifications

const ManageWasteCollectionReports = () => {
  const [reports, setReports] = useState([
    { id: 1, parish: 'Kingston', collectionTime: '2024-11-05 08:00 AM', status: 'Pending' },
    { id: 2, parish: 'Montego Bay', collectionTime: '2024-11-06 10:00 AM', status: 'In Progress' },
    { id: 3, parish: 'Ocho Rios', collectionTime: '2024-11-07 07:00 AM', status: 'Completed' },
  ]);

  // Handle Mark as Completed action
  const handleMarkAsCompleted = (id) => {
    const updatedReports = reports.map((report) =>
      report.id === id ? { ...report, status: 'Completed' } : report
    );
    setReports(updatedReports);
    toast.success('Report marked as completed!');
  };

  // Handle Edit action
  const handleEditReport = (id) => {
    const report = reports.find((report) => report.id === id);
    if (report) {
      const newTime = prompt('Enter new collection time', report.collectionTime);
      if (newTime) {
        const updatedReports = reports.map((report) =>
          report.id === id ? { ...report, collectionTime: newTime } : report
        );
        setReports(updatedReports);
        toast.success('Report time updated!');
      }
    }
  };

  // Handle Cancel action
  const handleCancelReport = (id) => {
    const updatedReports = reports.filter((report) => report.id !== id);
    setReports(updatedReports);
    toast.success('Report cancelled!');
  };

  return (
    <div className="manage-reports">
      <h1 className="page-title">Manage Waste Collection Reports</h1>

      <div className="reports-list">
        {reports.length === 0 ? (
          <p className="empty-message">No reports available.</p>
        ) : (
          <table className="reports-table">
            <thead>
              <tr>
                <th>Parish</th>
                <th>Collection Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.parish}</td>
                  <td>{report.collectionTime}</td>
                  <td>{report.status}</td>
                  <td>
                    {/* Action buttons based on report status */}
                    {report.status !== 'Completed' && (
                      <button onClick={() => handleMarkAsCompleted(report.id)} className="mark-completed-btn">
                        Mark as Completed
                      </button>
                    )}

                    <button onClick={() => handleEditReport(report.id)} className="edit-btn">
                      Edit
                    </button>

                    <button onClick={() => handleCancelReport(report.id)} className="cancel-btn">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageWasteCollectionReports;
