import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import BackButton from '../components/BackButton';
import MetricCard from '../components/MetricCard';
import '../styles/SponsorshipAnalytics.css';

const SponsorshipAnalytics = () => {
  const navigate = useNavigate();
  const { sponsorshipId } = useParams();
  const [showRenewalDecision, setShowRenewalDecision] = useState(false);

  const sponsorshipData = {
    1: {
      analytics: {
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
        },
      },
      roi: {
        costs: 10000,
        contactsMade: 287,
        estimatedValue: 28500,
      },
    },
    2: {
      analytics: {
        eventName: 'Tech Conference 2025',
        sponsorshipTier: 'Platinum',
        sponsorshipAmount: '$25,000',
        eventDate: 'Feb 20, 2025',
        metrics: {
          impressions: '78,450',
          eventAttendees: '512',
          logoViews: '23,890',
          websiteClicks: '1,567',
          conversions: '67',
          socialReach: '198,340',
        },
      },
      roi: {
        costs: 25000,
        contactsMade: 512,
        estimatedValue: 61440,
      },
    },
  };

  const currentSponsorship = sponsorshipData[sponsorshipId] || sponsorshipData[1];
  const analytics = currentSponsorship.analytics;
  const roi = currentSponsorship.roi;

  return (
    <main className="sponsorship-analytics">
      <BackButton />
      <PageHeader
        title="My Sponsorships"
        showBack={false}
      />

      <div className="analytics-content">
        <section className="summary-metrics">
          <MetricCard 
            label="Total Invested" 
            value={`$${roi.costs.toLocaleString()}`}
            icon="💰"
            iconBg="gold"
          />
          <MetricCard 
            label="Active Sponsorships" 
            value="1"
            icon="💛"
            iconBg="green"
          />
        </section>

        <div className="browse-events-cta" onClick={() => navigate('/events-feed')}>
          <div className="cta-content">
            <span className="cta-icon">📅</span>
            <div className="cta-text">
              <h3>Browse Events</h3>
              <p>Find new sponsorship opportunities</p>
            </div>
          </div>
          <span className="cta-arrow">→</span>
        </div>

        <section className="sponsorships-list-section">
          <h2 className="section-title">Your Sponsorships</h2>
          
          <div className="sponsorship-detail-card">
            <div className="sponsorship-header">
              <div className="tier-icon gold">
                <span>👑</span>
              </div>
              <div className="tier-info">
                <h3>{analytics.sponsorshipTier}</h3>
                <p className="tier-amount">{analytics.sponsorshipAmount}</p>
              </div>
              <span className="status-badge active">Active</span>
            </div>

            <div className="benefits-section">
              <p className="benefits-label">Benefits:</p>
              <ul className="benefits-list">
                <li><span className="check">✓</span> Logo on materials</li>
                <li><span className="check">✓</span> VIP table</li>
                <li><span className="check">✓</span> Speaking slot</li>
                <li className="more-benefits">+1 more benefits</li>
              </ul>
            </div>

            <button className="view-event-btn" onClick={() => navigate(`/sponsor-event-details/1`)}>
              <span>📅</span> View Event
            </button>
          </div>

          <div className="sponsorship-detail-card">
            <div className="sponsorship-header">
              <div className="tier-icon platinum">
                <span>💎</span>
              </div>
              <div className="tier-info">
                <h3>Platinum</h3>
                <p className="tier-amount">$25,000</p>
              </div>
              <span className="status-badge pending">Pending</span>
            </div>

            <div className="benefits-section">
              <p className="benefits-label">Benefits:</p>
              <ul className="benefits-list">
                <li><span className="check">✓</span> Title sponsor</li>
                <li><span className="check">✓</span> Keynote intro</li>
                <li><span className="check">✓</span> Premium booth</li>
                <li className="more-benefits">+1 more benefits</li>
              </ul>
            </div>

            <button className="view-event-btn" onClick={() => navigate(`/sponsor-event-details/2`)}>
              <span>📅</span> View Event
            </button>
          </div>
        </section>

        {!showRenewalDecision && (
          <div className="renewal-prompt">
            <h3>Ready to Renew or Modify?</h3>
            <p>Consider renewing or upgrading your sponsorship for maximum impact.</p>
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
                onClick={() => navigate(`/modify-sponsorship/${sponsorshipId || 1}`)}
              >
                Renew or Upgrade →
              </button>
              <button
                className="btn-end"
                onClick={() => navigate(`/renewal-decision/${sponsorshipId || 1}`)}
              >
                End Sponsorship
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default SponsorshipAnalytics;
