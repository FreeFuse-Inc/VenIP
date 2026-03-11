import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QuickAccessGrid.css';

const QuickAccessGrid = ({ items }) => {
  const navigate = useNavigate();

  const defaultItems = [
    { id: 'events', label: 'Events', icon: '📅', path: '/events-feed', color: '#D4AF37' },
    { id: 'sponsorships', label: 'Sponsorships', icon: '💛', path: '/sponsorship-bookings', color: '#FF6B6B' },
    { id: 'packages', label: 'Packages', icon: '⭐', path: '/sponsorship-analytics', color: '#8B5CF6' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings', color: '#6b7280' },
  ];

  const gridItems = items || defaultItems;

  return (
    <div className="quick-access-section">
      <h3 className="quick-access-title">Quick Access</h3>
      <div className="quick-access-grid">
        {gridItems.map((item) => (
          <button
            key={item.id}
            className="quick-access-item"
            onClick={() => navigate(item.path)}
          >
            <div 
              className="quick-access-icon"
              style={{ 
                backgroundColor: `${item.color}15`,
                borderColor: `${item.color}30`
              }}
            >
              <span style={{ color: item.color }}>{item.icon}</span>
            </div>
            <span className="quick-access-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessGrid;
