import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import QuickAccessGrid from '../components/QuickAccessGrid';
import UpcomingEventCard from '../components/UpcomingEventCard';
import FilterTabs from '../components/FilterTabs';
import { CartContext } from '../context/CartContext';
import { RoleContext } from '../context/RoleContext';
import '../styles/VendorDashboard.css';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { toggleCartSidebar } = useContext(CartContext);
  const { setUserRole } = useContext(RoleContext);
  const [activeTab, setActiveTab] = useState('browse');

  // Set user role when dashboard loads
  useEffect(() => {
    setUserRole('vendor');
  }, [setUserRole]);

  const user = {
    name: 'Michael Chen',
    role: 'Vendor',
    company: 'Premium Catering Co.',
  };

  const availableEvents = [
    {
      id: 1,
      name: 'Annual Gala 2024',
      venue: 'Downtown Convention Center',
      date: '2024-12-15',
      status: 'Open',
      service: 'Catering',
      budget: '$5,000 - $10,000',
    },
    {
      id: 2,
      name: 'Charity Fundraiser',
      venue: 'Grand Hotel',
      date: '2025-01-10',
      status: 'Open',
      service: 'Decorations',
      budget: '$3,000 - $6,000',
    },
    {
      id: 3,
      name: 'Community Cleanup',
      venue: 'Central Park',
      date: '2025-01-20',
      status: 'Open',
      service: 'Photography',
      budget: '$1,500 - $3,000',
    },
  ];

  const myProposals = [
    {
      id: 1,
      name: 'Corporate Awards Night',
      venue: 'Business Center',
      date: '2024-12-20',
      status: 'Pending',
      quotedPrice: '$4,500',
    },
    {
      id: 2,
      name: 'Wedding Celebration',
      venue: 'Garden Estate',
      date: '2024-11-28',
      status: 'Active',
      quotedPrice: '$3,200',
    },
  ];

  const quickAccessItems = [
    { id: 'browse', label: 'Browse Jobs', icon: '🔍', path: '/vendors', color: '#D4AF37' },
    { id: 'proposals', label: 'My Proposals', icon: '📋', path: '/vendor-checklist', color: '#8B5CF6' },
    { id: 'suggest', label: 'Suggest Event', icon: '💡', path: '/suggest-event', color: '#22c55e' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings', color: '#6b7280' },
  ];

  const tabs = [
    { id: 'browse', label: 'Browse Events', icon: '🔍' },
    { id: 'proposals', label: 'My Proposals', icon: '📋' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <main className="vendor-dashboard">
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
            label="Active Quotes" 
            value="5" 
            icon="📋"
            iconBg="gold"
          />
          <MetricCard 
            label="Awaiting Response" 
            value="2" 
            icon="⏳"
            iconBg="purple"
          />
          <MetricCard 
            label="Jobs in Progress" 
            value="1" 
            icon="🔧"
            iconBg="green"
          />
        </section>

        <QuickAccessGrid items={quickAccessItems} />

        <section className="events-tabs-section">
          <div className="events-section-container">
            <FilterTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            <div className="tab-content">
              {activeTab === 'browse' && (
                <div className="events-list-modern">
                  {availableEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className={`event-job-card ${index === 0 ? 'featured' : ''}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => navigate(`/event-details/${event.id}`)}
                    >
                      <UpcomingEventCard
                        event={event}
                        service={event.service}
                        budget={event.budget}
                        featured={index === 0}
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'proposals' && (
                <div className="events-list-modern">
                  {myProposals.map((proposal, index) => (
                    <div
                      key={proposal.id}
                      className={`event-job-card ${index === 0 ? 'featured' : ''}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <UpcomingEventCard
                        event={proposal}
                        quotedPrice={proposal.quotedPrice}
                        featured={index === 0}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="suggest-event-cta" onClick={() => navigate('/suggest-event')}>
          <div className="cta-content">
            <span className="cta-icon">💡</span>
            <div className="cta-text">
              <h3>Suggest an Event</h3>
              <p>Help NPOs discover service opportunities</p>
            </div>
          </div>
          <span className="cta-arrow">→</span>
        </div>
      </div>
    </main>
  );
};

export default VendorDashboard;
