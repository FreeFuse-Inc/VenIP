import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/EventDetailsVendor.css';

const EventDetailsVendor = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const event = {
    id: eventId,
    name: 'Annual Gala 2024',
    date: 'Dec 15, 2024',
    time: '7:00 PM',
    location: 'Downtown Convention Center',
    description: 'Annual fundraising gala to support local communities. Looking for professional catering services to serve 300 guests.',
    serviceNeeded: 'Catering',
    budgetRange: '$5,000 - $10,000',
    attendees: 300,
    eventType: 'Fundraising Gala',
    additionalInfo: 'Vegetarian and vegan options required. Dietary restrictions must be accommodated.',
  };

  const handleSubmitQuote = () => {
    navigate(`/submit-quote/${eventId}`);
  };

  const handleProposeService = () => {
    navigate(`/suggest-event?eventId=${eventId}`);
  };

  return (
    <main className="event-details-vendor">
      <button className="back-btn" onClick={() => navigate('/dashboard/vendor')}>
        ← Back to Dashboard
      </button>

      <div className="event-details-header">
        <div className="event-title-section">
          <h1 className="event-title">{event.name}</h1>
          <p className="event-meta">
            📅 {event.date} at {event.time} • 📍 {event.location}
          </p>
        </div>
        <span className="service-badge-large">{event.serviceNeeded}</span>
      </div>

      <div className="event-details-content">
        <div className="details-grid">
          <div className="details-card">
            <h3>Event Overview</h3>
            <div className="detail-row">
              <span className="detail-label">Event Type:</span>
              <span className="detail-value">{event.eventType}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Expected Attendees:</span>
              <span className="detail-value">{event.attendees}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Service Needed:</span>
              <span className="detail-value">{event.serviceNeeded}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Budget Range:</span>
              <span className="detail-value budget-highlight">{event.budgetRange}</span>
            </div>
          </div>

          <div className="details-card">
            <h3>Description</h3>
            <p className="description-text">{event.description}</p>
            <p className="description-text additional">
              <strong>Additional Requirements:</strong> {event.additionalInfo}
            </p>
          </div>
        </div>

        <div className="action-section">
          <h3>Ready to submit a quote?</h3>
          <p className="action-description">
            Click below to submit your proposal with pricing, timeline, and portfolio details.
          </p>
          <div className="action-buttons">
            <button className="btn-submit-quote" onClick={handleSubmitQuote}>
              Submit Quote
            </button>
            <button className="btn-propose-service" onClick={handleProposeService}>Propose Different Service</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EventDetailsVendor;
