import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UpcomingEventCard.css';

const UpcomingEventCard = ({ 
  event, 
  onClick,
  showActions = false 
}) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleString('en-US', { month: 'short' })
    };
  };

  const { day, month } = formatDate(event.date || event.eventDate);

  const getStatusColor = (status) => {
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

  const statusStyle = getStatusColor(event.status);

  const handleClick = () => {
    if (onClick) {
      onClick(event);
    } else if (event.id) {
      navigate(`/event-management/${event.id}`);
    }
  };

  return (
    <div className="upcoming-event-card" onClick={handleClick}>
      <div className="event-date-badge">
        <span className="date-day">{day}</span>
        <span className="date-month">{month}</span>
      </div>
      
      <div className="event-info">
        <h4 className="event-name">{event.name || event.title}</h4>
        <p className="event-venue">{event.venue || event.location}</p>
      </div>

      <div className="event-status-wrapper">
        <span 
          className="event-status-badge"
          style={{ 
            backgroundColor: statusStyle.bg,
            color: statusStyle.color
          }}
        >
          {event.status}
        </span>
      </div>

      {showActions && (
        <button className="event-action-btn">→</button>
      )}
    </div>
  );
};

export default UpcomingEventCard;
