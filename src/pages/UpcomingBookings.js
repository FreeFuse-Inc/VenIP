import React, { useContext, useState, useMemo } from 'react';
import { UserContext } from '../context/UserContext';
import BackButton from '../components/BackButton';
import '../styles/UpcomingBookings.css';

const UpcomingBookings = () => {
  const { user, updateBookingInHistory, deleteBookingFromHistory, deleteBookingFromCart } = useContext(UserContext);
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '',
  });

  const upcomingBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allBookings = [];

    const cart = user?.cart || [];
    allBookings.push(...cart);

    const bookingHistory = user?.bookingHistory || [];
    allBookings.push(...bookingHistory.map((booking) => ({
      ...booking,
      checkIn: booking.details?.checkIn || booking.checkIn || booking.date,
      checkOut: booking.details?.checkOut || booking.checkOut,
      departure: booking.details?.departure || booking.departure || booking.date,
      location: booking.details?.location || booking.location || booking.provider,
      guests: booking.details?.guests || booking.guests,
      bedrooms: booking.details?.bedrooms || booking.bedrooms,
      bathrooms: booking.details?.bathrooms || booking.bathrooms,
      amenities: booking.details?.amenities || booking.amenities,
    })));

    return allBookings.filter((item) => {
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
  }, [user, sortBy]);

  const filteredBookings = useMemo(() => {
    if (filterType === 'all') return upcomingBookings;
    return upcomingBookings.filter((item) => {
      const itemType = item.type || item.category;
      return itemType === filterType;
    });
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
    const typeValue = type?.toLowerCase() || '';
    switch (typeValue) {
      case 'hotels':
      case 'homes':
      case 'longstays':
      case 'hotel':
      case 'home & apartment':
      case 'long stay':
      case 'accommodation':
        return '🏨';
      case 'flights':
      case 'flight':
        return '✈️';
      case 'activities':
      case 'activity':
        return '🎭';
      case 'transfers':
      case 'airport transfer':
        return '🚗';
      default:
        return '📅';
    }
  };

  const getBookingTypeLabel = (type) => {
    const typeValue = type?.toLowerCase() || 'accommodation';
    switch (typeValue) {
      case 'hotels':
      case 'hotel':
        return 'Hotel';
      case 'homes':
      case 'home & apartment':
        return 'Home & Apartment';
      case 'longstays':
      case 'long stay':
        return 'Long Stay';
      case 'flights':
      case 'flight':
        return 'Flight';
      case 'activities':
      case 'activity':
        return 'Activity';
      case 'transfers':
      case 'airport transfer':
        return 'Airport Transfer';
      case 'accommodation':
        return 'Accommodation';
      default:
        return typeValue || 'Booking';
    }
  };

  const formatDate = (dateString) => {
    const date = parseLocalDate(dateString);
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

  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return new Date(year, parseInt(month) - 1, parseInt(day));
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = parseLocalDate(dateString);
    bookingDate.setHours(0, 0, 0, 0);
    const diffTime = bookingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return `In ${Math.floor(diffDays / 7)} weeks`;
  };

  const getDaysUntilCheckIn = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = parseLocalDate(dateString);
    bookingDate.setHours(0, 0, 0, 0);
    const diffTime = bookingDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const openEditModal = (booking) => {
    const checkIn = booking.checkIn || booking.details?.checkIn;
    const checkOut = booking.checkOut || booking.details?.checkOut;
    const guests = booking.guests || booking.details?.guests;

    setEditFormData({
      checkIn: checkIn || '',
      checkOut: checkOut || '',
      guests: guests || '',
    });
    setEditingBookingId(booking.id);
  };

  const closeEditModal = () => {
    setEditingBookingId(null);
    setEditFormData({
      checkIn: '',
      checkOut: '',
      guests: '',
    });
  };

  const handleEditSubmit = () => {
    const { checkIn, checkOut, guests } = editFormData;

    if (!checkIn || !checkOut || !guests) {
      alert('Please fill in all fields');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      alert('Check-out date must be after check-in date');
      return;
    }

    const booking = filteredBookings.find((b) => b.id === editingBookingId);
    if (!booking) return;

    if (booking.details) {
      updateBookingInHistory(editingBookingId, {
        details: {
          ...booking.details,
          checkIn,
          checkOut,
          guests,
        },
      });
    } else {
      updateBookingInHistory(editingBookingId, {
        checkIn,
        checkOut,
        guests,
      });
    }

    closeEditModal();
    alert('Booking updated successfully!');

    window.location.reload();
  };

  const handleCancelBooking = (booking) => {
    const bookingDate = booking.checkIn || booking.details?.checkIn || booking.departure;
    const daysUntil = getDaysUntilCheckIn(bookingDate);

    if (daysUntil < 7) {
      alert('Bookings can only be canceled 7 days or more in advance.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel "${booking.name}"? This action cannot be undone.`
    );

    if (confirmed) {
      if (booking.details) {
        deleteBookingFromHistory(booking.id);
      } else {
        deleteBookingFromCart(booking.id);
      }
      alert('Booking canceled successfully!');
    }
  };

  const renderAccommodationDetails = (booking) => {
    return (
      <div className="accommodation-details">
        <div className="detail-row">
          <span className="detail-label">📍 Location:</span>
          <span className="detail-value">{booking.location || 'N/A'}</span>
        </div>
        {booking.checkIn && (
          <div className="detail-row">
            <span className="detail-label">📅 Check-in:</span>
            <span className="detail-value">{formatDate(booking.checkIn)}</span>
          </div>
        )}
        {booking.checkOut && (
          <div className="detail-row">
            <span className="detail-label">📅 Check-out:</span>
            <span className="detail-value">{formatDate(booking.checkOut)}</span>
          </div>
        )}
        <div className="detail-row">
          <span className="detail-label">🛏️ Bedrooms:</span>
          <span className="detail-value">{booking.bedrooms || 'N/A'}</span>
        </div>
        {booking.guests && (
          <div className="detail-row">
            <span className="detail-label">👥 Guests:</span>
            <span className="detail-value">{booking.guests}</span>
          </div>
        )}
        {booking.rating && (
          <div className="detail-row">
            <span className="detail-label">⭐ Rating:</span>
            <span className="detail-value">{booking.rating}/5 ({booking.reviews} reviews)</span>
          </div>
        )}
      </div>
    );
  };

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
    const bookingType = booking.type || booking.category;
    const typeValue = bookingType?.toLowerCase() || '';

    if (typeValue.includes('accommodation') || typeValue === 'hotels' || typeValue === 'homes' || typeValue === 'longstays') {
      return renderAccommodationDetails(booking);
    } else if (typeValue.includes('flight')) {
      return renderFlightDetails(booking);
    } else if (typeValue.includes('activity')) {
      return renderActivityDetails(booking);
    } else if (typeValue.includes('transfer')) {
      return renderTransferDetails(booking);
    }
    return renderAccommodationDetails(booking);
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
              const daysUntilNumber = getDaysUntilCheckIn(bookingDate);
              const canEdit = daysUntilNumber > 3;
              const canCancel = daysUntilNumber >= 7;

              return (
                <div key={index} className="booking-card">
                  <div className="booking-card-header">
                    <div className="booking-title-section">
                      <span className="booking-icon">{getBookingIcon(booking.type || booking.category)}</span>
                      <div className="booking-title-info">
                        <h3 className="booking-name">{booking.name}</h3>
                        <span className="booking-type">{getBookingTypeLabel(booking.type || booking.category)}</span>
                      </div>
                    </div>
                    <div className="booking-meta">
                      <div className="days-until">{daysUntil}</div>
                      <div className="booking-price">{booking.totalPrice || booking.amount}</div>
                    </div>
                  </div>

                  <div className="booking-card-body">
                    {renderBookingDetails(booking)}
                  </div>

                  <div className="booking-card-footer">
                    <button
                      className={`edit-btn ${!canEdit ? 'disabled' : ''}`}
                      onClick={() => canEdit && openEditModal(booking)}
                      disabled={!canEdit}
                      title={!canEdit ? 'Cannot edit bookings within 3 days of check-in' : 'Edit booking'}
                    >
                      Edit
                    </button>
                    <button
                      className={`cancel-btn ${!canCancel ? 'disabled' : ''}`}
                      onClick={() => canCancel && handleCancelBooking(booking)}
                      disabled={!canCancel}
                      title={!canCancel ? 'Can only cancel bookings 7 days or more in advance' : 'Cancel booking'}
                    >
                      Cancel
                    </button>
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

      {editingBookingId && (
        <div className="edit-modal-overlay" onClick={closeEditModal}>
          <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>Edit Booking</h2>
              <button className="close-modal-btn" onClick={closeEditModal}>
                ✕
              </button>
            </div>

            <form className="edit-booking-form" onSubmit={(e) => {
              e.preventDefault();
              handleEditSubmit();
            }}>
              <div className="form-group">
                <label htmlFor="edit-check-in">Check-in Date *</label>
                <input
                  type="date"
                  id="edit-check-in"
                  value={editFormData.checkIn}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      checkIn: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-check-out">Check-out Date *</label>
                <input
                  type="date"
                  id="edit-check-out"
                  value={editFormData.checkOut}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      checkOut: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-guests">Guests *</label>
                <input
                  type="text"
                  id="edit-guests"
                  value={editFormData.guests}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      guests: e.target.value,
                    }))
                  }
                  placeholder="e.g., 2 adults, 1 child"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-form-btn" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default UpcomingBookings;
