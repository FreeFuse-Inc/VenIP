import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import '../styles/Vendors.css';

const Vendors = () => {
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: 'BrightEvents',
      category: 'Event Planning',
      rating: 4.8,
      reviews: 128,
      phone: '(555) 123-4567',
      email: 'contact@brightevents.com',
      services: ['Event Planning', 'Coordination', 'Décor'],
      status: 'Active',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
    },
    {
      id: 2,
      name: 'Catering Pros',
      category: 'Catering',
      rating: 4.6,
      reviews: 95,
      phone: '(555) 234-5678',
      email: 'info@cateringpros.com',
      services: ['Catering', 'Menu Planning', 'Bar Service'],
      status: 'Active',
      image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
    },
    {
      id: 3,
      name: 'Fresh Floral',
      category: 'Decorations',
      rating: 4.9,
      reviews: 156,
      phone: '(555) 345-6789',
      email: 'hello@freshfloral.com',
      services: ['Floral Arrangements', 'Décor Design', 'Setup'],
      status: 'Active',
      image: 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
    },
    {
      id: 4,
      name: 'Harmony Music',
      category: 'Entertainment',
      rating: 4.7,
      reviews: 82,
      phone: '(555) 456-7890',
      email: 'booking@harmonymusic.com',
      services: ['DJ Services', 'Live Band', 'Sound System'],
      status: 'Active',
      image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: false,
    },
    {
      id: 5,
      name: 'Premier Photography',
      category: 'Photography',
      rating: 4.9,
      reviews: 210,
      phone: '(555) 567-8901',
      email: 'book@premierphotography.com',
      services: ['Event Photography', 'Videography', 'Photo Booth'],
      status: 'Active',
      image: 'https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=800',
      featured: true,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    phone: '',
    email: '',
    services: '',
    image: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const filterTabs = ['All', 'Event Planning', 'Catering', 'Decorations', 'Entertainment', 'Photography'];

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterCategory === 'All' || vendor.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  const handleAddVendor = () => {
    if (formData.name && formData.category && formData.phone && formData.email) {
      const defaultImages = [
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      ];

      const newVendor = {
        id: editingId || Date.now(),
        name: formData.name,
        category: formData.category,
        phone: formData.phone,
        email: formData.email,
        services: formData.services.split(',').map((s) => s.trim()).filter(Boolean),
        rating: editingId ? vendors.find((v) => v.id === editingId).rating : 5.0,
        reviews: editingId ? vendors.find((v) => v.id === editingId).reviews : 0,
        status: 'Active',
        image: formData.image || defaultImages[Math.floor(Math.random() * defaultImages.length)],
        featured: false,
      };

      if (editingId) {
        setVendors(vendors.map((v) => (v.id === editingId ? newVendor : v)));
        setEditingId(null);
      } else {
        setVendors([...vendors, newVendor]);
      }

      setFormData({ name: '', category: '', phone: '', email: '', services: '', image: '' });
      setImagePreview(null);
      setShowAddForm(false);
    }
  };

  const handleEditVendor = (vendor) => {
    setFormData({
      name: vendor.name,
      category: vendor.category,
      phone: vendor.phone,
      email: vendor.email,
      services: vendor.services.join(', '),
      image: vendor.image,
    });
    setImagePreview(vendor.image);
    setEditingId(vendor.id);
    setSelectedVendor(null);
    setShowAddForm(true);
  };

  const handleDeleteVendor = (id, e) => {
    if (e) e.stopPropagation();
    setVendors(vendors.filter((v) => v.id !== id));
    setSelectedVendor(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ name: '', category: '', phone: '', email: '', services: '', image: '' });
    setImagePreview(null);
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

  const getCategoryIcon = (category) => {
    const icons = {
      'Event Planning': '📋',
      'Catering': '🍽️',
      'Decorations': '🌸',
      'Entertainment': '🎵',
      'Photography': '📸',
    };
    return icons[category] || '⭐';
  };

  return (
    <main className="vendors-page">
      <BackButton />
      <PageHeader
        title="Vendors"
        showBack={false}
        actions={
          <button className="add-vendor-btn" onClick={() => setShowAddForm(true)}>
            <span className="add-icon">+</span>
            Add Vendor
          </button>
        }
      />

      <div className="vendors-content">
        <div className="vendors-controls">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search vendors by name, category, or services..."
          />
          
          <FilterTabs 
            tabs={filterTabs}
            activeTab={filterCategory}
            onChange={setFilterCategory}
          />
        </div>

        <div className="vendors-stats">
          <div className="stat-pill">
            <span className="stat-number">{vendors.length}</span>
            <span className="stat-label">Total Vendors</span>
          </div>
          <div className="stat-pill active">
            <span className="stat-number">{vendors.filter(v => v.status === 'Active').length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-pill featured">
            <span className="stat-number">{vendors.filter(v => v.featured).length}</span>
            <span className="stat-label">Featured</span>
          </div>
          <div className="stat-pill rating">
            <span className="stat-number">{(vendors.reduce((acc, v) => acc + v.rating, 0) / vendors.length).toFixed(1)}</span>
            <span className="stat-label">Avg Rating</span>
          </div>
        </div>

        {showAddForm && (
          <div className="vendor-form-overlay">
            <div className="vendor-form-modal">
              <div className="form-modal-header">
                <h2>{editingId ? 'Edit Vendor' : 'Add New Vendor'}</h2>
                <button className="close-form-btn" onClick={handleCancel}>✕</button>
              </div>
              <div className="form-modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Vendor Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., BrightEvents"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}>
                      <option value="">Select Category</option>
                      <option value="Catering">Catering</option>
                      <option value="Decorations">Decorations</option>
                      <option value="Photography">Photography</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Event Planning">Event Planning</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="contact@vendor.com"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Services (comma-separated)</label>
                    <input
                      type="text"
                      name="services"
                      value={formData.services}
                      onChange={handleInputChange}
                      placeholder="e.g., Service 1, Service 2, Service 3"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Vendor Photo</label>
                    <div className="image-upload-area">
                      {imagePreview ? (
                        <div className="image-preview-container">
                          <img
                            src={imagePreview}
                            alt="Vendor preview"
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
                          <span className="upload-text">Click to upload vendor photo</span>
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
                <button className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn-save" onClick={handleAddVendor}>
                  {editingId ? 'Update Vendor' : 'Add Vendor'}
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedVendor ? (
          <div className="vendor-detail-overlay">
            <div className="vendor-detail-modal">
              <button className="close-detail-btn" onClick={() => setSelectedVendor(null)}>✕</button>
              
              <div className="vendor-detail-hero">
                <img 
                  src={selectedVendor.image} 
                  alt={selectedVendor.name}
                  className="vendor-detail-image"
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
                <div className="vendor-detail-hero-overlay"></div>
                <div className="vendor-detail-hero-content">
                  <span className="vendor-category-badge">{getCategoryIcon(selectedVendor.category)} {selectedVendor.category}</span>
                  <h2 className="vendor-detail-name">{selectedVendor.name}</h2>
                  <div className="vendor-detail-rating">
                    <div className="stars">{renderStars(selectedVendor.rating)}</div>
                    <span className="rating-value">{selectedVendor.rating}</span>
                    <span className="review-count">({selectedVendor.reviews} reviews)</span>
                  </div>
                </div>
                {selectedVendor.featured && (
                  <span className="featured-badge">⭐ Featured</span>
                )}
              </div>

              <div className="vendor-detail-body">
                <div className="vendor-detail-section">
                  <h3>Contact Information</h3>
                  <div className="contact-grid">
                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      <div className="contact-info">
                        <span className="contact-label">Phone</span>
                        <span className="contact-value">{selectedVendor.phone}</span>
                      </div>
                    </div>
                    <div className="contact-item">
                      <span className="contact-icon">📧</span>
                      <div className="contact-info">
                        <span className="contact-label">Email</span>
                        <span className="contact-value">{selectedVendor.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="vendor-detail-section">
                  <h3>Services Offered</h3>
                  <div className="services-list">
                    {selectedVendor.services.map((service, idx) => (
                      <span key={idx} className="service-chip">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="vendor-detail-actions">
                  <button className="btn-vendor-edit" onClick={() => handleEditVendor(selectedVendor)}>
                    ✏️ Edit Vendor
                  </button>
                  <button className="btn-vendor-delete" onClick={() => handleDeleteVendor(selectedVendor.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="vendors-grid">
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="vendor-card"
                  onClick={() => setSelectedVendor(vendor)}
                >
                  <div className="vendor-image-wrapper">
                    <img 
                      src={vendor.image} 
                      alt={vendor.name}
                      className="vendor-image"
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800';
                      }}
                    />
                    <div className="vendor-image-overlay"></div>
                    <span className="vendor-category-badge">
                      {getCategoryIcon(vendor.category)} {vendor.category}
                    </span>
                    {vendor.featured && (
                      <span className="vendor-featured-badge">⭐ Featured</span>
                    )}
                  </div>

                  <div className="vendor-card-content">
                    <div className="vendor-card-header">
                      <h3 className="vendor-card-title">{vendor.name}</h3>
                      <div className="vendor-rating">
                        <div className="stars">{renderStars(vendor.rating)}</div>
                        <span className="rating-value">{vendor.rating}</span>
                        <span className="review-count">({vendor.reviews})</span>
                      </div>
                    </div>

                    <div className="vendor-services">
                      {vendor.services.slice(0, 3).map((service, idx) => (
                        <span key={idx} className="service-badge">
                          {service}
                        </span>
                      ))}
                      {vendor.services.length > 3 && (
                        <span className="service-badge more">+{vendor.services.length - 3}</span>
                      )}
                    </div>

                    <div className="vendor-contact-info">
                      <div className="contact-row">
                        <span className="contact-icon">📞</span>
                        <span className="contact-text">{vendor.phone}</span>
                      </div>
                      <div className="contact-row">
                        <span className="contact-icon">📧</span>
                        <span className="contact-text">{vendor.email}</span>
                      </div>
                    </div>

                    <div className="vendor-card-actions">
                      <button 
                        className="btn-card-edit"
                        onClick={(e) => { e.stopPropagation(); handleEditVendor(vendor); }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-card-delete"
                        onClick={(e) => handleDeleteVendor(vendor.id, e)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-vendors">
                <div className="no-vendors-icon">🏢</div>
                <h3>No vendors found</h3>
                <p>Try adjusting your search or filters</p>
                <button className="add-vendor-empty-btn" onClick={() => setShowAddForm(true)}>
                  + Add Your First Vendor
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Vendors;
