import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/SponsorEventDetails.css';

const SponsorEventDetails = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const event = {
    id: eventId,
    name: 'Annual Charity Gala',
    tagline: 'A night of giving and celebration',
    date: 'Friday, March 14, 2025',
    time: '18:00',
    location: 'Grand Ballroom',
    address: '123 Luxury Ave, Downtown',
    description:
      'Join us for our Annual Gala, a premier fundraising event celebrating community impact and supporting local nonprofit initiatives. This elegant evening brings together donors, leaders, and community members to make a real difference.',
    cause: 'Community Development',
    impact:
      'Funds raised support education programs, community development, and social welfare initiatives. Your sponsorship directly impacts 5,000+ community members annually.',
    expectedAttendees: 300,
    budget: '$50,000',
    venueImage: 'https://images.pexels.com/photos/30311728/pexels-photo-30311728.jpeg?auto=compress&cs=tinysrgb&w=800',
    venueRating: 4.8,
    venueCapacity: 500,
    status: 'Published',
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
      {/* Hero Header */}
      <div className="event-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="event-status-badge">{event.status}</span>
          <h1 className="event-title">{event.name}</h1>
          <p className="event-tagline">{event.tagline}</p>
        </div>
      </div>

      <div className="event-details-content">
        {/* Venue Card */}
        <div className="venue-section">
          <h2 className="section-title">Venue</h2>
          <div className="venue-card">
            <div className="venue-image-wrapper">
              <img src={event.venueImage} alt={event.location} className="venue-image" />
            </div>
            <div className="venue-info">
              <h3 className="venue-name">{event.location}</h3>
              <p className="venue-address">{event.address}</p>
              <div className="venue-meta">
                <span className="venue-rating">⭐ {event.venueRating}</span>
                <span className="venue-divider">•</span>
                <span className="venue-capacity">Capacity: {event.venueCapacity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Card */}
        <div className="event-details-card">
          <div className="detail-row">
            <div className="detail-icon date-icon">📅</div>
            <div className="detail-info">
              <span className="detail-label">Date & Time</span>
              <span className="detail-value">{event.date}</span>
              <span className="detail-sub">{event.time}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon location-icon">📍</div>
            <div className="detail-info">
              <span className="detail-label">Location</span>
              <span className="detail-value">{event.location}</span>
              <span className="detail-sub">{event.address}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon attendees-icon">👥</div>
            <div className="detail-info">
              <span className="detail-label">Expected Attendees</span>
              <span className="detail-value">{event.expectedAttendees} people</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon budget-icon">💰</div>
            <div className="detail-info">
              <span className="detail-label">Budget</span>
              <span className="detail-value">{event.budget}</span>
            </div>
          </div>
        </div>

        {/* Sponsorship Packages - Keep as is */}
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
