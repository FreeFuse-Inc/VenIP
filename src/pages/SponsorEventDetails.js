import React, { useContext, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EventContext } from '../context/EventContext';
import BackButton from '../components/BackButton';
import '../styles/SponsorEventDetails.css';

const SponsorEventDetails = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { events } = useContext(EventContext);

  // Find the event from context based on eventId
  const event = useMemo(() => {
    const foundEvent = events.find(e => e.id === parseInt(eventId));
    
    if (!foundEvent) return null;

    // Map event data to display format with sensible defaults
    return {
      id: foundEvent.id,
      name: foundEvent.name,
      tagline: foundEvent.description || 'Join us for this amazing event',
      date: formatDisplayDate(foundEvent.date),
      time: foundEvent.time || '7:00 PM',
      location: foundEvent.location || 'Venue TBD',
      address: getAddressForLocation(foundEvent.location),
      description: foundEvent.description || 'Event details coming soon.',
      cause: getEventCause(foundEvent.type),
      impact: getEventImpact(foundEvent.type),
      expectedAttendees: foundEvent.attendees || 200,
      budget: getBudgetDisplay(foundEvent.type),
      venueImage: getVenueImage(foundEvent.location, foundEvent.type),
      venueRating: getVenueRating(foundEvent.location),
      venueCapacity: getVenueCapacity(foundEvent.location, foundEvent.attendees),
      status: foundEvent.status || 'Published',
      logo: getEventLogo(foundEvent.type),
      type: foundEvent.type,
    };
  }, [events, eventId]);

  // Helper functions
  function formatDisplayDate(dateStr) {
    if (!dateStr) return 'Date TBD';
    const date = new Date(dateStr);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  function getAddressForLocation(location) {
    const addresses = {
      'Downtown Convention Center': '123 Main Street, Downtown District',
      'Tech Hub Building': '500 Innovation Way, Tech District',
      'Community Center': '200 Community Drive, Central',
      'Grand Ballroom': '789 Luxury Avenue, Uptown',
      'Garden Estate': '150 Garden Lane, Countryside',
    };
    return addresses[location] || '123 Event Avenue, City Center';
  }

  function getEventCause(type) {
    const causes = {
      charity: 'Community Development & Philanthropy',
      business: 'Innovation & Professional Development',
      health: 'Health & Wellness Initiatives',
      wedding: 'Celebration & Community',
    };
    return causes[type] || 'Community Impact';
  }

  function getEventImpact(type) {
    const impacts = {
      charity: 'Funds raised support education programs, community development, and social welfare initiatives. Your sponsorship directly impacts thousands of community members.',
      business: 'Your sponsorship supports innovation, networking opportunities, and professional development for industry leaders and emerging talent.',
      health: 'Contributions support health education, wellness programs, and community health initiatives reaching diverse populations.',
      wedding: 'Your participation contributes to creating memorable experiences and supporting local vendors and communities.',
    };
    return impacts[type] || 'Your sponsorship makes a meaningful difference in our community.';
  }

  function getBudgetDisplay(type) {
    const budgets = {
      charity: '$50,000',
      business: '$75,000',
      health: '$30,000',
      wedding: '$25,000',
    };
    return budgets[type] || '$40,000';
  }

  function getVenueImage(location, type) {
    const images = {
      'Downtown Convention Center': 'https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Tech Hub Building': 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Community Center': 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Grand Ballroom': 'https://images.pexels.com/photos/30311728/pexels-photo-30311728.jpeg?auto=compress&cs=tinysrgb&w=800',
      'Garden Estate': 'https://images.pexels.com/photos/169193/pexels-photo-169193.jpeg?auto=compress&cs=tinysrgb&w=800',
    };
    
    // Fallback by type
    const typeImages = {
      charity: 'https://images.pexels.com/photos/30311728/pexels-photo-30311728.jpeg?auto=compress&cs=tinysrgb&w=800',
      business: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      health: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    };
    
    return images[location] || typeImages[type] || 'https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg?auto=compress&cs=tinysrgb&w=800';
  }

  function getVenueRating(location) {
    const ratings = {
      'Downtown Convention Center': 4.8,
      'Tech Hub Building': 4.9,
      'Community Center': 4.5,
      'Grand Ballroom': 4.9,
      'Garden Estate': 4.7,
    };
    return ratings[location] || 4.6;
  }

  function getVenueCapacity(location, attendees) {
    const capacities = {
      'Downtown Convention Center': 1000,
      'Tech Hub Building': 800,
      'Community Center': 400,
      'Grand Ballroom': 500,
      'Garden Estate': 300,
    };
    return capacities[location] || Math.max(attendees * 1.5, 200);
  }

  function getEventLogo(type) {
    const logos = {
      charity: '🎗️',
      business: '💼',
      health: '🏥',
      wedding: '💒',
    };
    return logos[type] || '🎯';
  }

  // Generate tiers based on event type
  const tiers = useMemo(() => {
    const eventType = event?.type || 'charity';
    
    const tierConfigs = {
      charity: [
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
            'Title Sponsorship',
            'Dedicated logo placement',
            '10 event tickets',
            'Exclusive VIP reception access',
            'Speaking opportunity (optional)',
            'Annual partnership recognition',
          ],
        },
      ],
      business: [
        {
          tier: 'BRONZE',
          name: 'Starter',
          price: '$3,000',
          benefits: [
            'Logo on conference materials',
            'Listing in attendee app',
            '3 conference passes',
            'Social media mention',
          ],
        },
        {
          tier: 'SILVER',
          name: 'Professional',
          price: '$7,500',
          benefits: [
            'All Starter benefits',
            'Booth in exhibit hall',
            '5 conference passes',
            'Logo on event website',
            'Newsletter feature',
          ],
        },
        {
          tier: 'GOLD',
          name: 'Enterprise',
          price: '$15,000',
          features: ['Premium visibility'],
          benefits: [
            'All Professional benefits',
            'Premium booth location',
            '10 conference passes',
            'Speaking session slot',
            'Lead capture access',
            'VIP networking dinner',
          ],
        },
        {
          tier: 'PLATINUM',
          name: 'Title Sponsor',
          price: '$30,000',
          features: ['Maximum exposure'],
          benefits: [
            'All Enterprise benefits',
            'Title naming rights',
            'Keynote introduction',
            '20 conference passes',
            'Exclusive lounge access',
            'Year-round partnership',
          ],
        },
      ],
      health: [
        {
          tier: 'BRONZE',
          name: 'Supporter',
          price: '$1,500',
          benefits: [
            'Logo on event materials',
            'Recognition at event',
            '2 event passes',
            'Thank you certificate',
          ],
        },
        {
          tier: 'SILVER',
          name: 'Partner',
          price: '$4,000',
          benefits: [
            'All Supporter benefits',
            'Booth space',
            '4 event passes',
            'Social media recognition',
            'Newsletter mention',
          ],
        },
        {
          tier: 'GOLD',
          name: 'Champion',
          price: '$8,000',
          features: ['Premium partnership'],
          benefits: [
            'All Partner benefits',
            'Session sponsorship',
            '8 event passes',
            'Logo on wellness materials',
            'Community health impact report',
          ],
        },
        {
          tier: 'PLATINUM',
          name: 'Wellness Leader',
          price: '$15,000',
          features: ['Top-tier recognition'],
          benefits: [
            'All Champion benefits',
            'Title sponsorship',
            '15 event passes',
            'Keynote speaking opportunity',
            'Year-round wellness program partnership',
          ],
        },
      ],
    };

    return tierConfigs[eventType] || tierConfigs.charity;
  }, [event?.type]);

  // Handle event not found
  if (!event) {
    return (
      <main className="sponsor-event-details">
        <BackButton />
        <div className="event-not-found">
          <div className="not-found-icon">🔍</div>
          <h2>Event Not Found</h2>
          <p>The event you're looking for doesn't exist or has been removed.</p>
          <button className="back-btn" onClick={() => navigate('/events-feed')}>
            Browse Events
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="sponsor-event-details">
      <BackButton />
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

        {/* Sponsorship Packages */}
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
