import React, { useContext, useState, useMemo } from 'react';
import BackButton from '../components/BackButton';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import { EventContext } from '../context/EventContext';
import { RoleContext } from '../context/RoleContext';
import '../styles/VendorCommitments.css';

const VendorCommitments = () => {
  const {
    getVendorCommitments,
    updateCommitmentStatus,
  } = useContext(EventContext);
  const { setUserRole } = useContext(RoleContext);

  React.useEffect(() => {
    setUserRole('vendor');
  }, [setUserRole]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filterTabs = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

  const allCommitments = useMemo(() => {
    return getVendorCommitments('vendor');
  }, [getVendorCommitments]);

  const filteredCommitments = useMemo(() => {
    return allCommitments.filter(commitment => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        commitment.eventName.toLowerCase().includes(query) ||
        commitment.clientName.toLowerCase().includes(query) ||
        commitment.serviceName.toLowerCase().includes(query);
      const matchesFilter =
        activeFilter === 'All' || commitment.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [allCommitments, searchQuery, activeFilter]);

  const confirmedCount = allCommitments.filter(c => c.status === 'Confirmed').length;
  const pendingCount = allCommitments.filter(c => c.status === 'Pending').length;

  const totalRevenue = allCommitments
    .filter(c => c.status === 'Confirmed' || c.status === 'Completed')
    .reduce((sum, c) => {
      const price = parseFloat((c.agreedPrice || '').replace(/[^0-9.]/g, ''));
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

  const handleAccept = (id) => {
    updateCommitmentStatus(id, 'Confirmed');
  };

  const handleDecline = (id) => {
    updateCommitmentStatus(id, 'Cancelled');
  };

  const handleMarkComplete = (id) => {
    updateCommitmentStatus(id, 'Completed');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Confirmed': return 'confirmed';
      case 'Pending': return 'pending';
      case 'Completed': return 'completed';
      case 'Cancelled': return 'cancelled';
      default: return '';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <main className="vendor-commitments-page">
      <BackButton />
      <PageHeader
        title="My Commitments"
        subtitle="Track your bookings and manage client engagements"
      />

      <div className="commitments-page-content">
        {/* Stats Pills */}
        <div className="commitments-stats">
          <div className="stat-pill">
            <span className="stat-pill-value">{allCommitments.length}</span>
            <span className="stat-pill-label">Total Bookings</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-value">{confirmedCount}</span>
            <span className="stat-pill-label">Confirmed</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-value">{pendingCount}</span>
            <span className="stat-pill-label">Pending</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-value">${totalRevenue.toLocaleString()}</span>
            <span className="stat-pill-label">Revenue</span>
          </div>
        </div>

        {/* Controls */}
        <div className="commitments-controls">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by event, client, or service..."
          />
          <FilterTabs
            tabs={filterTabs}
            activeTab={activeFilter}
            onChange={setActiveFilter}
          />
        </div>

        {/* Commitments Grid */}
        <div className="commitments-grid-section">
          {filteredCommitments.length > 0 ? (
            <div className="commitments-grid">
              {filteredCommitments.map((commitment, index) => (
                <div
                  key={commitment.id}
                  className="commitment-card"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  {/* Status Header */}
                  <div className={`commitment-status-header ${getStatusClass(commitment.status)}`}>
                    <span className="commitment-status-label">{commitment.status}</span>
                    <span className="commitment-price">{commitment.agreedPrice}</span>
                  </div>

                  {/* Card Body */}
                  <div className="commitment-card-body">
                    {/* Event Info */}
                    <div className="commitment-event-info">
                      <h4 className="commitment-event-name">{commitment.eventName}</h4>
                      <span className="commitment-service-tag">{commitment.serviceName}</span>
                    </div>

                    {/* Details Grid */}
                    <div className="commitment-details">
                      <div className="commitment-detail-row">
                        <span className="detail-icon">📅</span>
                        <span className="detail-text">{formatDate(commitment.eventDate)}</span>
                      </div>
                      <div className="commitment-detail-row">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">{commitment.eventLocation}</span>
                      </div>
                      <div className="commitment-detail-row">
                        <span className="detail-icon">👥</span>
                        <span className="detail-text">{commitment.attendees} attendees</span>
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="commitment-client">
                      <div className="client-header">Client</div>
                      <div className="client-info-grid">
                        <div className="client-detail">
                          <span className="client-icon">👤</span>
                          <span className="client-text">{commitment.clientName}</span>
                        </div>
                        <div className="client-detail">
                          <span className="client-icon">✉️</span>
                          <span className="client-text">{commitment.clientEmail}</span>
                        </div>
                        <div className="client-detail">
                          <span className="client-icon">📞</span>
                          <span className="client-text">{commitment.clientPhone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {commitment.notes && (
                      <div className="commitment-notes">
                        <span className="notes-label">Notes:</span>
                        <span className="notes-text">{commitment.notes}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="commitment-card-actions">
                      {commitment.status === 'Pending' && (
                        <>
                          <button
                            className="commitment-action-btn btn-accept"
                            onClick={() => handleAccept(commitment.id)}
                          >
                            ✓ Accept
                          </button>
                          <button
                            className="commitment-action-btn btn-decline"
                            onClick={() => handleDecline(commitment.id)}
                          >
                            ✕ Decline
                          </button>
                        </>
                      )}
                      {commitment.status === 'Confirmed' && (
                        <button
                          className="commitment-action-btn btn-complete"
                          onClick={() => handleMarkComplete(commitment.id)}
                        >
                          ✓ Mark Complete
                        </button>
                      )}
                      {(commitment.status === 'Completed' || commitment.status === 'Cancelled') && (
                        <div className="commitment-finalized">
                          {commitment.status === 'Completed' ? '✅ Completed' : '❌ Cancelled'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-commitments">
              <div className="empty-icon">📋</div>
              <h3>No commitments found</h3>
              <p>
                {searchQuery || activeFilter !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'When clients book your services, commitments will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default VendorCommitments;
