import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend, ArcElement, LineElement } from 'chart.js';

// Registering necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement // Register LineElement for Line chart
);

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

  useEffect(() => {
    try {
      // Simulate fetching users and reports
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
      ]);
      setReports([
        { id: 1, title: 'Waste Collection Report - Week 1', date: '2024-10-01', status: 'Completed' },
        { id: 2, title: 'Waste Collection Report - Week 2', date: '2024-10-08', status: 'Pending' },
      ]);
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

  const handleUserStatusChange = (userId, newStatus) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);

    // Update analytics dynamically
    setAnalytics(prev => ({
      ...prev,
      activeUsers: updatedUsers.filter(user => user.status === 'Active').length,
    }));
  };

  const chartDataUsers = {
    labels: ['Oct 1', 'Oct 2', 'Oct 3', 'Oct 4', 'Oct 5'],
    datasets: [
      {
        label: 'Active Users',
        data: [1, 1, 1, 1, 2],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const chartDataBar = {
    labels: ['Total Users', 'Active Users'],
    datasets: [
      {
        label: 'Users',
        data: [analytics.totalUsers, analytics.activeUsers],
        backgroundColor: ['#36a2eb', '#ff6384'],
        borderColor: ['#36a2eb', '#ff6384'],
        borderWidth: 1,
      },
    ],
  };

  const chartDataPie = {
    labels: ['Completed Reports', 'Pending Reports'],
    datasets: [
      {
        data: [analytics.completedReports, analytics.totalReports - analytics.completedReports],
        backgroundColor: ['#36a2eb', '#ffcd56'],
        hoverBackgroundColor: ['#36a2eb', '#ffcd56'],
      },
    ],
  };

  return (
    <section id="admin-dashboard" className="admin-dashboard">
      <h1>Administrator Report</h1>

      {/* Bar Chart for Total Users and Active Users */}
      <div className="dashboard-section">
        <h2>Users Overview</h2>
        {/* Bar Chart Container */}
        <div className="chart-container" style={{ height: '300px' }}>
          <Bar data={chartDataBar} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
      </div>

      {/* Line Chart for Active Users Over Time */}
      <div className="dashboard-section">
        <h2>Active Users Over Time</h2>
        {/* Line Chart Container */}
        <div className="chart-container">
          <Line data={chartDataUsers} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>
      </div>

      {/* Pie Chart for Report Status */}
      <div className="dashboard-section">
        <h2>Report Status</h2>
        <div className="pie-chart-container">
          <Pie data={chartDataPie} />
        </div>
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
                  <button onClick={() => handleUserStatusChange(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}>
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
