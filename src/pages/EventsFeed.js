import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EventsFeed.css';

const EventsFeed = () => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState('All');

  const availableEvents = [
    {
      id: 1,
      name: 'Annual Gala 2024',
      category: 'Charity',
      date: 'Dec 15, 2024',
      location: 'Downtown Convention Center',
      description: 'Annual fundraising gala to support local communities',
      expectedAttendees: '300+',
      cause: 'Community Development',
      minSponsorship: '$2,000',
    },
    {
      id: 2,
      name: 'Tech Conference 2025',
      category: 'Business',
      date: 'Feb 20, 2025',
      location: 'Tech Hub Downtown',
      description: 'Leading technology conference bringing together innovators',
      expectedAttendees: '500+',
      cause: 'Education & Technology',
      minSponsorship: '$5,000',
    },
    {
      id: 3,
      name: 'Community Wellness Summit',
      category: 'Health',
      date: 'Jan 15, 2025',
      location: 'Central Park',
      description: 'Wellness and health awareness event for the community',
      expectedAttendees: '250+',
      cause: 'Health & Wellness',
      minSponsorship: '$2,000',
    },
    {
      id: 4,
      name: 'Startup Innovation Forum',
      category: 'Business',
      date: 'Feb 10, 2025',
      location: 'Innovation Center',
      description: 'Networking event for startups and investors',
      expectedAttendees: '300+',
      cause: 'Entrepreneurship',
      minSponsorship: '$3,000',
    },
  ];

  const categories = ['All', 'Charity', 'Business', 'Health', 'Education'];
  const filteredEvents =
    filterCategory === 'All' ? availableEvents : availableEvents.filter((e) => e.category === filterCategory);

  return (
    <main className="events-feed">
      <div className="feed-header">
        <h1>Available Events to Sponsor</h1>
        <p>Explore upcoming events and support causes that matter to you</p>
      </div>

      <div className="feed-content">
        <div className="filter-section">
          <h3>Filter by Category</h3>
          <div className="filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="events-list">
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-feed-card">
              <div className="event-feed-header">
                <div>
                  <h3 className="event-feed-name">{event.name}</h3>
                  <p className="event-feed-cause">{event.cause}</p>
                </div>
                <span className="category-badge">{event.category}</span>
              </div>

              <p className="event-feed-description">{event.description}</p>

              <div className="event-feed-details">
                <div className="detail">
                  <span className="detail-icon">📅</span>
                  <span>{event.date}</span>
                </div>
                <div className="detail">
                  <span className="detail-icon">📍</span>
                  <span>{event.location}</span>
                </div>
                <div className="detail">
                  <span className="detail-icon">👥</span>
                  <span>{event.expectedAttendees}</span>
                </div>
                <div className="detail">
                  <span className="detail-icon">💰</span>
                  <span>From {event.minSponsorship}</span>
                </div>
              </div>

              <button className="view-options-btn" onClick={() => navigate(`/sponsor-event-details/${event.id}`)}>
                View Sponsorship Options →
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default EventsFeed;
