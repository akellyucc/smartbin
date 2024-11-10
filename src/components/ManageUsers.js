import React, { useState } from 'react';
import '../styles/ManageUsers.css';
import { toast } from 'react-toastify'; // For notifications
import Modal from './ManageUsersModal'; // Import the modal component

const ManageUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', isApproved: false, isActive: true, role: 'User', isBlocked: false },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', isApproved: false, isActive: false, role: 'User', isBlocked: false },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', isApproved: true, isActive: true, role: 'Admin', isBlocked: false },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false); // For managing modal visibility
  const [currentUser, setCurrentUser] = useState(null); // For managing current user being edited

  // Handle Add New User Button
  const openAddModal = () => {
    setCurrentUser(null); // Reset to null for adding a new user
    setIsModalOpen(true);
  };

  // Handle Edit User Button
  const openEditModal = (user) => {
    setCurrentUser(user); // Set the user to edit
    setIsModalOpen(true);
  };

  // Function to handle the approval of a user
  const handleApprove = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, isApproved: true } : user
    );
    setUsers(updatedUsers);
    toast.success('User approved!');
  };

  // Function to show the rejection confirmation toast
  const handleRejectToast = (user) => {
    const rejectToast = toast(
      <div>
        <p>Are you sure you want to reject {user.name}?</p>
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => handleReject(user)}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              padding: '8px 20px',
              border: 'none',
              borderRadius: '5px',
              marginRight: '10px',
              cursor: 'pointer',
            }}
          >
            Reject
          </button>
          <button
            onClick={() => toast.dismiss(rejectToast.id)}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '8px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false } // Prevent auto close and hide the close button
    );
  };

  // Function to handle the rejection of a user
  const handleReject = (user) => {
    const updatedUsers = users.filter((u) => u.id !== user.id);
    setUsers(updatedUsers);
    toast.success('User rejected!');
  };

  // Function to handle activation of a user
  const handleActivate = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, isActive: true } : user
    );
    setUsers(updatedUsers);
    toast.success('User activated!');
  };

  // Function to handle deactivation of a user
  const handleDeactivate = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, isActive: false } : user
    );
    setUsers(updatedUsers);
    toast.success('User deactivated!');
  };

  // Function to handle blocking a user
  const handleBlock = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, isBlocked: true } : user
    );
    setUsers(updatedUsers);
    toast.success('User blocked!');
  };

  // Function to handle unblocking a user
  const handleUnblock = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, isBlocked: false } : user
    );
    setUsers(updatedUsers);
    toast.success('User unblocked!');
  };

  // Function to handle role change
  const handleRoleChange = (id, newRole) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    toast.success(`Role changed to ${newRole}`);
  };

  // Function to save new or edited user
  const handleSaveUser = (user) => {
    if (user.id) {
      // Edit user
      const updatedUsers = users.map((u) => (u.id === user.id ? user : u));
      setUsers(updatedUsers);
      toast.success('User updated!');
    } else {
      // Add new user
      const newUser = { ...user, id: users.length + 1 }; // Auto-generate an ID
      setUsers([...users, newUser]);
      toast.success('User added!');
    }
    setIsModalOpen(false); // Close modal after saving
  };

  return (
    <div className="manage-users">
      <h1 className="page-title">Manage Users</h1>

      {/* Button to add a new user */}
      <button onClick={openAddModal} className="add-user-btn">
        Add New User
      </button>

      <div className="users-list">
        {users.length === 0 ? (
          <p className="empty-message">No users available.</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Approved</th>
                <th>Active</th>
                <th>Blocked</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isApproved ? 'Yes' : 'No'}</td>
                  <td>{user.isActive ? 'Yes' : 'No'}</td>
                  <td>{user.isBlocked ? 'Yes' : 'No'}</td>
                  <td>
                    {/* Role Dropdown */}
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >

                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Driver">Driver</option>
                      <option value="User">User</option>
                      <option value="Guest">Guest</option>
                    </select>
                  </td>
                  <td>
                    {/* Edit Button */}
                    <button
                      onClick={() => openEditModal(user)}
                      className="edit-btn"
                    >
                      Edit
                    </button>

                    {/* Approve/Reject Buttons */}
                    {!user.isApproved && (
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="approve-btn"
                      >
                        Approve
                      </button>
                    )}
                    {user.isApproved && (
                      <button
                        onClick={() => handleRejectToast(user)} // Use the toast here
                        className="reject-btn"
                      >
                        Reject
                      </button>
                    )}

                    {/* Activate/Deactivate Buttons */}
                    {!user.isActive && !user.isBlocked && (
                      <button
                        onClick={() => handleActivate(user.id)}
                        className="activate-btn"
                      >
                        Activate
                      </button>
                    )}
                    {user.isActive && (
                      <button
                        onClick={() => handleDeactivate(user.id)}
                        className="deactivate-btn"
                      >
                        Deactivate
                      </button>
                    )}

                    {/* Block/Unblock Buttons */}
                    {!user.isBlocked && (
                      <button
                        onClick={() => handleBlock(user.id)}
                        className="block-btn"
                      >
                        Block
                      </button>
                    )}
                    {user.isBlocked && (
                      <button
                        onClick={() => handleUnblock(user.id)}
                        className="unblock-btn"
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for adding/editing a user */}
      {isModalOpen && (
        <Modal
          user={currentUser}
          onSave={handleSaveUser}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageUsers;
