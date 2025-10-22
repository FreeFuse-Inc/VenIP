import React, { useState } from 'react';
import '../styles/Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    organizationName: 'VenIP Events',
    contactEmail: 'admin@venip.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Downtown',
    timezone: 'UTC-5 (EST)',
    language: 'English',
  });

  const [userProfile, setUserProfile] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@venip.com',
    role: 'Administrator',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    bookingReminders: true,
    vendorUpdates: true,
    eventReminders: true,
    weeklyReport: false,
  });

  const [editMode, setEditMode] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setTempSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSaveSettings = () => {
    setSettings(tempSettings);
    setEditMode(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setTempSettings(settings);
    setEditMode(false);
  };

  return (
    <main className="settings-page">
      <header className="page-header">
        <h1 className="page-title">Settings</h1>
      </header>

      <div className="page-content">
        {saveSuccess && <div className="success-message">✓ Settings saved successfully!</div>}

        <div className="settings-container">
          <div className="settings-section">
            <h2 className="section-title">Organization Settings</h2>
            {editMode ? (
              <div className="form-container">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Organization Name</label>
                    <input
                      type="text"
                      name="organizationName"
                      value={tempSettings.organizationName}
                      onChange={handleSettingChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={tempSettings.contactEmail}
                      onChange={handleSettingChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={tempSettings.phone}
                      onChange={handleSettingChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={tempSettings.address}
                      onChange={handleSettingChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Timezone</label>
                    <select
                      name="timezone"
                      value={tempSettings.timezone}
                      onChange={handleSettingChange}
                    >
                      <option>UTC-5 (EST)</option>
                      <option>UTC-6 (CST)</option>
                      <option>UTC-7 (MST)</option>
                      <option>UTC-8 (PST)</option>
                      <option>UTC (GMT)</option>
                      <option>UTC+1 (CET)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Language</label>
                    <select
                      name="language"
                      value={tempSettings.language}
                      onChange={handleSettingChange}
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn-cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button className="btn-save" onClick={handleSaveSettings}>
                    Save Settings
                  </button>
                </div>
              </div>
            ) : (
              <div className="settings-display">
                <div className="setting-item">
                  <span className="label">Organization Name:</span>
                  <span className="value">{settings.organizationName}</span>
                </div>
                <div className="setting-item">
                  <span className="label">Contact Email:</span>
                  <span className="value">{settings.contactEmail}</span>
                </div>
                <div className="setting-item">
                  <span className="label">Phone:</span>
                  <span className="value">{settings.phone}</span>
                </div>
                <div className="setting-item">
                  <span className="label">Address:</span>
                  <span className="value">{settings.address}</span>
                </div>
                <div className="setting-item">
                  <span className="label">Timezone:</span>
                  <span className="value">{settings.timezone}</span>
                </div>
                <div className="setting-item">
                  <span className="label">Language:</span>
                  <span className="value">{settings.language}</span>
                </div>
                <button className="btn-edit-settings" onClick={() => setEditMode(true)}>
                  Edit Settings
                </button>
              </div>
            )}
          </div>

          <div className="settings-section">
            <h2 className="section-title">User Profile</h2>
            <div className="profile-display">
              <div className="profile-header">
                <div className="profile-avatar">{userProfile.firstName.charAt(0)}</div>
                <div className="profile-info">
                  <h3>
                    {userProfile.firstName} {userProfile.lastName}
                  </h3>
                  <p className="role">{userProfile.role}</p>
                </div>
              </div>
              <div className="profile-details">
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{userProfile.email}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Role:</span>
                  <span className="value">{userProfile.role}</span>
                </div>
              </div>
              <button className="btn-edit-profile">Edit Profile</button>
            </div>
          </div>

          <div className="settings-section">
            <h2 className="section-title">Notification Preferences</h2>
            <div className="notifications-container">
              <div className="notification-item">
                <div className="notification-info">
                  <h4>Email Notifications</h4>
                  <p>Receive email notifications for important events</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={notifications.emailNotifications}
                    onChange={handleNotificationChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>Booking Reminders</h4>
                  <p>Get reminded about upcoming bookings</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="bookingReminders"
                    checked={notifications.bookingReminders}
                    onChange={handleNotificationChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>Vendor Updates</h4>
                  <p>Receive updates from vendors and service providers</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="vendorUpdates"
                    checked={notifications.vendorUpdates}
                    onChange={handleNotificationChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>Event Reminders</h4>
                  <p>Get notified about event deadlines and milestones</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="eventReminders"
                    checked={notifications.eventReminders}
                    onChange={handleNotificationChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>Weekly Report</h4>
                  <p>Receive a weekly summary of your activities</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="weeklyReport"
                    checked={notifications.weeklyReport}
                    onChange={handleNotificationChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;
