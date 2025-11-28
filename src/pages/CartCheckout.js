import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import '../styles/CartCheckout.css';

const CartCheckout = () => {
  const navigate = useNavigate();
  const { user, updateUser, addToBookingHistory, clearCart, getCartTotal } = useContext(UserContext);
  const { openCartSidebar } = useContext(CartContext);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    companyName: user?.companyName || '',
    email: '',
    phone: user?.phone || '',
    billingAddress: user?.billingAddress || '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (!user || !user.cart || user.cart.length === 0) {
      navigate('/accommodation-bookings');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'cardNumber', 'cardExpiry', 'cardCVC'];
    for (let field of required) {
      if (!formData[field]?.trim()) {
        alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      alert('Please enter a valid 16-digit card number');
      return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      alert('Card expiry must be in MM/YY format');
      return false;
    }

    if (!/^\d{3,4}$/.test(formData.cardCVC.replace(/\s/g, ''))) {
      alert('Please enter a valid CVC code');
      return false;
    }

    return true;
  };

  const handleConfirmPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const cartTotal = getCartTotal();
      const orderData = {
        items: user.cart,
        subtotal: cartTotal,
        tax: cartTotal * 0.1,
        total: cartTotal * 1.1,
        customerInfo: {
          fullName: formData.fullName,
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          billingAddress: formData.billingAddress,
        },
      };

      await new Promise((resolve) => setTimeout(resolve, 2000));

      updateUser({
        fullName: formData.fullName,
        companyName: formData.companyName,
        phone: formData.phone,
        billingAddress: formData.billingAddress,
      });

      user.cart.forEach((item) => {
        addToBookingHistory({
          category: item.category || 'Accommodation',
          name: item.name,
          provider: item.provider || item.location || 'VenIP',
          date: item.checkOut || item.date || new Date().toISOString().split('T')[0],
          status: 'Confirmed',
          amount: item.totalPrice,
          bookingDate: new Date().toISOString().split('T')[0],
          details: {
            checkIn: item.checkIn,
            checkOut: item.checkOut,
            guests: item.guests,
            quantity: item.quantity,
            location: item.location,
          },
        });
      });

      clearCart();

      setOrderDetails(orderData);
      setConfirmed(true);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || !user.cart) {
    return null;
  }

  if (confirmed && orderDetails) {
    return (
      <div className="checkout-success">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Booking Confirmed!</h2>
          <p>Thank you for your purchase</p>

          <div className="confirmation-details">
            <div className="detail-section">
              <h4>Booking Summary</h4>
              <div className="detail-item">
                <span className="label">Number of Items:</span>
                <span className="value">{orderDetails.items.length}</span>
              </div>
              <div className="detail-item">
                <span className="label">Subtotal:</span>
                <span className="value">${orderDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className="detail-item">
                <span className="label">Tax (est.):</span>
                <span className="value">${orderDetails.tax.toFixed(2)}</span>
              </div>
              <div className="detail-item total">
                <span className="label">Total Amount:</span>
                <span className="value">${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Confirmation Email</h4>
              <p className="confirmation-email">{formData.email}</p>
            </div>

            <div className="detail-section">
              <h4>Items Booked</h4>
              <div className="booked-items">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="booked-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-amount">{item.totalPrice}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="next-steps">
            A confirmation email with all booking details has been sent to {formData.email}. You can manage your bookings from your profile.
          </p>

          <div className="success-actions">
            <button
              onClick={() => toggleCartSidebar()}
              className="btn-view-history"
            >
              View in Cart History
            </button>
            <button
              onClick={() => navigate('/accommodation-bookings')}
              className="btn-continue-booking"
            >
              Continue Booking
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className="btn-view-bookings"
            >
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cartItems = user.cart || [];
  const cartTotal = getCartTotal();
  const taxAmount = cartTotal * 0.1;
  const totalAmount = cartTotal * 1.1;

  return (
    <main className="cart-checkout">
      <div className="checkout-header">
        <h1>Complete Your Bookings</h1>
        <p>{cartItems.length} item(s) in cart • Total: ${totalAmount.toFixed(2)}</p>
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          <section className="order-summary-section">
            <h2 className="section-title">Order Summary</h2>
            <div className="cart-items-display">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-content">
                    <h4 className="summary-item-name">{item.name}</h4>
                    <p className="summary-item-location">{item.location}</p>
                    {(item.checkIn || item.checkOut) && (
                      <p className="summary-item-dates">
                        {item.checkIn} - {item.checkOut}
                      </p>
                    )}
                    {item.guests && (
                      <p className="summary-item-guests">Guests: {item.guests}</p>
                    )}
                  </div>
                  <div className="summary-item-price">{item.totalPrice}</div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (estimated)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </section>

          <section className="payment-form-section">
            <h2 className="section-title">Payment Details</h2>

            <form className="checkout-form">
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
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Company name (optional)"
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
                  <label>Address</label>
                  <input
                    type="text"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleInputChange}
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Card Information</h3>
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

              <div className="checkout-buttons">
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="btn-confirm"
                >
                  {isProcessing ? 'Processing...' : `Confirm & Pay $${totalAmount.toFixed(2)}`}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default CartCheckout;
