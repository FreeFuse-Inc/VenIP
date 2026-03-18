import React, { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import QuickAccessGrid from '../components/QuickAccessGrid';
import UpcomingEventCard from '../components/UpcomingEventCard';
import SponsorCard from '../components/SponsorCard';
import VenueCard from '../components/VenueCard';
import { FeedbackContext } from '../context/FeedbackContext';
import { CartContext } from '../context/CartContext';
import { RoleContext } from '../context/RoleContext';
import { EventContext } from '../context/EventContext';
import { UserContext } from '../context/UserContext';
import '../styles/NPODashboard.css';

const NPODashboard = () => {
  const navigate = useNavigate();
  const { feedback, getNewFeedbackCount } = useContext(FeedbackContext);
  const { toggleCartSidebar } = useContext(CartContext);
  const { setUserRole } = useContext(RoleContext);
  const { getNPOSponsors, getNPOEventIds, getNPOVenues } = useContext(EventContext);
  const { user: currentUser } = useContext(UserContext);

  // Set user role when dashboard loads
  useEffect(() => {
    setUserRole('npo');
  }, [setUserRole]);

  const user = {
    name: 'Sarah Johnson',
    role: 'Event Organizer',
    organization: 'Community Hearts Foundation',
  };

  // Get NPO's sponsors and venues
  const npoEventIds = useMemo(() => {
    return getNPOEventIds(currentUser?.id || 'npo');
  }, [getNPOEventIds, currentUser?.id]);

  const npoSponsors = useMemo(() => {
    return getNPOSponsors(npoEventIds).slice(0, 3); // Show top 3 sponsors
  }, [getNPOSponsors, npoEventIds]);

  const npoVenues = useMemo(() => {
    return getNPOVenues(currentUser?.id || 'npo').slice(0, 3); // Show top 3 venues
  }, [getNPOVenues, currentUser?.id]);

  const upcomingEvents = [
    { id: 1, name: 'Annual Gala 2024', venue: 'Grand Ballroom', date: '2024-12-15', status: 'Published' },
    { id: 2, name: 'Charity Fundraiser', venue: 'City Center', date: '2025-01-10', status: 'Draft' },
    { id: 3, name: 'Community Cleanup', venue: 'Central Park', date: '2025-01-20', status: 'Published' },
  ];

  const quickAccessItems = [
    { id: 'create', label: 'Create Event', icon: '➕', path: '/create-event', color: '#D4AF37', badge: null },
    { id: 'events', label: 'My Events', icon: '📅', path: '/bookings', color: '#8B5CF6', badge: null },
    { id: 'sponsors', label: 'Sponsors', icon: '🏆', path: '/npo-sponsors', color: '#FDB022', badge: npoSponsors.length },
    { id: 'venues', label: 'Venues', icon: '🏛️', path: '/npo-venues', color: '#10B981', badge: npoVenues.length },
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
            label="Active Sponsors"
            value={npoSponsors.length}
            icon="🏆"
            iconBg="amber"
          />
          <MetricCard
            label="Owned Venues"
            value={npoVenues.length}
            icon="🏛️"
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

        {npoSponsors.length > 0 && (
          <section className="sponsors-overview-section">
            <div className="section-header-modern">
              <h2 className="section-title-modern">Your Sponsors & Partners</h2>
              <button className="see-all-btn" onClick={() => navigate('/npo-sponsors')}>
                View All
              </button>
            </div>
            <div className="sponsors-overview-grid">
              {npoSponsors.map((sponsor, index) => (
                <SponsorCard
                  key={sponsor.id}
                  sponsor={sponsor}
                  onClick={() => navigate('/npo-sponsors')}
                  style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                />
              ))}
            </div>
          </section>
        )}

        {npoVenues.length > 0 && (
          <section className="venues-overview-section">
            <div className="section-header-modern">
              <h2 className="section-title-modern">Your Venues & Bookings</h2>
              <button className="see-all-btn" onClick={() => navigate('/npo-venues')}>
                Browse All
              </button>
            </div>
            <div className="venues-overview-grid">
              {npoVenues.map((venue, index) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  isOwned={true}
                  onClick={() => navigate('/npo-venues')}
                  style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                />
              ))}
            </div>
          </section>
        )}

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
