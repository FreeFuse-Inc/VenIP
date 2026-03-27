import React, { useContext, useState, useMemo } from 'react';
import BackButton from '../components/BackButton';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import { EventContext } from '../context/EventContext';
import { RoleContext } from '../context/RoleContext';
import '../styles/VendorServices.css';

const VendorServices = () => {
  const {
    createVendorService,
    updateVendorService,
    deleteVendorService,
    getVendorServices,
  } = useContext(EventContext);
  const { setUserRole } = useContext(RoleContext);

  React.useEffect(() => {
    setUserRole('vendor');
  }, [setUserRole]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = ['All', 'Catering', 'Entertainment', 'Photography', 'Décor', 'Coordination', 'AV/Sound'];

  const [formData, setFormData] = useState({
    serviceName: '',
    category: 'Catering',
    description: '',
    priceRange: '',
    basePrice: '',
    features: '',
    availability: 'Available',
    image: '',
  });

  const allServices = useMemo(() => {
    return getVendorServices('vendor');
  }, [getVendorServices]);

  const filteredServices = useMemo(() => {
    return allServices.filter(service => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        service.serviceName.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query);
      const matchesCategory =
        activeCategory === 'All' || service.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allServices, searchQuery, activeCategory]);

  const availableCount = allServices.filter(s => s.availability === 'Available').length;
  const avgRating = allServices.length > 0
    ? (allServices.reduce((sum, s) => sum + (s.rating || 0), 0) / allServices.length).toFixed(1)
    : '0.0';
  const totalReviews = allServices.reduce((sum, s) => sum + (s.reviews || 0), 0);

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

  const handleSubmitService = () => {
    if (formData.serviceName && formData.category && formData.priceRange) {
      const serviceImages = [
        'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=500&h=300&fit=crop',
      ];

      const serviceData = {
        serviceName: formData.serviceName,
        category: formData.category,
        description: formData.description,
        priceRange: formData.priceRange,
        basePrice: parseInt(formData.basePrice) || 0,
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
        availability: formData.availability,
        image: formData.image || serviceImages[Math.floor(Math.random() * serviceImages.length)],
      };

      if (editingService) {
        updateVendorService(editingService.id, serviceData);
      } else {
        createVendorService(serviceData, 'vendor');
      }

      handleCancelForm();
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setFormData({
      serviceName: service.serviceName,
      category: service.category,
      description: service.description || '',
      priceRange: service.priceRange || '',
      basePrice: service.basePrice ? service.basePrice.toString() : '',
      features: (service.features || []).join(', '),
      availability: service.availability || 'Available',
      image: service.image,
    });
    setImagePreview(service.image);
    setShowAddForm(true);
  };

  const handleDeleteService = (id) => {
    deleteVendorService(id);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingService(null);
    setFormData({
      serviceName: '',
      category: 'Catering',
      description: '',
      priceRange: '',
      basePrice: '',
      features: '',
      availability: 'Available',
      image: '',
    });
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

  return (
    <main className="vendor-services-page">
      <BackButton />
      <PageHeader
        title="My Services"
        subtitle="Manage your service offerings and showcase what you provide"
        actions={
          <button className="add-service-btn" onClick={() => setShowAddForm(true)}>
            <span className="add-icon">+</span>
            Add Service
          </button>
        }
      />

      <div className="services-page-content">
        {/* Stats Pills */}
        <div className="services-stats">
          <div className="stat-pill">
            <span className="stat-pill-value">{allServices.length}</span>
            <span className="stat-pill-label">Total Services</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-value">{availableCount}</span>
            <span className="stat-pill-label">Available</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-value">⭐ {avgRating}</span>
            <span className="stat-pill-label">Avg Rating</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-value">{totalReviews}</span>
            <span className="stat-pill-label">Total Reviews</span>
          </div>
        </div>

        {/* Controls */}
        <div className="services-controls">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search services by name, category..."
          />
          <FilterTabs
            tabs={categories}
            activeTab={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        {/* Add/Edit Service Modal */}
        {showAddForm && (
          <div className="service-form-overlay">
            <div className="service-form-modal">
              <div className="form-modal-header">
                <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                <button className="close-form-btn" onClick={handleCancelForm}>✕</button>
              </div>
              <div className="form-modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Service Name *</label>
                    <input
                      type="text"
                      name="serviceName"
                      value={formData.serviceName}
                      onChange={handleInputChange}
                      placeholder="e.g., Premium Catering Package"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="Catering">Catering</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Photography">Photography</option>
                      <option value="Décor">Décor</option>
                      <option value="Coordination">Coordination</option>
                      <option value="AV/Sound">AV/Sound</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price Range *</label>
                    <input
                      type="text"
                      name="priceRange"
                      value={formData.priceRange}
                      onChange={handleInputChange}
                      placeholder="e.g., $2,000 - $8,000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Base Price</label>
                    <input
                      type="number"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleInputChange}
                      placeholder="e.g., 2000"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your service offering..."
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Features (comma-separated)</label>
                    <input
                      type="text"
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      placeholder="e.g., Menu Customization, Wait Staff"
                    />
                  </div>
                  <div className="form-group">
                    <label>Availability</label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                    >
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Service Photo</label>
                    <div className="image-upload-area">
                      {imagePreview ? (
                        <div className="image-preview-container">
                          <img
                            src={imagePreview}
                            alt="Service preview"
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
                          <span className="upload-text">Click to upload service photo</span>
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
                <button className="btn-save" onClick={handleSubmitService}>
                  {editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="services-grid-section">
          {filteredServices.length > 0 ? (
            <div className="services-grid">
              {filteredServices.map((service, index) => (
                <div
                  key={service.id}
                  className="service-card"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  {/* Image Section */}
                  <div className="service-image-wrapper">
                    <img
                      src={service.image}
                      alt={service.serviceName}
                      className="service-card-image"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&h=300&fit=crop';
                      }}
                    />
                    <div className="service-image-overlay"></div>
                    <span className="service-category-badge">
                      {service.category}
                    </span>
                    <span className={`service-availability-badge ${service.availability === 'Available' ? 'available' : 'unavailable'}`}>
                      {service.availability}
                    </span>
                    <div className="service-price-badge">
                      {service.priceRange}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="service-card-content">
                    <div className="service-card-header">
                      <h4 className="service-card-title">{service.serviceName}</h4>
                      {service.rating && (
                        <div className="service-rating">
                          <div className="service-rating-stars">{renderStars(service.rating)}</div>
                          <span className="service-rating-value">{service.rating}</span>
                          <span className="service-review-count">({service.reviews})</span>
                        </div>
                      )}
                    </div>

                    <p className="service-description">{service.description}</p>

                    {service.features && service.features.length > 0 && (
                      <div className="service-features">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="feature-chip">
                            {feature}
                          </span>
                        ))}
                        {service.features.length > 3 && (
                          <span className="feature-chip more">
                            +{service.features.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="service-card-actions">
                      <button
                        className="service-action-btn btn-service-edit"
                        onClick={() => handleEditService(service)}
                      >
                        <span className="btn-icon">✎</span>
                        Edit
                      </button>
                      <button
                        className="service-action-btn btn-service-delete"
                        onClick={() => handleDeleteService(service.id)}
                      >
                        <span className="btn-icon">🗑️</span>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-services">
              <div className="empty-icon">🛠️</div>
              <h3>No services found</h3>
              <p>
                {searchQuery || activeCategory !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'Add your first service to start showcasing your offerings'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default VendorServices;
