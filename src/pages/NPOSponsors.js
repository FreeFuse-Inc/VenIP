import React, { useContext, useState, useMemo } from 'react';
import BackButton from '../components/BackButton';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import { EventContext } from '../context/EventContext';
import { UserContext } from '../context/UserContext';
import { RoleContext } from '../context/RoleContext';
import '../styles/NPOSponsors.css';

const NPOSponsors = () => {
  const {
    createSponsor,
    updateSponsor,
    deleteSponsor,
    getNPOSponsorCompanies,
    getAvailableSponsorCompanies,
  } = useContext(EventContext);
  const { user } = useContext(UserContext);
  const { setUserRole } = useContext(RoleContext);

  React.useEffect(() => {
    setUserRole('npo');
  }, [setUserRole]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Your Partners');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const tabs = ['Your Partners', 'Available Sponsors'];
  const filterTabs = ['All', 'Active', 'Pending'];

  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    contactPerson: '',
    email: '',
    sponsorshipLevel: 'Gold',
    investment: '',
    benefits: '',
    image: '',
  });

  const npoSponsors = useMemo(() => {
    return getNPOSponsorCompanies(user?.id || 'npo');
  }, [getNPOSponsorCompanies, user?.id]);

  const availableSponsors = useMemo(() => {
    return getAvailableSponsorCompanies(user?.id || 'npo');
  }, [getAvailableSponsorCompanies, user?.id]);

  const filteredNPOSponsors = useMemo(() => {
    return npoSponsors.filter(sponsor => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        sponsor.companyName.toLowerCase().includes(query) ||
        sponsor.industry.toLowerCase().includes(query) ||
        (sponsor.contactPerson || '').toLowerCase().includes(query);
      const matchesFilter =
        filterStatus === 'All' ||
        sponsor.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [npoSponsors, searchQuery, filterStatus]);

  const filteredAvailableSponsors = useMemo(() => {
    return availableSponsors.filter(sponsor => {
      const query = searchQuery.toLowerCase();
      return (
        sponsor.companyName.toLowerCase().includes(query) ||
        sponsor.industry.toLowerCase().includes(query)
      );
    });
  }, [availableSponsors, searchQuery]);

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

  const handleSubmitSponsor = () => {
    if (formData.companyName && formData.industry && formData.investment) {
      const sponsorImages = [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop',
      ];

      const sponsorData = {
        companyName: formData.companyName,
        industry: formData.industry,
        contactPerson: formData.contactPerson,
        email: formData.email,
        sponsorshipLevel: formData.sponsorshipLevel,
        investment: formData.investment,
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(Boolean),
        image: formData.image || sponsorImages[Math.floor(Math.random() * sponsorImages.length)],
        status: 'Active',
        available: false,
      };

      if (editingSponsor) {
        updateSponsor(editingSponsor.id, sponsorData);
      } else {
        createSponsor(sponsorData, user?.id || 'npo');
      }

      handleCancelForm();
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleEditSponsor = (sponsor) => {
    setEditingSponsor(sponsor);
    setFormData({
      companyName: sponsor.companyName,
      industry: sponsor.industry,
      contactPerson: sponsor.contactPerson || '',
      email: sponsor.email || '',
      sponsorshipLevel: sponsor.sponsorshipLevel,
      investment: sponsor.investment,
      benefits: (sponsor.benefits || []).join(', '),
      image: sponsor.image,
    });
    setImagePreview(sponsor.image);
    setShowAddForm(true);
  };

  const handleDeleteSponsor = (id) => {
    deleteSponsor(id);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingSponsor(null);
    setFormData({
      companyName: '',
      industry: '',
      contactPerson: '',
      email: '',
      sponsorshipLevel: 'Gold',
      investment: '',
      benefits: '',
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

  const getStatusBadgeClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'active') return 'active';
    if (s === 'pending') return 'pending';
    if (s === 'available') return 'available';
    return 'inactive';
  };

  const displayedSponsors = activeTab === 'Your Partners' ? filteredNPOSponsors : filteredAvailableSponsors;

  return (
    <main className="npo-sponsors-page">
      <BackButton />
      <PageHeader
        title="Sponsors & Partnerships"
        subtitle="Manage your partnerships and discover new sponsorship opportunities"
        actions={activeTab === 'Your Partners' ? (
          <button className="add-sponsor-btn" onClick={() => setShowAddForm(true)}>
            <span className="add-icon">+</span>
            Add Sponsor
          </button>
        ) : null}
      />

      <div className="sponsors-page-content">
        {/* Stats Pills */}
        <div className="sponsors-stats">
          <div className="stat-pill">
            <span className="stat-pill-value">{npoSponsors.length}</span>
            <span className="stat-pill-label">Total Sponsors</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-value">{npoSponsors.filter(s => s.status === 'Active').length}</span>
            <span className="stat-pill-label">Active</span>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-value">{availableSponsors.length}</span>
            <span className="stat-pill-label">Available</span>
          </div>
        </div>

        {/* Controls */}
        <div className="sponsors-controls">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search sponsors by name, industry..."
          />
          <FilterTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
          {activeTab === 'Your Partners' && (
            <FilterTabs
              tabs={filterTabs}
              activeTab={filterStatus}
              onChange={setFilterStatus}
            />
          )}
        </div>

        {/* Add/Edit Sponsor Modal */}
        {showAddForm && (
          <div className="sponsor-form-overlay">
            <div className="sponsor-form-modal">
              <div className="form-modal-header">
                <h2>{editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}</h2>
                <button className="close-form-btn" onClick={handleCancelForm}>✕</button>
              </div>
              <div className="form-modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Company Name *</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="e.g., Acme Corporation"
                    />
                  </div>
                  <div className="form-group">
                    <label>Industry *</label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      placeholder="e.g., Technology"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Person</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      placeholder="e.g., John Smith"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g., john@acme.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Sponsorship Level</label>
                    <select
                      name="sponsorshipLevel"
                      value={formData.sponsorshipLevel}
                      onChange={handleInputChange}
                    >
                      <option value="Platinum">Platinum</option>
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="Bronze">Bronze</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Investment Amount *</label>
                    <input
                      type="text"
                      name="investment"
                      value={formData.investment}
                      onChange={handleInputChange}
                      placeholder="e.g., $5,000"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Benefits (comma-separated)</label>
                    <input
                      type="text"
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleInputChange}
                      placeholder="e.g., Logo Placement, VIP Access, Social Media"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Company Photo</label>
                    <div className="image-upload-area">
                      {imagePreview ? (
                        <div className="image-preview-container">
                          <img
                            src={imagePreview}
                            alt="Sponsor preview"
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
                          <span className="upload-text">Click to upload company photo</span>
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
                <button className="btn-save" onClick={handleSubmitSponsor}>
                  {editingSponsor ? 'Update Sponsor' : 'Add Sponsor'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sponsors Grid */}
        <div className="sponsors-grid-section">
          {displayedSponsors.length > 0 ? (
            <div className="sponsors-grid">
              {displayedSponsors.map((sponsor, index) => (
                <div
                  key={sponsor.id}
                  className="sponsor-card"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  {/* Image Section */}
                  <div className="sponsor-image-wrapper">
                    <img
                      src={sponsor.image}
                      alt={sponsor.companyName}
                      className="sponsor-card-image"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop';
                      }}
                    />
                    <div className="sponsor-image-overlay"></div>
                    <span className={`sponsor-status-badge ${getStatusBadgeClass(sponsor.status)}`}>
                      {sponsor.status}
                    </span>
                    <div className="sponsor-investment-badge">
                      {sponsor.investment}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="sponsor-card-content">
                    <div className="sponsor-card-header">
                      <div className="sponsor-title-section">
                        <h4 className="sponsor-card-title">{sponsor.companyName}</h4>
                        {sponsor.rating && (
                          <div className="sponsor-rating">
                            <div className="sponsor-rating-stars">{renderStars(sponsor.rating)}</div>
                            <span className="sponsor-rating-value">{sponsor.rating}</span>
                            <span className="sponsor-review-count">({sponsor.reviews})</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="sponsor-card-details">
                      <div className="sponsor-detail-item">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">{sponsor.industry}</span>
                      </div>
                      <div className="sponsor-detail-item">
                        <span className="detail-icon">👤</span>
                        <span className="detail-text">{sponsor.contactPerson || 'No contact listed'}</span>
                      </div>
                    </div>

                    {sponsor.benefits && sponsor.benefits.length > 0 && (
                      <div className="sponsor-benefits">
                        {sponsor.benefits.slice(0, 3).map((benefit, idx) => (
                          <span key={idx} className="benefit-chip">
                            {benefit}
                          </span>
                        ))}
                        {sponsor.benefits.length > 3 && (
                          <span className="benefit-chip more">
                            +{sponsor.benefits.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="sponsor-card-actions">
                      {activeTab === 'Your Partners' ? (
                        <>
                          <button
                            className="sponsor-action-btn btn-sponsor-edit"
                            onClick={() => handleEditSponsor(sponsor)}
                          >
                            <span className="btn-icon">✎</span>
                            Edit
                          </button>
                          <button
                            className="sponsor-action-btn btn-sponsor-delete"
                            onClick={() => handleDeleteSponsor(sponsor.id)}
                          >
                            <span className="btn-icon">🗑️</span>
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          className="sponsor-action-btn btn-sponsor-connect"
                          onClick={() => alert(`Connection request sent to ${sponsor.companyName}`)}
                        >
                          <span className="btn-icon">🤝</span>
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-sponsors">
              <div className="empty-icon">🏆</div>
              <h3>
                {activeTab === 'Your Partners'
                  ? 'No sponsors yet'
                  : 'No available sponsors'}
              </h3>
              <p>
                {activeTab === 'Your Partners'
                  ? 'Add your first sponsor to start managing partnerships'
                  : 'Check back later for available sponsors'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default NPOSponsors;
