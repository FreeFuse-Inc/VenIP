import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import bookingApi from '../utils/bookingApi';
import '../styles/AccommodationBookings.css';

/**
 * AccommodationBookings Component
 *
 * This component handles travel bookings across 6 categories:
 * - Hotels (Airbnb + Booking.com)
 * - Homes & Apartments (Airbnb)
 * - Long Stays (Furnished rentals)
 * - Flights (Google Flights)
 * - Activities (Viator + GetYourGuide)
 * - Airport Transfers (Uber)
 *
 * API Integration:
 * Users can add API keys in Settings > Travel Booking Integrations.
 * The keys are stored in localStorage with the pattern: `${apiName}_api_key`
 * When API keys are available, the functions in getResultsForTab() will use real API calls.
 * Until then, mock data is displayed for demonstration purposes.
 *
 * To integrate real APIs:
 * 1. Uncomment the TODO: API call sections in getResultsForTab()
 * 2. Implement the fetch functions (fetchFromAirbnb, fetchFromBooking, etc.)
 * 3. Pass the API keys and search parameters to the fetch functions
 * 4. Handle API responses and format them to match the mock data structure
 */
const AccommodationBookings = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(UserContext);
  const { openCartSidebar } = useContext(CartContext);
  const [activeTab, setActiveTab] = useState('hotels');
  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '2 adults',
  });

  const [hasSearched, setHasSearched] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filterLogic, setFilterLogic] = useState('any');
  const [activeFilters, setActiveFilters] = useState({
    amenities: [],
    priceRange: [0, 500],
    minRating: 0,
    bedrooms: [],
    bathrooms: [],
  });


  const getApiKey = (apiName) => {
    return localStorage.getItem(`${apiName}_api_key`);
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? `$${price}` : price;
  };

  const getResultsForTab = async (tab) => {
    // Check if API keys are available and make real API calls
    // Otherwise, use mock API for demonstration
    // TODO: When you have real API credentials, implement the actual API calls here

    try {
      let results = [];

      switch (tab) {
        case 'hotels':
          results = await bookingApi.searchHotels(searchParams);
          break;

        case 'homes':
          results = await bookingApi.searchHomes(searchParams);
          break;

        case 'longstays':
          results = await bookingApi.searchLongStays(searchParams);
          break;

        case 'flights':
          results = await bookingApi.searchFlights(searchParams);
          break;

        case 'activities':
          results = await bookingApi.searchActivities(searchParams);
          break;

        case 'transfers':
          results = await bookingApi.searchTransfers(searchParams);
          break;

        default:
          results = [];
      }

      // Format prices to include $ symbol for consistent display
      return results.map(item => ({
        ...item,
        price: formatPrice(item.price),
        availability: item.availability ? 'Available' : 'Unavailable',
      }));
    } catch (error) {
      console.error(`Error fetching ${tab}:`, error);
      return [];
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setHasSearched(false);
    setFilteredResults([]);
    setActiveFilters({
      amenities: [],
      priceRange: [0, 500],
      minRating: 0,
      bedrooms: [],
      bathrooms: [],
    });
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'amenities') {
      setActiveFilters((prev) => ({
        ...prev,
        amenities: prev.amenities.includes(value)
          ? prev.amenities.filter((a) => a !== value)
          : [...prev.amenities, value],
      }));
    } else if (filterType === 'priceRange') {
      setActiveFilters((prev) => ({
        ...prev,
        priceRange: value,
      }));
    } else if (filterType === 'minRating') {
      setActiveFilters((prev) => ({
        ...prev,
        minRating: value,
      }));
    } else if (filterType === 'bedrooms') {
      setActiveFilters((prev) => ({
        ...prev,
        bedrooms: prev.bedrooms.includes(value)
          ? prev.bedrooms.filter((b) => b !== value)
          : [...prev.bedrooms, value],
      }));
    } else if (filterType === 'bathrooms') {
      setActiveFilters((prev) => ({
        ...prev,
        bathrooms: prev.bathrooms.includes(value)
          ? prev.bathrooms.filter((b) => b !== value)
          : [...prev.bathrooms, value],
      }));
    }
  };

  const applyFilters = async () => {
    const results = await getResultsForTab(activeTab);
    let filtered = [...results];

    filtered = filtered.filter((item) => {
      // Price filter - handle both string and number formats
      let price = item.price;
      if (typeof price === 'string') {
        price = parseInt(price.replace(/[$,]/g, '') || '0');
      }
      const meetsPrice = price >= activeFilters.priceRange[0] && price <= activeFilters.priceRange[1];

      // Rating filter - only apply if minimum rating is set
      const meetsRating = !activeFilters.minRating || (item.rating && item.rating >= activeFilters.minRating);

      // Bedrooms filter - only apply if bedrooms filter is selected
      const meetsBedrooms =
        activeFilters.bedrooms.length === 0 || (item.bedrooms && activeFilters.bedrooms.includes(item.bedrooms));

      // Bathrooms filter - only apply if bathrooms filter is selected
      const meetsBathrooms =
        activeFilters.bathrooms.length === 0 || (item.bathrooms && activeFilters.bathrooms.includes(item.bathrooms));

      // Amenities filter
      let meetsAmenities = true;
      if (activeFilters.amenities.length > 0) {
        const itemAmenities = item.amenities || [];
        if (filterLogic === 'all') {
          meetsAmenities = activeFilters.amenities.every((a) => itemAmenities.includes(a));
        } else {
          meetsAmenities = activeFilters.amenities.some((a) => itemAmenities.includes(a));
        }
      }

      return meetsPrice && meetsRating && meetsBedrooms && meetsBathrooms && meetsAmenities;
    });

    setFilteredResults(filtered);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchParams.destination) {
      alert('Please enter a destination');
      return;
    }

    // For flights, don't require check-in/check-out dates as a hard requirement
    if (activeTab !== 'flights' && (!searchParams.checkIn || !searchParams.checkOut)) {
      if (activeTab !== 'activities' && activeTab !== 'transfers') {
        alert('Please fill in destination and dates');
        return;
      }
    }

    setHasSearched(true);
    const results = await getResultsForTab(activeTab);
    setFilteredResults(results);
  };

  const handleBooking = (item) => {
    const bookingData = {
      item,
      searchParams,
      type: activeTab,
    };
    // Navigate or open booking modal
    navigate('/booking-confirmation', { state: bookingData });
  };

  const handleAddToCart = (item) => {
    let cartItem = {
      name: item.name,
      location: item.location,
      image: item.image,
      type: activeTab,
      rating: item.rating,
      reviews: item.reviews,
    };

    const nights = searchParams.checkIn && searchParams.checkOut
      ? Math.ceil((new Date(searchParams.checkOut) - new Date(searchParams.checkIn)) / (1000 * 60 * 60 * 24))
      : 1;

    switch (activeTab) {
      case 'hotels':
      case 'homes':
      case 'longstays':
        cartItem = {
          ...cartItem,
          checkIn: searchParams.checkIn,
          checkOut: searchParams.checkOut,
          guests: searchParams.guests,
          nightlyRate: item.price,
          nights: nights || 1,
          totalPrice: `$${(parseFloat(item.price.replace(/[$,]/g, '')) * (nights || 1)).toFixed(0)}`,
          bedrooms: item.bedrooms,
          bathrooms: item.bathrooms,
          amenities: item.amenities,
        };
        break;

      case 'flights':
        cartItem = {
          ...cartItem,
          departure: item.departure,
          arrival: item.arrival,
          from: item.from,
          to: item.to,
          airline: item.airline,
          duration: item.duration,
          stops: item.stops,
          totalPrice: item.price,
          seats: item.seats,
        };
        break;

      case 'activities':
        cartItem = {
          ...cartItem,
          duration: item.duration,
          groupSize: item.groupSize,
          provider: item.provider,
          included: item.included,
          totalPrice: item.price,
          quantity: 1,
        };
        break;

      case 'transfers':
        cartItem = {
          ...cartItem,
          service: item.service,
          vehicle: item.vehicle,
          pickup: item.pickup,
          destination: item.destination,
          estimatedTime: item.estimatedTime,
          capacity: item.capacity,
          features: item.features,
          totalPrice: item.price,
        };
        break;

      default:
        break;
    }

    addToCart(cartItem);
    openCartSidebar();
    alert(`${item.name} added to cart!`);
  };

  const renderResults = () => {
    switch (activeTab) {
      case 'hotels':
      case 'homes':
      case 'longstays':
        return renderAccommodations();
      case 'flights':
        return renderFlights();
      case 'activities':
        return renderActivities();
      case 'transfers':
        return renderTransfers();
      default:
        return null;
    }
  };

  const renderAccommodations = () => (
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
                <span className="detail-label">🛏��</span>
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
                <span key={idx} className="amenity-tag">{amenity}</span>
              ))}
              {accommodation.amenities.length > 3 && (
                <span className="amenity-tag more">+{accommodation.amenities.length - 3} more</span>
              )}
            </div>
            <div className="price-section">
              <div className="price">
                <span className="price-amount">{accommodation.price}</span>
                {accommodation.pricePerNight && <span className="per-night">/night</span>}
                {accommodation.minStay && <span className="per-night">({accommodation.minStay})</span>}
              </div>
              <div className="button-group">
                <button className="book-btn" onClick={() => handleBooking(accommodation)}>
                  Book Now →
                </button>
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(accommodation)} title="Add to cart">
                  🛒
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFlights = () => (
    <div className="flights-list">
      {filteredResults.map((flight) => (
        <div key={flight.id} className="flight-card">
          <div className="flight-header">
            <h3 className="airline-name">{flight.airline}</h3>
            <div className="rating-section">
              <span className="star-rating">⭐ {flight.rating}</span>
            </div>
          </div>
          <div className="flight-details">
            <div className="flight-route">
              <div className="flight-leg">
                <span className="time">{flight.departure}</span>
                <span className="airport">{flight.from}</span>
              </div>
              <div className="flight-duration">
                <span>{flight.duration}</span>
                <span>{flight.stops}</span>
              </div>
              <div className="flight-leg">
                <span className="time">{flight.arrival}</span>
                <span className="airport">{flight.to}</span>
              </div>
            </div>
          </div>
          <div className="flight-footer">
            <div>
              <span className="seats-available">{flight.seats}</span>
            </div>
            <div className="flight-price-section">
              <span className="price">{flight.price}</span>
              <button className="book-btn" onClick={() => handleBooking(flight)}>
                Book →
              </button>
              <button className="add-to-cart-btn" onClick={() => handleAddToCart(flight)} title="Add to cart">
                🛒
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderActivities = () => (
    <div className="activities-grid">
      {filteredResults.map((activity) => (
        <div key={activity.id} className="activity-card">
          <div className="card-image-container">
            <img src={activity.image} alt={activity.name} className="card-image" />
          </div>
          <div className="card-content">
            <span className="provider-badge">{activity.provider}</span>
            <h3 className="activity-name">{activity.name}</h3>
            <p className="activity-location">📍 {activity.location}</p>
            <div className="activity-info">
              <span>���️ {activity.duration}</span>
              <span>👥 {activity.groupSize}</span>
            </div>
            <div className="rating-section">
              <div className="star-rating">⭐ {activity.rating}</div>
              <span className="review-count">({activity.reviews} reviews)</span>
            </div>
            <div className="included-list">
              {activity.included.map((item, idx) => (
                <span key={idx} className="included-item">✓ {item}</span>
              ))}
            </div>
            <div className="price-section">
              <span className="price">{activity.price}</span>
              <div className="button-group">
                <button className="book-btn" onClick={() => handleBooking(activity)}>
                  Book Now →
                </button>
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(activity)} title="Add to cart">
                  🛒
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTransfers = () => (
    <div className="transfers-list">
      {filteredResults.map((transfer) => (
        <div key={transfer.id} className="transfer-card">
          <div className="transfer-header">
            <h3 className="service-name">{transfer.service}</h3>
            <span className="vehicle-type">{transfer.vehicle}</span>
            <div className="rating-section">
              <span className="star-rating">⭐ {transfer.rating}</span>
            </div>
          </div>
          <div className="transfer-details">
            <div className="route-info">
              <div className="location">
                <span className="label">📍 Pickup:</span>
                <span>{transfer.pickup}</span>
              </div>
              <div className="location">
                <span className="label">📍 Destination:</span>
                <span>{transfer.destination}</span>
              </div>
            </div>
            <div className="transfer-specs">
              <span>⏱️ {transfer.estimatedTime}</span>
              <span>👥 {transfer.capacity}</span>
            </div>
            <div className="features-list">
              {transfer.features.map((feature, idx) => (
                <span key={idx} className="feature-tag">✓ {feature}</span>
              ))}
            </div>
          </div>
          <div className="transfer-footer">
            <span className="price">{transfer.price}</span>
            <div className="button-group">
              <button className="book-btn" onClick={() => handleBooking(transfer)}>
                Reserve →
              </button>
              <button className="add-to-cart-btn" onClick={() => handleAddToCart(transfer)} title="Add to cart">
                🛒
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="accommodation-bookings-page">
      <div className="booking-header">
        <h1 className="page-title">Travel Bookings</h1>
      </div>

      <div className="search-container">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'hotels' ? 'active' : ''}`}
              onClick={() => handleTabChange('hotels')}
            >
              Hotels
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'homes' ? 'active' : ''}`}
              onClick={() => handleTabChange('homes')}
            >
              Homes & Apts
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'longstays' ? 'active' : ''}`}
              onClick={() => handleTabChange('longstays')}
            >
              Long stays
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'flights' ? 'active' : ''}`}
              onClick={() => handleTabChange('flights')}
            >
              Flights
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
              onClick={() => handleTabChange('activities')}
            >
              Activities
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'transfers' ? 'active' : ''}`}
              onClick={() => handleTabChange('transfers')}
            >
              Airport transfer
            </button>
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

            {activeTab !== 'activities' && activeTab !== 'transfers' && (
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
            )}

            {activeTab !== 'flights' && (
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
            )}
          </div>

          <button type="submit" className="search-btn">
            SEARCH
          </button>
        </form>
      </div>

      {/* Filters Section */}
      {hasSearched && (
        <div className="filters-section">
          <button
            type="button"
            className="filters-toggle"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <span>🔍 Filters</span>
            <span className={`filter-arrow ${isFiltersOpen ? 'open' : ''}`}>▼</span>
          </button>

          {isFiltersOpen && (
            <div className="filters-content">
              {/* Filter Logic Toggle - Only for accommodations with amenity filtering */}
              {(activeTab === 'hotels' || activeTab === 'homes' || activeTab === 'longstays') && (
                <div className="filter-group">
                  <label>Matching Logic for Amenities</label>
                  <div className="filter-logic-toggle">
                    <button
                      type="button"
                      className={`logic-btn ${filterLogic === 'any' ? 'active' : ''}`}
                      onClick={() => setFilterLogic('any')}
                    >
                      ANY (Match at least one)
                    </button>
                    <button
                      type="button"
                      className={`logic-btn ${filterLogic === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterLogic('all')}
                    >
                      ALL (Match all)
                    </button>
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div className="filter-group">
                <label>Price Range</label>
                <div className="price-filter">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={activeFilters.priceRange[1]}
                    onChange={(e) =>
                      handleFilterChange('priceRange', [
                        activeFilters.priceRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="price-slider"
                  />
                  <div className="price-display">
                    ${activeFilters.priceRange[0]} - ${activeFilters.priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Minimum Rating Filter */}
              <div className="filter-group">
                <label>Minimum Rating</label>
                <div className="rating-filter">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={activeFilters.minRating}
                    onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                    className="rating-slider"
                  />
                  <span className="rating-display">⭐ {activeFilters.minRating.toFixed(1)}+</span>
                </div>
              </div>

              {/* Bedrooms Filter - Only for accommodations */}
              {(activeTab === 'hotels' || activeTab === 'homes' || activeTab === 'longstays') && (
                <div className="filter-group">
                  <label>Bedrooms</label>
                  <div className="checkbox-group">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <label key={num} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={activeFilters.bedrooms.includes(num)}
                          onChange={() => handleFilterChange('bedrooms', num)}
                        />
                        <span>{num} Bed{num > 1 ? 's' : ''}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Bathrooms Filter - Only for accommodations */}
              {(activeTab === 'hotels' || activeTab === 'homes' || activeTab === 'longstays') && (
                <div className="filter-group">
                  <label>Bathrooms</label>
                  <div className="checkbox-group">
                    {[1, 2, 3, 4].map((num) => (
                      <label key={num} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={activeFilters.bathrooms.includes(num)}
                          onChange={() => handleFilterChange('bathrooms', num)}
                        />
                        <span>{num} Bath{num > 1 ? 's' : ''}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities Filter - Only for accommodations */}
              {(activeTab === 'hotels' || activeTab === 'homes' || activeTab === 'longstays') && (
                <div className="filter-group">
                  <label>Amenities</label>
                  <div className="checkbox-group amenities-grid">
                    {['WiFi', 'Air Conditioning', 'Kitchen', 'Washer', 'TV', 'Pool', 'Gym', 'Parking', 'Concierge'].map(
                      (amenity) => (
                        <label key={amenity} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={activeFilters.amenities.includes(amenity)}
                            onChange={() => handleFilterChange('amenities', amenity)}
                          />
                          <span>{amenity}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <div className="filter-actions">
                <button type="button" className="apply-filters-btn" onClick={applyFilters}>
                  ✓ Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {hasSearched && (
        <div className="results-container">
          <div className="results-header">
            <h2>
              {activeTab === 'hotels' && 'Available Hotels'}
              {activeTab === 'homes' && 'Available Homes & Apartments'}
              {activeTab === 'longstays' && 'Long Stay Options'}
              {activeTab === 'flights' && 'Available Flights'}
              {activeTab === 'activities' && 'Available Activities'}
              {activeTab === 'transfers' && 'Airport Transfer Options'}
            </h2>
            <p className="results-count">{filteredResults.length} options found</p>
          </div>

          {renderResults()}
        </div>
      )}

      {!hasSearched && (
        <div className="empty-state">
          <div className="empty-state-content">
            <p className="empty-state-icon">
              {activeTab === 'hotels' && '🏨'}
              {activeTab === 'homes' && '🏠'}
              {activeTab === 'longstays' && '🏢'}
              {activeTab === 'flights' && '✈️'}
              {activeTab === 'activities' && '🎭'}
              {activeTab === 'transfers' && '🚗'}
            </p>
            <h3>Find your perfect {activeTab}</h3>
            <p>Use the search above to find {activeTab} for your event</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default AccommodationBookings;
