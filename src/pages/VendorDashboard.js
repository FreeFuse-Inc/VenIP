import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import '../styles/VendorDashboard.css';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');

  const vendorProfile = {
    name: 'Premium Catering Co.',
    missionStatement: 'Delivering exceptional catering services that transform events into memorable experiences through quality ingredients, creative presentations, and outstanding customer service.',
    email: 'contact@premiumcatering.com',
    phone: '+1 (555) 123-4567',
    website: 'www.premiumcatering.com',
  };

  const availableEvents = [
    {
      id: 1,
      name: 'Annual Gala 2024',
      description: 'Looking for catering services',
      date: 'Dec 15, 2024',
      location: 'Downtown Convention Center',
      budget: '$5,000 - $10,000',
      service: 'Catering',
    },
    {
      id: 2,
      name: 'Charity Fundraiser',
      description: 'Need decorations and floral arrangements',
      date: 'Jan 10, 2025',
      location: 'Grand Hotel',
      budget: '$3,000 - $6,000',
      service: 'Decorations',
    },
    {
      id: 3,
      name: 'Community Cleanup',
      description: 'Professional photography needed',
      date: 'Jan 20, 2025',
      location: 'Central Park',
      budget: '$1,500 - $3,000',
      service: 'Photography',
    },
  ];

  const myProposals = [
    {
      id: 1,
      eventName: 'Corporate Awards Night',
      serviceType: 'Catering',
      quotedPrice: '$4,500',
      status: 'Pending Review',
      submittedDate: 'Dec 5, 2024',
    },
    {
      id: 2,
      eventName: 'Wedding Celebration',
      serviceType: 'Catering',
      quotedPrice: '$3,200',
      status: 'Accepted',
      submittedDate: 'Nov 28, 2024',
    },
  ];

  return (
    <main className="vendor-dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Vendor Dashboard</h1>
        <button className="suggest-event-btn" onClick={() => navigate('/suggest-event')}>
          💡 Suggest Event
        </button>
      </header>

      <div className="dashboard-content">
        <section className="profile-section">
          <div className="profile-header">
            <div className="profile-avatar">🏢</div>
            <div className="profile-main">
              <h2 className="profile-name">{vendorProfile.name}</h2>
              <p className="profile-mission">{vendorProfile.missionStatement}</p>
            </div>
          </div>
          <div className="profile-contact-grid">
            <div className="contact-item">
              <span className="contact-label">📧 Email</span>
              <p className="contact-value">{vendorProfile.email}</p>
            </div>
            <div className="contact-item">
              <span className="contact-label">📞 Phone</span>
              <p className="contact-value">{vendorProfile.phone}</p>
            </div>
            <div className="contact-item">
              <span className="contact-label">🌐 Website</span>
              <p className="contact-value">{vendorProfile.website}</p>
            </div>
          </div>
        </section>

        <section className="metrics-section">
          <MetricCard label="Total Active Quotes" value="5" />
          <MetricCard label="Quotes Awaiting Response" value="2" />
          <MetricCard label="Jobs in Progress" value="1" />
        </section>

        <section className="tabs-section">
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
              onClick={() => setActiveTab('browse')}
            >
              Browse Events Needing Services
            </button>
            <button
              className={`tab-btn ${activeTab === 'proposals' ? 'active' : ''}`}
              onClick={() => setActiveTab('proposals')}
            >
              My Proposals
            </button>
          </div>

          {activeTab === 'browse' && (
            <div className="events-grid">
              {availableEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <h3 className="event-name">{event.name}</h3>
                    <span className="service-badge">{event.service}</span>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-details">
                    <p>
                      <span className="detail-label">📅 Date:</span> {event.date}
                    </p>
                    <p>
                      <span className="detail-label">📍 Location:</span> {event.location}
                    </p>
                    <p>
                      <span className="detail-label">💰 Budget:</span> {event.budget}
                    </p>
                  </div>
                  <button className="submit-quote-btn" onClick={() => navigate(`/event-details-vendor/${event.id}`)}>View & Submit Quote →</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'proposals' && (
            <div className="proposals-list">
              {myProposals.map((proposal) => (
                <div key={proposal.id} className="proposal-card">
                  <div className="proposal-header">
                    <div>
                      <h3 className="proposal-event">{proposal.eventName}</h3>
                      <p className="proposal-service">{proposal.serviceType}</p>
                    </div>
                    <div
                      className="proposal-status"
                      data-status={proposal.status.toLowerCase().replace(' ', '-')}
                    >
                      {proposal.status}
                    </div>
                  </div>
                  <div className="proposal-details">
                    <p>
                      <span className="detail-label">Quote:</span> {proposal.quotedPrice}
                    </p>
                    <p>
                      <span className="detail-label">Submitted:</span> {proposal.submittedDate}
                    </p>
                  </div>
                  <button className="view-proposal-btn">View Details →</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default VendorDashboard;
