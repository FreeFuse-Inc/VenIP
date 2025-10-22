import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/SponsorEventDetails.css';

const SponsorEventDetails = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const event = {
    id: eventId,
    name: 'Annual Gala 2024',
    date: 'Dec 15, 2024',
    time: '7:00 PM',
    location: 'Downtown Convention Center',
    description:
      'Join us for our Annual Gala, a premier fundraising event celebrating community impact and supporting local nonprofit initiatives. This elegant evening brings together donors, leaders, and community members to make a real difference.',
    cause: 'Community Development',
    impact:
      'Funds raised support education programs, community development, and social welfare initiatives. Your sponsorship directly impacts 5,000+ community members annually.',
    expectedAttendees: 300,
    logo: '🎯',
  };

  const tiers = [
    {
      tier: 'BRONZE',
      name: 'Bronze',
      price: '$2,000',
      benefits: [
        'Logo recognition on event materials',
        'Recognition in post-event report',
        'Certificate of appreciation',
        '2 event tickets',
      ],
    },
    {
      tier: 'SILVER',
      name: 'Silver',
      price: '$5,000',
      benefits: [
        'All Bronze benefits',
        'Logo on event signage and program',
        'Social media recognition (3 posts)',
        '4 event tickets',
        'Booth space (optional)',
      ],
    },
    {
      tier: 'GOLD',
      name: 'Gold',
      price: '$10,000',
      features: ['Premium benefits package'],
      benefits: [
        'All Silver benefits',
        'Logo on event website and major signage',
        'Social media recognition (5 posts + stories)',
        '6 event tickets',
        'Premium booth space',
        'Mention in opening remarks',
        'Email recognition to 10,000+ subscribers',
      ],
    },
    {
      tier: 'PLATINUM',
      name: 'Platinum',
      price: '$20,000',
      features: ['Elite benefits package'],
      benefits: [
        'All Gold benefits',
        'Title Sponsorship (Annual Gala 2024 presented by [Your Company])',
        'Dedicated logo placement',
        '10 event tickets',
        'Exclusive VIP reception access',
        'Speaking opportunity (optional)',
        'Annual partnership recognition',
      ],
    },
  ];

  return (
    <main className="sponsor-event-details">
      <button className="back-btn" onClick={() => navigate('/events-feed')}>
        ← Back to Events Feed
      </button>

      <div className="event-details-header">
        <h1>{event.name}</h1>
        <p className="event-meta">
          📅 {event.date} at {event.time} • 📍 {event.location}
        </p>
      </div>

      <div className="event-details-content">
        <div className="event-info-section">
          <div className="info-card">
            <h3>About This Event</h3>
            <p>{event.description}</p>
            <div className="event-stats">
              <div className="stat">
                <span className="stat-label">Expected Attendees:</span>
                <span className="stat-value">{event.expectedAttendees}+</span>
              </div>
              <div className="stat">
                <span className="stat-label">Cause Area:</span>
                <span className="stat-value">{event.cause}</span>
              </div>
            </div>
          </div>

          <div className="impact-card">
            <h3>Impact & Reach</h3>
            <p>{event.impact}</p>
            <ul className="impact-list">
              <li>5,000+ community members supported annually</li>
              <li>10+ programs funded by sponsorships</li>
              <li>100% of funds go directly to community initiatives</li>
            </ul>
          </div>
        </div>

        <div className="sponsorship-tiers">
          <h2>Sponsorship Packages</h2>
          <p className="tiers-intro">Choose the sponsorship level that aligns with your organization's goals</p>

          <div className="tiers-grid">
            {tiers.map((tier) => (
              <div key={tier.tier} className="tier-card">
                <div className="tier-header">
                  <h4 className="tier-name">{tier.name}</h4>
                  <p className="tier-price">{tier.price}</p>
                </div>

                {tier.features && <p className="tier-features">{tier.features[0]}</p>}

                <ul className="tier-benefits">
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx}>✓ {benefit}</li>
                  ))}
                </ul>

                <button
                  className="select-tier-btn"
                  onClick={() => navigate(`/sponsorship-package-selection/${event.id}/${tier.tier.toLowerCase()}`)}
                >
                  Select {tier.name} →
                </button>
              </div>
            ))}
          </div>

          <div className="custom-note">
            <p>
              <strong>Custom Sponsorship:</strong> If you'd like to customize your sponsorship amount or benefits,
              please contact our sponsorship coordinator at <a href="mailto:sponsor@venip.com">sponsor@venip.com</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SponsorEventDetails;
