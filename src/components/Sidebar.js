import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../context/RoleContext';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import '../styles/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, showRoleSelection }) => {
  const navigate = useNavigate();
  const { userRole } = useContext(RoleContext);
  const { getCartItemCount } = useContext(UserContext);
  const { toggleCartSidebar } = useContext(CartContext);
  const [expandedItems, setExpandedItems] = useState({});

  const getDashboardPath = () => {
    if (!userRole) return '/';
    return `/dashboard/${userRole}`;
  };

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: '🏠', path: getDashboardPath() },
      { id: 'venues', label: 'Venues', icon: '📍', path: '/venues' },
    ];

    if (userRole === 'sponsor') {
      return [
        ...baseItems,
        { id: 'calander', label: 'Calander', icon: '📅', path: '/sponsorship-bookings' },
        {
          id: 'bookings',
          label: 'Bookings',
          icon: '🏨',
          submenu: [
            { id: 'travel-bookings', label: 'Travel Bookings', path: '/travel-bookings' },
            { id: 'upcoming-bookings', label: 'Upcoming Bookings', path: '/upcoming-bookings' },
          ],
        },
        { id: 'vendors', label: 'Vendors', icon: '👥', path: '/vendors' },
        { id: 'feedback-testing', label: 'Feedback Testing', icon: '🧪', path: '/feedback-testing' },
        { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
      ];
    }

    return [
      ...baseItems,
      { id: 'bookings', label: 'Calander', icon: '📅', path: '/bookings' },
      { id: 'vendors', label: 'Vendors', icon: '👥', path: '/vendors' },
      { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
    ];
  };

  const menuItems = getMenuItems();

  const toggleExpand = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const roles = [
    { id: 'npo', name: 'NPO', icon: '🎯', color: '#FF6B6B' },
    { id: 'vendor', name: 'Vendor', icon: '🛠️', color: '#4F7DFF' },
    { id: 'sponsor', name: 'Sponsor', icon: '⭐', color: '#FFD93D' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">🅥</div>
          <span className="logo-text">VenIP</span>
        </div>
      </div>

      {!showRoleSelection && (
        <>
          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              const handleClick = () => {
                setActiveTab(item.id);
                navigate(item.path);
              };

              return (
                <button
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={handleClick}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            className="cart-nav-btn"
            onClick={toggleCartSidebar}
            title="Toggle shopping cart"
          >
            <span className="nav-icon">🛒</span>
            <span className="nav-label">Cart</span>
            {getCartItemCount() > 0 && (
              <span className="cart-count">{getCartItemCount()}</span>
            )}
          </button>
        </>
      )}

      <div className="sidebar-footer">
        {showRoleSelection ? (
          <div className="role-selection-cards">
            <p className="role-label">Choose Your Role</p>
            {roles.map((role) => (
              <button
                key={role.id}
                className={`role-card-small ${userRole === role.id ? 'active' : ''}`}
                onClick={() => navigate(`/dashboard/${role.id}`)}
                style={{ borderColor: userRole === role.id ? role.color : '#e5e7eb' }}
              >
                <span className="role-icon-small" style={{ backgroundColor: role.color }}>
                  {role.icon}
                </span>
                <span className="role-name-small">{role.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <button className="change-role-btn" onClick={() => navigate('/')}>
              Change Role
            </button>
            <span className="powered-by">Powered by FreeFuse</span>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
