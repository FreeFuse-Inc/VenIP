import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
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
      image: 'https://images.pexels.com/photos/2833037/pexels-photo-2833037.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      name: 'Grand Hotel Ballroom',
      location: 'Uptown',
      capacity: 500,
      amenities: ['WiFi', 'Catering', 'Decorations'],
      rate: '$75/hour',
      available: true,
      image: 'https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      reviews: 89,
    },
    {
      id: 3,
      name: 'Central Park Pavilion',
      location: 'Central Park',
      capacity: 300,
      amenities: ['Tables', 'Chairs', 'Lighting'],
      rate: '$30/hour',
      available: false,
      image: 'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.5,
      reviews: 67,
    },
    {
      id: 4,
      name: 'Skyline Rooftop Terrace',
      location: 'Financial District',
      capacity: 200,
      amenities: ['WiFi', 'Bar', 'Lighting', 'Sound System'],
      rate: '$120/hour',
      available: true,
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      reviews: 156,
    },
    {
      id: 5,
      name: 'Historic Manor Estate',
      location: 'Westside',
      capacity: 400,
      amenities: ['Gardens', 'Parking', 'Catering', 'Bridal Suite'],
      rate: '$95/hour',
      available: true,
      image: 'https://images.pexels.com/photos/1045541/pexels-photo-1045541.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      reviews: 203,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    amenities: '',
    rate: '',
  });
  const [editingId, setEditingId] = useState(null);

  const filterTabs = ['All', 'Available', 'Unavailable'];

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || 
                         (filterStatus === 'Available' && venue.available) ||
                         (filterStatus === 'Unavailable' && !venue.available);
    return matchesSearch && matchesFilter;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVenue = () => {
    if (formData.name && formData.location && formData.capacity && formData.rate) {
      const venueImages = [
        'https://images.pexels.com/photos/260689/pexels-photo-260689.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
      ];
      
      const newVenue = {
        id: editingId || Date.now(),
        name: formData.name,
        location: formData.location,
        capacity: parseInt(formData.capacity),
        amenities: formData.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        rate: formData.rate,
        available: true,
        image: venueImages[Math.floor(Math.random() * venueImages.length)],
        rating: (Math.random() * 0.5 + 4.5).toFixed(1),
        reviews: Math.floor(Math.random() * 100 + 20),
      };

      if (editingId) {
        setVenues(venues.map((v) => (v.id === editingId ? { ...v, ...newVenue } : v)));
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

  const handleDeleteVenue = (id, e) => {
    e.stopPropagation();
    setVenues(venues.filter((v) => v.id !== id));
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ name: '', location: '', capacity: '', amenities: '', rate: '' });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    if (rating % 1 >= 0.5) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    return stars;
  };

  return (
    <main className="venues-page">
      <BackButton />
      <PageHeader
        title="Venues"
        showBack={false}
        actions={
          <button className="add-venue-btn" onClick={() => setShowAddForm(true)}>
            <span className="add-icon">+</span>
            Add Venue
          </button>
        }
      />

      <div className="venues-content">
        <div className="venues-controls">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search venues by name or location..."
          />
          
          <FilterTabs 
            tabs={filterTabs}
            activeTab={filterStatus}
            onChange={setFilterStatus}
          />
        </div>

        {showAddForm && (
          <div className="venue-form-overlay">
            <div className="venue-form-modal">
              <div className="form-modal-header">
                <h2>{editingId ? 'Edit Venue' : 'Add New Venue'}</h2>
                <button className="close-form-btn" onClick={handleCancel}>✕</button>
              </div>
              <div className="form-modal-body">
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
              </div>
              <div className="form-modal-actions">
                <button className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn-save" onClick={handleAddVenue}>
                  {editingId ? 'Update Venue' : 'Add Venue'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="venues-stats">
          <div className="stat-pill">
            <span className="stat-number">{venues.length}</span>
            <span className="stat-label">Total Venues</span>
          </div>
          <div className="stat-pill available">
            <span className="stat-number">{venues.filter(v => v.available).length}</span>
            <span className="stat-label">Available</span>
          </div>
          <div className="stat-pill booked">
            <span className="stat-number">{venues.filter(v => !v.available).length}</span>
            <span className="stat-label">Booked</span>
          </div>
        </div>

        <div className="venues-grid">
          {filteredVenues.length > 0 ? (
            filteredVenues.map((venue) => (
              <div 
                key={venue.id} 
                className="venue-card"
                onClick={() => handleEditVenue(venue)}
              >
                <div className="venue-image-wrapper">
                  <img 
                    src={venue.image} 
                    alt={venue.name}
                    className="venue-image"
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/260689/pexels-photo-260689.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                  />
                  <div className="venue-image-overlay"></div>
                  <span className={`venue-status-badge ${venue.available ? 'available' : 'unavailable'}`}>
                    {venue.available ? 'Available' : 'Booked'}
                  </span>
                  <div className="venue-rate-badge">
                    {venue.rate}
                  </div>
                </div>

                <div className="venue-card-content">
                  <div className="venue-card-header">
                    <h3 className="venue-card-title">{venue.name}</h3>
                    <div className="venue-rating">
                      <div className="stars">{renderStars(venue.rating)}</div>
                      <span className="rating-value">{venue.rating}</span>
                      <span className="review-count">({venue.reviews})</span>
                    </div>
                  </div>

                  <div className="venue-card-details">
                    <div className="venue-detail-item">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">{venue.location}</span>
                    </div>
                    <div className="venue-detail-item">
                      <span className="detail-icon">👥</span>
                      <span className="detail-text">Up to {venue.capacity} guests</span>
                    </div>
                  </div>

                  <div className="venue-amenities">
                    {venue.amenities.slice(0, 4).map((amenity, idx) => (
                      <span key={idx} className="amenity-chip">
                        {amenity}
                      </span>
                    ))}
                    {venue.amenities.length > 4 && (
                      <span className="amenity-chip more">
                        +{venue.amenities.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="venue-card-actions">
                    <button 
                      className="btn-venue-edit"
                      onClick={(e) => { e.stopPropagation(); handleEditVenue(venue); }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-venue-delete"
                      onClick={(e) => handleDeleteVenue(venue.id, e)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-venues">
              <div className="no-venues-icon">🏛️</div>
              <h3>No venues found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Venues;
