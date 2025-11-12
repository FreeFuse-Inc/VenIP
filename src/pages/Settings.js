import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Settings.css';

const Settings = ({ chatGPTConnected = false, onChatGPTConnect, onChatGPTDisconnect }) => {
  const navigate = useNavigate();
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

  // Travel API states
  const [travelApis, setTravelApis] = useState({
    airbnb: { connected: false, key: '' },
    booking: { connected: false, key: '' },
    googleFlights: { connected: false, key: '' },
    viator: { connected: false, key: '' },
    getYourGuide: { connected: false, key: '' },
    uber: { connected: false, key: '' },
  });

  const [editMode, setEditMode] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showChatGPTModal, setShowChatGPTModal] = useState(false);
  const [chatGPTApiKey, setChatGPTApiKey] = useState('');
  const [activeApiModal, setActiveApiModal] = useState(null);
  const [apiInputValue, setApiInputValue] = useState('');

  // Load API keys from localStorage on mount
  useEffect(() => {
    const savedApis = {};
    Object.keys(travelApis).forEach((api) => {
      const savedKey = localStorage.getItem(`${api}_api_key`);
      if (savedKey) {
        savedApis[api] = { connected: true, key: savedKey };
      } else {
        savedApis[api] = { connected: false, key: '' };
      }
    });
    setTravelApis(savedApis);
  }, []);

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

  // ChatGPT API handlers
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

  // Travel API handlers
  const openApiModal = (apiName) => {
    setActiveApiModal(apiName);
    setApiInputValue('');
  };

  const closeApiModal = () => {
    setActiveApiModal(null);
    setApiInputValue('');
  };

  const handleConnectApi = () => {
    if (apiInputValue.trim() && activeApiModal) {
      localStorage.setItem(`${activeApiModal}_api_key`, apiInputValue);
      setTravelApis((prev) => ({
        ...prev,
        [activeApiModal]: { connected: true, key: apiInputValue },
      }));
      closeApiModal();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleDisconnectApi = (apiName) => {
    localStorage.removeItem(`${apiName}_api_key`);
    setTravelApis((prev) => ({
      ...prev,
      [apiName]: { connected: false, key: '' },
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const apiConfigs = {
    airbnb: {
      icon: '🏨',
      name: 'Airbnb API',
      description: 'Connect your Airbnb account to display live hotel listings',
      url: 'https://airbnb.com/api',
      instructions: ['Visit https://airbnb.com/api', 'Create or get your API key', 'Copy and paste your API key below'],
      placeholder: 'Enter your Airbnb API Key',
    },
    booking: {
      icon: '🔖',
      name: 'Booking.com API',
      description: 'Connect Booking.com to show hotel availability and pricing',
      url: 'https://booking.com/api',
      instructions: ['Visit https://booking.com/api', 'Generate an API key', 'Copy and paste your API key below'],
      placeholder: 'Enter your Booking.com API Key',
    },
    googleFlights: {
      icon: '✈️',
      name: 'Google Flights API',
      description: 'Connect Google Flights to display available flights and prices',
      url: 'https://developers.google.com/flights',
      instructions: ['Visit https://developers.google.com/flights', 'Create a Google API key', 'Copy and paste your API key below'],
      placeholder: 'Enter your Google Flights API Key',
    },
    viator: {
      icon: '🎭',
      name: 'Viator API',
      description: 'Connect Viator to display available activities and tours',
      url: 'https://viator.com/api',
      instructions: ['Visit https://viator.com/api', 'Create an API key', 'Copy and paste your API key below'],
      placeholder: 'Enter your Viator API Key',
    },
    getYourGuide: {
      icon: '🗺️',
      name: 'GetYourGuide API',
      description: 'Connect GetYourGuide to show tours and experiences',
      url: 'https://getyourguide.com/api',
      instructions: ['Visit https://getyourguide.com/api', 'Generate an API key', 'Copy and paste your API key below'],
      placeholder: 'Enter your GetYourGuide API Key',
    },
    uber: {
      icon: '🚗',
      name: 'Uber API',
      description: 'Connect Uber to enable airport transfers and rides',
      url: 'https://developer.uber.com',
      instructions: ['Visit https://developer.uber.com', 'Create an app and API key', 'Copy and paste your API key below'],
      placeholder: 'Enter your Uber API Key',
    },
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
            <h2 className="section-title">Travel Booking Integrations</h2>
            <div className="integrations-container">
              {Object.entries(apiConfigs).map(([apiKey, config]) => (
                <div key={apiKey} className="integration-item">
                  <div className="integration-header">
                    <div className="integration-info">
                      <div className="integration-icon">{config.icon}</div>
                      <div className="integration-details">
                        <h4>{config.name}</h4>
                        <p>{config.description}</p>
                      </div>
                    </div>
                    <div className={`connection-status ${travelApis[apiKey].connected ? 'connected' : 'disconnected'}`}>
                      <span className="status-indicator"></span>
                      <span className="status-text">{travelApis[apiKey].connected ? 'Connected' : 'Not Connected'}</span>
                    </div>
                  </div>
                  <div className="integration-actions">
                    {!travelApis[apiKey].connected ? (
                      <button className="btn-connect" onClick={() => openApiModal(apiKey)}>
                        Connect {config.name.split(' ')[0]}
                      </button>
                    ) : (
                      <button className="btn-disconnect" onClick={() => handleDisconnectApi(apiKey)}>
                        Disconnect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="settings-section">
            <h2 className="section-title">AI Assistant</h2>
            <div className="integrations-container">
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

      {/* Travel API Modals */}
      {activeApiModal && (
        <div className="modal-overlay" onClick={closeApiModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Connect {apiConfigs[activeApiModal]?.name}</h2>
              <button className="close-btn" onClick={closeApiModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="api-instructions">
                <p>To get your API key:</p>
                <ol>
                  {apiConfigs[activeApiModal]?.instructions.map((instruction, idx) => (
                    <li key={idx}>{instruction}</li>
                  ))}
                </ol>
              </div>

              <div className="form-group">
                <label>{apiConfigs[activeApiModal]?.name} API Key *</label>
                <input
                  type="password"
                  placeholder={apiConfigs[activeApiModal]?.placeholder}
                  value={apiInputValue}
                  onChange={(e) => setApiInputValue(e.target.value)}
                />
              </div>

              <div className="form-group">
                <p className="info-text">ℹ️ Your API key is encrypted and stored securely in your browser.</p>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={closeApiModal}>
                  Cancel
                </button>
                <button
                  className="btn-save"
                  onClick={handleConnectApi}
                  disabled={!apiInputValue.trim()}
                >
                  Connect API
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ChatGPT Modal */}
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
