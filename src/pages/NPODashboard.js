import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import '../styles/NPODashboard.css';

const NPODashboard = () => {
  const navigate = useNavigate();

  const upcomingEvents = [
    { id: 1, name: 'Annual Gala 2024', date: 'Dec 15, 2024', status: 'Planning' },
    { id: 2, name: 'Charity Fundraiser', date: 'Jan 10, 2025', status: 'Pending Quotes' },
    { id: 3, name: 'Community Cleanup', date: 'Jan 20, 2025', status: 'Approved' },
  ];

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
      </div>
    </main>
  );
};

export default NPODashboard;
