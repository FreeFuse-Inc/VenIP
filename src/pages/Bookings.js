import React, { useState } from 'react';
import '../styles/Bookings.css';

const Bookings = () => {
  const [bookings] = useState([
    {
      id: 1,
      eventName: 'Annual Gala 2024',
      venueName: 'Downtown Convention Center',
      date: '2024-12-15',
      time: '7:00 PM',
      attendees: 250,
      status: 'Confirmed',
      vendorName: 'BrightEvents',
      contactPerson: 'John Smith',
      phone: '(555) 123-4567',
    },
    {
      id: 2,
      eventName: 'Charity Fundraiser',
      venueName: 'Grand Hotel Ballroom',
      date: '2025-01-10',
      time: '6:30 PM',
      attendees: 180,
      status: 'Pending',
      vendorName: 'Catering Pros',
      contactPerson: 'Sarah Johnson',
      phone: '(555) 234-5678',
    },
    {
      id: 3,
      eventName: 'Community Cleanup',
      venueName: 'Central Park Pavilion',
      date: '2025-01-20',
      time: '9:00 AM',
      attendees: 120,
      status: 'Confirmed',
      vendorName: 'Fresh Floral',
      contactPerson: 'Mike Davis',
      phone: '(555) 345-6789',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const statuses = ['All', 'Confirmed', 'Pending', 'Cancelled'];

  const filteredBookings =
    filterStatus === 'All' ? bookings : bookings.filter((b) => b.status === filterStatus);

  return (
    <main className="bookings-page">
      <header className="page-header">
        <h1 className="page-title">Bookings</h1>
      </header>

      <div className="page-content">
        <div className="filter-section">
          <div className="filter-buttons">
            {statuses.map((status) => (
              <button
                key={status}
                className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {selectedBooking ? (
          <div className="booking-detail-card">
            <div className="detail-container">
              <div className="detail-header">
                <h2>{selectedBooking.eventName}</h2>
                <span className={`status-badge ${selectedBooking.status.toLowerCase()}`}>
                  {selectedBooking.status}
                </span>
              </div>

              <div className="detail-grid">
                <div className="detail-section">
                  <h3>Event Information</h3>
                  <p>
                    <span className="label">Event:</span> {selectedBooking.eventName}
                  </p>
                  <p>
                    <span className="label">Date:</span> {new Date(selectedBooking.date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="label">Time:</span> {selectedBooking.time}
                  </p>
                  <p>
                    <span className="label">Expected Attendees:</span> {selectedBooking.attendees}
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Venue Information</h3>
                  <p>
                    <span className="label">Venue:</span> {selectedBooking.venueName}
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Vendor Information</h3>
                  <p>
                    <span className="label">Vendor:</span> {selectedBooking.vendorName}
                  </p>
                  <p>
                    <span className="label">Contact Person:</span> {selectedBooking.contactPerson}
                  </p>
                  <p>
                    <span className="label">Phone:</span> {selectedBooking.phone}
                  </p>
                </div>
              </div>

              {selectedBooking.status === 'Pending' && (
                <div className="action-buttons">
                  <button className="btn-approve">Confirm Booking</button>
                  <button className="btn-reject">Cancel Booking</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div>
                    <h3 className="booking-event">{booking.eventName}</h3>
                    <p className="booking-venue">{booking.venueName}</p>
                  </div>
                  <span className={`status-badge ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div className="detail">
                    <span className="icon">📅</span>
                    <span>{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                  </div>
                  <div className="detail">
                    <span className="icon">👥</span>
                    <span>{booking.attendees} attendees</span>
                  </div>
                  <div className="detail">
                    <span className="icon">👤</span>
                    <span>{booking.contactPerson}</span>
                  </div>
                </div>

                <button className="view-details-btn" onClick={() => setSelectedBooking(booking)}>
                  View Details →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Bookings;
