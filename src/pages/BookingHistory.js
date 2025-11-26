import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import BackButton from '../components/BackButton';
import '../styles/BookingHistory.css';

const BookingHistory = () => {
  const { user } = useContext(UserContext);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const categories = ['All', 'Travel', 'Sponsorship', 'Vendor', 'Accommodation'];

  const mockTravelBookings = [
    {
      id: 'travel_1',
      category: 'Travel',
      name: 'Flight to New York',
      provider: 'Emirates',
      date: '2024-11-15',
      status: 'Completed',
      amount: '$245',
      bookingDate: '2024-10-20',
      details: {
        from: 'LAX',
        to: 'JFK',
        departure: '8:30 AM',
        arrival: '4:45 PM',
        duration: '5h 15m',
        airline: 'Emirates',
      },
    },
    {
      id: 'travel_2',
      category: 'Travel',
      name: 'Hotel - Downtown Apartment',
      provider: 'Airbnb',
      date: '2024-12-01',
      status: 'Completed',
      amount: '$468',
      bookingDate: '2024-11-10',
      details: {
        checkIn: '2024-12-01',
        checkOut: '2024-12-04',
        nights: 3,
        location: 'Downtown',
      },
    },
  ];

  const mockSponsorshipBookings = [
    {
      id: 'sponsor_1',
      category: 'Sponsorship',
      name: 'Annual Gala 2024',
      provider: 'VenIP Events',
      date: '2024-12-15',
      status: 'Completed',
      amount: '$5,000',
      bookingDate: '2024-11-01',
      details: {
        tier: 'Gold',
        attendees: 287,
        impressions: '45,230',
        roi: 'Estimated $28,500',
      },
    },
    {
      id: 'sponsor_2',
      category: 'Sponsorship',
      name: 'Tech Conference 2025',
      provider: 'VenIP Events',
      date: '2025-02-20',
      status: 'Confirmed',
      amount: '$10,000',
      bookingDate: '2024-12-15',
      details: {
        tier: 'Platinum',
        expectedAttendees: 512,
        benefits: 'Logo on website, social mentions, booth space',
      },
    },
  ];

  const mockVendorBookings = [
    {
      id: 'vendor_1',
      category: 'Vendor',
      name: 'Catering - Gala 2024',
      provider: 'Catering Pros',
      date: '2024-12-15',
      status: 'Completed',
      amount: '$3,200',
      bookingDate: '2024-11-20',
      details: {
        vendor: 'Catering Pros',
        contact: 'Sarah Johnson',
        guests: 250,
        menu: 'Premium 3-course',
      },
    },
  ];

  const mockAccommodationBookings = [
    {
      id: 'accom_1',
      category: 'Accommodation',
      name: 'Luxury Penthouse Suite',
      provider: 'Airbnb',
      date: '2024-11-20',
      status: 'Completed',
      amount: '$972',
      bookingDate: '2024-10-15',
      details: {
        bedrooms: 3,
        bathrooms: 3,
        beds: 4,
        nights: 3,
        amenities: ['WiFi', 'Gym', 'Pool', 'Concierge'],
      },
    },
  ];

  const allBookings = [
    ...mockTravelBookings,
    ...mockSponsorshipBookings,
    ...mockVendorBookings,
    ...mockAccommodationBookings,
  ];

  const getFilteredBookings = () => {
    let filtered = filterCategory === 'All' 
      ? allBookings 
      : allBookings.filter(b => b.category === filterCategory);

    // Sort
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'amount') {
      filtered.sort((a, b) => {
        const amountA = parseInt(a.amount.replace(/[$,]/g, ''));
        const amountB = parseInt(b.amount.replace(/[$,]/g, ''));
        return amountB - amountA;
      });
    }

    return filtered;
  };

  const getTotalSpent = () => {
    return getFilteredBookings().reduce((sum, booking) => {
      const amount = parseInt(booking.amount.replace(/[$,]/g, '')) || 0;
      return sum + amount;
    }, 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'completed';
      case 'Confirmed':
        return 'confirmed';
      case 'Pending':
        return 'pending';
      case 'Cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredBookings = getFilteredBookings();

  return (
    <main className="booking-history-page">
      <BackButton />
      
      <header className="history-header">
        <div>
          <h1 className="page-title">Booking History</h1>
          <p className="header-subtitle">View all your past and present bookings across all services</p>
        </div>
      </header>

      <div className="page-content">
        {filteredBookings.length > 0 && (
          <div className="summary-section">
            <div className="summary-card">
              <h3>Total Bookings</h3>
              <p className="summary-value">{filteredBookings.length}</p>
            </div>
            <div className="summary-card">
              <h3>Total Spent</h3>
              <p className="summary-value">${getTotalSpent().toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="controls-section">
          <div className="filter-group">
            <label className="control-label">Category</label>
            <div className="filter-buttons">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="sort-group">
            <label htmlFor="sortBy" className="control-label">Sort By</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">Most Recent</option>
              <option value="date">By Date</option>
              <option value="amount">By Amount</option>
            </select>
          </div>
        </div>

        {selectedBooking ? (
          <div className="booking-detail-view">
            <button
              className="back-to-list"
              onClick={() => setSelectedBooking(null)}
            >
              ← Back to List
            </button>

            <div className="detail-card">
              <div className="detail-header">
                <div>
                  <h2>{selectedBooking.name}</h2>
                  <p className="detail-provider">{selectedBooking.provider}</p>
                </div>
                <span className={`status-badge ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>

              <div className="detail-info">
                <div className="info-row">
                  <span className="info-label">Booking Date</span>
                  <span className="info-value">{formatDate(selectedBooking.bookingDate)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Event/Service Date</span>
                  <span className="info-value">{formatDate(selectedBooking.date)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Category</span>
                  <span className="info-value">{selectedBooking.category}</span>
                </div>
                <div className="info-row amount">
                  <span className="info-label">Amount</span>
                  <span className="info-value">{selectedBooking.amount}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Details</h3>
                <div className="details-grid">
                  {Object.entries(selectedBooking.details).map(([key, value]) => (
                    <div key={key} className="detail-item">
                      <span className="detail-key">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                      <span className="detail-value">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedBooking.status === 'Completed' && (
                <div className="action-section">
                  <button className="btn-rebook">Book Again</button>
                  <button className="btn-download">Download Receipt</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="booking-card"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="booking-card-header">
                    <div className="booking-card-title">
                      <h3>{booking.name}</h3>
                      <p className="booking-card-provider">{booking.provider}</p>
                    </div>
                    <span className={`status-badge ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="booking-card-info">
                    <div className="info-item">
                      <span className="icon">📅</span>
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">🏷️</span>
                      <span>{booking.category}</span>
                    </div>
                    <div className="info-item">
                      <span className="icon">💰</span>
                      <span className="amount">{booking.amount}</span>
                    </div>
                  </div>

                  <button className="view-details-link">View Details →</button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p className="empty-icon">📭</p>
                <h3>No bookings found</h3>
                <p>You don't have any bookings in this category yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default BookingHistory;
