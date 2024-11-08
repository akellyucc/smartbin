import React from 'react';
import '../styles/Modal.css'; // Add styling for the modal

const Modal = ({ show, onClose, report }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Waste Collection Report Details</h2>

        <div className="modal-body">
          <table className="modal-table">
            <tbody>
              <tr>
                <td className="modal-label">Report ID:</td>
                <td className="modal-value">{report.id}</td>
              </tr>
              <tr>
                <td className="modal-label">Collection Date:</td>
                <td className="modal-value">{report.collectionDate}</td>
              </tr>
              <tr>
                <td className="modal-label">Location:</td>
                <td className="modal-value">{report.location}</td>
              </tr>
              <tr>
                <td className="modal-label">Waste Type:</td>
                <td className="modal-value">{report.wasteType}</td>
              </tr>
              <tr>
                <td className="modal-label">Quantity Collected:</td>
                <td className="modal-value">{report.quantityCollected}</td>
              </tr>
              <tr>
                <td className="modal-label">Collection Vehicle:</td>
                <td className="modal-value">{report.collectionVehicle}</td>
              </tr>
              <tr>
                <td className="modal-label">Driver Name:</td>
                <td className="modal-value">{report.driverName}</td>
              </tr>
              <tr>
                <td className="modal-label">Start Time:</td>
                <td className="modal-value">{report.startTime}</td>
              </tr>
              <tr>
                <td className="modal-label">End Time:</td>
                <td className="modal-value">{report.endTime}</td>
              </tr>
              <tr>
                <td className="modal-label">Recycling Rate:</td>
                <td className="modal-value">{report.recyclingRate}</td>
              </tr>
              <tr>
                <td className="modal-label">Customer Feedback:</td>
                <td className="modal-value">{report.customerFeedback}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default Modal;
