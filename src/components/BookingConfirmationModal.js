import React, { useState } from 'react';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/BookingConfirmationModal.css';

const BookingConfirmationModal = ({ isOpen, onClose, itemCount, totalAmount, email }) => {
  const [isClosing, setIsClosing] = useState(false);
  const { openCartSidebar } = useContext(CartContext);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`}>
      <div className={`confirmation-modal ${isClosing ? 'closing' : ''}`}>
        <div className="modal-content">
          <div className="success-icon">✓</div>
          <h2>Booking Confirmed!</h2>
          <p className="success-message">Your booking has been successfully confirmed.</p>
          
          <div className="confirmation-summary">
            <div className="summary-item">
              <span className="label">Items Booked:</span>
              <span className="value">{itemCount}</span>
            </div>
            <div className="summary-item">
              <span className="label">Total Amount:</span>
              <span className="value">${totalAmount}</span>
            </div>
            {email && (
              <div className="summary-item">
                <span className="label">Confirmation Sent To:</span>
                <span className="value">{email}</span>
              </div>
            )}
          </div>

          <p className="modal-info">
            A confirmation email with all booking details has been sent. Your bookings are now visible in the Cart History tab.
          </p>

          <div className="modal-actions">
            <button onClick={handleClose} className="modal-close-btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;
