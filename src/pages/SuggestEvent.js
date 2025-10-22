import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SuggestEvent.css';

const SuggestEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    description: '',
    suggestedDate: '',
    estimatedBudget: '',
    serviceOffering: '',
    targetAudience: '',
    additionalInfo: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      formData.eventName &&
      formData.eventType &&
      formData.description &&
      formData.suggestedDate &&
      formData.serviceOffering
    ) {
      setSubmitted(true);
      setTimeout(() => {
        navigate('/dashboard/vendor');
      }, 2000);
    }
  };

  if (submitted) {
    return (
      <div className="event-suggestion-submitted">
        <div className="success-message">
          <div className="success-icon">💡</div>
          <h2>Event Idea Submitted!</h2>
          <p>Thank you for suggesting an event idea.</p>
          <p className="status-text">
            The NPO will review your suggestion and may contact you to discuss further details.
          </p>
          <button onClick={() => navigate('/dashboard/vendor')} className="btn-return">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="suggest-event-page">
      <button className="back-btn" onClick={() => navigate('/dashboard/vendor')}>
        ← Back to Dashboard
      </button>

      <div className="suggest-event-header">
        <h1>Suggest a New Event</h1>
        <p>
          Have an event idea that needs services? Tell us about it and we'll connect you with NPOs who might be
          interested.
        </p>
      </div>

      <div className="suggest-event-content">
        <form className="suggestion-form">
          <div className="form-section">
            <h3>Event Details</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Event Name *</label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  placeholder="e.g., Community Sports Festival"
                />
              </div>

              <div className="form-group">
                <label>Event Type *</label>
                <select name="eventType" value={formData.eventType} onChange={handleInputChange}>
                  <option value="">Select Event Type</option>
                  <option value="Fundraiser">Fundraiser</option>
                  <option value="Conference">Conference</option>
                  <option value="Festival">Festival</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Community Event">Community Event</option>
                  <option value="Sports Event">Sports Event</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Event Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the event, its purpose, and what makes it special..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Suggested Event Date *</label>
                <input
                  type="date"
                  name="suggestedDate"
                  value={formData.suggestedDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Estimated Budget Range</label>
                <select name="estimatedBudget" value={formData.estimatedBudget} onChange={handleInputChange}>
                  <option value="">Select Budget Range</option>
                  <option value="Under $5,000">Under $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                  <option value="Over $50,000">Over $50,000</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Your Service Offering</h3>

            <div className="form-grid">
              <div className="form-group full-width">
                <label>What Service Can You Provide? *</label>
                <textarea
                  name="serviceOffering"
                  value={formData.serviceOffering}
                  onChange={handleInputChange}
                  placeholder="Describe your service: catering, decorations, photography, entertainment, etc. Explain how your service would enhance this event."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Target Audience / Expected Attendees</label>
                <input
                  type="text"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  placeholder="e.g., 200-300 professionals, families, students"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>

            <div className="form-group">
              <label>Any Additional Details or Notes</label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                placeholder="Share any other relevant information about the event or your services..."
                rows="3"
              />
            </div>

            <div className="note-box">
              <p>
                💡 <strong>Tip:</strong> The more details you provide, the better NPOs can understand your vision and
                connect with you.
              </p>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard/vendor')}>
              Cancel
            </button>
            <button type="button" className="btn-submit" onClick={handleSubmit}>
              Submit Event Idea
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SuggestEvent;
