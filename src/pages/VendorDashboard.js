import React, { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import QuickAccessGrid from '../components/QuickAccessGrid';
import { CartContext } from '../context/CartContext';
import { RoleContext } from '../context/RoleContext';
import { EventContext } from '../context/EventContext';
import '../styles/VendorDashboard.css';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { toggleCartSidebar } = useContext(CartContext);
  const { setUserRole } = useContext(RoleContext);
  const { getVendorServices, getVendorCommitments } = useContext(EventContext);

  useEffect(() => {
    setUserRole('vendor');
  }, [setUserRole]);

  const user = {
    name: 'Michael Chen',
    role: 'Vendor',
    company: 'Premium Catering Co.',
  };

  const services = useMemo(() => getVendorServices('vendor'), [getVendorServices]);
  const commitments = useMemo(() => getVendorCommitments('vendor'), [getVendorCommitments]);

  const activeServices = services.filter(s => s.availability === 'Available').length;
  const pendingBookings = commitments.filter(c => c.status === 'Pending').length;
  const confirmedJobs = commitments.filter(c => c.status === 'Confirmed').length;

  const upcomingCommitments = commitments
    .filter(c => c.status === 'Confirmed' || c.status === 'Pending')
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
    .slice(0, 5);

  const quickAccessItems = [
    { id: 'services', label: 'My Services', icon: '🛠️', path: '/vendor-services', color: '#D4AF37' },
    { id: 'commitments', label: 'Commitments', icon: '📋', path: '/vendor-commitments', color: '#8B5CF6' },
    { id: 'suggest', label: 'Suggest Event', icon: '💡', path: '/suggest-event', color: '#22c55e' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings', color: '#6b7280' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Confirmed': return 'confirmed';
      case 'Pending': return 'pending';
      default: return '';
    }
  };

  return (
    <main className="vendor-dashboard">
      <header className="dashboard-header-modern">
        <div className="header-welcome">
          <p className="welcome-text">Welcome back,</p>
          <h1 className="user-name">{user.name}</h1>
          <span className="role-badge">{user.role}</span>
        </div>
        <div className="header-actions">
          <button className="header-icon-btn" onClick={toggleCartSidebar} title="Cart">
            🛒
          </button>
          <button className="header-icon-btn" onClick={handleLogout} title="Logout">
            ➡️
          </button>
        </div>
      </header>

      <div className="dashboard-content-modern">
        <section className="metrics-section-modern">
          <MetricCard 
            label="Active Services" 
            value={String(activeServices)}
            icon="🛠️"
            iconBg="gold"
          />
          <MetricCard 
            label="Pending Bookings" 
            value={String(pendingBookings)}
            icon="⏳"
            iconBg="purple"
          />
          <MetricCard 
            label="Confirmed Jobs" 
            value={String(confirmedJobs)}
            icon="✅"
            iconBg="green"
          />
        </section>

        <QuickAccessGrid items={quickAccessItems} />

        {/* Upcoming Commitments Section */}
        <section className="events-tabs-section">
          <div className="events-section-container">
            <h3 className="upcoming-section-title">Upcoming Commitments</h3>

            <div className="tab-content">
              {upcomingCommitments.length > 0 ? (
                <div className="events-list-modern">
                  {upcomingCommitments.map((commitment, index) => (
                    <div
                      key={commitment.id}
                      className="commitment-preview-card"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => navigate('/vendor-commitments')}
                    >
                      <div className={`commitment-preview-status ${getStatusClass(commitment.status)}`}>
                        {commitment.status}
                      </div>
                      <div className="commitment-preview-info">
                        <h4 className="commitment-preview-event">{commitment.eventName}</h4>
                        <p className="commitment-preview-service">{commitment.serviceName}</p>
                        <div className="commitment-preview-meta">
                          <span>📅 {formatDate(commitment.eventDate)}</span>
                          <span>📍 {commitment.eventLocation}</span>
                          <span className="commitment-preview-price">{commitment.agreedPrice}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-commitments-message">
                  <span className="no-commitments-icon">📋</span>
                  <p>No upcoming commitments</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="suggest-event-cta" onClick={() => navigate('/suggest-event')}>
          <div className="cta-content">
            <span className="cta-icon">💡</span>
            <div className="cta-text">
              <h3>Suggest an Event</h3>
              <p>Help NPOs discover service opportunities</p>
            </div>
          </div>
          <span className="cta-arrow">→</span>
        </div>
      </div>
    </main>
  );
};

export default VendorDashboard;
