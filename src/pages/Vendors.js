import React, { useState } from 'react';
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
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    phone: '',
    email: '',
    services: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVendor = () => {
    if (formData.name && formData.category && formData.phone && formData.email) {
      const newVendor = {
        id: editingId || Date.now(),
        name: formData.name,
        category: formData.category,
        phone: formData.phone,
        email: formData.email,
        services: formData.services.split(',').map((s) => s.trim()),
        rating: editingId ? vendors.find((v) => v.id === editingId).rating : 5.0,
        reviews: editingId ? vendors.find((v) => v.id === editingId).reviews : 0,
        status: 'Active',
      };

      if (editingId) {
        setVendors(vendors.map((v) => (v.id === editingId ? newVendor : v)));
        setEditingId(null);
      } else {
        setVendors([...vendors, newVendor]);
      }

      setFormData({ name: '', category: '', phone: '', email: '', services: '' });
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
    });
    setEditingId(vendor.id);
    setShowAddForm(true);
  };

  const handleDeleteVendor = (id) => {
    setVendors(vendors.filter((v) => v.id !== id));
    setSelectedVendor(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ name: '', category: '', phone: '', email: '', services: '' });
  };

  return (
    <main className="vendors-page">
      <header className="page-header">
        <h1 className="page-title">Vendors</h1>
        <button className="add-btn" onClick={() => setShowAddForm(true)}>
          + Add Vendor
        </button>
      </header>

      <div className="page-content">
        {showAddForm && (
          <div className="form-card">
            <h2>{editingId ? 'Edit Vendor' : 'Add New Vendor'}</h2>
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
            </div>
            <div className="form-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleAddVendor}>
                {editingId ? 'Update Vendor' : 'Add Vendor'}
              </button>
            </div>
          </div>
        )}

        {selectedVendor ? (
          <div className="vendor-detail-card">
            <div className="vendor-detail-header">
              <h2>{selectedVendor.name}</h2>
              <span className={`status-badge ${selectedVendor.status.toLowerCase()}`}>
                {selectedVendor.status}
              </span>
            </div>

            <div className="rating-section">
              <div className="rating">
                <span className="stars">{'⭐'.repeat(Math.floor(selectedVendor.rating))}</span>
                <span className="rating-value">{selectedVendor.rating}</span>
                <span className="reviews">({selectedVendor.reviews} reviews)</span>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-section">
                <h3>Contact Information</h3>
                <p>
                  <span className="label">Category:</span> {selectedVendor.category}
                </p>
                <p>
                  <span className="label">Phone:</span> {selectedVendor.phone}
                </p>
                <p>
                  <span className="label">Email:</span> {selectedVendor.email}
                </p>
              </div>

              <div className="detail-section">
                <h3>Services</h3>
                <div className="service-tags">
                  {selectedVendor.services.map((service, idx) => (
                    <span key={idx} className="service-tag">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="vendor-actions">
              <button className="btn-edit" onClick={() => handleEditVendor(selectedVendor)}>
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDeleteVendor(selectedVendor.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="vendors-grid">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="vendor-card"
                onClick={() => setSelectedVendor(vendor)}
              >
                <div className="vendor-card-header">
                  <h3 className="vendor-name">{vendor.name}</h3>
                  <span className="vendor-category">{vendor.category}</span>
                </div>

                <div className="vendor-rating">
                  <span className="stars">{'⭐'.repeat(Math.floor(vendor.rating))}</span>
                  <span className="rating-value">{vendor.rating}</span>
                  <span className="reviews">({vendor.reviews})</span>
                </div>

                <div className="vendor-services">
                  {vendor.services.slice(0, 2).map((service, idx) => (
                    <span key={idx} className="service-badge">
                      {service}
                    </span>
                  ))}
                  {vendor.services.length > 2 && (
                    <span className="service-badge">+{vendor.services.length - 2} more</span>
                  )}
                </div>

                <div className="vendor-contact">
                  <p>📞 {vendor.phone}</p>
                  <p>📧 {vendor.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Vendors;
