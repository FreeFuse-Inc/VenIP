import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/PaymentConfirmation.css';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const { eventId, tier, amount } = useParams();
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    billingAddress: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmPayment = async () => {
    if (!formData.fullName || !formData.email || !formData.cardNumber) {
      alert('Please fill in all required fields');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setConfirmed(true);
      setIsProcessing(false);
    }, 2000);
  };

  if (confirmed) {
    return (
      <div className="payment-success">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Payment Confirmed!</h2>
          <p>Thank you for your sponsorship</p>
          <div className="confirmation-details">
            <div className="detail-item">
              <span className="label">Event:</span>
              <span className="value">Annual Gala 2024</span>
            </div>
            <div className="detail-item">
              <span className="label">Tier:</span>
              <span className="value">{tier?.toUpperCase()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Amount:</span>
              <span className="value">${amount}</span>
            </div>
            <div className="detail-item">
              <span className="label">Confirmation Email Sent To:</span>
              <span className="value">{formData.email}</span>
            </div>
          </div>
          <p className="next-steps">
            You'll receive a detailed sponsorship agreement and benefits activation email within 24 hours.
          </p>
          <button onClick={() => navigate('/dashboard/sponsor')} className="btn-return">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="payment-confirmation">
      <div className="confirmation-header">
        <h1>Complete Your Sponsorship</h1>
        <p>Annual Gala 2024 • {tier?.toUpperCase()} Tier • ${amount}</p>
      </div>

      <div className="confirmation-content">
        <form className="payment-form">
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
              </div>
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Company name"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Billing Address</h3>
            <div className="form-group full-width">
              <label>Address *</label>
              <input
                type="text"
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                placeholder="123 Business Ave, City, State 12345"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Payment Information</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Card Number *</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
              </div>
              <div className="form-group">
                <label>Expiry Date *</label>
                <input
                  type="text"
                  name="cardExpiry"
                  value={formData.cardExpiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </div>
              <div className="form-group">
                <label>CVC *</label>
                <input
                  type="text"
                  name="cardCVC"
                  value={formData.cardCVC}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                />
              </div>
            </div>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span>Annual Gala 2024 - {tier?.toUpperCase()} Sponsorship</span>
              <span>${amount}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${amount}</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-confirm"
            onClick={handleConfirmPayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Confirm & Sponsor'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default PaymentConfirmation;
