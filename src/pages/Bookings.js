import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import FilterTabs from '../components/FilterTabs';
import '../styles/Bookings.css';

const Bookings = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Enhanced booking data with varied dates
  const [bookings, setBookings] = useState([
    {
      id: 1,
      eventName: 'Annual Gala 2024',
      venueName: 'Downtown Convention Center',
      date: '2026-01-14',
      time: '7:00 PM',
      attendees: 250,
      status: 'Confirmed',
      vendorName: 'BrightEvents',
      contactPerson: 'John Smith',
      phone: '(555) 123-4567',
      service: 'Catering',
    },
    {
      id: 2,
      eventName: 'Charity Fundraiser',
      venueName: 'Grand Hotel Ballroom',
      date: '2026-01-14',
      time: '6:30 PM',
      attendees: 180,
      status: 'Pending',
      vendorName: 'Catering Pros',
      contactPerson: 'Sarah Johnson',
      phone: '(555) 234-5678',
      service: 'Full Service',
    },
    {
      id: 3,
      eventName: 'Community Cleanup',
      venueName: 'Central Park Pavilion',
      date: '2026-01-20',
      time: '9:00 AM',
      attendees: 120,
      status: 'Confirmed',
      vendorName: 'Fresh Floral',
      contactPerson: 'Mike Davis',
      phone: '(555) 345-6789',
      service: 'Decorations',
    },
    {
      id: 4,
      eventName: 'Tech Summit 2026',
      venueName: 'Innovation Hub',
      date: '2026-01-22',
      time: '10:00 AM',
      attendees: 400,
      status: 'Confirmed',
      vendorName: 'AudioVisual Pro',
      contactPerson: 'Lisa Chen',
      phone: '(555) 456-7890',
      service: 'AV Equipment',
    },
    {
      id: 5,
      eventName: 'Wedding Reception',
      venueName: 'Sunset Gardens',
      date: '2026-01-25',
      time: '4:00 PM',
      attendees: 150,
      status: 'Pending',
      vendorName: 'Elegant Events',
      contactPerson: 'Emily White',
      phone: '(555) 567-8901',
      service: 'Photography',
    },
    {
      id: 6,
      eventName: 'Corporate Retreat',
      venueName: 'Mountain Lodge Resort',
      date: '2026-02-05',
      time: '8:00 AM',
      attendees: 75,
      status: 'Confirmed',
      vendorName: 'Adventure Tours',
      contactPerson: 'Tom Wilson',
      phone: '(555) 678-9012',
      service: 'Team Building',
    },
    {
      id: 7,
      eventName: 'Art Exhibition Opening',
      venueName: 'City Art Gallery',
      date: '2025-02-14',
      time: '6:00 PM',
      attendees: 200,
      status: 'Pending',
      vendorName: 'Gallery Services',
      contactPerson: 'Anna Martinez',
      phone: '(555) 789-0123',
      service: 'Event Setup',
    },
  ]);

  // Calendar utility functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatSelectedDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => b.date === dateStr);
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    
    // Empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null });
    }
    
    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const events = getEventsForDate(date);
      days.push({ 
        day, 
        date,
        events,
        hasEvents: events.length > 0,
        isToday: isToday(date),
        isSelected: isSameDay(date, selectedDate)
      });
    }
    
    return days;
  }, [currentMonth, selectedDate, bookings]);

  // Filter bookings for display
  const displayedBookings = useMemo(() => {
    let filtered = bookings;
    
    // Filter by selected date
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      filtered = bookings.filter(b => b.date === dateStr);
    }
    
    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(b => b.status.toLowerCase() === activeFilter);
    }
    
    // Sort by date
    return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [bookings, selectedDate, activeFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    pending: bookings.filter(b => b.status === 'Pending').length,
  }), [bookings]);

  const filterTabs = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'confirmed', label: 'Confirmed', count: stats.confirmed },
    { id: 'pending', label: 'Pending', count: stats.pending },
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Handle confirming a pending booking
  const handleConfirmBooking = (bookingId) => {
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: 'Confirmed' }
          : booking
      )
    );
  };

  return (
    <main className="bookings-page">
      <BackButton />
      
      {/* Hero Header */}
      <header className="bookings-hero">
        <div className="hero-decoration">
          <div className="decoration-circle decoration-1"></div>
          <div className="decoration-circle decoration-2"></div>
        </div>
        <div className="hero-content">
          <div className="hero-main">
            <h1 className="bookings-title">My Bookings</h1>
            <p className="bookings-subtitle">Manage your scheduled events and vendor appointments</p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="hero-stat confirmed">
              <span className="stat-number">{stats.confirmed}</span>
              <span className="stat-label">Confirmed</span>
            </div>
            <div className="hero-stat pending">
              <span className="stat-number">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
        </div>
      </header>

      {/* Split View Container */}
      <div className="bookings-split-view">
        {/* Left Panel - Calendar */}
        <div className="calendar-panel">
          <div className="calendar-card">
            {/* Month Navigation */}
            <div className="calendar-header">
              <button className="month-nav-btn" onClick={previousMonth}>
                <span>‹</span>
              </button>
              <h2 className="month-title">{formatMonthYear(currentMonth)}</h2>
              <button className="month-nav-btn" onClick={nextMonth}>
                <span>›</span>
              </button>
            </div>

            {/* Today Button */}
            <button className="today-btn" onClick={goToToday}>
              Today
            </button>

            {/* Week Day Headers */}
            <div className="calendar-weekdays">
              {weekDays.map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
              {calendarDays.map((dayData, index) => (
                <div
                  key={index}
                  className={`calendar-day ${!dayData.day ? 'empty' : ''} ${dayData.isToday ? 'today' : ''} ${dayData.isSelected ? 'selected' : ''} ${dayData.hasEvents ? 'has-events' : ''}`}
                  onClick={() => dayData.date && setSelectedDate(dayData.date)}
                >
                  {dayData.day && (
                    <>
                      <span className="day-number">{dayData.day}</span>
                      {dayData.hasEvents && (
                        <div className="event-indicators">
                          {dayData.events.slice(0, 3).map((event, i) => (
                            <span 
                              key={i} 
                              className={`event-dot ${event.status.toLowerCase()}`}
                              title={event.eventName}
                            ></span>
                          ))}
                          {dayData.events.length > 3 && (
                            <span className="more-events">+{dayData.events.length - 3}</span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="calendar-stats">
              <div className="calendar-stat-item">
                <span className="calendar-stat-icon">📅</span>
                <div className="calendar-stat-info">
                  <span className="calendar-stat-value">{stats.total}</span>
                  <span className="calendar-stat-label">Total Events</span>
                </div>
              </div>
              <div className="calendar-stat-item">
                <span className="calendar-stat-icon">✅</span>
                <div className="calendar-stat-info">
                  <span className="calendar-stat-value">{stats.confirmed}</span>
                  <span className="calendar-stat-label">Confirmed</span>
                </div>
              </div>
              <div className="calendar-stat-item">
                <span className="calendar-stat-icon">⏳</span>
                <div className="calendar-stat-info">
                  <span className="calendar-stat-value">{stats.pending}</span>
                  <span className="calendar-stat-label">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Details */}
        <div className="details-panel">
          <div className="details-card">
            {/* Details Header */}
            <div className="details-header">
              <div className="details-title-section">
                {selectedDate ? (
                  <>
                    <h2 className="details-title">{formatSelectedDate(selectedDate)}</h2>
                    <p className="details-subtitle">
                      {displayedBookings.length} {displayedBookings.length === 1 ? 'event' : 'events'} scheduled
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="details-title">All Upcoming Events</h2>
                    <p className="details-subtitle">
                      Showing {displayedBookings.length} {displayedBookings.length === 1 ? 'booking' : 'bookings'}
                    </p>
                  </>
                )}
              </div>
              {selectedDate && (
                <button className="clear-selection-btn" onClick={() => setSelectedDate(null)}>
                  View All
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="details-filters">
              <FilterTabs
                tabs={filterTabs}
                activeTab={activeFilter}
                onChange={setActiveFilter}
                size="compact"
              />
            </div>

            {/* Bookings List */}
            <div className="bookings-list">
              {displayedBookings.length > 0 ? (
                displayedBookings.map((booking, index) => (
                  <div 
                    key={booking.id} 
                    className="booking-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="booking-card-header">
                      <div className="booking-info">
                        <h3 className="booking-event-name">{booking.eventName}</h3>
                        <p className="booking-venue">
                          <span className="venue-icon">📍</span>
                          {booking.venueName}
                        </p>
                      </div>
                      <span
                        className={`status-badge ${booking.status.toLowerCase()} ${booking.status === 'Pending' ? 'clickable' : ''}`}
                        onClick={() => booking.status === 'Pending' && handleConfirmBooking(booking.id)}
                        title={booking.status === 'Pending' ? 'Click to confirm this booking' : ''}
                      >
                        {booking.status === 'Pending' ? '✓ Tap to Confirm' : booking.status}
                      </span>
                    </div>

                    <div className="booking-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span>{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">🕐</span>
                        <span>{booking.time}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">👥</span>
                        <span>{booking.attendees} guests</span>
                      </div>
                      <div className="meta-item highlight">
                        <span className="meta-icon">🎯</span>
                        <span>{booking.service}</span>
                      </div>
                    </div>

                    <div className="booking-vendor">
                      <div className="vendor-info">
                        <span className="vendor-label">Vendor:</span>
                        <span className="vendor-name">{booking.vendorName}</span>
                      </div>
                      <div className="vendor-contact">
                        <span className="contact-person">{booking.contactPerson}</span>
                        <span className="contact-phone">{booking.phone}</span>
                      </div>
                    </div>

                    <div className="booking-actions">
                      <button className="btn-view-details" onClick={() => navigate(`/event-details/${booking.id}`)}>
                        View Details
                        <span className="btn-arrow">→</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h3>No bookings found</h3>
                  <p>
                    {selectedDate 
                      ? 'No events scheduled for this date'
                      : 'You don\'t have any bookings yet'
                    }
                  </p>
                  {selectedDate && (
                    <button className="btn-view-all" onClick={() => setSelectedDate(null)}>
                      View All Bookings
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Bookings;
