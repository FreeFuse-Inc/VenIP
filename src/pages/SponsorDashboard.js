import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import '../styles/SponsorDashboard.css';

const SponsorDashboard = () => {
  const navigate = useNavigate();
  const sponsoredEvents = [
    {
      id: 1,
      name: 'Annual Gala 2024',
      category: 'Charity',
      sponsorshipLevel: 'Gold',
      amount: '$5,000',
      date: 'Dec 15, 2024',
      engagement: '2,450',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Tech Conference 2025',
      category: 'Business',
      sponsorshipLevel: 'Platinum',
      amount: '$10,000',
      date: 'Feb 20, 2025',
      engagement: '4,800',
      status: 'Active',
    },
  ];

  const availableEvents = [
    {
      id: 1,
      name: 'Community Wellness Summit',
      description: 'Health and wellness focused event',
      date: 'Jan 15, 2025',
      expectedAttendees: '500+',
      packages: [
        { name: 'Bronze', price: '$2,000' },
        { name: 'Silver', price: '$5,000' },
        { name: 'Gold', price: '$10,000' },
      ],
    },
    {
      id: 2,
      name: 'Startup Innovation Forum',
      description: 'Networking event for startups and investors',
      date: 'Feb 10, 2025',
      expectedAttendees: '300+',
      packages: [
        { name: 'Sponsor', price: '$3,000' },
        { name: 'Platinum', price: '$8,000' },
      ],
    },
  ];

  return (
    <main className="sponsor-dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Sponsor Dashboard</h1>
      </header>

      <div className="dashboard-content">
        <section className="metrics-section">
          <MetricCard label="Total Sponsorships" value="2" />
          <MetricCard label="Total Engagement Reach" value="7.2K" />
          <MetricCard label="Available Events" value="12" />
        </section>

        <section className="sponsored-section">
          <div className="section-header">
            <h2>Your Sponsorships</h2>
          </div>
          <div className="sponsored-grid">
            {sponsoredEvents.map((event) => (
              <div key={event.id} className="sponsored-card">
                <div className="event-header">
                  <h3 className="event-name">{event.name}</h3>
                  <span className="sponsorship-level">{event.sponsorshipLevel}</span>
                </div>
                <div className="event-info-grid">
                  <p>
                    <span className="label">Amount:</span> {event.amount}
                  </p>
                  <p>
                    <span className="label">Date:</span> {event.date}
                  </p>
                  <p>
                    <span className="label">Engagement:</span> {event.engagement} people
                  </p>
                </div>
                <button className="analytics-btn">View Analytics →</button>
              </div>
            ))}
          </div>
        </section>

        <section className="available-events-section">
          <div className="section-header">
            <h2>Available Events to Sponsor</h2>
          </div>
          <div className="events-grid">
            {availableEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <h3 className="event-name">{event.name}</h3>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                  <p>
                    <span className="detail-label">📅</span> {event.date}
                  </p>
                  <p>
                    <span className="detail-label">👥</span> {event.expectedAttendees}
                  </p>
                </div>

                <div className="packages-section">
                  <h4>Sponsorship Packages:</h4>
                  <div className="packages-list">
                    {event.packages.map((pkg, idx) => (
                      <button key={idx} className="package-btn">
                        <span>{pkg.name}</span> - <span>{pkg.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default SponsorDashboard;
