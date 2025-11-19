import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
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

  // Mock data for Hotels (Airbnb + Booking.com)
  const mockHotels = [
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
      source: 'airbnb',
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
      source: 'booking',
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
      source: 'airbnb',
    },
  ];

  // Mock data for Homes & Apartments
  const mockHomes = [
    {
      id: 101,
      name: 'Beachfront House',
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
      type: 'House',
    },
    {
      id: 102,
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
      type: 'House',
    },
    {
      id: 103,
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
      type: 'Apartment',
    },
  ];

  // Mock data for Long Stays
  const mockLongStays = [
    {
      id: 201,
      name: 'Furnished Apartment - 6 Months',
      location: 'Downtown - 0.5 km away',
      price: '$2,800',
      pricePerNight: false,
      rating: 4.75,
      reviews: 145,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      availability: 'Available',
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      amenities: ['Furnished', 'WiFi', 'Utilities Included', 'Parking'],
      minStay: '6 months',
    },
    {
      id: 202,
      name: 'Extended Stay Luxury Suite',
      location: 'Midtown - 1 km away',
      price: '$3,500',
      pricePerNight: false,
      rating: 4.82,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1631049307038-da0ec89d4d0d?w=400&h=300&fit=crop',
      availability: 'Available',
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      amenities: ['Fully Furnished', 'WiFi', 'Weekly Cleaning', 'Gym Access'],
      minStay: '3 months',
    },
    {
      id: 203,
      name: 'Corporate Housing - 1 Year',
      location: 'Business District - 2 km away',
      price: '$3,000',
      pricePerNight: false,
      rating: 4.88,
      reviews: 276,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      availability: 'Available',
      bedrooms: 3,
      beds: 3,
      bathrooms: 2,
      amenities: ['Fully Furnished', 'Utilities', 'WiFi', 'Parking', 'Housekeeping'],
      minStay: '1 year',
    },
  ];

  // Mock data for Flights
  const mockFlights = [
    {
      id: 301,
      airline: 'Emirates',
      from: 'LAX',
      to: 'JFK',
      departure: '2025-11-15 08:30 AM',
      arrival: '2025-11-15 04:45 PM',
      duration: '5h 15m',
      stops: 'Nonstop',
      price: '$245',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1551632786-de41ec8a42d7?w=400&h=300&fit=crop',
      seats: '4 seats available',
    },
    {
      id: 302,
      airline: 'United Airlines',
      from: 'LAX',
      to: 'JFK',
      departure: '2025-11-15 10:15 AM',
      arrival: '2025-11-15 06:30 PM',
      duration: '5h 15m',
      stops: 'Nonstop',
      price: '$198',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1551632786-de41ec8a42d7?w=400&h=300&fit=crop',
      seats: '8 seats available',
    },
    {
      id: 303,
      airline: 'American Airlines',
      from: 'LAX',
      to: 'JFK',
      departure: '2025-11-15 02:45 PM',
      arrival: '2025-11-15 11:00 PM',
      duration: '5h 15m',
      stops: 'Nonstop',
      price: '$178',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1551632786-de41ec8a42d7?w=400&h=300&fit=crop',
      seats: '12 seats available',
    },
  ];

  // Mock data for Activities
  const mockActivities = [
    {
      id: 401,
      name: 'City Walking Tour & Local Food',
      provider: 'Viator',
      location: 'Downtown',
      duration: '4 hours',
      price: '$89',
      rating: 4.9,
      reviews: 523,
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
      groupSize: 'Up to 15 people',
      included: ['Guide', 'Food Tastings', 'Walking Map'],
    },
    {
      id: 402,
      name: 'Adventure Sports Package',
      provider: 'GetYourGuide',
      location: 'National Park',
      duration: '6 hours',
      price: '$156',
      rating: 4.7,
      reviews: 342,
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
      groupSize: 'Up to 20 people',
      included: ['Equipment', 'Instructor', 'Insurance'],
    },
    {
      id: 403,
      name: 'Scenic Boat Tour & Dinner',
      provider: 'Viator',
      location: 'Harbor',
      duration: '3 hours',
      price: '$124',
      rating: 4.8,
      reviews: 456,
      image: 'https://images.unsplash.com/photo-1552053831-71594a27c62d?w=400&h=300&fit=crop',
      groupSize: 'Up to 30 people',
      included: ['Boat Tour', 'Dinner', 'Beverages'],
    },
  ];

  // Mock data for Airport Transfer
  const mockTransfers = [
    {
      id: 501,
      service: 'Uber Black',
      vehicle: 'Premium Sedan',
      pickup: 'Hotel',
      destination: 'Airport (JFK)',
      price: '$58',
      estimatedTime: '45 minutes',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop',
      capacity: 'Up to 4 passengers',
      features: ['WiFi', 'Charger', 'Professional Driver'],
    },
    {
      id: 502,
      service: 'Lyft Lux',
      vehicle: 'Premium Car',
      pickup: 'Hotel',
      destination: 'Airport (JFK)',
      price: '$45',
      estimatedTime: '45 minutes',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop',
      capacity: 'Up to 4 passengers',
      features: ['Professional Driver', 'Luggage Space', 'Climate Control'],
    },
    {
      id: 503,
      service: 'Airport Shuttle',
      vehicle: 'Shared Shuttle',
      pickup: 'Hotel Lobby',
      destination: 'Airport (JFK)',
      price: '$25',
      estimatedTime: '60 minutes',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop',
      capacity: 'Up to 12 passengers',
      features: ['Budget Friendly', 'Luggage Included', 'Regular Schedule'],
    },
  ];

  const getApiKey = (apiName) => {
    return localStorage.getItem(`${apiName}_api_key`);
  };

  const getResultsForTab = async (tab) => {
    // Check if API keys are available and make real API calls
    // Otherwise, return mock data for demonstration

    switch (tab) {
      case 'hotels':
        // Combine Airbnb + Booking.com results
        const airbnbKey = getApiKey('airbnb');
        const bookingKey = getApiKey('booking');
        if (airbnbKey || bookingKey) {
          // TODO: Make real API calls to Airbnb and Booking.com
          // const airbnbResults = await fetchFromAirbnb(searchParams, airbnbKey);
          // const bookingResults = await fetchFromBooking(searchParams, bookingKey);
          // return [...airbnbResults, ...bookingResults];
        }
        return mockHotels;

      case 'homes':
        const airbnbHomeKey = getApiKey('airbnb');
        if (airbnbHomeKey) {
          // TODO: Make real API call to Airbnb for homes
          // return await fetchFromAirbnbHomes(searchParams, airbnbHomeKey);
        }
        return mockHomes;

      case 'longstays':
        const furnishedKey = getApiKey('airbnb');
        if (furnishedKey) {
          // TODO: Make real API call for long-stay rentals
          // return await fetchLongStayRentals(searchParams, furnishedKey);
        }
        return mockLongStays;

      case 'flights':
        const flightsKey = getApiKey('googleFlights');
        if (flightsKey) {
          // TODO: Make real API call to Google Flights
          // return await fetchFlights(searchParams, flightsKey);
        }
        return mockFlights;

      case 'activities':
        const viatorKey = getApiKey('viator');
        const getYourGuideKey = getApiKey('getYourGuide');
        if (viatorKey || getYourGuideKey) {
          // TODO: Make real API calls to Viator and GetYourGuide
          // const viatorResults = await fetchFromViator(searchParams, viatorKey);
          // const gygResults = await fetchFromGetYourGuide(searchParams, getYourGuideKey);
          // return [...viatorResults, ...gygResults];
        }
        return mockActivities;

      case 'transfers':
        const uberKey = getApiKey('uber');
        if (uberKey) {
          // TODO: Make real API call to Uber
          // return await fetchUberTransfers(searchParams, uberKey);
        }
        return mockTransfers;

      default:
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
              <span>⏱️ {activity.duration}</span>
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
        <button className="back-btn" onClick={() => navigate('/dashboard/sponsor')}>
          ← Back
        </button>
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
