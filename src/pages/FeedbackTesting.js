import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventContext } from '../context/EventContext';
import { FeedbackContext } from '../context/FeedbackContext';
import BackButton from '../components/BackButton';
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
  const [uploadedTemplate, setUploadedTemplate] = useState(null);
  const [templatePreview, setTemplatePreview] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Get unique events from sponsorships
  const uniqueEvents = sponsorships
    ?.filter((s, index, self) => self.findIndex((t) => t.eventId === s.eventId) === index)
    .map((s) => ({
      id: s.eventId,
      name: s.eventName,
      date: s.date,
    })) || [];

  const venueFields = [
    { key: 'location', label: 'Location & Accessibility', icon: '📍' },
    { key: 'cleanliness', label: 'Cleanliness & Maintenance', icon: '✨' },
    { key: 'amenities', label: 'Amenities & Facilities', icon: '🏋️' },
    { key: 'staff', label: 'Staff & Service', icon: '👥' },
    { key: 'value', label: 'Value for Price', icon: '💎' },
  ];

  const serviceFields = [
    { key: 'quality', label: 'Quality of Work', icon: '⭐' },
    { key: 'timeliness', label: 'Timeliness & Delivery', icon: '⏱️' },
    { key: 'professionalism', label: 'Professionalism', icon: '👔' },
    { key: 'value', label: 'Value for Price', icon: '💎' },
  ];

  const fields = feedbackType === 'venue' ? venueFields : serviceFields;

  // Load template from localStorage on mount
  React.useEffect(() => {
    const savedTemplate = localStorage.getItem('feedbackTemplate');
    if (savedTemplate) {
      try {
        const templateData = JSON.parse(savedTemplate);
        setUploadedTemplate(templateData);
      } catch (err) {
        console.error('Error loading template:', err);
      }
    }
  }, []);

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

  const handleTemplateUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ['.pdf', '.html', '.json', '.txt', '.docx', '.doc'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      setUploadError('Invalid file type. Allowed types: PDF, HTML, JSON, Word docs, Plain text');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setUploadError('');
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        const templateData = {
          name: file.name,
          type: fileExtension,
          content: content,
          uploadedAt: new Date().toLocaleString(),
        };

        localStorage.setItem('feedbackTemplate', JSON.stringify(templateData));
        setUploadedTemplate(templateData);
        setTemplatePreview('');
        setShowUploadModal(false);
      } catch (err) {
        setUploadError('Error processing file. Please try again.');
      }
    };

    reader.onerror = () => {
      setUploadError('Error reading file. Please try again.');
    };

    reader.readAsText(file);
  };

  const handleRemoveTemplate = () => {
    localStorage.removeItem('feedbackTemplate');
    setUploadedTemplate(null);
    setTemplatePreview('');
    setUploadError('');
  };

  const renderTemplate = () => {
    if (!uploadedTemplate) return null;

    const { content, type } = uploadedTemplate;

    if (type === '.html') {
      return (
        <div
          className="template-content html-template"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    } else if (type === '.json') {
      try {
        const data = JSON.parse(content);
        return (
          <div className="template-content json-template">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        );
      } catch (err) {
        return <p className="template-error">Invalid JSON format</p>;
      }
    } else {
      return (
        <div className="template-content text-template">
          <pre>{content}</pre>
        </div>
      );
    }
  };

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
    setSuccessMessage(`Test feedback submitted for ${selectedEventData.name}!`);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      navigate('/dashboard/sponsor');
    }, 2500);
  };

  // Calculate completion percentage
  const totalRatings = Object.values(formData.ratings).filter(r => r > 0).length;
  const completionPercent = fields.length > 0 ? Math.round((totalRatings / fields.length) * 100) : 0;

  if (submitted) {
    return (
      <main className="feedback-testing-page">
        <div className="success-overlay">
          <div className="success-container">
            <div className="success-decoration">
              <div className="success-ring"></div>
              <div className="success-ring delay-1"></div>
              <div className="success-ring delay-2"></div>
            </div>
            <div className="success-icon">✓</div>
            <h2 className="success-title">Feedback Submitted!</h2>
            <p className="success-message">{successMessage}</p>
            <div className="success-progress">
              <div className="success-progress-bar"></div>
            </div>
            <p className="success-subtitle">Returning to dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="feedback-testing-page">
      <BackButton />
      
      {/* Hero Section */}
      <div className="feedback-hero">
        <div className="hero-decoration">
          <div className="decoration-circle decoration-1"></div>
          <div className="decoration-circle decoration-2"></div>
        </div>
        <div className="hero-content">
          <div className="hero-main">
            <h1 className="feedback-title">Feedback Testing</h1>
            <p className="feedback-subtitle">Submit test feedback to preview how the system works</p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat test-mode">
              <span className="stat-icon">🧪</span>
              <span className="stat-label">Test Mode</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">{uniqueEvents.length}</span>
              <span className="stat-label">Events</span>
            </div>
          </div>
        </div>
      </div>

      <div className="feedback-content">
        {/* Template Management Section */}
        <div className="template-management-card">
          <div className="template-card-header">
            <div className="template-icon-wrap">
              <span className="template-icon">📋</span>
            </div>
            <div className="template-header-text">
              <h3>Custom Template</h3>
              <p>Upload your own feedback form template</p>
            </div>
            <button
              type="button"
              className="btn-upload-template"
              onClick={() => setShowUploadModal(true)}
            >
              <span className="btn-icon">📁</span>
              {uploadedTemplate ? 'Replace' : 'Upload'}
            </button>
          </div>

          {uploadedTemplate && (
            <div className="template-info">
              <div className="template-file-info">
                <span className="file-icon">📄</span>
                <div className="file-details">
                  <span className="file-name">{uploadedTemplate.name}</span>
                  <span className="file-date">Uploaded: {uploadedTemplate.uploadedAt}</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-remove-template"
                onClick={handleRemoveTemplate}
              >
                ✕
              </button>
            </div>
          )}

          {!uploadedTemplate && (
            <div className="template-hint">
              <span className="hint-icon">💡</span>
              <p>Upload PDF, HTML, JSON, Word, or text files to replace the default form</p>
            </div>
          )}
        </div>

        {uploadedTemplate ? (
          <div className="custom-template-container">
            <div className="template-intro">
              <h2>Custom Feedback Form</h2>
              <p>Your uploaded template is displayed below</p>
            </div>
            {renderTemplate()}
            <div className="template-form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/dashboard/sponsor')}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmit}
              >
                <span>Submit Feedback</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="feedback-split-view">
            {/* Left Panel - Form */}
            <div className="form-panel">
              <form className="testing-form" onSubmit={handleSubmit}>
                {/* Event Selection */}
                <div className="form-section" style={{ animationDelay: '0.1s' }}>
                  <div className="section-header">
                    <span className="section-icon">🎯</span>
                    <h3 className="section-title">Select Event</h3>
                  </div>
                  <div className="form-group">
                    <label htmlFor="event-select">Choose an Event</label>
                    <div className="select-wrapper">
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
                      <span className="select-arrow">▼</span>
                    </div>
                    {uniqueEvents.length === 0 && (
                      <p className="info-text">
                        <span className="info-icon">💡</span>
                        No events found. Create sponsorships first to test feedback.
                      </p>
                    )}
                  </div>
                </div>

                {/* Feedback Type Selection */}
                <div className="form-section" style={{ animationDelay: '0.2s' }}>
                  <div className="section-header">
                    <span className="section-icon">📝</span>
                    <h3 className="section-title">Feedback Type</h3>
                  </div>
                  <div className="feedback-type-buttons">
                    <button
                      type="button"
                      className={`type-btn ${feedbackType === 'venue' ? 'active' : ''}`}
                      onClick={() => handleFeedbackTypeChange('venue')}
                    >
                      <span className="type-icon">🏢</span>
                      <span className="type-label">Venue</span>
                      <span className="type-desc">Rate the location</span>
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${feedbackType === 'service' ? 'active' : ''}`}
                      onClick={() => handleFeedbackTypeChange('service')}
                    >
                      <span className="type-icon">🎯</span>
                      <span className="type-label">Service</span>
                      <span className="type-desc">Rate the provider</span>
                    </button>
                  </div>
                </div>

                {/* Submitter Info */}
                <div className="form-section" style={{ animationDelay: '0.3s' }}>
                  <div className="section-header">
                    <span className="section-icon">👤</span>
                    <h3 className="section-title">Your Information</h3>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Ratings */}
                <div className="form-section ratings-section" style={{ animationDelay: '0.4s' }}>
                  <div className="section-header">
                    <span className="section-icon">⭐</span>
                    <div className="section-title-group">
                      <h3 className="section-title">Ratings</h3>
                      <span className="completion-badge">
                        {completionPercent}% Complete
                      </span>
                    </div>
                  </div>
                  <p className="section-subtitle">Rate each category from 1 to 5 stars</p>

                  <div className="ratings-grid">
                    {fields.map((field, index) => (
                      <div 
                        key={field.key} 
                        className={`rating-card ${formData.ratings[field.key] > 0 ? 'rated' : ''}`}
                        style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                      >
                        <div className="rating-card-header">
                          <span className="rating-icon">{field.icon}</span>
                          <label>{field.label}</label>
                        </div>
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
                        </div>
                        <span className="rating-value">
                          {formData.ratings[field.key] > 0 
                            ? `${formData.ratings[field.key]}/5` 
                            : 'Not rated'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => navigate('/dashboard/sponsor')}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={uniqueEvents.length === 0}
                  >
                    <span>Submit Test Feedback</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Right Panel - Info */}
            <div className="info-panel">
              <div className="info-card">
                <div className="info-card-header">
                  <span className="info-card-icon">💡</span>
                  <h4>How It Works</h4>
                </div>
                <ul className="info-list">
                  <li>
                    <span className="step-number">1</span>
                    <span>Select an event from your sponsorships</span>
                  </li>
                  <li>
                    <span className="step-number">2</span>
                    <span>Choose between venue or service feedback</span>
                  </li>
                  <li>
                    <span className="step-number">3</span>
                    <span>Rate each aspect on a 1-5 star scale</span>
                  </li>
                  <li>
                    <span className="step-number">4</span>
                    <span>Submit to see it on your dashboard</span>
                  </li>
                </ul>
              </div>

              <div className="info-card highlight">
                <div className="info-card-header">
                  <span className="info-card-icon">🏷️</span>
                  <h4>Test Badge</h4>
                </div>
                <p className="info-description">
                  Test submissions will appear in your "Event Feedback" section with a special test badge for easy identification.
                </p>
              </div>

              <div className="info-card">
                <div className="info-card-header">
                  <span className="info-card-icon">📊</span>
                  <h4>Live Preview</h4>
                </div>
                <p className="info-description">
                  Experience the complete feedback flow and see how ratings appear in real-time on your dashboard.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Template Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-icon">📁</span>
                <h2>Upload Template</h2>
              </div>
              <button
                className="close-btn"
                onClick={() => setShowUploadModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="upload-info">
                <h4>Supported Formats</h4>
                <div className="format-tags">
                  <span className="format-tag">PDF</span>
                  <span className="format-tag">HTML</span>
                  <span className="format-tag">JSON</span>
                  <span className="format-tag">Word</span>
                  <span className="format-tag">Text</span>
                </div>
                <p className="size-limit">Maximum file size: 5MB</p>
              </div>

              {uploadError && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {uploadError}
                </div>
              )}

              <div className="file-upload-area">
                <div className="upload-icon">📤</div>
                <p className="upload-text">Click to select or drag a file here</p>
                <input
                  type="file"
                  id="template-file"
                  onChange={handleTemplateUpload}
                  accept=".pdf,.html,.json,.txt,.doc,.docx"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default FeedbackTesting;
