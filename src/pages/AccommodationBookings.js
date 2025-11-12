import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AccommodationBookings.css';

const AccommodationBookings = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '2 adults',
  });

  const [hasSearched, setHasSearched] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  const mockAccommodations = [
    {
      id: 1,
      name: 'Modern Downtown Apartment',
      location: 'Downtown - 0.5 km away',
      price: '$156',
      pricePerNight: true,
      rating: 4.85,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      availability: 'Available',
      bedrooms: 2,
      beds: 3,
      bathrooms: 2,
      amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Washer'],
    },
    {
      id: 2,
      name: 'Cozy Studio with City View',
      location: 'Midtown - 1.2 km away',
      price: '$98',
      pricePerNight: true,
      rating: 4.72,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      availability: 'Available',
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'TV', 'Kitchen', 'Parking'],
    },
    {
      id: 3,
      name: 'Luxury Penthouse Suite',
      location: 'Downtown - 0.3 km away',
      price: '$324',
      pricePerNight: true,
      rating: 4.96,
      reviews: 418,
      image: 'https://images.unsplash.com/photo-1631049307038-da0ec89d4d0d?w=400&h=300&fit=crop',
      availability: 'Available',
      bedrooms: 3,
      beds: 4,
      bathrooms: 3,
      amenities: ['WiFi', 'Gym', 'Pool', 'Concierge', 'Kitchen', 'Parking'],
    },
    {
      id: 4,
      name: 'Beach House Beachfront',
      location: 'Beachfront - 2.1 km away',
      price: '$245',
      pricePerNight: true,
      rating: 4.89,
      reviews: 342,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      availability: 'Available',
      bedrooms: 4,
      beds: 5,
      bathrooms: 2,
      amenities: ['WiFi', 'Beach Access', 'Pool', 'Kitchen', 'Hot Tub'],
    },
    {
      id: 5,
      name: 'Charming Victorian Home',
      location: 'Historic District - 0.8 km away',
      price: '$175',
      pricePerNight: true,
      rating: 4.78,
      reviews: 267,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      availability: 'Available',
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
      amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Garden', 'Parking'],
    },
    {
      id: 6,
      name: 'Modern Loft in Arts District',
      location: 'Arts District - 1.5 km away',
      price: '$132',
      pricePerNight: true,
      rating: 4.81,
      reviews: 289,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      availability: 'Available',
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      amenities: ['WiFi', 'Kitchen', 'Rooftop Access', 'Workspace'],
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchParams.destination || !searchParams.checkIn || !searchParams.checkOut) {
      alert('Please fill in destination, check-in, and check-out dates');
      return;
    }

    setHasSearched(true);
    setFilteredResults(mockAccommodations);
  };

  const handleBooking = (accommodation) => {
    navigate('/accommodation-booking-details', {
      state: {
        accommodation,
        searchParams,
      },
    });
  };

  return (
    <main className="accommodation-bookings-page">
      <div className="booking-header">
        <button className="back-btn" onClick={() => navigate('/dashboard/sponsor')}>
          ← Back
        </button>
        <h1 className="page-title">Find Accommodation</h1>
      </div>

      <div className="search-container">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-tabs">
            <button type="button" className="tab-btn active">Hotels</button>
            <button type="button" className="tab-btn">Homes & Apts</button>
            <button type="button" className="tab-btn">Long stays</button>
            <button type="button" className="tab-btn">Flights</button>
            <button type="button" className="tab-btn">Activities</button>
            <button type="button" className="tab-btn">Airport transfer</button>
          </div>

          <div className="search-inputs">
            <div className="search-input-group">
              <label htmlFor="destination">Destination or property</label>
              <input
                type="text"
                id="destination"
                name="destination"
                placeholder="Enter a destination or property"
                value={searchParams.destination}
                onChange={handleInputChange}
              />
            </div>

            <div className="date-inputs-group">
              <div className="date-input">
                <label htmlFor="checkIn">Check In</label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  value={searchParams.checkIn}
                  onChange={handleInputChange}
                />
              </div>

              <div className="date-input">
                <label htmlFor="checkOut">Check Out</label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  value={searchParams.checkOut}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="guests-input">
              <label htmlFor="guests">Guests</label>
              <select
                id="guests"
                name="guests"
                value={searchParams.guests}
                onChange={handleInputChange}
              >
                <option>1 adult</option>
                <option>2 adults</option>
                <option>3 adults</option>
                <option>4 adults</option>
                <option>5+ adults</option>
                <option>1 adult, 1 child</option>
                <option>2 adults, 1 child</option>
                <option>2 adults, 2 children</option>
              </select>
            </div>
          </div>

          <button type="submit" className="search-btn">
            SEARCH
          </button>
        </form>
      </div>

      {hasSearched && (
        <div className="results-container">
          <div className="results-header">
            <h2>Available Accommodations</h2>
            <p className="results-count">{filteredResults.length} properties found</p>
          </div>

          <div className="accommodations-grid">
            {filteredResults.map((accommodation) => (
              <div key={accommodation.id} className="accommodation-card">
                <div className="card-image-container">
                  <img src={accommodation.image} alt={accommodation.name} className="card-image" />
                  <div className="availability-badge">{accommodation.availability}</div>
                </div>

                <div className="card-content">
                  <h3 className="accommodation-name">{accommodation.name}</h3>
                  <p className="accommodation-location">{accommodation.location}</p>

                  <div className="rating-section">
                    <div className="star-rating">⭐ {accommodation.rating}</div>
                    <span className="review-count">({accommodation.reviews} reviews)</span>
                  </div>

                  <div className="property-details">
                    <div className="detail-item">
                      <span className="detail-label">🛏️</span>
                      <span>{accommodation.bedrooms} bd</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">🛁</span>
                      <span>{accommodation.bathrooms} ba</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">🪑</span>
                      <span>{accommodation.beds} beds</span>
                    </div>
                  </div>

                  <div className="amenities-list">
                    {accommodation.amenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="amenity-tag">
                        {amenity}
                      </span>
                    ))}
                    {accommodation.amenities.length > 3 && (
                      <span className="amenity-tag more">+{accommodation.amenities.length - 3} more</span>
                    )}
                  </div>

                  <div className="price-section">
                    <div className="price">
                      <span className="price-amount">{accommodation.price}</span>
                      {accommodation.pricePerNight && <span className="per-night">/night</span>}
                    </div>
                    <button
                      className="book-btn"
                      onClick={() => handleBooking(accommodation)}
                    >
                      Book Now →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasSearched && (
        <div className="empty-state">
          <div className="empty-state-content">
            <p className="empty-state-icon">🏨</p>
            <h3>Find your perfect accommodation</h3>
            <p>Use the search above to find accommodations for your event</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default AccommodationBookings;
