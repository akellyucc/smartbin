import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Map from './components/Map';
import Notifications from './components/Notifications';
import ActionButtons from './components/ActionButtons';
import ReportPage from './components/ReportPage';
import SchedulePickup from './components/SchedulePickup';
import Login from './components/login';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import ManageUsers from './components/ManageUsers';
import ManageWasteCollection from './components/ManageWasteCollection';
import ManageBins from './components/ManageBins';
import ManageSettings from './components/ManageSettings';
import ManageWasteCollectionReports from './components/ManageWasteCollectionReports';
import WasteCollectionReports from './components/WasteCollectionReports';
import Services from './components/ApplyForService';
import Signup from './components/Signup'; // Adjust path as needed

import { ROLES, PERMISSIONS } from './constants/roles';

import './App.css';
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import the Toastify CSS

function App() {
  const [selectedParish, setSelectedParish] = useState('');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const hasPermission = (permission) => {
    return user && user.permissions && user.permissions.includes(permission);
  };

  return (
    <Router>
      <div className="App">
        {/* Conditionally render the Header only if user is logged in */}
        {user && (
          <Header onParishChange={setSelectedParish} onLogout={handleLogout} user={user} />
        )}
        <main>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            {/*services */}
            <Route
              path="/Services"
              element={
                user && user.role === ROLES.GUEST && hasPermission(PERMISSIONS.VIEW_SERVICES) ? (
                    <Services />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                user && hasPermission(PERMISSIONS.VIEW_DASHBOARD) ? (
                  <>
                    <Dashboard />
                    <div className="content">
                      <Map selectedParish={selectedParish} />
                      <Notifications />
                    </div>
                    <ActionButtons />
                  </>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />




      <Route>
        <Route path="/signup" element={<Signup />} />
        {/* Add more routes here */}
      </Route>


            {/* Admin Dashboard */}
            <Route
              path="/admin-dashboard"
              element={
                user && user.role === ROLES.ADMIN && hasPermission(PERMISSIONS.MANAGE_USERS) ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Role-based routes */}
            <Route
              path="/manage-users"
              element={
                user && user.role === ROLES.ADMIN && hasPermission(PERMISSIONS.MANAGE_USERS) ? (
                  <ManageUsers />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
           {/* Role-based routes */}
          <Route
            path="/services"
            element={
              // Check if user exists and if they have the required permission
              user  ? (
                <Services />
              ) : (
                <Navigate to="/login" />
              )
            }
          />


            <Route
              path="/manage-bins"
              element={
                user && (user.role === ROLES.DRIVER || user.role === ROLES.ADMIN) && hasPermission(PERMISSIONS.MANAGE_BINS) ? (
                  <ManageBins />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/settings"
              element={
                user && user.role === ROLES.ADMIN && hasPermission(PERMISSIONS.MANAGE_SETTINGS) ? (
                  <ManageSettings />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/reports"
              element={
                user && hasPermission(PERMISSIONS.VIEW_REPORTS) ? (
                  <ReportPage  selectedParish={selectedParish}/>

                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            <Route
              path="/manage-waste-collection-reports"
              element={
                user && user.role === ROLES.ADMIN ? (
                  <ManageWasteCollectionReports />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/waste-collection-reports"
              element={
                user && user.role === ROLES.ADMIN ? (
                  <WasteCollectionReports />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/manage-waste-collection"
              element={
                user && user.role === ROLES.ADMIN ? (
                  <ManageWasteCollection />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/schedule-pickup"
              element={
                user && hasPermission(PERMISSIONS.REQUEST_PICKUP) ? (
                  <SchedulePickup />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </main>
      </div>
    </Router>
  );
}

export default App;