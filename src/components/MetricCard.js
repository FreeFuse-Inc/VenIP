import React from 'react';
import '../styles/MetricCard.css';

const MetricCard = ({ label, value, subtitle }) => {
  return (
    <div className="metric-card">
      <p className="metric-label">{label}</p>
      <h3 className="metric-value">{value}</h3>
      {subtitle && <p className="metric-subtitle">{subtitle}</p>}
    </div>
  );
};

export default MetricCard;
