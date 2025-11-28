import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import BookingConfirmationModal from '../components/BookingConfirmationModal';
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

    const cardNum = formData.cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cardNum)) {
      alert('Please enter a valid card number (13-19 digits)');
      return false;
    }

    const expiry = formData.cardExpiry.trim();
    if (!expiry.match(/^\d{2}\/?\d{2}$/)) {
      console.warn('Expiry format issue, but allowing:', formData.cardExpiry);
    }

    const cvc = formData.cardCVC.replace(/\s/g, '');
    if (!/^\d{3,4}$/.test(cvc)) {
      alert('Please enter a valid CVC code (3-4 digits)');
      return false;
    }

    return true;
  };

  const handleConfirmPayment = async () => {
    console.log('Payment button clicked');

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed, processing payment...');
    setIsProcessing(true);

    try {
      const cartTotal = getCartTotal();
      console.log('Cart total:', cartTotal);

      // Capture cart items immediately before any state changes
      const cartItemsToProcess = user.cart ? [...user.cart] : [];
      console.log('Cart items to process:', cartItemsToProcess.length);

      const orderData = {
        items: cartItemsToProcess,
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

      console.log('Processing payment...');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log('Adding items to booking history...');

      // Create all booking records
      const newBookingRecords = cartItemsToProcess.map((item, index) => {
        console.log(`Creating booking ${index + 1}:`, item.name);
        const bookingRecord = {
          id: `booking_${Date.now()}_${Math.random()}`,
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
          bookedAt: new Date().toISOString(),
        };
        console.log('Booking record:', bookingRecord);
        return bookingRecord;
      });

      // Add all bookings at once
      console.log('Adding all bookings to history...');
      const updatedHistory = [...(user.bookingHistory || []), ...newBookingRecords];
      console.log('Updated history length:', updatedHistory.length);

      console.log('Updating user profile and history in one operation...');
      updateUser({
        fullName: formData.fullName,
        companyName: formData.companyName,
        phone: formData.phone,
        billingAddress: formData.billingAddress,
        bookingHistory: updatedHistory,
        cart: [],
      });

      console.log('Setting order details and confirmed state');
      setOrderDetails(orderData);
      setConfirmed(true);
      console.log('Payment processing complete!');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again. Check browser console for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || !user.cart) {
    return null;
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

      <BookingConfirmationModal
        isOpen={confirmed}
        onClose={() => {
          setConfirmed(false);
          navigate('/accommodation-bookings');
        }}
        itemCount={orderDetails?.items?.length || 0}
        totalAmount={orderDetails?.total?.toFixed(2) || '0.00'}
        email={formData.email}
      />
    </main>
  );
};

export default CartCheckout;
