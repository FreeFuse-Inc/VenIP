import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import '../styles/EventManagement.css';

const EventManagement = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [event] = useState({
    id: eventId || 1,
    name: 'Annual Gala 2024',
    date: 'Dec 15, 2024',
    time: '7:00 PM',
    location: 'Downtown Convention Center',
    description: 'Annual fundraising gala to support local communities',
    status: 'Planning',
    budget: 15000,
    budgetUsed: 4500,
    attendeeTarget: 300,
    attendeeConfirmed: 45,
  });

  const [vendorRequests] = useState([
    {
      id: 1,
      vendorName: 'BrightEvents',
      serviceType: 'Event Planning & Coordination',
      status: 'Quote Pending',
      sentDate: 'Dec 1, 2024',
      expectedResponse: 'Dec 8, 2024',
    },
    {
      id: 2,
      vendorName: 'Catering Pros',
      serviceType: 'Catering Services',
      status: 'Quote Received',
      sentDate: 'Dec 1, 2024',
      quotedPrice: '$3,500',
      expectedResponse: 'Dec 5, 2024',
    },
    {
      id: 3,
      vendorName: 'Fresh Floral',
      serviceType: 'Floral Decorations',
      status: 'Quote Received',
      sentDate: 'Dec 2, 2024',
      quotedPrice: '$1,200',
      expectedResponse: 'Dec 6, 2024',
    },
  ]);

  const [activeTab, setActiveTab] = useState('overview');

  const budgetPercentage = (event.budgetUsed / event.budget) * 100;
  const attendeePercentage = (event.attendeeConfirmed / event.attendeeTarget) * 100;

  return (
    <main className="event-management">
      <BackButton />
      <div className="event-header">
        <div className="event-header-content">
          <h1 className="event-title">{event.name}</h1>
          <div className="event-meta">
            <span className="event-date">📅 {event.date} at {event.time}</span>
            <span className="event-location">📍 {event.location}</span>
            <span className={`event-status-badge ${event.status.toLowerCase().replace(' ', '-')}`}>
              {event.status}
            </span>
          </div>
        </div>
      </div>

      <div className="event-content">
        <div className="tabs-navigation">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'vendors' ? 'active' : ''}`}
            onClick={() => setActiveTab('vendors')}
          >
            Vendor Requests
          </button>
          <button
            className={`tab ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            Budget & Attendees
          </button>
          <button
            className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="tab-content overview-content">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Event Details</h3>
                <div className="detail-item">
                  <span className="detail-label">Event Name:</span>
                  <span className="detail-value">{event.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date & Time:</span>
                  <span className="detail-value">{event.date} at {event.time}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{event.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{event.description}</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>Quick Stats</h3>
                <div className="stat-row">
                  <div className="stat">
                    <span className="stat-label">Attendees Confirmed</span>
                    <span className="stat-value">{event.attendeeConfirmed} / {event.attendeeTarget}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${attendeePercentage}%` }}></div>
                  </div>
                </div>
                <div className="stat-row">
                  <div className="stat">
                    <span className="stat-label">Budget Used</span>
                    <span className="stat-value">${event.budgetUsed} / ${event.budget}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${budgetPercentage}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={() => navigate(`/create-event/${eventId}?mode=edit`)}>Edit Event Details</button>
              <button className="btn-secondary" onClick={() => navigate(`/request-vendors/${eventId}`)}>Request More Vendors</button>
              <button className="btn-secondary" onClick={() => navigate(`/invite-attendees/${eventId}`)}>Invite Attendees</button>
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="tab-content vendors-content">
            <div className="vendors-summary">
              <div className="summary-card">
                <span className="summary-label">Total Vendors Requested:</span>
                <span className="summary-value">{vendorRequests.length}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Quotes Received:</span>
                <span className="summary-value">{vendorRequests.filter(v => v.status === 'Quote Received').length}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Awaiting Response:</span>
                <span className="summary-value">{vendorRequests.filter(v => v.status === 'Quote Pending').length}</span>
              </div>
            </div>

            <div className="vendors-list">
              {vendorRequests.map((vendor) => (
                <div key={vendor.id} className="vendor-request-card">
                  <div className="vendor-header">
                    <h4 className="vendor-name">{vendor.vendorName}</h4>
                    <span className={`vendor-status ${vendor.status.toLowerCase().replace(' ', '-')}`}>
                      {vendor.status}
                    </span>
                  </div>
                  <p className="service-type">{vendor.serviceType}</p>
                  <div className="vendor-dates">
                    <span>📤 Sent: {vendor.sentDate}</span>
                    <span>⏰ Expected: {vendor.expectedResponse}</span>
                    {vendor.quotedPrice && <span>💰 Quote: {vendor.quotedPrice}</span>}
                  </div>
                  <div className="vendor-actions">
                    {vendor.status === 'Quote Received' ? (
                      <>
                        <button className="btn-approve">Accept Quote</button>
                        <button className="btn-negotiate">Negotiate</button>
                      </>
                    ) : (
                      <button className="btn-secondary">Send Reminder</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="tab-content budget-content">
            <div className="budget-grid">
              <div className="budget-card">
                <h3>Budget Breakdown</h3>
                <div className="budget-item">
                  <span className="budget-label">Total Budget:</span>
                  <span className="budget-value">${event.budget.toLocaleString()}</span>
                </div>
                <div className="budget-item">
                  <span className="budget-label">Amount Used:</span>
                  <span className="budget-value used">${event.budgetUsed.toLocaleString()}</span>
                </div>
                <div className="budget-item">
                  <span className="budget-label">Amount Remaining:</span>
                  <span className="budget-value remaining">${(event.budget - event.budgetUsed).toLocaleString()}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${budgetPercentage}%` }}></div>
                </div>
                <p className="budget-percentage">{budgetPercentage.toFixed(0)}% of budget used</p>
              </div>

              <div className="attendees-card">
                <h3>Attendee Tracking</h3>
                <div className="attendees-item">
                  <span className="attendees-label">Target Attendees:</span>
                  <span className="attendees-value">{event.attendeeTarget}</span>
                </div>
                <div className="attendees-item">
                  <span className="attendees-label">Confirmed:</span>
                  <span className="attendees-value confirmed">{event.attendeeConfirmed}</span>
                </div>
                <div className="attendees-item">
                  <span className="attendees-label">Still Needed:</span>
                  <span className="attendees-value">{event.attendeeTarget - event.attendeeConfirmed}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${attendeePercentage}%` }}></div>
                </div>
                <p className="attendee-percentage">{attendeePercentage.toFixed(0)}% of target reached</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="tab-content timeline-content">
            <div className="timeline">
              <div className="timeline-item completed">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Event Created</h4>
                  <p>Nov 28, 2024</p>
                </div>
              </div>
              <div className="timeline-item completed">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Vendors Invited</h4>
                  <p>Dec 1, 2024</p>
                </div>
              </div>
              <div className="timeline-item in-progress">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Awaiting Quotes</h4>
                  <p>Expected: Dec 8, 2024</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Vendor Approvals</h4>
                  <p>Expected: Dec 12, 2024</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Event Date</h4>
                  <p>Dec 15, 2024 at 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default EventManagement;
