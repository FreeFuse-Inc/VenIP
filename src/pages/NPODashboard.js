import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import { FeedbackContext } from '../context/FeedbackContext';
import '../styles/NPODashboard.css';

const NPODashboard = () => {
  const navigate = useNavigate();
  const { feedback, getNewFeedbackCount } = useContext(FeedbackContext);

  const upcomingEvents = [
    { id: 1, name: 'Annual Gala 2024', date: 'Dec 15, 2024', status: 'Planning' },
    { id: 2, name: 'Charity Fundraiser', date: 'Jan 10, 2025', status: 'Pending Quotes' },
    { id: 3, name: 'Community Cleanup', date: 'Jan 20, 2025', status: 'Approved' },
  ];

  const newFeedbackCount = getNewFeedbackCount();
  const recentFeedback = feedback.slice(0, 3);

  return (
    <main className="npo-dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">NPO Dashboard</h1>
        <button className="create-event-btn" onClick={() => navigate('/create-event')}>
          + Create Event
        </button>
      </header>

      <div className="dashboard-content">
        <section className="metrics-section">
          <MetricCard label="Total Events" value="12" />
          <MetricCard label="Pending Vendor Quotes" value="3" />
          <MetricCard label="Upcoming Events" value="5" />
        </section>

        <section className="events-section">
          <div className="section-header">
            <h2>Recent Events</h2>
          </div>
          <div className="events-list">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-info">
                  <h3 className="event-name">{event.name}</h3>
                  <p className="event-date">{event.date}</p>
                </div>
                <div className="event-status" data-status={event.status.toLowerCase().replace(' ', '-')}>
                  {event.status}
                </div>
                <button className="event-action-btn" onClick={() => navigate(`/event-management/${event.id}`)}>View Details →</button>
              </div>
            ))}
          </div>
        </section>

        <section className="feedback-section">
          <div className="section-header">
            <h2>Event Feedback</h2>
            {newFeedbackCount > 0 && <span className="feedback-badge">{newFeedbackCount} new</span>}
          </div>
          {recentFeedback.length > 0 ? (
            <div className="feedback-list">
              {recentFeedback.map((item) => (
                <div key={item.id} className="feedback-card">
                  <div className="feedback-info">
                    <div className="feedback-title-row">
                      <h4 className="feedback-event">{item.eventName}</h4>
                      {item.isTestFeedback && <span className="test-badge">🧪 TEST</span>}
                    </div>
                    <p className="feedback-meta">
                      {item.type === 'venue' ? '🏢 Venue' : '🎯 Service'} • By {item.submittedBy}
                    </p>
                    <p className="feedback-date">{item.submittedAt}</p>
                  </div>
                  <div className="feedback-rating">
                    <span className="rating-stars">★★★★★</span>
                    <span className={`status-badge ${item.status}`}>{item.status}</span>
                  </div>
                  <button className="view-feedback-btn" onClick={() => navigate(`/event-management/${item.eventId}`)}>
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No feedback received yet. Feedback will appear after your events conclude.</p>
              <button className="setup-btn" onClick={() => navigate('/feedback-settings')}>
                ⚙️ Set Up Feedback Automation
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default NPODashboard;
