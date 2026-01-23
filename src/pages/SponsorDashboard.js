import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import QuickAccessGrid from '../components/QuickAccessGrid';
import UpcomingEventCard from '../components/UpcomingEventCard';
import SponsorshipCard from '../components/SponsorshipCard';
import { FeedbackContext } from '../context/FeedbackContext';
import { CartContext } from '../context/CartContext';
import '../styles/SponsorDashboard.css';

const SponsorDashboard = () => {
  const navigate = useNavigate();
  const { feedback } = useContext(FeedbackContext);
  const { toggleCartSidebar } = useContext(CartContext);

  const user = {
    name: 'Emily Davis',
    role: 'Sponsor',
    company: 'Global Innovations Inc.',
  };

  const sponsoredEvents = [
    {
      id: 1,
      name: 'Annual Gala 2024',
      tier: 'Gold',
      amount: '$10,000',
      status: 'Active',
      benefits: ['Logo on materials', 'VIP table', 'Speaking slot', 'Premium placement'],
      eventId: 1,
    },
    {
      id: 2,
      name: 'Tech Conference 2025',
      tier: 'Platinum',
      amount: '$25,000',
      status: 'Pending',
      benefits: ['Title sponsor', 'Keynote intro', 'Premium booth', 'VIP access'],
      eventId: 2,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      name: 'Annual Charity Gala',
      venue: 'Grand Ballroom',
      date: '2025-03-14',
      status: 'Published',
    },
    {
      id: 2,
      name: 'Tech Conference 2025',
      venue: 'Conference Center',
      date: '2025-04-19',
      status: 'Published',
    },
    {
      id: 3,
      name: 'Summer Fundraiser',
      venue: 'Rooftop Garden',
      date: '2025-06-09',
      status: 'Draft',
    },
  ];

  const quickAccessItems = [
    { id: 'events', label: 'Events', icon: '📅', path: '/events-feed', color: '#D4AF37' },
    { id: 'sponsorships', label: 'Sponsorships', icon: '💛', path: '/sponsorship-bookings', color: '#FF6B6B' },
    { id: 'packages', label: 'Packages', icon: '⭐', path: '/sponsorship-analytics', color: '#8B5CF6' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings', color: '#6b7280' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <main className="sponsor-dashboard">
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
            label="Sponsorships" 
            value="2" 
            icon="💛"
            iconBg="gold"
          />
          <MetricCard 
            label="Active" 
            value="1" 
            icon="⭐"
            iconBg="green"
          />
        </section>

        <QuickAccessGrid items={quickAccessItems} />

        <section className="upcoming-section">
          <div className="section-header-modern">
            <h2 className="section-title-modern">Upcoming Events</h2>
            <button className="see-all-btn" onClick={() => navigate('/events-feed')}>
              See All
            </button>
          </div>
          <div className="upcoming-events-list">
            {upcomingEvents.map((event) => (
              <UpcomingEventCard 
                key={event.id} 
                event={event}
                onClick={() => navigate(`/sponsor-event-details/${event.id}`)}
              />
            ))}
          </div>
        </section>

        <section className="sponsorships-section">
          <div className="section-header-modern">
            <h2 className="section-title-modern">Your Sponsorships</h2>
            <button className="see-all-btn" onClick={() => navigate('/sponsorship-analytics')}>
              View All
            </button>
          </div>

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

          <div className="sponsorships-grid">
            {sponsoredEvents.map((sponsorship) => (
              <SponsorshipCard 
                key={sponsorship.id} 
                sponsorship={sponsorship}
              />
            ))}
          </div>
        </section>

        {feedback.length > 0 && (
          <section className="feedback-preview-section">
            <div className="section-header-modern">
              <h2 className="section-title-modern">Recent Feedback</h2>
              <span className="feedback-count">{feedback.length} total</span>
            </div>
            <div className="feedback-preview-list">
              {feedback.slice(0, 2).map((item) => (
                <div key={item.id} className="feedback-preview-card">
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
          </section>
        )}
      </div>
    </main>
  );
};

export default SponsorDashboard;
