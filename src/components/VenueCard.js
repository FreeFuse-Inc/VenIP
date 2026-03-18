import React from 'react';
import '../styles/VenueCard.css';

const VenueCard = ({
  venue,
  isOwned = false,
  onEdit,
  onDelete,
  onBook,
  onClick,
  style = {}
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(venue);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(venue);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(venue.id);
    }
  };

  const handleBook = (e) => {
    e.stopPropagation();
    if (onBook) {
      onBook(venue);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    if (rating % 1 >= 0.5) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    return stars;
  };

  const getAvailabilityBadgeClass = () => {
    if (isOwned) {
      return venue.available ? 'available' : 'unavailable';
    }
    return venue.available ? 'available' : 'unavailable';
  };

  const getAvailabilityText = () => {
    if (isOwned) {
      return venue.available ? 'Available' : 'Booked';
    }
    return venue.available ? 'Available' : 'Booked';
  };

  return (
    <div 
      className={`venue-card ${isOwned ? 'owned' : 'available'}`}
      onClick={handleCardClick}
      style={style}
    >
      {/* Image Section */}
      <div className="venue-card-image-wrapper">
        <img
          src={venue.image}
          alt={venue.name}
          className="venue-card-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1519167758993-c8585aa81ead?w=500&h=300&fit=crop';
          }}
        />
        <div className="venue-card-image-overlay"></div>

        {/* Status Badge */}
        <span className={`venue-card-status-badge ${getAvailabilityBadgeClass()}`}>
          {getAvailabilityText()}
        </span>

        {/* Rate Badge */}
        <div className="venue-card-rate-badge">
          {venue.rate}
        </div>
      </div>

      {/* Content Section */}
      <div className="venue-card-content">
        {/* Header with Title and Rating */}
        <div className="venue-card-header">
          <div className="venue-card-title-section">
            <h4 className="venue-card-title">{venue.name}</h4>
            {venue.rating && (
              <div className="venue-card-rating">
                <div className="venue-rating-stars">{renderStars(venue.rating)}</div>
                <span className="venue-rating-value">{venue.rating}</span>
                <span className="venue-review-count">({venue.reviews})</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="venue-card-details">
          <div className="venue-detail-item">
            <span className="detail-icon">📍</span>
            <span className="detail-text">{venue.location}</span>
          </div>
          <div className="venue-detail-item">
            <span className="detail-icon">👥</span>
            <span className="detail-text">Up to {venue.capacity} guests</span>
          </div>
        </div>

        {/* Amenities */}
        {venue.amenities && venue.amenities.length > 0 && (
          <div className="venue-card-amenities">
            {venue.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="amenity-tag">
                {amenity}
              </span>
            ))}
            {venue.amenities.length > 3 && (
              <span className="amenity-tag more">
                +{venue.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="venue-card-actions">
          {isOwned ? (
            <>
              <button className="venue-action-btn edit-btn" onClick={handleEdit}>
                <span className="btn-icon">✎</span>
                Edit
              </button>
              <button className="venue-action-btn delete-btn" onClick={handleDelete}>
                <span className="btn-icon">🗑️</span>
                Delete
              </button>
            </>
          ) : (
            <button className="venue-action-btn book-btn" onClick={handleBook}>
              <span className="btn-icon">📅</span>
              Book Venue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
