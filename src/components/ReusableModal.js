// Modal.js
import React from 'react';
import '../ReusableModal.css'; // Add your modal styles here

// Modal Component
const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null; // Return nothing if modal is not open

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose(); // Close the modal after confirming
  };

  const handleClose = () => {
    onClose(); // Close the modal when cancel is clicked
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={handleClose}>
            {cancelText}
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
};

export default Modal;
