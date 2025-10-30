import React, { useState, useMemo } from 'react';
import '../styles/SponsorshipCalendar.css';

const SponsorshipCalendar = ({ sponsorshipData, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock sponsorship activity data
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
    onDateSelect(dateStr);
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
    <div className="sponsorship-calendar">
      <div className="calendar-header">
        <button className="nav-btn prev-btn" onClick={handlePrevMonth}>
          ← Prev
        </button>
        <h3 className="month-year">{monthName}</h3>
        <button className="nav-btn next-btn" onClick={handleNextMonth}>
          Next ���
        </button>
      </div>

      <div className="weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
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
              {activity && (
                <div className="activity-tooltip">
                  <div className="tooltip-title">{activity.title}</div>
                  <div className="tooltip-level">{activity.level}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="selected-date-info">
          <h4>Selected Date: {selectedDate}</h4>
          {getActivityForDate(selectedDate) ? (
            <div className="activity-details">
              <p className="activity-type">
                {getActivityForDate(selectedDate).type === 'event' ? '🎯 Event' : '🔄 Renewal'}
              </p>
              <p className="activity-title">{getActivityForDate(selectedDate).title}</p>
              <p className="activity-level">Level: {getActivityForDate(selectedDate).level}</p>
            </div>
          ) : (
            <p className="no-activity">No sponsorship activity on this date</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SponsorshipCalendar;
