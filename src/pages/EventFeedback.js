import React, { useState, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FeedbackContext } from '../context/FeedbackContext';
import { EventContext } from '../context/EventContext';
import BackButton from '../components/BackButton';
import '../styles/EventFeedback.css';

const EventFeedback = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { getEventById } = useContext(EventContext);
  const { submitFeedback } = useContext(FeedbackContext);
  const location = useLocation();

  const event = getEventById(eventId);
  const feedbackType = new URLSearchParams(location.search).get('type') || 'venue';

  const [formData, setFormData] = useState({
    ratings: feedbackType === 'venue' ? {
      location: 0,
      cleanliness: 0,
      amenities: 0,
      staff: 0,
      value: 0,
    } : {
      quality: 0,
      timeliness: 0,
      professionalism: 0,
      value: 0,
    },
    comments: '',
    name: '',
    email: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const venueFields = [
    { key: 'location', label: 'Location & Accessibility' },
    { key: 'cleanliness', label: 'Cleanliness & Maintenance' },
    { key: 'amenities', label: 'Amenities & Facilities' },
    { key: 'staff', label: 'Staff & Service' },
    { key: 'value', label: 'Value for Price' },
  ];

  const serviceFields = [
    { key: 'quality', label: 'Quality of Work' },
    { key: 'timeliness', label: 'Timeliness & Delivery' },
    { key: 'professionalism', label: 'Professionalism' },
    { key: 'value', label: 'Value for Price' },
  ];

  const fields = feedbackType === 'venue' ? venueFields : serviceFields;

  const handleRatingChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [fieldKey]: value,
      },
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      alert('Please enter your email');
      return;
    }

    if (Object.values(formData.ratings).some((r) => r === 0)) {
      alert('Please rate all categories');
      return;
    }

    const feedbackData = {
      eventId: parseInt(eventId),
      eventName: event?.name || 'Unknown Event',
      eventDate: event?.date || '',
      submittedBy: formData.name,
      submittedByEmail: formData.email,
      submittedByRole: 'user',
      type: feedbackType,
      ratings: formData.ratings,
      comments: formData.comments,
    };

    submitFeedback(feedbackData);
    setSubmitted(true);

    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (!event) {
    return (
      <main className="event-feedback-page">
        <div className="error-container">
          <p className="error-message">Event not found</p>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="event-feedback-page">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Thank You!</h2>
          <p className="success-message">Your feedback has been submitted successfully.</p>
          <p className="success-subtitle">Redirecting to dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="event-feedback-page">
      <BackButton />
      <div className="feedback-header">
        <h1 className="page-title">Event Feedback</h1>
      </div>

      <div className="feedback-container">
        <div className="feedback-intro">
          <h2>{event.name}</h2>
          <p className="event-date">Event Date: {event.date}</p>
          <div className="feedback-type-badge">
            {feedbackType === 'venue' ? '��� Venue Feedback' : '🎯 Service Feedback'}
          </div>
        </div>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>

            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Ratings</h3>
            <p className="section-subtitle">Please rate each aspect on a scale of 1 to 5</p>

            <div className="ratings-grid">
              {fields.map((field) => (
                <div key={field.key} className="rating-card">
                  <label>{field.label}</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star ${formData.ratings[field.key] >= star ? 'filled' : ''}`}
                        onClick={() => handleRatingChange(field.key, star)}
                        aria-label={`Rate ${star} stars`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="rating-value">
                      {formData.ratings[field.key] > 0 ? `${formData.ratings[field.key]}/5` : 'Not rated'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Additional Comments</h3>

            <div className="form-group">
              <label htmlFor="comments">Your Feedback</label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                placeholder="Share your thoughts and suggestions (optional)"
                rows="5"
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EventFeedback;
