import React, { useState } from 'react';
import '../styles/Settings.css';

const Settings = ({ chatGPTConnected = false, onChatGPTConnect, onChatGPTDisconnect }) => {
  const [settings, setSettings] = useState({
    organizationName: 'VenIP Events',
    contactEmail: 'admin@venip.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Downtown',
    timezone: 'UTC-5 (EST)',
    language: 'English',
  });

  const [userProfile] = useState({
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
  const [airbnbConnected, setAirbnbConnected] = useState(false);
  const [showAirbnbModal, setShowAirbnbModal] = useState(false);
  const [showChatGPTModal, setShowChatGPTModal] = useState(false);
  const [chatGPTApiKey, setChatGPTApiKey] = useState('');

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

  const handleAirbnbConnect = () => {
    setShowAirbnbModal(true);
  };

  const handleAirbnbConfirm = () => {
    setAirbnbConnected(true);
    setShowAirbnbModal(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAirbnbDisconnect = () => {
    setAirbnbConnected(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChatGPTConnect = () => {
    setShowChatGPTModal(true);
  };

  const handleChatGPTConfirm = () => {
    if (chatGPTApiKey.trim()) {
      if (onChatGPTConnect) {
        onChatGPTConnect(chatGPTApiKey);
      }
      setChatGPTApiKey('');
      setShowChatGPTModal(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleChatGPTDisconnect = () => {
    if (onChatGPTDisconnect) {
      onChatGPTDisconnect();
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
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
            <h2 className="section-title">Integrations</h2>
            <div className="integrations-container">
              <div className="integration-item">
                <div className="integration-header">
                  <div className="integration-info">
                    <div className="integration-icon">🏨</div>
                    <div className="integration-details">
                      <h4>Airbnb Integration</h4>
                      <p>Connect your Airbnb account to display live accommodations in the Bookings section</p>
                    </div>
                  </div>
                  <div className={`connection-status ${airbnbConnected ? 'connected' : 'disconnected'}`}>
                    <span className="status-indicator"></span>
                    <span className="status-text">{airbnbConnected ? 'Connected' : 'Not Connected'}</span>
                  </div>
                </div>
                <div className="integration-actions">
                  {!airbnbConnected ? (
                    <button className="btn-connect" onClick={handleAirbnbConnect}>
                      Connect Airbnb
                    </button>
                  ) : (
                    <button className="btn-disconnect" onClick={handleAirbnbDisconnect}>
                      Disconnect
                    </button>
                  )}
                </div>
              </div>

              <div className="integration-item">
                <div className="integration-header">
                  <div className="integration-info">
                    <div className="integration-icon">🤖</div>
                    <div className="integration-details">
                      <h4>ChatGPT AI Assistant</h4>
                      <p>Connect your ChatGPT API key to enable the AI Assistant for app navigation and guidance</p>
                    </div>
                  </div>
                  <div className={`connection-status ${chatGPTConnected ? 'connected' : 'disconnected'}`}>
                    <span className="status-indicator"></span>
                    <span className="status-text">{chatGPTConnected ? 'Connected' : 'Not Connected'}</span>
                  </div>
                </div>
                <div className="integration-actions">
                  {!chatGPTConnected ? (
                    <button className="btn-connect" onClick={handleChatGPTConnect}>
                      Connect ChatGPT
                    </button>
                  ) : (
                    <button className="btn-disconnect" onClick={handleChatGPTDisconnect}>
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
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

      {showAirbnbModal && (
        <div className="modal-overlay" onClick={() => setShowAirbnbModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Connect Airbnb Account</h2>
              <button className="close-btn" onClick={() => setShowAirbnbModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="airbnb-instructions">
                <p>To connect your Airbnb account, you'll need to:</p>
                <ol>
                  <li>Visit <strong>https://airbnb.com/api</strong></li>
                  <li>Create an API key or use your existing credentials</li>
                  <li>Authorize VenIP to access your accommodation listings</li>
                  <li>Your live accommodations will appear in the Bookings section</li>
                </ol>
              </div>

              <div className="form-group">
                <label>Airbnb API Key</label>
                <input
                  type="password"
                  placeholder="Enter your Airbnb API Key"
                  defaultValue=""
                />
              </div>

              <div className="form-group">
                <label>Account Email</label>
                <input
                  type="email"
                  placeholder="Enter your Airbnb email"
                  defaultValue=""
                />
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowAirbnbModal(false)}>
                  Cancel
                </button>
                <button className="btn-save" onClick={handleAirbnbConfirm}>
                  Connect Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showChatGPTModal && (
        <div className="modal-overlay" onClick={() => setShowChatGPTModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Connect ChatGPT API</h2>
              <button className="close-btn" onClick={() => setShowChatGPTModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="chatgpt-instructions">
                <p>To connect your ChatGPT API:</p>
                <ol>
                  <li>Visit <strong>https://platform.openai.com/account/api-keys</strong></li>
                  <li>Create a new API key or use an existing one</li>
                  <li>Copy your API key and paste it below</li>
                  <li>The AI Assistant will appear in the bottom right of your screen</li>
                </ol>
              </div>

              <div className="form-group">
                <label>ChatGPT API Key *</label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={chatGPTApiKey}
                  onChange={(e) => setChatGPTApiKey(e.target.value)}
                />
              </div>

              <div className="form-group">
                <p className="info-text">ℹ️ Your API key is encrypted and stored securely.</p>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowChatGPTModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn-save"
                  onClick={handleChatGPTConfirm}
                  disabled={!chatGPTApiKey.trim()}
                >
                  Connect API
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Settings;
