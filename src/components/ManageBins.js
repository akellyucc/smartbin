import React, { useState } from 'react';
import '../styles/ManageBins.css';
import { toast } from 'react-toastify'; // For notifications

const ManageBins = () => {
  const [bins, setBins] = useState([
    { id: 'BIN-001', location: 'Kingston', capacity: 100 },
    { id: 'BIN-002', location: 'Montego Bay', capacity: 150 },
  ]);

  const [newBin, setNewBin] = useState({
    binId: '',
    location: '',
    capacity: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Bin ID validation pattern (BIN-XXX format)
  const binIdRegex = /^BIN-\d{3}$/;

  const handleAddBin = () => {
    const { binId, location, capacity } = newBin;

    // Validation checks
    if (!binId || !location || !capacity) {
      toast.error("Please fill out all fields!");
      return;
    }

    if (!binId.match(binIdRegex)) {
      toast.error("Bin ID must be in the format BIN-XXX (e.g., BIN-001)!");
      return;
    }

    if (isNaN(capacity) || capacity <= 0) {
      toast.error("Please enter a valid bin capacity!");
      return;
    }

    // Add new bin
    setBins([
      ...bins,
      { id: binId, location, capacity: parseInt(capacity) },
    ]);

    // Clear form and close modal
    setNewBin({ binId: '', location: '', capacity: '' });
    setIsModalOpen(false);

    // Success message
    toast.success('Bin added successfully!');
  };

  // Handle removing a bin
  const handleRemoveBin = (binId) => {
    setBins(bins.filter((bin) => bin.id !== binId));
    toast.success('Bin removed successfully!');
  };

  // Handle input changes for new bin
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBin({ ...newBin, [name]: value });
  };

  // Open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setNewBin({ binId: '', location: '', capacity: '' }); // Reset form when closing
  };

  return (
    <div className="manage-bins">
      <h1 className="page-title">Manage Bins</h1>

      <div className="bins-list">
        <h2>Existing Bins</h2>
        {bins.length === 0 ? (
          <p className="empty-message">No bins available.</p>
        ) : (
          <table className="bins-table">
            <thead>
              <tr>
                <th>Bin ID</th>
                <th>Location</th>
                <th>Capacity (L)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bins.map((bin) => (
                <tr key={bin.id}>
                  <td>{bin.id}</td>
                  <td>{bin.location}</td>
                  <td>{bin.capacity}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveBin(bin.id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Bin Button */}
      <div className="add-bin-button-container">
        <button onClick={openModal} className="add-bin-button">
          Add New Bin
        </button>
      </div>

      {/* Modal for Adding Bin */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Bin</h2>
            <form>
              <label>Bin ID (BIN-XXX format)</label>
              <input
                type="text"
                name="binId"
                value={newBin.binId}
                onChange={handleChange}
                placeholder="Enter bin ID (e.g., BIN-001)"
                maxLength="7"
              />

              <label>Location</label>
              <input
                type="text"
                name="location"
                value={newBin.location}
                onChange={handleChange}
                placeholder="Enter bin location"
              />

              <label>Capacity (in liters)</label>
              <input
                type="number"
                name="capacity"
                value={newBin.capacity}
                onChange={handleChange}
                placeholder="Enter bin capacity"
              />

              <button type="button" onClick={handleAddBin} className="add-button">
                Add Bin
              </button>
            </form>

            <button onClick={closeModal} className="close-modal-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBins;
