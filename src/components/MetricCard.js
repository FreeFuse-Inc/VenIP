import React from 'react';
import '../styles/MetricCard.css';

const MetricCard = ({ 
  label, 
  value, 
  subtitle, 
  icon, 
  iconBg = 'gold',
  size = 'default',
  trend,
  trendValue 
}) => {
  const getIconBgColor = () => {
    const colors = {
      gold: 'var(--icon-bg-gold)',
      purple: 'var(--icon-bg-purple)',
      green: 'var(--icon-bg-green)',
      red: 'var(--icon-bg-red)',
      blue: 'var(--icon-bg-blue)',
    };
    return colors[iconBg] || colors.gold;
  };

  const getIconColor = () => {
    const colors = {
      gold: 'var(--accent-gold)',
      purple: 'var(--accent-purple)',
      green: 'var(--accent-green)',
      red: 'var(--accent-red)',
      blue: 'var(--accent-blue)',
    };
    return colors[iconBg] || colors.gold;
  };

  return (
    <div className={`metric-card ${size === 'compact' ? 'metric-card-compact' : ''}`}>
      {icon && (
        <div 
          className="metric-icon-wrapper"
          style={{ 
            backgroundColor: getIconBgColor(),
            color: getIconColor()
          }}
        >
          <span className="metric-icon">{icon}</span>
        </div>
      )}
      <div className="metric-content">
        <h3 className="metric-value">{value}</h3>
        <p className="metric-label">{label}</p>
        {subtitle && <p className="metric-subtitle">{subtitle}</p>}
        {trend && (
          <div className={`metric-trend ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
            <span className="trend-icon">{trend === 'up' ? '↑' : '↓'}</span>
            <span className="trend-value">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
