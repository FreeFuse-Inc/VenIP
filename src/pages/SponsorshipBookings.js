import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SponsorshipBookings.css';

const SponsorshipBookings = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const activityData = {
    '2024-12-15': {
      type: 'event',
      title: 'Annual Gala 2024',
      level: 'Gold',
    },
    '2024-12-20': {
      type: 'renewal',
      title: 'Gold Sponsorship Renewal',
      level: 'Gold',
    },
    '2025-02-20': {
      type: 'event',
      title: 'Tech Conference 2025',
      level: 'Platinum',
    },
    '2025-02-25': {
      type: 'renewal',
      title: 'Platinum Sponsorship Renewal',
      level: 'Platinum',
    },
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getActivityForDate = (dateStr) => {
    return activityData[dateStr] || null;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(dateStr);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <main className="sponsorship-bookings-page">
      <div className="bookings-header">
        <button className="back-btn" onClick={() => navigate('/dashboard/sponsor')}>
          ← Back
        </button>
        <h1 className="page-title">Sponsorship Bookings</h1>
      </div>

      <div className="bookings-container">
        <div className="calendar-section">
          <div className="calendar-header">
            <button className="nav-btn prev-btn" onClick={handlePrevMonth}>
              ← Prev
            </button>
            <h2 className="month-year">{monthName}</h2>
            <button className="nav-btn next-btn" onClick={handleNextMonth}>
              Next →
            </button>
          </div>

          <div className="weekdays">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="empty-day"></div>;
              }

              const dateStr = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day);
              const activity = getActivityForDate(dateStr);
              const isSelected = selectedDate === dateStr;

              return (
                <div
                  key={day}
                  className={`calendar-day ${activity ? 'has-activity' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="day-number">{day}</div>
                  {activity && (
                    <div className={`activity-indicator ${activity.type}`}>
                      {activity.type === 'event' ? '🎯' : '🔄'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="legend">
            <div className="legend-item">
              <span className="legend-icon event">🎯</span>
              <span>Sponsored Event</span>
            </div>
            <div className="legend-item">
              <span className="legend-icon renewal">🔄</span>
              <span>Renewal Date</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          {selectedDate ? (
            <div className="selected-date-details">
              <h3 className="selected-date-title">
                {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              {getActivityForDate(selectedDate) ? (
                <div className="activity-details">
                  <div className="activity-icon">
                    {getActivityForDate(selectedDate).type === 'event' ? '🎯' : '🔄'}
                  </div>
                  <div className="activity-content">
                    <p className="activity-type">
                      {getActivityForDate(selectedDate).type === 'event' ? 'Sponsored Event' : 'Renewal'}
                    </p>
                    <h4 className="activity-title">{getActivityForDate(selectedDate).title}</h4>
                    <p className="activity-level">
                      <strong>Level:</strong> {getActivityForDate(selectedDate).level}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="no-activity">
                  <p>No sponsorship activity on this date</p>
                </div>
              )}
            </div>
          ) : (
            <div className="details-placeholder">
              <p>Select a date to view details</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SponsorshipBookings;
