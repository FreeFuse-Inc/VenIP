import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SponsorshipAnalytics.css';

const SponsorshipAnalytics = () => {
  const navigate = useNavigate();
  const [showRenewalDecision, setShowRenewalDecision] = useState(false);

  const analytics = {
    eventName: 'Annual Gala 2024',
    sponsorshipTier: 'Gold',
    sponsorshipAmount: '$10,000',
    eventDate: 'Dec 15, 2024',
    metrics: {
      impressions: '45,230',
      eventAttendees: '287',
      logoViews: '12,450',
      websiteClicks: '892',
      conversions: '34',
      socialReach: '125,680',
      emailReaches: '28,940',
    },
  };

  const roi = {
    costs: 10000,
    contactsMade: 287,
    estimatedValue: 45000,
  };

  return (
    <main className="sponsorship-analytics">
      <button className="back-btn" onClick={() => navigate('/dashboard/sponsor')}>
        ← Back to Dashboard
      </button>

      <div className="analytics-header">
        <h1>Sponsorship Performance</h1>
        <p>
          {analytics.eventName} • {analytics.sponsorshipTier} • {analytics.sponsorshipAmount}
        </p>
      </div>

      <div className="analytics-content">
        <div className="metrics-grid">
          <div className="metric-card">
            <h4>Total Impressions</h4>
            <p className="metric-value">{analytics.metrics.impressions}</p>
            <span className="metric-label">times your brand was seen</span>
          </div>
          <div className="metric-card">
            <h4>Event Attendees</h4>
            <p className="metric-value">{analytics.metrics.eventAttendees}</p>
            <span className="metric-label">direct interactions</span>
          </div>
          <div className="metric-card">
            <h4>Logo Views</h4>
            <p className="metric-value">{analytics.metrics.logoViews}</p>
            <span className="metric-label">instances on event materials</span>
          </div>
          <div className="metric-card">
            <h4>Website Clicks</h4>
            <p className="metric-value">{analytics.metrics.websiteClicks}</p>
            <span className="metric-label">from event materials</span>
          </div>
          <div className="metric-card">
            <h4>Lead Conversions</h4>
            <p className="metric-value">{analytics.metrics.conversions}</p>
            <span className="metric-label">qualified leads generated</span>
          </div>
          <div className="metric-card">
            <h4>Social Media Reach</h4>
            <p className="metric-value">{analytics.metrics.socialReach}</p>
            <span className="metric-label">unique accounts reached</span>
          </div>
        </div>

        <div className="detailed-sections">
          <div className="section-card">
            <h3>ROI Summary</h3>
            <div className="roi-breakdown">
              <div className="roi-item">
                <span className="label">Sponsorship Investment:</span>
                <span className="value">${roi.costs.toLocaleString()}</span>
              </div>
              <div className="roi-item">
                <span className="label">Direct Contacts Made:</span>
                <span className="value">{roi.contactsMade}</span>
              </div>
              <div className="roi-item highlight">
                <span className="label">Estimated Value Generated:</span>
                <span className="value">${roi.estimatedValue.toLocaleString()}</span>
              </div>
              <p className="roi-note">Based on average customer value and engagement metrics</p>
            </div>
          </div>

          <div className="section-card">
            <h3>Sponsorship Benefits Activated</h3>
            <ul className="benefits-list">
              <li>✓ Logo displayed on event website</li>
              <li>✓ Social media mentions (5 posts)</li>
              <li>✓ Recognition in email campaigns</li>
              <li>✓ Event program listing</li>
              <li>✓ Booth space provided</li>
              <li>✓ 6 event tickets fulfilled</li>
            </ul>
          </div>

          {!showRenewalDecision && (
            <div className="renewal-prompt">
              <h3>Ready to Renew or Modify?</h3>
              <p>
                Was this sponsorship a success for your organization? Consider renewing or upgrading your sponsorship
                for maximum impact.
              </p>
              <button className="btn-renewal-decision" onClick={() => setShowRenewalDecision(true)}>
                View Renewal Options →
              </button>
            </div>
          )}

          {showRenewalDecision && (
            <div className="renewal-section">
              <h3>What Would You Like to Do?</h3>
              <div className="renewal-buttons">
                <button
                  className="btn-renew"
                  onClick={() => navigate(`/modify-sponsorship/1`)}
                >
                  Renew or Upgrade Sponsorship →
                </button>
                <button
                  className="btn-end"
                  onClick={() => navigate(`/renewal-decision/1`)}
                >
                  End Sponsorship
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SponsorshipAnalytics;
