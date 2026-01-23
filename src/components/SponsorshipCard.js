import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SponsorshipCard.css';

const SponsorshipCard = ({ 
  sponsorship,
  onClick,
  showViewButton = true
}) => {
  const navigate = useNavigate();

  const getTierIcon = (tier) => {
    const icons = {
      bronze: '🥉',
      silver: '🥈',
      gold: '👑',
      platinum: '💎',
    };
    return icons[tier?.toLowerCase()] || '⭐';
  };

  const getTierColor = (tier) => {
    const colors = {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#D4AF37',
      platinum: '#8B5CF6',
    };
    return colors[tier?.toLowerCase()] || '#D4AF37';
  };

  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower === 'active') {
      return { bg: 'var(--status-active-bg)', color: 'var(--status-active)' };
    }
    if (statusLower === 'pending') {
      return { bg: 'var(--status-pending-bg)', color: 'var(--status-pending)' };
    }
    if (statusLower === 'completed') {
      return { bg: 'var(--status-completed-bg)', color: 'var(--status-completed)' };
    }
    return { bg: 'var(--status-draft-bg)', color: 'var(--status-draft)' };
  };

  const tierColor = getTierColor(sponsorship.tier || sponsorship.sponsorshipLevel);
  const statusStyle = getStatusStyle(sponsorship.status);

  const handleClick = () => {
    if (onClick) {
      onClick(sponsorship);
    }
  };

  const handleViewEvent = (e) => {
    e.stopPropagation();
    if (sponsorship.eventId || sponsorship.id) {
      navigate(`/sponsorship-analytics/${sponsorship.eventId || sponsorship.id}`);
    }
  };

  return (
    <div className="sponsorship-card" onClick={handleClick}>
      <div className="sponsorship-header">
        <div 
          className="sponsorship-tier-icon"
          style={{ 
            backgroundColor: `${tierColor}20`,
            borderColor: `${tierColor}40`
          }}
        >
          <span style={{ color: tierColor }}>{getTierIcon(sponsorship.tier || sponsorship.sponsorshipLevel)}</span>
        </div>
        <div className="sponsorship-tier-info">
          <h4 className="sponsorship-tier-name">{sponsorship.tier || sponsorship.sponsorshipLevel}</h4>
          <p className="sponsorship-amount" style={{ color: tierColor }}>
            {sponsorship.amount || sponsorship.price}
          </p>
        </div>
        <span 
          className="sponsorship-status"
          style={{ 
            backgroundColor: statusStyle.bg,
            color: statusStyle.color
          }}
        >
          {sponsorship.status}
        </span>
      </div>

      {sponsorship.benefits && sponsorship.benefits.length > 0 && (
        <div className="sponsorship-benefits">
          <p className="benefits-label">Benefits:</p>
          <ul className="benefits-list">
            {sponsorship.benefits.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="benefit-item">
                <span className="benefit-check">✓</span>
                <span className="benefit-text">{benefit}</span>
              </li>
            ))}
            {sponsorship.benefits.length > 3 && (
              <li className="benefit-more">+{sponsorship.benefits.length - 3} more benefits</li>
            )}
          </ul>
        </div>
      )}

      {showViewButton && (
        <button className="view-event-btn" onClick={handleViewEvent}>
          <span className="btn-icon">📅</span>
          <span>View Event</span>
        </button>
      )}
    </div>
  );
};

export default SponsorshipCard;
