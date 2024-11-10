import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'; // Import your custom CSS
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '../constants/roles'; // Import roles and permissions

const Header = ({ onParishChange, onLogout, user }) => {
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedParish, setSelectedParish] = useState(null);

  const countries = [
    {
      name: 'Jamaica',
      parishes: [
        'Portmore', 'Kingston', 'St. Andrew', 'St. Catherine', 'Clarendon',
        'Manchester', 'St. Elizabeth', 'Westmoreland', 'Hanover', 'St. James',
        'Trelawny', 'St. Ann', 'St. Mary'
      ]
    },
    { name: 'USA', parishes: [] }
  ];

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedParish(null);  // Reset parish when changing country
    setIsLocationDropdownOpen(false); // Close the country dropdown
    console.log("Selected Country:", country);
  };

  const handleParishChange = (parish) => {
    setSelectedParish(parish);
    onParishChange(parish); // Pass parish back to parent component
    setIsLocationDropdownOpen(false); // Close the dropdowns after selecting a parish
    console.log("Selected Parish:", parish);
  };

  const handleLogout = () => {
    onLogout();
    setIsLocationDropdownOpen(false); // Close location dropdown on logout
  };

  // Check if the user has a specific permission
  const hasPermission = (permission) => {
    return user && ROLE_PERMISSIONS[user.role]?.includes(permission);
  };

  return (
    <header className="header">
      <div className="branding"><metric-card>Smart Bin Management and Disposal System</metric-card></div>

      <div className="nav-container">
        <nav>
          <ul className="nav">
            {/* Home Link - Visible to Managers, Admins, and Users with View Dashboard permission */}
            {(hasPermission(PERMISSIONS.VIEW_REPORTS) || hasPermission(PERMISSIONS.MANAGE_BINS) || hasPermission(PERMISSIONS.VIEW_DASHBOARD)) && (
              <li className="nav-item">
                <Link to="/" className="nav-links">Home</Link>
              </li>
            )}

            {/* Location Dropdown */}
            <li className="nav-item dropdown">
              <li
                className="nav-links"
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)} // Toggle dropdown visibility
              >
                Location
              </li>
              {isLocationDropdownOpen && (
                <div className="dropdown-menu">
                  {countries.map((country) => (
                    <div key={country.name}>
                      <button
                        className="dropdown-item"
                        onClick={() => handleCountryChange(country.name)}
                      >
                        {country.name}
                      </button>
                      {/* Show parishes dropdown if a country is selected */}
                      {country.name === selectedCountry && country.parishes.length > 0 && (
                        <div className="parish-menu">
                          {country.parishes.map((parish, index) => (
                            <button
                              key={index}
                              className="dropdown-item parish-item"
                              onClick={() => handleParishChange(parish)}
                            >
                              {parish}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>

            {/* Role-specific Links */}
            {user?.role === ROLES.ADMIN && (
              <li className="nav-item">
                <Link to="/admin-dashboard" className="nav-links">Admin Report</Link>
              </li>
            )}

            {user?.role === ROLES.ADMIN && (
              <li className="nav-item">
                <Link to="/manage-waste-collection-reports" className="nav-links">Manage Collection Reports</Link>
              </li>
            )}

            {user?.role === ROLES.MANAGER && (
              <li className="nav-item">
                <Link to="/manager-dashboard" className="nav-links">Manager Dashboard</Link>
              </li>
            )}
            {(user?.role === ROLES.MANAGER || user?.role === ROLES.ADMIN) && (
              <li className="nav-item">
                <Link to="/waste-collection-reports" className="nav-links">Waste Collection Report</Link>
              </li>
            )}

            {user?.role === ROLES.DRIVER && (
              <li className="nav-item">
                <Link to="/driver-dashboard" className="nav-links">Driver Dashboard</Link>
              </li>
            )}



            {/* Reports Link - Visible to Users with View Reports permission */}
            {hasPermission(PERMISSIONS.VIEW_REPORTS) && (
              <li className="nav-item">
                <Link to="/reports" className="nav-links">Reports</Link>
              </li>
            )}

            {/* Manage Bins Link - Visible to users with Manage Bins permission */}
            {hasPermission(PERMISSIONS.MANAGE_BINS) && (
              <li className="nav-item">
                <Link to="/manage-bins" className="nav-links">Manage Bins</Link>
              </li>
            )}

            {/* Manage Users Link - Visible only to Admin */}
            {user?.role === ROLES.ADMIN && hasPermission(PERMISSIONS.MANAGE_USERS) && (
              <li className="nav-item">
                <Link to="/manage-users" className="nav-links">Manage Users</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Profile Section on the Right */}
      <div className="profile-section">
        <button className="nav-link" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
