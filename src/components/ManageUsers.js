import React, { useState } from 'react';
import '../styles/ManageUsers.css';
import { toast } from 'react-toastify'; // For notifications

const ManageUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', isApproved: false, isActive: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', isApproved: false, isActive: false },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', isApproved: true, isActive: true },
  ]);

  // Function to handle approval of a user
  const handleApprove = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, isApproved: true } : user
    );
    setUsers(updatedUsers);
    toast.success('User approved!');
  };

  // Function to handle rejection of a user
  const handleReject = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
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

  return (
    <div className="manage-users">
      <h1 className="page-title">Manage Users</h1>

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
                  <td>
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
                        onClick={() => handleReject(user.id)}
                        className="reject-btn"
                      >
                        Reject
                      </button>
                    )}

                    {/* Activate/Deactivate Buttons */}
                    {!user.isActive && (
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

export default ManageUsers;
