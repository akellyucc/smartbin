import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css'; // Assuming a separate CSS file for styling
import { Line } from 'react-chartjs-2'; // Using Chart.js for data visualization
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalReports: 0,
    completedReports: 0,
  });

  // Sample Data Fetch Simulation (Replace with API calls)
  useEffect(() => {
    // Simulate fetching users and reports
    try {
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
      ]);
      setReports([
        { id: 1, title: 'Waste Collection Report - Week 1', date: '2024-10-01', status: 'Completed' },
        { id: 2, title: 'Waste Collection Report - Week 2', date: '2024-10-08', status: 'Pending' },
      ]);

      // Set Analytics Data
      setAnalytics({
        totalUsers: 2,
        activeUsers: 1,
        totalReports: 2,
        completedReports: 1,
      });
    } catch (err) {
      setError('Failed to load data');
    }
  }, []);

  // Handle changing user status
  const handleUserStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => user.id === userId ? { ...user, status: newStatus } : user));
    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      activeUsers: users.filter(user => user.status === 'Active').length,
    }));
  };

  // Line chart data for Analytics (Users over time)
  const chartData = {
    labels: ['Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5'], // Example dates
    datasets: [
      {
        label: 'Active Users',
        data: [1, 1, 1, 1, 2], // Example number of active users over days
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <section id="admin-dashboard" className="admin-dashboard">
      <h1>Administrator Dashboard</h1>

      {/* Analytics Overview */}
      <div className="dashboard-overview">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{analytics.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p>{analytics.activeUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Reports</h3>
          <p>{analytics.totalReports}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Reports</h3>
          <p>{analytics.completedReports}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="dashboard-section">
        <h2>Active Users Over Time</h2>
        <Line data={chartData} />
      </div>

      {/* Users Section */}
      <div className="dashboard-section">
        <h2>Users</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <button
                    onClick={() => handleUserStatusChange(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}
                  >
                    {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reports Section */}
      <div className="dashboard-section">
        <h2>Waste Management Reports</h2>
        <table className="reports-table">
          <thead>
            <tr>
              <th>Report Title</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td>{report.title}</td>
                <td>{report.date}</td>
                <td>{report.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Error Handling */}
      {error && <p className="error-message">{error}</p>}
    </section>
  );
};

export default AdminDashboard;
