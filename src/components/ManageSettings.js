import React, { useState } from 'react';
import '../styles/ManageSettings.css';
import { toast } from 'react-toastify'; // For notifications

const ManageSettings = () => {
  const [settings, setSettings] = useState({
    wasteCollectionTime: '08:00',
    binCapacity: 100,
    emailNotifications: true,
  });

  const handleSave = () => {
    // Logic to save settings (API call, etc.)
    console.log('Settings saved:', settings);
    toast.success('Settings saved successfully!');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="manage-settings">
      <h1 className="page-title">Manage Settings</h1>

      <div className="settings-form">
        {/* Waste Collection Time */}
        <div className="setting-item">
          <label htmlFor="wasteCollectionTime">Waste Collection Time</label>
          <input
            type="time"
            id="wasteCollectionTime"
            name="wasteCollectionTime"
            value={settings.wasteCollectionTime}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        {/* Bin Capacity */}
        <div className="setting-item">
          <label htmlFor="binCapacity">Bin Capacity (in liters)</label>
          <input
            type="number"
            id="binCapacity"
            name="binCapacity"
            value={settings.binCapacity}
            onChange={handleChange}
            className="input-field"
            min="1"
          />
        </div>

        {/* Email Notifications */}
        <div className="setting-item">
          <label>Email Notifications</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="emailNotifications"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
            />
            <span className="checkbox-label">Enable email notifications</span>
          </div>
        </div>

        {/* Save Button */}
        <button onClick={handleSave} className="save-button">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default ManageSettings;
