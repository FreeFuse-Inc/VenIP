import React, { useContext, useState, useMemo } from 'react';
import { UserContext } from '../context/UserContext';
import BackButton from '../components/BackButton';
import '../styles/UpcomingBookings.css';

const UpcomingBookings = () => {
  const { cart } = useContext(UserContext);
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');

  const upcomingBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return cart.filter((item) => {
      if (!item.checkIn && !item.departure) return false;

      let itemDate = null;
      if (item.checkIn) {
        itemDate = new Date(item.checkIn);
      } else if (item.departure) {
        itemDate = new Date(item.departure);
      }

      return itemDate && itemDate >= today;
    }).sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.checkIn ? new Date(a.checkIn) : new Date(a.departure);
        const dateB = b.checkIn ? new Date(b.checkIn) : new Date(b.departure);
        return dateA - dateB;
      } else if (sortBy === 'price') {
        const priceA = parseFloat(a.totalPrice?.replace(/[$,]/g, '') || 0);
        const priceB = parseFloat(b.totalPrice?.replace(/[$,]/g, '') || 0);
        return priceB - priceA;
      }
      return 0;
    });
  }, [cart, sortBy]);

  const filteredBookings = useMemo(() => {
    if (filterType === 'all') return upcomingBookings;
    return upcomingBookings.filter((item) => item.type === filterType);
  }, [upcomingBookings, filterType]);

  const bookingTypes = [
    { value: 'all', label: 'All Bookings' },
    { value: 'hotels', label: 'Hotels' },
    { value: 'homes', label: 'Homes & Apartments' },
    { value: 'longstays', label: 'Long Stays' },
    { value: 'flights', label: 'Flights' },
    { value: 'activities', label: 'Activities' },
    { value: 'transfers', label: 'Airport Transfers' },
  ];

  const getBookingIcon = (type) => {
    switch (type) {
      case 'hotels':
      case 'homes':
      case 'longstays':
        return '🏨';
      case 'flights':
        return '✈️';
      case 'activities':
        return '🎭';
      case 'transfers':
        return '🚗';
      default:
        return '📅';
    }
  };

  const getBookingTypeLabel = (type) => {
    switch (type) {
      case 'hotels':
        return 'Hotel';
      case 'homes':
        return 'Home & Apartment';
      case 'longstays':
        return 'Long Stay';
      case 'flights':
        return 'Flight';
      case 'activities':
        return 'Activity';
      case 'transfers':
        return 'Airport Transfer';
      default:
        return 'Booking';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(dateString);
    bookingDate.setHours(0, 0, 0, 0);
    const diffTime = bookingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return `In ${Math.floor(diffDays / 7)} weeks`;
  };

  const renderAccommodationDetails = (booking) => (
    <div className="accommodation-details">
      <div className="detail-row">
        <span className="detail-label">📍 Location:</span>
        <span className="detail-value">{booking.location}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">📅 Check-in:</span>
        <span className="detail-value">{formatDate(booking.checkIn)}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">📅 Check-out:</span>
        <span className="detail-value">{formatDate(booking.checkOut)}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">🛏️ Bedrooms:</span>
        <span className="detail-value">{booking.bedrooms || 'N/A'}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">👥 Guests:</span>
        <span className="detail-value">{booking.guests}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">⭐ Rating:</span>
        <span className="detail-value">{booking.rating}/5 ({booking.reviews} reviews)</span>
      </div>
    </div>
  );

  const renderFlightDetails = (booking) => (
    <div className="flight-details-section">
      <div className="detail-row">
        <span className="detail-label">✈️ Airline:</span>
        <span className="detail-value">{booking.airline}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">📍 Route:</span>
        <span className="detail-value">{booking.from} → {booking.to}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">🕐 Departure:</span>
        <span className="detail-value">{formatTime(booking.departure)}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">🕐 Arrival:</span>
        <span className="detail-value">{formatTime(booking.arrival)}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">⏱️ Duration:</span>
        <span className="detail-value">{booking.duration}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">🛑 Stops:</span>
        <span className="detail-value">{booking.stops}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">💺 Seats:</span>
        <span className="detail-value">{booking.seats}</span>
      </div>
    </div>
  );

  const renderActivityDetails = (booking) => (
    <div className="activity-details-section">
      <div className="detail-row">
        <span className="detail-label">🏢 Provider:</span>
        <span className="detail-value">{booking.provider}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">⏱️ Duration:</span>
        <span className="detail-value">{booking.duration}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">👥 Group Size:</span>
        <span className="detail-value">{booking.groupSize}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">📋 Includes:</span>
        <div className="includes-list">
          {booking.included && booking.included.map((item, idx) => (
            <span key={idx} className="include-item">✓ {item}</span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransferDetails = (booking) => (
    <div className="transfer-details-section">
      <div className="detail-row">
        <span className="detail-label">🚗 Service:</span>
        <span className="detail-value">{booking.service}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">🚙 Vehicle:</span>
        <span className="detail-value">{booking.vehicle}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">📍 Pickup:</span>
        <span className="detail-value">{booking.pickup}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">📍 Destination:</span>
        <span className="detail-value">{booking.destination}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">⏱️ Estimated Time:</span>
        <span className="detail-value">{booking.estimatedTime}</span>
      </div>
      <div className="detail-row">
        <span className="detail-label">👥 Capacity:</span>
        <span className="detail-value">{booking.capacity}</span>
      </div>
    </div>
  );

  const renderBookingDetails = (booking) => {
    switch (booking.type) {
      case 'hotels':
      case 'homes':
      case 'longstays':
        return renderAccommodationDetails(booking);
      case 'flights':
        return renderFlightDetails(booking);
      case 'activities':
        return renderActivityDetails(booking);
      case 'transfers':
        return renderTransferDetails(booking);
      default:
        return null;
    }
  };

  return (
    <main className="upcoming-bookings-page">
      <BackButton />
      <div className="bookings-header">
        <h1 className="page-title">Upcoming Bookings</h1>
        <p className="bookings-count">
          {filteredBookings.length} upcoming booking{filteredBookings.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="bookings-controls">
        <div className="filter-group">
          <label htmlFor="filter-type">Filter by Type:</label>
          <select
            id="filter-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            {bookingTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-group">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Date (Earliest First)</option>
            <option value="price">Price (Highest First)</option>
          </select>
        </div>
      </div>

      <div className="bookings-container">
        {filteredBookings.length > 0 ? (
          <div className="bookings-list">
            {filteredBookings.map((booking, index) => {
              const bookingDate = booking.checkIn || booking.departure;
              const daysUntil = getDaysUntil(bookingDate);

              return (
                <div key={index} className="booking-card">
                  <div className="booking-card-header">
                    <div className="booking-title-section">
                      <span className="booking-icon">{getBookingIcon(booking.type)}</span>
                      <div className="booking-title-info">
                        <h3 className="booking-name">{booking.name}</h3>
                        <span className="booking-type">{getBookingTypeLabel(booking.type)}</span>
                      </div>
                    </div>
                    <div className="booking-meta">
                      <div className="days-until">{daysUntil}</div>
                      <div className="booking-price">{booking.totalPrice}</div>
                    </div>
                  </div>

                  <div className="booking-card-body">
                    {renderBookingDetails(booking)}
                  </div>

                  <div className="booking-card-footer">
                    <button className="edit-btn">Edit</button>
                    <button className="cancel-btn">Cancel</button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <p className="empty-state-icon">📭</p>
              <h3>No upcoming bookings</h3>
              <p>You don't have any upcoming travel bookings yet.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default UpcomingBookings;
