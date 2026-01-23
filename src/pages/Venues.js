import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import '../styles/Venues.css';

const Venues = () => {
  const [venues, setVenues] = useState([
    {
      id: 1,
      name: 'Downtown Convention Center',
      location: 'Downtown',
      capacity: 1000,
      amenities: ['WiFi', 'Parking', 'Catering', 'Audio/Video'],
      rate: '$50/hour',
      available: true,
    },
    {
      id: 2,
      name: 'Grand Hotel Ballroom',
      location: 'Uptown',
      capacity: 500,
      amenities: ['WiFi', 'Catering', 'Decorations'],
      rate: '$75/hour',
      available: true,
    },
    {
      id: 3,
      name: 'Central Park Pavilion',
      location: 'Central Park',
      capacity: 300,
      amenities: ['Tables', 'Chairs', 'Lighting'],
      rate: '$30/hour',
      available: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    amenities: '',
    rate: '',
  });
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVenue = () => {
    if (formData.name && formData.location && formData.capacity && formData.rate) {
      const newVenue = {
        id: editingId || Date.now(),
        name: formData.name,
        location: formData.location,
        capacity: parseInt(formData.capacity),
        amenities: formData.amenities.split(',').map((a) => a.trim()),
        rate: formData.rate,
        available: true,
      };

      if (editingId) {
        setVenues(venues.map((v) => (v.id === editingId ? newVenue : v)));
        setEditingId(null);
      } else {
        setVenues([...venues, newVenue]);
      }

      setFormData({ name: '', location: '', capacity: '', amenities: '', rate: '' });
      setShowAddForm(false);
    }
  };

  const handleEditVenue = (venue) => {
    setFormData({
      name: venue.name,
      location: venue.location,
      capacity: venue.capacity.toString(),
      amenities: venue.amenities.join(', '),
      rate: venue.rate,
    });
    setEditingId(venue.id);
    setShowAddForm(true);
  };

  const handleDeleteVenue = (id) => {
    setVenues(venues.filter((v) => v.id !== id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ name: '', location: '', capacity: '', amenities: '', rate: '' });
  };

  return (
    <main className="venues-page">
      <BackButton />
      <header className="page-header">
        <h1 className="page-title">Venues</h1>
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          + Add Venue
        </button>
      </header>

      <div className="page-content">
        {showAddForm && (
          <div className="form-card">
            <h2>{editingId ? 'Edit Venue' : 'Add New Venue'}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Venue Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Downtown Convention Center"
                />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Downtown"
                />
              </div>
              <div className="form-group">
                <label>Capacity *</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
                />
              </div>
              <div className="form-group">
                <label>Hourly Rate *</label>
                <input
                  type="text"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  placeholder="e.g., $50/hour"
                />
              </div>
              <div className="form-group full-width">
                <label>Amenities (comma-separated)</label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  placeholder="e.g., WiFi, Parking, Catering"
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleAddVenue}>
                {editingId ? 'Update Venue' : 'Add Venue'}
              </button>
            </div>
          </div>
        )}

        <div className="venues-grid">
          {venues.map((venue) => (
            <div key={venue.id} className="venue-card">
              <div className="venue-header">
                <h3 className="venue-name">{venue.name}</h3>
                <span className={`availability-badge ${venue.available ? 'available' : 'unavailable'}`}>
                  {venue.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <p className="venue-location">📍 {venue.location}</p>
              <p className="venue-capacity">👥 Capacity: {venue.capacity} people</p>
              <p className="venue-rate">💰 {venue.rate}</p>
              <div className="amenities">
                <h4>Amenities:</h4>
                <div className="amenity-tags">
                  {venue.amenities.map((amenity, idx) => (
                    <span key={idx} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div className="venue-actions">
                <button className="btn-edit" onClick={() => handleEditVenue(venue)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDeleteVenue(venue.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Venues;
