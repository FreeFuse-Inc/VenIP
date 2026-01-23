import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import '../styles/InviteAttendees.css';

const InviteAttendees = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [invitees, setInvitees] = useState([
    { id: 1, email: 'john@example.com', name: 'John Smith', status: 'Invited' },
    { id: 2, email: 'jane@example.com', name: 'Jane Doe', status: 'Accepted' },
    { id: 3, email: 'bob@example.com', name: 'Bob Johnson', status: 'Pending' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [inviteStatus, setInviteStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddInvitee = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert('Please fill in all fields');
      return;
    }

    const newInvitee = {
      id: invitees.length + 1,
      name: formData.name,
      email: formData.email,
      status: 'Pending',
    };

    setInvitees((prev) => [...prev, newInvitee]);
    setFormData({ name: '', email: '' });
    setShowForm(false);
    setInviteStatus('invitee');
  };

  const handleRemoveInvitee = (id) => {
    setInvitees((prev) => prev.filter((inv) => inv.id !== id));
  };

  const handleSendInvitations = () => {
    setInviteStatus('success');
    setTimeout(() => {
      navigate(`/event-management/${eventId}`);
    }, 2000);
  };

  if (inviteStatus === 'success') {
    return (
      <main className="invite-attendees-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Invitations Sent Successfully!</h2>
          <p>All attendees have been invited to the event</p>
          <p className="redirect-message">Redirecting you back to event details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="invite-attendees-container">
      <BackButton />
      <div className="invite-header">
        <h1>Invite Attendees</h1>
        <p className="event-id-text">Event ID: {eventId}</p>
      </div>

      <div className="invite-content">
        <div className="invitee-form-section">
          {!showForm && (
            <button 
              className="btn-add-invitee"
              onClick={() => setShowForm(true)}
            >
              + Add Attendee
            </button>
          )}

          {showForm && (
            <div className="invite-form">
              <h3>Add New Attendee</h3>
              <form onSubmit={handleAddInvitee}>
                <div className="form-group">
                  <label>Attendee Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g., john@example.com"
                  />
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ name: '', email: '' });
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Attendee
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="invitees-list-section">
          <h2>Invited Attendees ({invitees.length})</h2>
          
          {invitees.length === 0 ? (
            <div className="empty-state">
              <p>No attendees invited yet</p>
              <p className="subtext">Add attendees to invite them to the event</p>
            </div>
          ) : (
            <div className="invitees-list">
              {invitees.map((invitee) => (
                <div key={invitee.id} className="invitee-card">
                  <div className="invitee-info">
                    <h4 className="invitee-name">{invitee.name}</h4>
                    <p className="invitee-email">{invitee.email}</p>
                  </div>
                  <div className="invitee-status-section">
                    <span className={`invitee-status ${invitee.status.toLowerCase()}`}>
                      {invitee.status}
                    </span>
                    <button
                      className="btn-remove"
                      onClick={() => handleRemoveInvitee(invitee.id)}
                      title="Remove invitee"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {invitees.length > 0 && (
            <div className="invite-actions">
              <button
                className="btn-secondary"
                onClick={() => navigate(`/event-management/${eventId}`)}
              >
                Save & Close
              </button>
              <button
                className="btn-primary"
                onClick={handleSendInvitations}
              >
                Send All Invitations →
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default InviteAttendees;
