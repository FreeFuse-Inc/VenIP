import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/RequestVendors.css';

const RequestVendors = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  
  const serviceCategories = [
    'Catering Services',
    'Decorations & Floral',
    'Photography & Videography',
    'Event Planning & Coordination',
    'Sound & Lighting',
    'Entertainment & DJ',
    'Venue Setup & Furniture',
    'Transportation & Logistics',
  ];

  const [selectedServices, setSelectedServices] = useState([]);
  const [vendorRequests, setVendorRequests] = useState([
    {
      id: 1,
      serviceType: 'Catering Services',
      vendorsRequested: 3,
      status: 'In Progress',
      dateRequested: 'Dec 1, 2024',
    },
    {
      id: 2,
      serviceType: 'Decorations & Floral',
      vendorsRequested: 2,
      status: 'Quotes Received',
      dateRequested: 'Dec 2, 2024',
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);

  const handleServiceToggle = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleRequestVendors = (e) => {
    e.preventDefault();

    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }

    selectedServices.forEach((service) => {
      const newRequest = {
        id: vendorRequests.length + 1,
        serviceType: service,
        vendorsRequested: 3,
        status: 'In Progress',
        dateRequested: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      };
      setVendorRequests((prev) => [...prev, newRequest]);
    });

    setRequestStatus('success');
    setSelectedServices([]);
    setShowForm(false);

    setTimeout(() => {
      navigate(`/event-management/${eventId}`);
    }, 2000);
  };

  if (requestStatus === 'success') {
    return (
      <main className="request-vendors-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Vendor Requests Sent Successfully!</h2>
          <p>Your vendor requests have been sent to matching service providers</p>
          <p className="redirect-message">Redirecting you back to event details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="request-vendors-container">
      <div className="request-header">
        <button className="back-btn" onClick={() => navigate(`/event-management/${eventId}`)}>
          ← Back to Event
        </button>
        <h1>Request More Vendors</h1>
        <p className="event-id-text">Event ID: {eventId}</p>
      </div>

      <div className="request-content">
        <div className="request-form-section">
          {!showForm && (
            <button
              className="btn-request-vendors"
              onClick={() => setShowForm(true)}
            >
              + Request New Service
            </button>
          )}

          {showForm && (
            <div className="vendor-request-form">
              <h3>Select Services to Request</h3>
              <form onSubmit={handleRequestVendors}>
                <div className="services-grid">
                  {serviceCategories.map((service) => {
                    const isSelected = selectedServices.includes(service);
                    const isRequested = vendorRequests.some((req) => req.serviceType === service);
                    return (
                      <div
                        key={service}
                        className={`service-option ${isSelected ? 'selected' : ''} ${
                          isRequested && !isSelected ? 'already-requested' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={service}
                          name={service}
                          checked={isSelected}
                          onChange={() => handleServiceToggle(service)}
                          disabled={isRequested && !isSelected}
                        />
                        <label htmlFor={service}>
                          {service}
                          {isRequested && !isSelected && <span className="already-text"> (Already Requested)</span>}
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="vendor-count-info">
                  <p>Selected: <strong>{selectedServices.length}</strong> service(s)</p>
                  <p className="info-text">We'll send requests to 3-5 vendors for each service</p>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedServices([]);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={selectedServices.length === 0}
                  >
                    Send Requests →
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="vendor-requests-list-section">
          <h2>Active Vendor Requests ({vendorRequests.length})</h2>

          {vendorRequests.length === 0 ? (
            <div className="empty-state">
              <p>No vendor requests yet</p>
              <p className="subtext">Request vendors to get quotes for your event services</p>
            </div>
          ) : (
            <div className="vendor-requests-list">
              {vendorRequests.map((request) => (
                <div key={request.id} className="vendor-request-card">
                  <div className="request-info">
                    <h4 className="service-title">{request.serviceType}</h4>
                    <div className="request-details">
                      <span className="detail">👥 {request.vendorsRequested} vendors requested</span>
                      <span className="detail">📅 {request.dateRequested}</span>
                    </div>
                  </div>
                  <div className="request-status-section">
                    <span className={`request-status ${request.status.toLowerCase().replace(' ', '-')}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {vendorRequests.length > 0 && (
            <div className="request-actions">
              <button
                className="btn-secondary"
                onClick={() => navigate(`/event-management/${eventId}`)}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default RequestVendors;
