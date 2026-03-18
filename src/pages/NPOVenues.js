import React, { useContext, useState, useMemo } from 'react';
import BackButton from '../components/BackButton';
import PageHeader from '../components/PageHeader';
import VenueCard from '../components/VenueCard';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import { EventContext } from '../context/EventContext';
import { UserContext } from '../context/UserContext';
import { RoleContext } from '../context/RoleContext';
import '../styles/NPOVenues.css';

const NPOVenues = () => {
  const { createVenue, updateVenue, deleteVenue, getNPOVenues, getAvailableVenues } = useContext(EventContext);
  const { user } = useContext(UserContext);
  const { setUserRole } = useContext(RoleContext);

  // Set user role when page loads
  React.useEffect(() => {
    setUserRole('npo');
  }, [setUserRole]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('My Venues');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [imagePreview, setImagePreview] = useState(null);

  const tabs = ['My Venues', 'Available to Book'];
  const filterTabs = ['All', 'Available', 'Booked'];

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    amenities: '',
    rate: '',
    image: '',
  });

  // Get NPO's venues and available venues
  const npoVenues = useMemo(() => {
    return getNPOVenues(user?.id || 'npo');
  }, [getNPOVenues, user?.id]);

  const availableVenuesToBook = useMemo(() => {
    return getAvailableVenues(user?.id || 'npo');
  }, [getAvailableVenues, user?.id]);

  // Filter venues based on search and filters
  const filteredNPOVenues = useMemo(() => {
    return npoVenues.filter(venue => {
      const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           venue.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'All' ||
                           (filterStatus === 'Available' && venue.available) ||
                           (filterStatus === 'Booked' && !venue.available);
      return matchesSearch && matchesFilter;
    });
  }, [npoVenues, searchQuery, filterStatus]);

  const filteredAvailableVenues = useMemo(() => {
    return availableVenuesToBook.filter(venue => {
      const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           venue.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'All' ||
                           (filterStatus === 'Available' && venue.available) ||
                           (filterStatus === 'Booked' && !venue.available);
      return matchesSearch && matchesFilter;
    });
  }, [availableVenuesToBook, searchQuery, filterStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleAddVenue = () => {
    if (formData.name && formData.location && formData.capacity && formData.rate) {
      const venueImages = [
        'https://images.unsplash.com/photo-1519167758993-c8585aa81ead?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
      ];

      const venueData = {
        name: formData.name,
        location: formData.location,
        capacity: parseInt(formData.capacity),
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
        rate: formData.rate,
        image: formData.image || venueImages[Math.floor(Math.random() * venueImages.length)],
        available: true,
      };

      if (editingVenue) {
        updateVenue(editingVenue.id, venueData);
      } else {
        createVenue(venueData, user?.id || 'npo');
      }

      handleCancelForm();
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleEditVenue = (venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      location: venue.location,
      capacity: venue.capacity.toString(),
      amenities: venue.amenities.join(', '),
      rate: venue.rate,
      image: venue.image,
    });
    setImagePreview(venue.image);
    setShowAddForm(true);
  };

  const handleDeleteVenue = (id) => {
    // Delete venue without confirmation
    deleteVenue(id);
  };

  const handleBookVenue = (venue) => {
    alert(`Booking request sent for ${venue.name}`);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingVenue(null);
    setFormData({
      name: '',
      location: '',
      capacity: '',
      amenities: '',
      rate: '',
      image: '',
    });
    setImagePreview(null);
  };

  const displayedVenues = activeTab === 'My Venues' ? filteredNPOVenues : filteredAvailableVenues;

  return (
    <main className="npo-venues-page">
      <BackButton />
      <PageHeader
        title="Venues & Bookings"
        subtitle="Manage your venues and discover booking opportunities"
        actions={activeTab === 'My Venues' ? (
          <button className="add-venue-btn" onClick={() => setShowAddForm(true)}>
            <span className="add-icon">+</span>
            Add Venue
          </button>
        ) : null}
      />

      <div className="venues-page-content">
        {/* Metrics Section */}
        <div className="venues-metrics-section">
          <div className="metric-pill">
            <span className="metric-value">{npoVenues.length}</span>
            <span className="metric-label">Venues Owned</span>
          </div>
          <div className="metric-pill">
            <span className="metric-value">{npoVenues.filter(v => v.available).length}</span>
            <span className="metric-label">Available Now</span>
          </div>
          <div className="metric-pill">
            <span className="metric-value">{availableVenuesToBook.length}</span>
            <span className="metric-label">Available to Book</span>
          </div>
        </div>

        {/* Controls */}
        <div className="venues-controls">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search venues by name or location..."
          />

          <FilterTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === 'My Venues' && (
            <FilterTabs
              tabs={filterTabs}
              activeTab={filterStatus}
              onChange={setFilterStatus}
            />
          )}
        </div>

        {/* Add/Edit Venue Modal */}
        {showAddForm && (
          <div className="venue-form-overlay">
            <div className="venue-form-modal">
              <div className="form-modal-header">
                <h2>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</h2>
                <button className="close-form-btn" onClick={handleCancelForm}>✕</button>
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
                      placeholder="e.g., Downtown District"
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
                    <label>Rate *</label>
                    <input
                      type="text"
                      name="rate"
                      value={formData.rate}
                      onChange={handleInputChange}
                      placeholder="e.g., $2,500/day"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Amenities (comma-separated)</label>
                    <input
                      type="text"
                      name="amenities"
                      value={formData.amenities}
                      onChange={handleInputChange}
                      placeholder="e.g., WiFi, Parking, Catering, AV Equipment"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Venue Photo</label>
                    <div className="image-upload-area">
                      {imagePreview ? (
                        <div className="image-preview-container">
                          <img
                            src={imagePreview}
                            alt="Venue preview"
                            className="image-preview"
                          />
                          <div className="image-preview-actions">
                            <label className="change-image-btn">
                              <span>📷 Change Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden-file-input"
                              />
                            </label>
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={removeImage}
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="upload-placeholder">
                          <div className="upload-icon">📸</div>
                          <span className="upload-text">Click to upload venue photo</span>
                          <span className="upload-hint">JPG, PNG or WebP (max 5MB)</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden-file-input"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-modal-actions">
                <button className="btn-cancel" onClick={handleCancelForm}>
                  Cancel
                </button>
                <button className="btn-save" onClick={handleAddVenue}>
                  {editingVenue ? 'Update Venue' : 'Add Venue'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Venues Grid */}
        <div className="venues-grid-section">
          {displayedVenues.length > 0 ? (
            <div className="venues-grid">
              {displayedVenues.map((venue, index) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  isOwned={activeTab === 'My Venues'}
                  onEdit={() => handleEditVenue(venue)}
                  onDelete={() => handleDeleteVenue(venue.id)}
                  onBook={() => handleBookVenue(venue)}
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state-venues">
              <div className="empty-icon">🏛️</div>
              <h3>
                {activeTab === 'My Venues'
                  ? 'No venues yet'
                  : 'No available venues'}
              </h3>
              <p>
                {activeTab === 'My Venues'
                  ? 'Create your first venue to start managing bookings'
                  : 'Check back later for available venues'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default NPOVenues;
