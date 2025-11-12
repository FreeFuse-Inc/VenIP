import React from 'react';
import '../styles/MetricCard.css';

const MetricCard = ({ label, value, subtitle, icon }) => {
  return (
    <div className="metric-card">
      {icon && <div className="metric-icon">{icon}</div>}
      <p className="metric-label">{label}</p>
      <h3 className="metric-value">{value}</h3>
      {subtitle && <p className="metric-subtitle">{subtitle}</p>}
    </div>
  );
};

export default MetricCard;
