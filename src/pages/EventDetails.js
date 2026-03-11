import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import FilterTabs from '../components/FilterTabs';
import { RoleContext } from '../context/RoleContext';
import { getEventById, formatEventDate } from '../utils/eventsData';
import '../styles/EventDetails.css';

const EventDetails = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { userRole } = useContext(RoleContext);

  // ALL HOOKS MUST BE AT THE TOP - before any conditional returns
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Determine user type
  const isVendor = userRole === 'vendor';
  const isOrganizer = userRole === 'npo';

  // Vendor requests data (for organizers) - static mock data
  const vendorRequests = [
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
  ];

  // Load event data based on eventId
  useEffect(() => {
    const loadedEvent = getEventById(eventId);
    if (loadedEvent) {
      const dateInfo = formatEventDate(loadedEvent.date);
      setEvent({
        ...loadedEvent,
        displayDate: dateInfo.full,
        budget: loadedEvent.totalBudget,
      });
    }
    setLoading(false);
  }, [eventId]);

  // Define tabs based on role
  const getTabs = () => {
    const baseTabs = [
      { id: 'overview', label: 'Overview', icon: '📋' },
    ];

    if (isVendor) {
      baseTabs.push({ id: 'quote', label: 'Submit Quote', icon: '💰' });
    }

    if (isOrganizer) {
      baseTabs.push(
        { id: 'vendors', label: 'Vendor Requests', icon: '👥' },
        { id: 'budget', label: 'Budget & Attendees', icon: '📊' },
      );
    }

    baseTabs.push({ id: 'timeline', label: 'Timeline', icon: '📅' });

    return baseTabs;
  };

  const tabs = getTabs();

  // Timeline data - dynamic based on event
  const timelineItems = event ? [
    { id: 1, title: 'Event Created', date: 'Event Posted', status: 'completed' },
    { id: 2, title: 'Vendors Invited', date: 'Invitations Sent', status: 'completed' },
    { id: 3, title: 'Awaiting Quotes', date: 'In Progress', status: 'in-progress' },
    { id: 4, title: 'Vendor Approvals', date: 'Pending', status: 'pending' },
    { id: 5, title: 'Event Date', date: `${event.displayDate} at ${event.time}`, status: 'pending' },
  ] : [];

  // Show loading state
  if (loading) {
    return (
      <main className="event-details-page">
        <BackButton />
        <div className="loading-state">Loading event details...</div>
      </main>
    );
  }

  // Show not found state
  if (!event) {
    return (
      <main className="event-details-page">
        <BackButton />
        <div className="not-found-state">
          <h2>Event Not Found</h2>
          <p>The event you're looking for doesn't exist.</p>
          <button className="btn-primary" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </main>
    );
  }

  // Calculate percentages
  const budgetPercentage = (event.budgetUsed / event.budget) * 100;
  const attendeePercentage = (event.attendeeConfirmed / event.attendeeTarget) * 100;

  // Handlers
  const handleSubmitQuote = () => {
    navigate(`/submit-quote/${eventId}`);
  };

  const handleProposeService = () => {
    navigate(`/suggest-event?eventId=${eventId}`);
  };

  const handleEditEvent = () => {
    navigate(`/create-event/${eventId}?mode=edit`);
  };

  const handleRequestVendors = () => {
    navigate(`/request-vendors/${eventId}`);
  };

  const handleInviteAttendees = () => {
    navigate(`/invite-attendees/${eventId}`);
  };

  return (
    <main className="event-details-page">
      <BackButton />
      
      {/* Elite Hero Header */}
      <header className="event-hero">
        <div className="hero-content">
          <div className="hero-main">
            <h1 className="event-title">{event.name}</h1>
            <div className="event-meta">
              <span className="meta-item">
                <span className="meta-icon">📅</span>
                {event.date} at {event.time}
              </span>
              <span className="meta-item">
                <span className="meta-icon">📍</span>
                {event.location}
              </span>
              <span className={`status-badge ${event.status.toLowerCase().replace(' ', '-')}`}>
                {event.status}
              </span>
            </div>
          </div>
          
          {isVendor && (
            <div className="hero-service-badge">
              <span className="service-icon">🛠️</span>
              <span className="service-label">Service Needed</span>
              <span className="service-value">{event.serviceNeeded}</span>
            </div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="hero-decoration">
          <div className="decoration-circle decoration-1"></div>
          <div className="decoration-circle decoration-2"></div>
        </div>
      </header>

      {/* Quick Stats Section */}
      <section className="quick-stats-section">
        <div className="stats-grid">
          {isVendor ? (
            <>
              <div className="stat-card">
                <div className="stat-icon-wrapper gold">
                  <span className="stat-icon">👥</span>
                </div>
                <div className="stat-content">
                  <span className="stat-label">Expected Attendees</span>
                  <span className="stat-value">{event.attendeeTarget}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper green">
                  <span className="stat-icon">💰</span>
                </div>
                <div className="stat-content">
                  <span className="stat-label">Budget Range</span>
                  <span className="stat-value">{event.budgetRange}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper purple">
                  <span className="stat-icon">🎭</span>
                </div>
                <div className="stat-content">
                  <span className="stat-label">Event Type</span>
                  <span className="stat-value">{event.eventType}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="stat-card with-progress">
                <div className="stat-header">
                  <div className="stat-icon-wrapper gold">
                    <span className="stat-icon">👥</span>
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Attendees Confirmed</span>
                    <span className="stat-value">{event.attendeeConfirmed} / {event.attendeeTarget}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${attendeePercentage}%` }}></div>
                </div>
              </div>
              <div className="stat-card with-progress">
                <div className="stat-header">
                  <div className="stat-icon-wrapper green">
                    <span className="stat-icon">💰</span>
                  </div>
                  <div className="stat-content">
                    <span className="stat-label">Budget Used</span>
                    <span className="stat-value">${event.budgetUsed.toLocaleString()} / ${event.budget.toLocaleString()}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${budgetPercentage}%` }}></div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper purple">
                  <span className="stat-icon">📋</span>
                </div>
                <div className="stat-content">
                  <span className="stat-label">Vendor Requests</span>
                  <span className="stat-value">{vendorRequests.length} Total</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Tabbed Content Section */}
      <section className="content-section">
        <div className="content-container">
          <FilterTabs 
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="tab-content-wrapper">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="tab-content overview-content">
                <div className="content-grid">
                  <div className="content-card">
                    <h3 className="card-title">
                      <span className="title-icon">📋</span>
                      Event Details
                    </h3>
                    <div className="details-list">
                      <div className="detail-row">
                        <span className="detail-label">Event Name</span>
                        <span className="detail-value">{event.name}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Date & Time</span>
                        <span className="detail-value">{event.date} at {event.time}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Location</span>
                        <span className="detail-value">{event.location}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Event Type</span>
                        <span className="detail-value">{event.eventType}</span>
                      </div>
                      {isVendor && (
                        <>
                          <div className="detail-row">
                            <span className="detail-label">Service Needed</span>
                            <span className="detail-value highlight">{event.serviceNeeded}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Budget Range</span>
                            <span className="detail-value highlight">{event.budgetRange}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="content-card">
                    <h3 className="card-title">
                      <span className="title-icon">📝</span>
                      Description
                    </h3>
                    <p className="description-text">{event.description}</p>
                    {event.additionalInfo && (
                      <div className="additional-info">
                        <strong>Additional Requirements:</strong>
                        <p>{event.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-section">
                  {isVendor ? (
                    <>
                      <h3 className="action-title">Ready to submit a quote?</h3>
                      <p className="action-description">
                        Click below to submit your proposal with pricing, timeline, and portfolio details.
                      </p>
                      <div className="action-buttons">
                        <button className="btn-primary" onClick={handleSubmitQuote}>
                          <span className="btn-icon">💰</span>
                          Submit Quote
                        </button>
                        <button className="btn-secondary" onClick={handleProposeService}>
                          <span className="btn-icon">💡</span>
                          Propose Different Service
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="action-buttons">
                      <button className="btn-primary" onClick={handleEditEvent}>
                        <span className="btn-icon">✏️</span>
                        Edit Event Details
                      </button>
                      <button className="btn-secondary" onClick={handleRequestVendors}>
                        <span className="btn-icon">👥</span>
                        Request More Vendors
                      </button>
                      <button className="btn-secondary" onClick={handleInviteAttendees}>
                        <span className="btn-icon">📧</span>
                        Invite Attendees
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quote Tab (Vendors Only) */}
            {activeTab === 'quote' && isVendor && (
              <div className="tab-content quote-content">
                <div className="quote-header">
                  <h3 className="section-title">Submit Your Quote</h3>
                  <p className="section-description">
                    Provide your pricing, timeline, and any relevant portfolio items for this event.
                  </p>
                </div>
                
                <div className="quote-summary-card">
                  <div className="summary-row">
                    <span className="summary-label">Service Required</span>
                    <span className="summary-value">{event.serviceNeeded}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Client Budget</span>
                    <span className="summary-value highlight">{event.budgetRange}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Expected Guests</span>
                    <span className="summary-value">{event.attendeeTarget}</span>
                  </div>
                </div>

                <div className="quote-cta">
                  <button className="btn-primary large" onClick={handleSubmitQuote}>
                    <span className="btn-icon">📝</span>
                    Continue to Quote Form
                  </button>
                </div>
              </div>
            )}

            {/* Vendor Requests Tab (Organizers Only) */}
            {activeTab === 'vendors' && isOrganizer && (
              <div className="tab-content vendors-content">
                <div className="vendors-summary">
                  <div className="summary-stat-card">
                    <span className="summary-stat-value">{vendorRequests.length}</span>
                    <span className="summary-stat-label">Total Vendors</span>
                  </div>
                  <div className="summary-stat-card">
                    <span className="summary-stat-value">{vendorRequests.filter(v => v.status === 'Quote Received').length}</span>
                    <span className="summary-stat-label">Quotes Received</span>
                  </div>
                  <div className="summary-stat-card">
                    <span className="summary-stat-value">{vendorRequests.filter(v => v.status === 'Quote Pending').length}</span>
                    <span className="summary-stat-label">Awaiting Response</span>
                  </div>
                </div>

                <div className="vendors-list">
                  {vendorRequests.map((vendor, index) => (
                    <div 
                      key={vendor.id} 
                      className="vendor-card"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="vendor-card-header">
                        <div className="vendor-info">
                          <h4 className="vendor-name">{vendor.vendorName}</h4>
                          <p className="vendor-service">{vendor.serviceType}</p>
                        </div>
                        <span className={`vendor-status ${vendor.status.toLowerCase().replace(' ', '-')}`}>
                          {vendor.status}
                        </span>
                      </div>
                      
                      <div className="vendor-meta">
                        <span className="meta-item">📤 Sent: {vendor.sentDate}</span>
                        <span className="meta-item">⏰ Expected: {vendor.expectedResponse}</span>
                        {vendor.quotedPrice && (
                          <span className="meta-item highlight">💰 Quote: {vendor.quotedPrice}</span>
                        )}
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

            {/* Budget & Attendees Tab (Organizers Only) */}
            {activeTab === 'budget' && isOrganizer && (
              <div className="tab-content budget-content">
                <div className="budget-grid">
                  <div className="budget-card">
                    <h3 className="card-title">
                      <span className="title-icon">💰</span>
                      Budget Breakdown
                    </h3>
                    <div className="budget-details">
                      <div className="budget-row">
                        <span className="budget-label">Total Budget</span>
                        <span className="budget-value">${event.budget.toLocaleString()}</span>
                      </div>
                      <div className="budget-row">
                        <span className="budget-label">Amount Used</span>
                        <span className="budget-value used">${event.budgetUsed.toLocaleString()}</span>
                      </div>
                      <div className="budget-row">
                        <span className="budget-label">Amount Remaining</span>
                        <span className="budget-value remaining">${(event.budget - event.budgetUsed).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="progress-bar large">
                      <div className="progress-fill" style={{ width: `${budgetPercentage}%` }}></div>
                    </div>
                    <p className="progress-label">{budgetPercentage.toFixed(0)}% of budget used</p>
                  </div>

                  <div className="budget-card">
                    <h3 className="card-title">
                      <span className="title-icon">👥</span>
                      Attendee Tracking
                    </h3>
                    <div className="budget-details">
                      <div className="budget-row">
                        <span className="budget-label">Target Attendees</span>
                        <span className="budget-value">{event.attendeeTarget}</span>
                      </div>
                      <div className="budget-row">
                        <span className="budget-label">Confirmed</span>
                        <span className="budget-value confirmed">{event.attendeeConfirmed}</span>
                      </div>
                      <div className="budget-row">
                        <span className="budget-label">Still Needed</span>
                        <span className="budget-value">{event.attendeeTarget - event.attendeeConfirmed}</span>
                      </div>
                    </div>
                    <div className="progress-bar large">
                      <div className="progress-fill" style={{ width: `${attendeePercentage}%` }}></div>
                    </div>
                    <p className="progress-label">{attendeePercentage.toFixed(0)}% of target reached</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="tab-content timeline-content">
                <div className="timeline">
                  {timelineItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`timeline-item ${item.status}`}
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <div className="timeline-marker">
                        {item.status === 'completed' && <span>✓</span>}
                      </div>
                      <div className="timeline-content">
                        <h4 className="timeline-title">{item.title}</h4>
                        <p className="timeline-date">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default EventDetails;
