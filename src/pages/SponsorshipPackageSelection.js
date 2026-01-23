import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import '../styles/SponsorshipPackageSelection.css';

const SponsorshipPackageSelection = () => {
  const navigate = useNavigate();
  const { eventId, tier } = useParams();
  const [selectedTier, setSelectedTier] = useState(tier?.toUpperCase() || 'SILVER');
  const [customAmount, setCustomAmount] = useState('');

  const tierDetails = {
    BRONZE: { name: 'Bronze', price: 2000, displayPrice: '$2,000' },
    SILVER: { name: 'Silver', price: 5000, displayPrice: '$5,000' },
    GOLD: { name: 'Gold', price: 10000, displayPrice: '$10,000' },
    PLATINUM: { name: 'Platinum', price: 20000, displayPrice: '$20,000' },
    CUSTOM: { name: 'Custom', price: customAmount ? parseInt(customAmount) : 0, displayPrice: `$${customAmount || '0'}` },
  };

  const currentTierDetails = tierDetails[selectedTier];

  const handleProceedToPayment = () => {
    if (selectedTier === 'CUSTOM' && (!customAmount || parseInt(customAmount) < 500)) {
      alert('Custom amount must be at least $500');
      return;
    }
    navigate(`/payment-confirmation/${eventId}/${selectedTier}/${currentTierDetails.price}`);
  };

  return (
    <main className="sponsorship-package-selection">
      <BackButton />
      <div className="selection-header">
        <h1>Select Your Sponsorship Package</h1>
        <p>Annual Gala 2024</p>
      </div>

      <div className="selection-content">
        <div className="tiers-summary">
          <h3>Available Packages</h3>
          <div className="tiers-list">
            {Object.keys(tierDetails)
              .filter((key) => key !== 'CUSTOM')
              .map((key) => (
                <button
                  key={key}
                  className={`tier-option ${selectedTier === key ? 'selected' : ''}`}
                  onClick={() => setSelectedTier(key)}
                >
                  <span className="tier-name">{tierDetails[key].name}</span>
                  <span className="tier-price">{tierDetails[key].displayPrice}</span>
                </button>
              ))}
          </div>

          <div className="custom-option">
            <label>
              <input
                type="radio"
                checked={selectedTier === 'CUSTOM'}
                onChange={() => setSelectedTier('CUSTOM')}
              />
              Custom Amount
            </label>
            {selectedTier === 'CUSTOM' && (
              <div className="custom-input-wrapper">
                <span className="currency">$</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount (min $500)"
                  min="500"
                />
              </div>
            )}
          </div>
        </div>

        <div className="package-summary">
          <h3>Summary</h3>
          <div className="summary-card">
            <div className="summary-item">
              <span className="label">Package:</span>
              <span className="value">{currentTierDetails.name}</span>
            </div>
            <div className="summary-item">
              <span className="label">Amount:</span>
              <span className="value amount">{currentTierDetails.displayPrice}</span>
            </div>
            <div className="summary-item total">
              <span className="label">Total Investment:</span>
              <span className="value">{currentTierDetails.displayPrice}</span>
            </div>

            <p className="summary-note">
              You'll complete payment and receive a confirmation email with sponsorship details and benefits breakdown.
            </p>

            <button className="btn-proceed" onClick={handleProceedToPayment}>
              Proceed to Payment →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SponsorshipPackageSelection;
