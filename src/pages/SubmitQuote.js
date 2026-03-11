import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import '../styles/SubmitQuote.css';

const SubmitQuote = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [formData, setFormData] = useState({
    serviceDescription: '',
    quotePrice: '',
    deliveryTimeline: '',
    milestones: '',
    portfolio: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, portfolio: e.target.files[0] }));
  };

  const handleSubmit = () => {
    if (formData.serviceDescription && formData.quotePrice && formData.deliveryTimeline) {
      setSubmitted(true);
      setTimeout(() => {
        navigate('/dashboard/vendor');
      }, 2000);
    }
  };

  if (submitted) {
    return (
      <div className="quote-submitted">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Quote Submitted Successfully!</h2>
          <p>Your proposal has been sent to the event organizer.</p>
          <p className="status-text">Status: Pending Review by NPO</p>
          <button onClick={() => navigate('/dashboard/vendor')} className="btn-return">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="submit-quote-page">
      <BackButton />
      <div className="quote-header">
        <h1>Submit Your Quote</h1>
        <p>Event: Annual Gala 2024 • Service: Catering</p>
      </div>

      <div className="quote-content">
        <form className="quote-form">
          <div className="form-section">
            <h3>Service Proposal</h3>
            <div className="form-group">
              <label>Service Description & Proposal *</label>
              <textarea
                name="serviceDescription"
                value={formData.serviceDescription}
                onChange={handleInputChange}
                placeholder="Describe your services, what you'll provide, and why you're the best fit for this event. Include any special offerings or add-ons."
                rows="6"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Pricing & Timeline</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Quote Price *</label>
                <div className="price-input-wrapper">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    name="quotePrice"
                    value={formData.quotePrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Delivery Timeline / Availability *</label>
                <input
                  type="text"
                  name="deliveryTimeline"
                  value={formData.deliveryTimeline}
                  onChange={handleInputChange}
                  placeholder="e.g., Within 2 weeks, Available on date"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Project Milestones (Optional)</h3>
            <div className="form-group">
              <label>Milestones & Deliverables</label>
              <textarea
                name="milestones"
                value={formData.milestones}
                onChange={handleInputChange}
                placeholder="e.g., Week 1: Initial consultation and menu planning • Week 2: Sample tasting • Week 3: Final confirmation and setup"
                rows="4"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Portfolio (Optional)</h3>
            <div className="form-group">
              <label>Upload Portfolio or References</label>
              <div className="file-upload">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.png,.zip"
                />
                <p className="file-info">
                  {formData.portfolio
                    ? `Selected: ${formData.portfolio.name}`
                    : 'PDF, images, or documents showing your previous work'}
                </p>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-submit"
              onClick={handleSubmit}
            >
              Submit Quote
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SubmitQuote;
