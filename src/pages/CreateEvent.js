import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateEvent.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    budget: '',
  });

  const steps = [
    { number: 1, title: 'Enter Event Details' },
    { number: 2, title: 'Request/Invite Vendors' },
    { number: 3, title: 'Receive & Compare Quotes' },
    { number: 4, title: 'Approvals' },
    { number: 5, title: 'Publish Event' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/dashboard/npo');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <main className="create-event-container">
      <header className="create-event-header">
        <button className="back-btn" onClick={() => navigate('/dashboard/npo')}>
          ← Back
        </button>
        <h1>Create Event</h1>
      </header>

      <div className="create-event-content">
        <div className="steps-indicator">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`step ${currentStep === step.number ? 'active' : ''} ${
                currentStep > step.number ? 'completed' : ''
              }`}
            >
              <div className="step-number">{step.number}</div>
              <span className="step-title">{step.title}</span>
            </div>
          ))}
        </div>

        <div className="form-container">
          {currentStep === 1 && (
            <div className="form-step">
              <h2>Enter Event Details</h2>
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Annual Charity Gala"
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event..."
                  rows="4"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Event Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Downtown Convention Center"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Budget (USD) *</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-step">
              <h2>Request/Invite Vendors</h2>
              <div className="vendor-list">
                <div className="vendor-invite-card">
                  <h3>Catering Services</h3>
                  <p>Invite caterers to provide quotes for your event</p>
                  <button className="invite-btn">+ Invite Vendors</button>
                </div>
                <div className="vendor-invite-card">
                  <h3>Decorations & Floral</h3>
                  <p>Request decoration services</p>
                  <button className="invite-btn">+ Invite Vendors</button>
                </div>
                <div className="vendor-invite-card">
                  <h3>Photography & Videography</h3>
                  <p>Book professional photography services</p>
                  <button className="invite-btn">+ Invite Vendors</button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-step">
              <h2>Receive & Compare Quotes</h2>
              <div className="quotes-container">
                <div className="quotes-empty">
                  <p>Quotes will appear here once vendors respond</p>
                  <p className="subtext">Vendors you've invited will send their quotes for comparison</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="form-step">
              <h2>Approvals</h2>
              <div className="approvals-section">
                <div className="approval-item">
                  <h3>Budget Review</h3>
                  <p>Total Quotes: Pending vendor responses</p>
                  <span className="status-badge pending">Pending</span>
                </div>
                <div className="approval-item">
                  <h3>Vendor Confirmation</h3>
                  <p>All vendors need to be confirmed before publishing</p>
                  <span className="status-badge pending">Pending</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="form-step">
              <h2>Publish Event</h2>
              <div className="publish-summary">
                <h3>Event Summary</h3>
                <div className="summary-item">
                  <span className="label">Title:</span>
                  <span className="value">{formData.title || 'Not provided'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Date:</span>
                  <span className="value">{formData.date || 'Not provided'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Location:</span>
                  <span className="value">{formData.location || 'Not provided'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Budget:</span>
                  <span className="value">${formData.budget || '0'}</span>
                </div>
                <p className="publish-note">
                  Review all details above and click "Publish" to make your event live and visible to vendors and
                  sponsors.
                </p>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button className="btn-secondary" onClick={handleBack} disabled={currentStep === 1}>
              ← Back
            </button>
            <button className="btn-primary" onClick={handleNext}>
              {currentStep === 5 ? 'Publish Event' : 'Next'} →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateEvent;
