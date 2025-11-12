import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeedbackContext } from '../context/FeedbackContext';
import '../styles/FeedbackSettings.css';

const FeedbackSettings = () => {
  const navigate = useNavigate();
  const { integrations, connectIntegration, disconnectIntegration } = useContext(FeedbackContext);

  const [zapierData, setZapierData] = useState({
    apiKey: '',
    webhookUrl: '',
  });

  const [stripeData, setStripeData] = useState({
    apiKey: '',
    stripeConnectId: '',
  });

  const [activeTab, setActiveTab] = useState('zapier');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleZapierInputChange = (e) => {
    const { name, value } = e.target;
    setZapierData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStripeInputChange = (e) => {
    const { name, value } = e.target;
    setStripeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleZapierConnect = (e) => {
    e.preventDefault();
    if (!zapierData.apiKey.trim()) {
      setMessage('Please enter a Zapier API Key');
      setMessageType('error');
      return;
    }

    connectIntegration('zapier', zapierData.apiKey, {
      webhookUrl: zapierData.webhookUrl,
    });

    setMessage('Zapier connected successfully! ✓');
    setMessageType('success');
    setZapierData({ apiKey: '', webhookUrl: '' });

    setTimeout(() => setMessage(''), 3000);
  };

  const handleZapierDisconnect = () => {
    disconnectIntegration('zapier');
    setMessage('Zapier disconnected');
    setMessageType('info');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleStripeConnect = (e) => {
    e.preventDefault();
    if (!stripeData.apiKey.trim()) {
      setMessage('Please enter a Stripe API Key');
      setMessageType('error');
      return;
    }

    connectIntegration('stripe', stripeData.apiKey, {
      stripeConnectId: stripeData.stripeConnectId,
    });

    setMessage('Stripe connected successfully! ✓');
    setMessageType('success');
    setStripeData({ apiKey: '', stripeConnectId: '' });

    setTimeout(() => setMessage(''), 3000);
  };

  const handleStripeDisconnect = () => {
    disconnectIntegration('stripe');
    setMessage('Stripe disconnected');
    setMessageType('info');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <main className="feedback-settings-page">
      <div className="settings-header">
        <button className="back-btn" onClick={() => navigate('/settings')}>
          ← Back to Settings
        </button>
        <h1 className="page-title">Feedback Integrations</h1>
      </div>

      <div className="settings-container">
        <div className="settings-intro">
          <h2>Connect to Email Automation Services</h2>
          <p>
            Set up integrations to automatically send feedback requests after events conclude.
            Connect Zapier for custom workflows or Stripe for payment-related feedback.
          </p>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'zapier' ? 'active' : ''}`}
            onClick={() => setActiveTab('zapier')}
          >
            <span className="tab-icon">⚡</span>
            Zapier Integration
          </button>
          <button
            className={`tab-btn ${activeTab === 'stripe' ? 'active' : ''}`}
            onClick={() => setActiveTab('stripe')}
          >
            <span className="tab-icon">💳</span>
            Stripe Integration
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'zapier' && (
            <div className="integration-card">
              <div className="integration-header">
                <div className="integration-info">
                  <h3>Zapier Workflow Automation</h3>
                  <p className="integration-description">
                    Connect Zapier to create automated workflows for sending feedback requests
                    through email, Slack, or other platforms. Perfect for custom email sequences.
                  </p>
                </div>
                <div className="integration-logo">⚡</div>
              </div>

              <div className="integration-content">
                {!integrations.zapier?.connected ? (
                  <>
                    <div className="setup-steps">
                      <h4>How to Connect:</h4>
                      <ol>
                        <li>Visit <a href="https://zapier.com" target="_blank" rel="noopener noreferrer">Zapier.com</a> and create an account</li>
                        <li>Go to your Account Settings → API</li>
                        <li>Generate a new API token</li>
                        <li>Copy your API token and paste it below</li>
                        <li>Create a Zap that triggers on "Webhook" to send feedback emails</li>
                      </ol>
                    </div>

                    <form onSubmit={handleZapierConnect}>
                      <div className="form-group">
                        <label htmlFor="zapier-apikey">Zapier API Key *</label>
                        <input
                          type="password"
                          id="zapier-apikey"
                          name="apiKey"
                          value={zapierData.apiKey}
                          onChange={handleZapierInputChange}
                          placeholder="Enter your Zapier API Key"
                          required
                        />
                        <small>Your API key is encrypted and stored securely</small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="zapier-webhook">Webhook URL (Optional)</label>
                        <input
                          type="url"
                          id="zapier-webhook"
                          name="webhookUrl"
                          value={zapierData.webhookUrl}
                          onChange={handleZapierInputChange}
                          placeholder="https://hooks.zapier.com/hooks/catch/..."
                        />
                        <small>Your Zapier webhook URL for sending feedback requests</small>
                      </div>

                      <button type="submit" className="connect-btn">
                        Connect to Zapier
                      </button>
                    </form>

                    <div className="integration-features">
                      <h4>Features:</h4>
                      <ul>
                        <li>✓ Automated feedback request emails</li>
                        <li>✓ Custom email templates</li>
                        <li>✓ Multi-step workflows</li>
                        <li>✓ Integration with Gmail, Slack, and 8,000+ apps</li>
                        <li>✓ Scheduled emails after event dates</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="connected-status">
                    <div className="status-badge connected">✓ Connected</div>
                    <p className="status-message">
                      Zapier is connected and ready to send automated feedback requests.
                    </p>
                    <div className="connection-details">
                      <p><strong>Status:</strong> Active</p>
                      <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                    <button
                      type="button"
                      className="disconnect-btn"
                      onClick={handleZapierDisconnect}
                    >
                      Disconnect Zapier
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stripe' && (
            <div className="integration-card">
              <div className="integration-header">
                <div className="integration-info">
                  <h3>Stripe Payment Integration</h3>
                  <p className="integration-description">
                    Connect Stripe to send feedback requests to customers with payment
                    history and automate feedback collection after transactions.
                  </p>
                </div>
                <div className="integration-logo">💳</div>
              </div>

              <div className="integration-content">
                {!integrations.stripe?.connected ? (
                  <>
                    <div className="setup-steps">
                      <h4>How to Connect:</h4>
                      <ol>
                        <li>Visit <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">Stripe.com</a> and log in</li>
                        <li>Go to Developers → API Keys</li>
                        <li>Copy your Secret Key (starts with sk_)</li>
                        <li>Paste it below to authorize access</li>
                        <li>Feedback will be sent to customers associated with transactions</li>
                      </ol>
                    </div>

                    <form onSubmit={handleStripeConnect}>
                      <div className="form-group">
                        <label htmlFor="stripe-apikey">Stripe Secret Key *</label>
                        <input
                          type="password"
                          id="stripe-apikey"
                          name="apiKey"
                          value={stripeData.apiKey}
                          onChange={handleStripeInputChange}
                          placeholder="sk_test_... or sk_live_..."
                          required
                        />
                        <small>Your Stripe Secret Key is encrypted and stored securely</small>
                      </div>

                      <div className="form-group">
                        <label htmlFor="stripe-connect">Stripe Connect ID (Optional)</label>
                        <input
                          type="text"
                          id="stripe-connect"
                          name="stripeConnectId"
                          value={stripeData.stripeConnectId}
                          onChange={handleStripeInputChange}
                          placeholder="acct_... (for Stripe Connect accounts)"
                        />
                        <small>If you use Stripe Connect for multi-user accounts</small>
                      </div>

                      <button type="submit" className="connect-btn">
                        Connect to Stripe
                      </button>
                    </form>

                    <div className="integration-features">
                      <h4>Features:</h4>
                      <ul>
                        <li>✓ Send feedback to Stripe customers</li>
                        <li>✓ Track transaction history</li>
                        <li>✓ Automatic customer email from Stripe records</li>
                        <li>✓ Post-purchase feedback collection</li>
                        <li>✓ Revenue impact analytics</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="connected-status">
                    <div className="status-badge connected">✓ Connected</div>
                    <p className="status-message">
                      Stripe is connected and ready to send feedback to your customers.
                    </p>
                    <div className="connection-details">
                      <p><strong>Status:</strong> Active</p>
                      <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                    <button
                      type="button"
                      className="disconnect-btn"
                      onClick={handleStripeDisconnect}
                    >
                      Disconnect Stripe
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="settings-footer">
          <div className="info-box">
            <h4>Need Help?</h4>
            <p>
              For more information on setting up these integrations, check our
              documentation or contact support.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FeedbackSettings;
