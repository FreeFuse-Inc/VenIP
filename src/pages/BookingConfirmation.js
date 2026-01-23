import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import '../styles/BookingConfirmation.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [paymentStep, setPaymentStep] = useState('details'); // 'details', 'payment', 'success'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    billingAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!bookingData) {
    return (
      <main className="booking-confirmation-page">
        <div className="error-container">
          <p className="error-message">Booking data not found. Please try again.</p>
        </div>
      </main>
    );
  }

  const { item, searchParams, type } = bookingData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, '').length < 13) {
      setError('Valid card number is required');
      return false;
    }
    if (!formData.cardExpiry.trim() || !/\d{2}\/\d{2}/.test(formData.cardExpiry)) {
      setError('Card expiry must be in MM/YY format');
      return false;
    }
    if (!formData.cardCVC.trim() || formData.cardCVC.length < 3) {
      setError('Valid CVC is required');
      return false;
    }
    if (!formData.billingAddress.trim()) {
      setError('Billing address is required');
      return false;
    }
    return true;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setPaymentStep('payment');
      setError('');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setPaymentStep('success');
      setError('');
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBookingPrice = () => {
    const priceStr = item.price.replace('$', '').replace(',', '');
    const priceNum = parseFloat(priceStr);
    return priceNum;
  };

  const getBookingTitle = () => {
    switch (type) {
      case 'hotels':
        return 'Hotel Booking';
      case 'homes':
        return 'Home & Apartment Booking';
      case 'longstays':
        return 'Long Stay Booking';
      case 'flights':
        return 'Flight Booking';
      case 'activities':
        return 'Activity Booking';
      case 'transfers':
        return 'Airport Transfer Booking';
      default:
        return 'Booking Confirmation';
    }
  };

  const renderBookingDetails = () => {
    switch (type) {
      case 'hotels':
      case 'homes':
      case 'longstays':
        return (
          <>
            <div className="detail-row">
              <span className="label">Property:</span>
              <span className="value">{item.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Location:</span>
              <span className="value">{item.location}</span>
            </div>
            <div className="detail-row">
              <span className="label">Check-in:</span>
              <span className="value">{searchParams.checkIn}</span>
            </div>
            <div className="detail-row">
              <span className="label">Check-out:</span>
              <span className="value">{searchParams.checkOut}</span>
            </div>
            <div className="detail-row">
              <span className="label">Guests:</span>
              <span className="value">{searchParams.guests}</span>
            </div>
            <div className="detail-row">
              <span className="label">Bedrooms:</span>
              <span className="value">{item.bedrooms}</span>
            </div>
            <div className="detail-row">
              <span className="label">Bathrooms:</span>
              <span className="value">{item.bathrooms}</span>
            </div>
          </>
        );
      case 'flights':
        return (
          <>
            <div className="detail-row">
              <span className="label">Airline:</span>
              <span className="value">{item.airline}</span>
            </div>
            <div className="detail-row">
              <span className="label">Route:</span>
              <span className="value">
                {item.from} → {item.to}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Departure:</span>
              <span className="value">{item.departure}</span>
            </div>
            <div className="detail-row">
              <span className="label">Arrival:</span>
              <span className="value">{item.arrival}</span>
            </div>
            <div className="detail-row">
              <span className="label">Duration:</span>
              <span className="value">{item.duration}</span>
            </div>
            <div className="detail-row">
              <span className="label">Stops:</span>
              <span className="value">{item.stops}</span>
            </div>
            <div className="detail-row">
              <span className="label">Passengers:</span>
              <span className="value">{searchParams.guests}</span>
            </div>
          </>
        );
      case 'activities':
        return (
          <>
            <div className="detail-row">
              <span className="label">Activity:</span>
              <span className="value">{item.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Provider:</span>
              <span className="value">{item.provider}</span>
            </div>
            <div className="detail-row">
              <span className="label">Location:</span>
              <span className="value">{item.location}</span>
            </div>
            <div className="detail-row">
              <span className="label">Duration:</span>
              <span className="value">{item.duration}</span>
            </div>
            <div className="detail-row">
              <span className="label">Participants:</span>
              <span className="value">{searchParams.guests}</span>
            </div>
            <div className="detail-row">
              <span className="label">Group Size:</span>
              <span className="value">Max {item.groupSize} people</span>
            </div>
          </>
        );
      case 'transfers':
        return (
          <>
            <div className="detail-row">
              <span className="label">Service Type:</span>
              <span className="value">{item.type}</span>
            </div>
            <div className="detail-row">
              <span className="label">Pickup Location:</span>
              <span className="value">{item.pickup}</span>
            </div>
            <div className="detail-row">
              <span className="label">Destination:</span>
              <span className="value">{item.destination}</span>
            </div>
            <div className="detail-row">
              <span className="label">Estimated Time:</span>
              <span className="value">{item.estimatedTime}</span>
            </div>
            <div className="detail-row">
              <span className="label">Capacity:</span>
              <span className="value">{item.capacity}</span>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (paymentStep === 'success') {
    return (
      <main className="booking-confirmation-page">
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Booking Confirmed!</h2>
          <p className="success-message">Your {getBookingTitle().toLowerCase()} has been successfully processed.</p>

          <div className="confirmation-details">
            <div className="confirmation-item">
              <span className="confirmation-label">Confirmation Number:</span>
              <span className="confirmation-value">BK{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
            <div className="confirmation-item">
              <span className="confirmation-label">Amount Paid:</span>
              <span className="confirmation-value">${getBookingPrice().toFixed(2)}</span>
            </div>
            <div className="confirmation-item">
              <span className="confirmation-label">Email:</span>
              <span className="confirmation-value">{formData.email}</span>
            </div>
          </div>

          <p className="success-note">A confirmation email has been sent to {formData.email}</p>

          <button className="back-btn-success" onClick={() => navigate('/accommodation-bookings')}>
            Return to Bookings
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="booking-confirmation-page">
      <BackButton />
      <div className="confirmation-header">
        <h1 className="page-title">{getBookingTitle()}</h1>
      </div>

      <div className="confirmation-container">
        <div className="confirmation-content">
          <div className="steps-indicator">
            <div className={`step ${paymentStep === 'details' ? 'active' : paymentStep !== 'details' ? 'completed' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Details</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${paymentStep === 'payment' ? 'active' : paymentStep === 'success' ? 'completed' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Payment</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${paymentStep === 'success' ? 'completed' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Confirmation</span>
            </div>
          </div>

          <div className="form-container">
            {paymentStep === 'details' ? (
              <form className="details-form" onSubmit={handleNextStep}>
                <div className="form-section">
                  <h2 className="section-title">Guest Information</h2>

                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="next-btn">
                  Continue to Payment
                </button>
              </form>
            ) : (
              <form className="payment-form" onSubmit={handlePayment}>
                <div className="form-section">
                  <h2 className="section-title">Payment Information</h2>

                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number *</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="cardExpiry">Expiry Date (MM/YY) *</label>
                      <input
                        type="text"
                        id="cardExpiry"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cardCVC">CVC *</label>
                      <input
                        type="text"
                        id="cardCVC"
                        name="cardCVC"
                        value={formData.cardCVC}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="billingAddress">Billing Address *</label>
                    <textarea
                      id="billingAddress"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleInputChange}
                      placeholder="Enter your full billing address"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-buttons">
                  <button type="button" className="back-btn-form" onClick={() => setPaymentStep('details')}>
                    ← Back
                  </button>
                  <button type="submit" className="pay-btn" disabled={loading}>
                    {loading ? 'Processing...' : `Pay $${getBookingPrice().toFixed(2)}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="booking-summary">
          <h2 className="summary-title">Booking Summary</h2>

          <div className="summary-details">
            {item.image && (
              <div className="summary-image">
                <img src={item.image} alt={item.name} />
              </div>
            )}

            <div className="booking-info">
              {renderBookingDetails()}
            </div>

            <div className="summary-divider"></div>

            <div className="price-breakdown">
              <div className="price-line">
                <span>Subtotal:</span>
                <span>${getBookingPrice().toFixed(2)}</span>
              </div>
              <div className="price-line">
                <span>Taxes & Fees:</span>
                <span>${(getBookingPrice() * 0.1).toFixed(2)}</span>
              </div>
              <div className="price-line total">
                <span>Total:</span>
                <span>${(getBookingPrice() * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookingConfirmation;
