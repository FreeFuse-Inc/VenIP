import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import '../styles/RenewalDecision.css';

const RenewalDecision = () => {
  const navigate = useNavigate();
  const { sponsorshipId } = useParams();
  const [confirmed, setConfirmed] = useState(false);

  const sponsorship = {
    eventName: 'Annual Gala 2024',
    tier: 'Gold',
    amount: '$10,000',
    endDate: 'Dec 31, 2024',
  };

  const handleEndSponsorship = () => {
    setConfirmed(true);
    setTimeout(() => {
      navigate('/dashboard/sponsor');
    }, 2000);
  };

  if (confirmed) {
    return (
      <div className="end-sponsorship-confirmed">
        <div className="confirmation-card">
          <div className="confirmation-icon">✓</div>
          <h2>Sponsorship Ended</h2>
          <p>{sponsorship.eventName} sponsorship has been ended.</p>
          <p className="confirmation-message">
            This sponsorship has been moved to your sponsorship history. You can still view performance metrics and
            reports at any time.
          </p>
          <button onClick={() => navigate('/dashboard/sponsor')} className="btn-return">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="renewal-decision">
      <BackButton />
      <div className="decision-header">
        <h1>End Sponsorship</h1>
        <p>{sponsorship.eventName} • {sponsorship.tier} Sponsorship</p>
      </div>

      <div className="decision-content">
        <div className="warning-card">
          <div className="warning-icon">⚠️</div>
          <h3>Are You Sure?</h3>
          <p>
            Ending this sponsorship means you will no longer be associated with {sponsorship.eventName}. Your logo will
            be removed from promotional materials after the event concludes on {sponsorship.endDate}.
          </p>
        </div>

        <div className="impact-section">
          <h3>What Happens When You End This Sponsorship:</h3>
          <ul className="impact-list">
            <li>✓ Your brand will no longer be featured in future promotional materials</li>
            <li>✓ Event organizers will be notified of the end of sponsorship</li>
            <li>✓ You can still access historical performance data and analytics</li>
            <li>✓ Your sponsorship will be archived in your history</li>
          </ul>
        </div>

        <div className="details-section">
          <h3>Sponsorship Details</h3>
          <div className="detail-item">
            <span className="label">Event:</span>
            <span className="value">{sponsorship.eventName}</span>
          </div>
          <div className="detail-item">
            <span className="label">Sponsorship Tier:</span>
            <span className="value">{sponsorship.tier}</span>
          </div>
          <div className="detail-item">
            <span className="label">Amount:</span>
            <span className="value">{sponsorship.amount}</span>
          </div>
          <div className="detail-item">
            <span className="label">Sponsorship End Date:</span>
            <span className="value">{sponsorship.endDate}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn-cancel" onClick={() => navigate('/sponsorship-analytics')}>
            Keep Sponsorship
          </button>
          <button className="btn-end-confirm" onClick={handleEndSponsorship}>
            Yes, End Sponsorship
          </button>
        </div>

        <p className="footer-note">
          <strong>Need to modify instead?</strong> You can upgrade, downgrade, or extend your sponsorship at any time.
          <button className="link-btn" onClick={() => navigate('/modify-sponsorship/1')}>
            Modify Sponsorship
          </button>
        </p>
      </div>
    </main>
  );
};

export default RenewalDecision;
