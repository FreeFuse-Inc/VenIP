import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import '../styles/CartSidebar.css';

const CartSidebar = () => {
  const navigate = useNavigate();
  const { user, removeFromCart, clearCart, getCartTotal, getCartItemCount } = useContext(UserContext);
  const { isCartSidebarOpen, toggleCartSidebar } = useContext(CartContext);
  const [activeTab, setActiveTab] = React.useState('cart');

  if (!user) return null;

  const cartItems = user.cart || [];
  const bookingHistory = user.bookingHistory || [];
  const recentBookings = bookingHistory.slice(-5).reverse();
  const itemCount = getCartItemCount();
  const cartTotal = getCartTotal();

  const handleRemoveItem = (cartItemId) => {
    removeFromCart(cartItemId);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/cart-checkout');
  };

  const handleContinueShopping = () => {
    toggleCartSidebar();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <button
        className={`cart-toggle-btn ${isCartSidebarOpen ? 'open' : 'closed'}`}
        onClick={toggleCartSidebar}
        aria-label="Toggle cart sidebar"
      >
        <span className="cart-icon">🛒</span>
        {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
      </button>

      <aside className={`cart-sidebar ${isCartSidebarOpen ? 'open' : 'closed'}`}>
        <div className="cart-header">
          <h2 className="cart-title">Shopping Cart</h2>
          <button
            className="cart-close-btn"
            onClick={toggleCartSidebar}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <span className="empty-cart-icon">🛒</span>
            <p className="empty-cart-text">Your cart is empty</p>
            <p className="empty-cart-subtitle">Add items from booking tabs to get started</p>
          </div>
        ) : (
          <>
            <div className="cart-items-container">
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                      }} />
                    </div>

                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-location">{item.location}</p>

                      <div className="item-info">
                        {item.checkIn && (
                          <span className="item-date">
                            {item.checkIn} - {item.checkOut}
                          </span>
                        )}
                        {item.guests && (
                          <span className="item-guests">{item.guests}</span>
                        )}
                        {item.quantity && (
                          <span className="item-quantity">Qty: {item.quantity}</span>
                        )}
                      </div>

                      <div className="item-pricing">
                        <span className="item-price">{item.totalPrice}</span>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label="Remove item"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Tax (est.)</span>
                <span className="summary-value">${(cartTotal * 0.1).toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span className="summary-label">Total</span>
                <span className="summary-value">${(cartTotal * 1.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="cart-actions">
              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
              <button
                className="continue-shopping-btn"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>
              <button
                className="clear-cart-btn"
                onClick={() => {
                  if (window.confirm('Clear all items from cart?')) {
                    clearCart();
                  }
                }}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
