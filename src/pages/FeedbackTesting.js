import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventContext } from '../context/EventContext';
import { FeedbackContext } from '../context/FeedbackContext';
import '../styles/FeedbackTesting.css';

const FeedbackTesting = () => {
  const navigate = useNavigate();
  const { sponsorships } = useContext(EventContext);
  const { submitFeedback } = useContext(FeedbackContext);

  const [selectedEvent, setSelectedEvent] = useState('');
  const [feedbackType, setFeedbackType] = useState('venue');
  const [formData, setFormData] = useState({
    name: 'Test Attendee',
    email: 'test@example.com',
    ratings: {},
  });
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Get unique events from sponsorships
  const uniqueEvents = sponsorships
    ?.filter((s, index, self) => self.findIndex((t) => t.eventId === s.eventId) === index)
    .map((s) => ({
      id: s.eventId,
      name: s.eventName,
      date: s.date,
    })) || [];

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

  // Initialize ratings when feedback type changes
  React.useEffect(() => {
    const newRatings = {};
    fields.forEach((field) => {
      newRatings[field.key] = 0;
    });
    setFormData((prev) => ({
      ...prev,
      ratings: newRatings,
    }));
  }, [feedbackType]);

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };

  const handleFeedbackTypeChange = (type) => {
    setFeedbackType(type);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [fieldKey]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedEvent) {
      alert('Please select an event');
      return;
    }

    if (Object.values(formData.ratings).some((r) => r === 0)) {
      alert('Please rate all categories');
      return;
    }

    const selectedEventData = uniqueEvents.find((event) => event.id === parseInt(selectedEvent));

    if (!selectedEventData) {
      alert('Invalid event selected');
      return;
    }

    // Submit feedback with test flag
    const feedbackData = {
      eventId: parseInt(selectedEvent),
      eventName: selectedEventData.name,
      eventDate: selectedEventData.date,
      submittedBy: formData.name,
      submittedByEmail: formData.email,
      submittedByRole: 'sponsor',
      type: feedbackType,
      ratings: formData.ratings,
      comments: `Test feedback for ${feedbackType} - submitted at ${new Date().toLocaleTimeString()}`,
      isTestFeedback: true,
    };

    submitFeedback(feedbackData);
    setSuccessMessage(`✅ Test feedback submitted for ${selectedEventData.name}!`);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      navigate('/dashboard/sponsor');
    }, 2500);
  };

  if (submitted) {
    return (
      <main className="feedback-testing-page">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Test Feedback Submitted!</h2>
          <p className="success-message">{successMessage}</p>
          <p className="success-subtitle">Returning to dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="feedback-testing-page">
      <div className="testing-header">
        <h1 className="page-title">Feedback Testing</h1>
      </div>

      <div className="testing-container">
        <div className="testing-intro">
          <div className="intro-icon">🧪</div>
          <h2>Test Event Feedback Submission</h2>
          <p>Submit test feedback for existing events to see how it appears in your Event Feedback section.</p>
          <p className="test-note">💡 Test submissions will be marked with a test badge on the dashboard.</p>
        </div>

        <form className="testing-form" onSubmit={handleSubmit}>
          {/* Event Selection */}
          <div className="form-section">
            <h3 className="section-title">Select Event</h3>
            <div className="form-group">
              <label htmlFor="event-select">Choose an Event *</label>
              <select
                id="event-select"
                value={selectedEvent}
                onChange={handleEventChange}
                required
              >
                <option value="">-- Select an Event --</option>
                {uniqueEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} ({event.date})
                  </option>
                ))}
              </select>
              {uniqueEvents.length === 0 && (
                <p className="info-text">
                  💡 No events found. Create some sponsorships first to test feedback.
                </p>
              )}
            </div>
          </div>

          {/* Feedback Type Selection */}
          <div className="form-section">
            <h3 className="section-title">Feedback Type</h3>
            <div className="feedback-type-buttons">
              <button
                type="button"
                className={`type-btn ${feedbackType === 'venue' ? 'active' : ''}`}
                onClick={() => handleFeedbackTypeChange('venue')}
              >
                <span className="type-icon">🏢</span>
                <span className="type-label">Venue Feedback</span>
              </button>
              <button
                type="button"
                className={`type-btn ${feedbackType === 'service' ? 'active' : ''}`}
                onClick={() => handleFeedbackTypeChange('service')}
              >
                <span className="type-icon">🎯</span>
                <span className="type-label">Service Feedback</span>
              </button>
            </div>
          </div>

          {/* Submitter Info */}
          <div className="form-section">
            <h3 className="section-title">Submitter Information</h3>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Ratings */}
          <div className="form-section">
            <h3 className="section-title">Ratings</h3>
            <p className="section-subtitle">Rate on a scale of 1 to 5 stars</p>

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

          {/* Submit Button */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/dashboard/sponsor')}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={uniqueEvents.length === 0}>
              Submit Test Feedback
            </button>
          </div>
        </form>

        <div className="testing-info">
          <h4>💡 How This Works</h4>
          <ul>
            <li>Select an event from your sponsorships</li>
            <li>Choose between venue or service feedback</li>
            <li>Rate each aspect on a 1-5 star scale</li>
            <li>Click submit to add it to your dashboard</li>
            <li>Test feedback will appear in "Your Event Feedback" section with a test badge</li>
            <li>This helps you see how the feedback system works in real-time</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default FeedbackTesting;
