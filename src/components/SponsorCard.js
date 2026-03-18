import React from 'react';
import '../styles/SponsorCard.css';

const SponsorCard = ({
  sponsor,
  onClick,
  style = {},
  showConnectButton = false,
  onConnect
}) => {
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
    if (statusLower === 'inactive') {
      return { bg: 'var(--status-draft-bg)', color: 'var(--status-draft)' };
    }
    return { bg: 'var(--status-draft-bg)', color: 'var(--status-draft)' };
  };

  const tierColor = getTierColor(sponsor.tier || sponsor.sponsorshipLevel);
  const statusStyle = getStatusStyle(sponsor.status);

  const handleClick = () => {
    if (onClick) {
      onClick(sponsor);
    }
  };

  const handleConnect = (e) => {
    e.stopPropagation();
    if (onConnect) {
      onConnect(sponsor);
    }
  };

  // Extract sponsor name - could be from companyName, name, or sponsorshipLevel
  const sponsorName = sponsor.companyName || sponsor.name || sponsor.sponsorshipLevel;
  const partnerships = sponsor.partnerships || sponsor.eventCount || 1;
  const amount = sponsor.amount || sponsor.investment || sponsor.price;

  return (
    <div className="sponsor-card" onClick={handleClick} style={style}>
      <div className="sponsor-card-header">
        <div
          className="sponsor-tier-icon"
          style={{
            backgroundColor: `${tierColor}20`,
            borderColor: `${tierColor}40`
          }}
        >
          <span style={{ color: tierColor }}>
            {getTierIcon(sponsor.tier || sponsor.sponsorshipLevel)}
          </span>
        </div>

        <div className="sponsor-card-title-section">
          <h4 className="sponsor-card-name">{sponsorName}</h4>
          <div className="sponsor-card-meta">
            <span className="sponsor-tier-badge" style={{ color: tierColor }}>
              {sponsor.tier || sponsor.sponsorshipLevel}
            </span>
            <span
              className="sponsor-card-status"
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.color
              }}
            >
              {sponsor.status}
            </span>
          </div>
        </div>
      </div>

      <div className="sponsor-card-content">
        <div className="sponsor-card-stat">
          <span className="stat-label">Investment:</span>
          <span className="stat-value" style={{ color: tierColor }}>
            {amount}
          </span>
        </div>
        <div className="sponsor-card-stat">
          <span className="stat-label">Partnerships:</span>
          <span className="stat-value">{partnerships}</span>
        </div>
      </div>

      {showConnectButton && (
        <button className="sponsor-connect-btn" onClick={handleConnect}>
          <span className="btn-icon">🤝</span>
          <span>Connect</span>
        </button>
      )}
    </div>
  );
};

export default SponsorCard;
