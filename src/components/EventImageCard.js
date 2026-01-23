import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EventImageCard.css';

const EventImageCard = ({ 
  event,
  onClick,
  actionLabel = 'View Details',
  actionPath
}) => {
  const navigate = useNavigate();

  const defaultImages = [
    'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=600',
  ];

  const getEventImage = () => {
    if (event.image) return event.image;
    const index = (event.id || 0) % defaultImages.length;
    return defaultImages[index];
  };

  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'published' || statusLower === 'active') {
      return { bg: 'var(--status-published-bg)', color: 'var(--status-published)' };
    }
    if (statusLower === 'draft') {
      return { bg: 'var(--status-draft-bg)', color: 'var(--status-draft)' };
    }
    if (statusLower === 'pending') {
      return { bg: 'var(--status-pending-bg)', color: 'var(--status-pending)' };
    }
    if (statusLower === 'completed') {
      return { bg: 'var(--status-completed-bg)', color: 'var(--status-completed)' };
    }
    return { bg: 'var(--status-draft-bg)', color: 'var(--status-draft)' };
  };

  const statusStyle = getStatusStyle(event.status);

  const handleClick = () => {
    if (onClick) {
      onClick(event);
    } else if (actionPath) {
      navigate(actionPath);
    } else if (event.id) {
      navigate(`/sponsor-event-details/${event.id}`);
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time;
  };

  return (
    <div className="event-image-card" onClick={handleClick}>
      <div className="event-image-wrapper">
        <img 
          src={getEventImage()} 
          alt={event.name || event.title}
          className="event-image"
          onError={(e) => {
            e.target.src = defaultImages[0];
          }}
        />
        <div className="image-overlay"></div>
      </div>

      <div className="event-card-content">
        <div className="event-card-header">
          <div className="event-title-section">
            <h3 className="event-card-title">{event.name || event.title}</h3>
            {event.description && (
              <p className="event-card-description">{event.description}</p>
            )}
          </div>
          {event.status && (
            <span 
              className="event-card-status"
              style={{ 
                backgroundColor: statusStyle.bg,
                color: statusStyle.color
              }}
            >
              {event.status}
            </span>
          )}
        </div>

        <div className="event-card-details">
          {event.date && (
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <span className="detail-text">{event.date}</span>
            </div>
          )}
          {event.time && (
            <div className="detail-item">
              <span className="detail-icon">⏰</span>
              <span className="detail-text">{formatTime(event.time)}</span>
            </div>
          )}
          {event.location && (
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <span className="detail-text">{event.location}</span>
            </div>
          )}
          {event.expectedAttendees && (
            <div className="detail-item">
              <span className="detail-icon">👥</span>
              <span className="detail-text">{event.expectedAttendees} expected attendees</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventImageCard;
