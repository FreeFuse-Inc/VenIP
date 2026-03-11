import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import QuickAccessGrid from '../components/QuickAccessGrid';
import UpcomingEventCard from '../components/UpcomingEventCard';
import { FeedbackContext } from '../context/FeedbackContext';
import { CartContext } from '../context/CartContext';
import { RoleContext } from '../context/RoleContext';
import '../styles/NPODashboard.css';

const NPODashboard = () => {
  const navigate = useNavigate();
  const { feedback, getNewFeedbackCount } = useContext(FeedbackContext);
  const { toggleCartSidebar } = useContext(CartContext);
  const { setUserRole } = useContext(RoleContext);

  // Set user role when dashboard loads
  useEffect(() => {
    setUserRole('npo');
  }, [setUserRole]);

  const user = {
    name: 'Sarah Johnson',
    role: 'Event Organizer',
    organization: 'Community Hearts Foundation',
  };

  const upcomingEvents = [
    { id: 1, name: 'Annual Gala 2024', venue: 'Grand Ballroom', date: '2024-12-15', status: 'Published' },
    { id: 2, name: 'Charity Fundraiser', venue: 'City Center', date: '2025-01-10', status: 'Draft' },
    { id: 3, name: 'Community Cleanup', venue: 'Central Park', date: '2025-01-20', status: 'Published' },
  ];

  const quickAccessItems = [
    { id: 'create', label: 'Create Event', icon: '➕', path: '/create-event', color: '#D4AF37' },
    { id: 'events', label: 'My Events', icon: '📅', path: '/bookings', color: '#8B5CF6' },
    { id: 'vendors', label: 'Vendors', icon: '👥', path: '/vendors', color: '#22c55e' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings', color: '#6b7280' },
  ];

  const newFeedbackCount = getNewFeedbackCount();
  const recentFeedback = feedback.slice(0, 2);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <main className="npo-dashboard">
      <header className="dashboard-header-modern">
        <div className="header-welcome">
          <p className="welcome-text">Welcome back,</p>
          <h1 className="user-name">{user.name}</h1>
          <span className="role-badge">{user.role}</span>
        </div>
        <div className="header-actions">
          <button className="header-icon-btn" onClick={toggleCartSidebar} title="Cart">
            🛒
          </button>
          <button className="header-icon-btn" onClick={handleLogout} title="Logout">
            ➡️
          </button>
        </div>
      </header>

      <div className="dashboard-content-modern">
        <section className="metrics-section-modern">
          <MetricCard 
            label="Total Events" 
            value="12" 
            icon="📅"
            iconBg="gold"
          />
          <MetricCard 
            label="Pending Quotes" 
            value="3" 
            icon="📋"
            iconBg="purple"
          />
          <MetricCard 
            label="Upcoming" 
            value="5" 
            icon="⭐"
            iconBg="green"
          />
        </section>

        <QuickAccessGrid items={quickAccessItems} />

        <section className="upcoming-section">
          <div className="section-header-modern">
            <h2 className="section-title-modern">Upcoming Events</h2>
            <button className="see-all-btn" onClick={() => navigate('/bookings')}>
              See All
            </button>
          </div>
          <div className="upcoming-events-list">
            {upcomingEvents.map((event) => (
              <UpcomingEventCard 
                key={event.id} 
                event={event}
                onClick={() => navigate(`/event-details/${event.id}`)}
              />
            ))}
          </div>
        </section>

        <div className="create-event-cta" onClick={() => navigate('/create-event')}>
          <div className="cta-content">
            <span className="cta-icon">✨</span>
            <div className="cta-text">
              <h3>Create New Event</h3>
              <p>Start planning your next amazing event</p>
            </div>
          </div>
          <span className="cta-arrow">→</span>
        </div>

        {(recentFeedback.length > 0 || newFeedbackCount > 0) && (
          <section className="feedback-section-modern">
            <div className="section-header-modern">
              <h2 className="section-title-modern">Event Feedback</h2>
              {newFeedbackCount > 0 && (
                <span className="feedback-count">{newFeedbackCount} new</span>
              )}
            </div>
            {recentFeedback.length > 0 ? (
              <div className="feedback-list-modern">
                {recentFeedback.map((item) => (
                  <div key={item.id} className="feedback-card-modern">
                    <div className="feedback-info">
                      <h4>{item.eventName}</h4>
                      <p>{item.type === 'venue' ? '🏢 Venue' : '🎯 Service'} • {item.submittedBy}</p>
                    </div>
                    <div className="feedback-rating">
                      {Object.values(item.ratings)[0]}/5 ★
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-feedback">
                <p>No feedback yet. Set up automation to collect feedback after events.</p>
                <button className="setup-feedback-btn" onClick={() => navigate('/feedback-settings')}>
                  ⚙️ Set Up Automation
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default NPODashboard;
