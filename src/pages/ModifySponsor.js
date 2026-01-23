import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import '../styles/ModifySponsor.css';

const ModifySponsor = () => {
  const navigate = useNavigate();
  const { sponsorshipId } = useParams();
  const [modificationOption, setModificationOption] = useState('upgrade');
  const [selectedNewTier, setSelectedNewTier] = useState('PLATINUM');
  const [extensionMonths, setExtensionMonths] = useState('12');

  const currentSponsorship = {
    eventName: 'Annual Gala 2024',
    currentTier: 'GOLD',
    currentAmount: 10000,
    currentStatus: 'Active',
  };

  const tiers = [
    { name: 'BRONZE', price: 2000 },
    { name: 'SILVER', price: 5000 },
    { name: 'GOLD', price: 10000 },
    { name: 'PLATINUM', price: 20000 },
  ];

  const calculateProration = () => {
    const currentPrice = currentSponsorship.currentAmount;
    const newPrice = tiers.find((t) => t.name === selectedNewTier)?.price || 0;
    const difference = newPrice - currentPrice;
    return difference;
  };

  const handleSaveModification = () => {
    if (modificationOption === 'extend') {
      alert(`Sponsorship extended by ${extensionMonths} months`);
    } else {
      alert(`Sponsorship tier changed to ${selectedNewTier}`);
    }
    navigate('/dashboard/sponsor');
  };

  return (
    <main className="modify-sponsor">
      <BackButton />
      <div className="modify-header">
        <h1>Modify Your Sponsorship</h1>
        <p>{currentSponsorship.eventName} • Current: {currentSponsorship.currentTier}</p>
      </div>

      <div className="modify-content">
        <div className="options-section">
          <h3>What Would You Like to Do?</h3>
          <div className="option-buttons">
            <button
              className={`option-btn ${modificationOption === 'upgrade' ? 'selected' : ''}`}
              onClick={() => setModificationOption('upgrade')}
            >
              <span className="option-title">Upgrade Tier</span>
              <span className="option-desc">Increase sponsorship benefits</span>
            </button>
            <button
              className={`option-btn ${modificationOption === 'downgrade' ? 'selected' : ''}`}
              onClick={() => setModificationOption('downgrade')}
            >
              <span className="option-title">Downgrade Tier</span>
              <span className="option-desc">Adjust to a different tier</span>
            </button>
            <button
              className={`option-btn ${modificationOption === 'extend' ? 'selected' : ''}`}
              onClick={() => setModificationOption('extend')}
            >
              <span className="option-title">Extend Duration</span>
              <span className="option-desc">Continue sponsorship longer</span>
            </button>
          </div>
        </div>

        {(modificationOption === 'upgrade' || modificationOption === 'downgrade') && (
          <div className="tier-selection">
            <h3>Select New Tier</h3>
            <p className="tier-note">Current tier: {currentSponsorship.currentTier} (${currentSponsorship.currentAmount})</p>
            <div className="tier-options">
              {tiers.map((tier) => (
                <button
                  key={tier.name}
                  className={`tier-option ${selectedNewTier === tier.name ? 'selected' : ''}`}
                  onClick={() => setSelectedNewTier(tier.name)}
                >
                  <span className="tier-name">{tier.name}</span>
                  <span className="tier-price">${tier.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {modificationOption === 'extend' && (
          <div className="extension-selection">
            <h3>Extend Duration</h3>
            <div className="form-group">
              <label>How long would you like to extend?</label>
              <select value={extensionMonths} onChange={(e) => setExtensionMonths(e.target.value)}>
                <option value="3">3 Months (+$2,500)</option>
                <option value="6">6 Months (+$5,000)</option>
                <option value="12">12 Months (+$10,000)</option>
                <option value="24">2 Years (+$20,000)</option>
              </select>
            </div>
          </div>
        )}

        <div className="summary-card">
          <h3>Change Summary</h3>
          {modificationOption !== 'extend' && (
            <>
              <div className="summary-item">
                <span>Current Tier:</span>
                <span>{currentSponsorship.currentTier} (${currentSponsorship.currentAmount.toLocaleString()})</span>
              </div>
              <div className="summary-item">
                <span>New Tier:</span>
                <span>{selectedNewTier} (${tiers.find((t) => t.name === selectedNewTier)?.price.toLocaleString()})</span>
              </div>
              {calculateProration() > 0 && (
                <div className="summary-item highlight">
                  <span>Additional Cost:</span>
                  <span>+${calculateProration().toLocaleString()}</span>
                </div>
              )}
              {calculateProration() < 0 && (
                <div className="summary-item highlight">
                  <span>Refund:</span>
                  <span>-${Math.abs(calculateProration()).toLocaleString()}</span>
                </div>
              )}
            </>
          )}
          {modificationOption === 'extend' && (
            <>
              <div className="summary-item">
                <span>Extension Period:</span>
                <span>{extensionMonths} months</span>
              </div>
              <div className="summary-item highlight">
                <span>Extension Cost:</span>
                <span>${extensionMonths === '3' ? '2,500' : extensionMonths === '6' ? '5,000' : extensionMonths === '12' ? '10,000' : '20,000'}</span>
              </div>
            </>
          )}

          <button className="btn-confirm" onClick={handleSaveModification}>
            Confirm Modification →
          </button>
        </div>
      </div>
    </main>
  );
};

export default ModifySponsor;
