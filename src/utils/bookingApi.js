/**
 * Booking API Service
 * 
 * This service provides a mock API interface that mimics Booking.com/Expedia structure.
 * When real API credentials are available, you can replace these functions with actual API calls.
 * 
 * Current State: Mock data generation
 * Future: Replace with real API calls (Booking.com, Expedia, etc)
 */

// Mock data generators for realistic listings
const generateHotels = (destination, checkIn, checkOut, guests) => {
  const baseHotels = [
    {
      id: `hotel_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Modern Downtown Apartment',
      location: 'Downtown - 0.5 km away',
      price: 156,
      currency: 'USD',
      pricePerNight: true,
      rating: 4.85,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      availability: true,
      bedrooms: 2,
      beds: 3,
      bathrooms: 2,
      amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Washer', 'TV', 'Parking'],
      source: 'airbnb',
      cancellation: 'Free cancellation',
      prepayment: 'No prepayment needed',
      tax: 'Tax may apply',
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
    },
    {
      id: `hotel_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Cozy Studio with City View',
      location: 'Midtown - 1.2 km away',
      price: 98,
      currency: 'USD',
      pricePerNight: true,
      rating: 4.72,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      availability: true,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'TV', 'Kitchen', 'Parking', 'Air Conditioning'],
      source: 'booking',
      cancellation: 'Free cancellation',
      prepayment: 'No prepayment needed',
      tax: 'Tax may apply',
      checkInTime: '2:00 PM',
      checkOutTime: '12:00 PM',
    },
    {
      id: `hotel_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Luxury Penthouse Suite',
      location: 'Downtown - 0.3 km away',
      price: 324,
      currency: 'USD',
      pricePerNight: true,
      rating: 4.96,
      reviews: 418,
      image: 'https://images.unsplash.com/photo-1631049307038-da0ec89d4d0d?w=400&h=300&fit=crop',
      availability: true,
      bedrooms: 3,
      beds: 4,
      bathrooms: 3,
      amenities: ['WiFi', 'Gym', 'Pool', 'Concierge', 'Kitchen', 'Parking', 'Air Conditioning'],
      source: 'airbnb',
      cancellation: 'Flexible cancellation',
      prepayment: 'Full prepayment required',
      tax: 'Tax may apply',
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
    },
    {
      id: `hotel_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Business Hotel Downtown',
      location: 'Central - 0.2 km away',
      price: 178,
      currency: 'USD',
      pricePerNight: true,
      rating: 4.68,
      reviews: 298,
      image: 'https://images.unsplash.com/photo-1566522650565-fbce2c2a3049?w=400&h=300&fit=crop',
      availability: true,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      amenities: ['WiFi', 'Business Center', 'Gym', 'Restaurant', 'Room Service', 'Parking'],
      source: 'booking',
      cancellation: 'Free cancellation',
      prepayment: 'No prepayment needed',
      tax: 'Tax may apply',
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
    },
  ];

  return baseHotels;
};

const generateHomes = (destination, checkIn, checkOut, guests) => {
  const baseHomes = [
    {
      id: `home_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Beachfront House',
      location: 'Beachfront - 2.1 km away',
      price: 245,
      currency: 'USD',
      pricePerNight: true,
      rating: 4.89,
      reviews: 342,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      availability: true,
      bedrooms: 4,
      beds: 5,
      bathrooms: 2,
      amenities: ['WiFi', 'Beach Access', 'Pool', 'Kitchen', 'Hot Tub', 'Washer', 'TV'],
      type: 'House',
      cancellation: 'Free cancellation',
      prepayment: 'No prepayment needed',
      checkInTime: '4:00 PM',
      checkOutTime: '10:00 AM',
    },
    {
      id: `home_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Charming Victorian Home',
      location: 'Historic District - 0.8 km away',
      price: 175,
      currency: 'USD',
      pricePerNight: true,
      rating: 4.78,
      reviews: 267,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
      availability: true,
      bedrooms: 3,
      beds: 4,
      bathrooms: 2,
      amenities: ['WiFi', 'Kitchen', 'Fireplace', 'Garden', 'Parking', 'Washer', 'Dryer'],
      type: 'House',
      cancellation: 'Free cancellation',
      prepayment: 'No prepayment needed',
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
    },
    {
      id: `home_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Modern Loft in Arts District',
      location: 'Arts District - 1.5 km away',
      price: 132,
      currency: 'USD',
      pricePerNight: true,
      rating: 4.81,
      reviews: 289,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      availability: true,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      amenities: ['WiFi', 'Kitchen', 'Rooftop Access', 'Workspace', 'Air Conditioning', 'TV'],
      type: 'Apartment',
      cancellation: 'Flexible cancellation',
      prepayment: 'No prepayment needed',
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
    },
    {
      id: `home_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Seaside Cottage',
      location: 'Coastal Area - 3.2 km away',
      price: 198,
      currency: 'USD',
      pricePerNight: true,
      rating: 4.83,
      reviews: 201,
      image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=300&fit=crop',
      availability: true,
      bedrooms: 2,
      beds: 3,
      bathrooms: 2,
      amenities: ['WiFi', 'Ocean View', 'Kitchen', 'Patio', 'Parking', 'Washer'],
      type: 'House',
      cancellation: 'Moderate cancellation',
      prepayment: 'No prepayment needed',
      checkInTime: '4:00 PM',
      checkOutTime: '10:00 AM',
    },
  ];

  return baseHomes;
};

const generateLongStays = (destination, checkIn, checkOut, guests) => {
  const baseLongStays = [
    {
      id: `longstay_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Furnished Apartment - 6 Months',
      location: 'Downtown - 0.5 km away',
      price: 2800,
      currency: 'USD',
      pricePerNight: false,
      rating: 4.75,
      reviews: 145,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      availability: true,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      amenities: ['Furnished', 'WiFi', 'Utilities Included', 'Parking', 'Kitchen', 'Washer'],
      minStay: '6 months',
      cancellation: 'Non-refundable',
      prepayment: 'Full month prepayment',
      checkInTime: '10:00 AM',
      checkOutTime: '10:00 AM',
    },
    {
      id: `longstay_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Extended Stay Luxury Suite',
      location: 'Midtown - 1 km away',
      price: 3500,
      currency: 'USD',
      pricePerNight: false,
      rating: 4.82,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1631049307038-da0ec89d4d0d?w=400&h=300&fit=crop',
      availability: true,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      amenities: ['Fully Furnished', 'WiFi', 'Weekly Cleaning', 'Gym Access', 'Kitchen'],
      minStay: '3 months',
      cancellation: 'Flexible cancellation',
      prepayment: 'First month prepayment',
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
    },
    {
      id: `longstay_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Corporate Housing - 1 Year',
      location: 'Business District - 2 km away',
      price: 3000,
      currency: 'USD',
      pricePerNight: false,
      rating: 4.88,
      reviews: 276,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
      availability: true,
      bedrooms: 3,
      beds: 3,
      bathrooms: 2,
      amenities: ['Fully Furnished', 'Utilities', 'WiFi', 'Parking', 'Housekeeping'],
      minStay: '1 year',
      cancellation: 'Flexible cancellation',
      prepayment: 'First month prepayment',
      checkInTime: '10:00 AM',
      checkOutTime: '10:00 AM',
    },
  ];

  return baseLongStays;
};

const generateFlights = (from, to, departDate, returnDate) => {
  const baseFlights = [
    {
      id: `flight_${Math.random().toString(36).substr(2, 9)}`,
      airline: 'Emirates',
      from: 'LAX',
      to: 'JFK',
      departure: '2025-11-15 08:30 AM',
      arrival: '2025-11-15 04:45 PM',
      duration: '5h 15m',
      stops: 'Nonstop',
      price: 245,
      currency: 'USD',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1551632786-de41ec8a42d7?w=400&h=300&fit=crop',
      seats: '4 available',
      cabin: 'Economy',
      baggage: '1 checked bag included',
      airline_code: 'EK',
    },
    {
      id: `flight_${Math.random().toString(36).substr(2, 9)}`,
      airline: 'United Airlines',
      from: 'LAX',
      to: 'JFK',
      departure: '2025-11-15 10:15 AM',
      arrival: '2025-11-15 06:30 PM',
      duration: '5h 15m',
      stops: 'Nonstop',
      price: 198,
      currency: 'USD',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1551632786-de41ec8a42d7?w=400&h=300&fit=crop',
      seats: '8 available',
      cabin: 'Economy',
      baggage: 'No checked bag',
      airline_code: 'UA',
    },
    {
      id: `flight_${Math.random().toString(36).substr(2, 9)}`,
      airline: 'American Airlines',
      from: 'LAX',
      to: 'JFK',
      departure: '2025-11-15 02:45 PM',
      arrival: '2025-11-15 11:00 PM',
      duration: '5h 15m',
      stops: 'Nonstop',
      price: 178,
      currency: 'USD',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1551632786-de41ec8a42d7?w=400&h=300&fit=crop',
      seats: '12 available',
      cabin: 'Economy',
      baggage: '1 checked bag included',
      airline_code: 'AA',
    },
    {
      id: `flight_${Math.random().toString(36).substr(2, 9)}`,
      airline: 'British Airways',
      from: 'LAX',
      to: 'JFK',
      departure: '2025-11-15 06:00 PM',
      arrival: '2025-11-16 02:15 AM',
      duration: '5h 15m',
      stops: 'Nonstop',
      price: 215,
      currency: 'USD',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1551632786-de41ec8a42d7?w=400&h=300&fit=crop',
      seats: '6 available',
      cabin: 'Premium Economy',
      baggage: '2 checked bags included',
      airline_code: 'BA',
    },
  ];

  return baseFlights;
};

const generateActivities = (destination) => {
  const baseActivities = [
    {
      id: `activity_${Math.random().toString(36).substr(2, 9)}`,
      name: 'City Walking Tour & Local Food',
      provider: 'Viator',
      location: 'Downtown',
      duration: '4 hours',
      price: 89,
      currency: 'USD',
      rating: 4.9,
      reviews: 523,
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
      groupSize: 'Up to 15 people',
      included: ['Professional Guide', 'Food Tastings', 'Walking Map', 'Water Bottle'],
      difficulty: 'Easy',
      languages: ['English', 'Spanish'],
      cancellation: 'Free cancellation up to 24 hours',
    },
    {
      id: `activity_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Adventure Sports Package',
      provider: 'GetYourGuide',
      location: 'National Park',
      duration: '6 hours',
      price: 156,
      currency: 'USD',
      rating: 4.7,
      reviews: 342,
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
      groupSize: 'Up to 20 people',
      included: ['Equipment', 'Certified Instructor', 'Insurance', 'Snacks'],
      difficulty: 'Intermediate',
      languages: ['English', 'German'],
      cancellation: 'Free cancellation up to 48 hours',
    },
    {
      id: `activity_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Scenic Boat Tour & Dinner',
      provider: 'Viator',
      location: 'Harbor',
      duration: '3 hours',
      price: 124,
      currency: 'USD',
      rating: 4.8,
      reviews: 456,
      image: 'https://images.unsplash.com/photo-1552053831-71594a27c62d?w=400&h=300&fit=crop',
      groupSize: 'Up to 30 people',
      included: ['Boat Tour', 'Three-Course Dinner', 'Beverages', 'Live Music'],
      difficulty: 'Easy',
      languages: ['English', 'French'],
      cancellation: 'Free cancellation up to 24 hours',
    },
    {
      id: `activity_${Math.random().toString(36).substr(2, 9)}`,
      name: 'Museum & Cultural Tour',
      provider: 'GetYourGuide',
      location: 'City Center',
      duration: '2.5 hours',
      price: 67,
      currency: 'USD',
      rating: 4.6,
      reviews: 289,
      image: 'https://images.unsplash.com/photo-1578974675417-a0fdd0165995?w=400&h=300&fit=crop',
      groupSize: 'Up to 25 people',
      included: ['Skip-the-Line Entry', 'Expert Guide', 'Headsets', 'Map'],
      difficulty: 'Easy',
      languages: ['English', 'Spanish', 'Italian'],
      cancellation: 'Free cancellation up to 24 hours',
    },
  ];

  return baseActivities;
};

const generateTransfers = (pickupLocation, destination) => {
  const baseTransfers = [
    {
      id: `transfer_${Math.random().toString(36).substr(2, 9)}`,
      service: 'Uber Black',
      vehicle: 'Premium Sedan',
      pickup: 'Hotel',
      destination: 'Airport (JFK)',
      price: 58,
      currency: 'USD',
      estimatedTime: '45 minutes',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop',
      capacity: 'Up to 4 passengers',
      features: ['WiFi', 'Phone Charger', 'Professional Driver', 'Water Bottle'],
      availability: 'Available',
    },
    {
      id: `transfer_${Math.random().toString(36).substr(2, 9)}`,
      service: 'Lyft Lux',
      vehicle: 'Premium Car',
      pickup: 'Hotel',
      destination: 'Airport (JFK)',
      price: 45,
      currency: 'USD',
      estimatedTime: '45 minutes',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop',
      capacity: 'Up to 4 passengers',
      features: ['Professional Driver', 'Large Luggage Space', 'Climate Control', 'Phone Charger'],
      availability: 'Available',
    },
    {
      id: `transfer_${Math.random().toString(36).substr(2, 9)}`,
      service: 'Airport Shuttle',
      vehicle: 'Shared Shuttle',
      pickup: 'Hotel Lobby',
      destination: 'Airport (JFK)',
      price: 25,
      currency: 'USD',
      estimatedTime: '60 minutes',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop',
      capacity: 'Up to 12 passengers',
      features: ['Budget Friendly', 'Luggage Included', 'Regular Schedule', 'Comfortable Seating'],
      availability: 'Available',
    },
    {
      id: `transfer_${Math.random().toString(36).substr(2, 9)}`,
      service: 'Rental Car',
      vehicle: 'Economy Car',
      pickup: 'Airport Desk',
      destination: 'Hotel',
      price: 38,
      currency: 'USD',
      estimatedTime: 'Self-drive',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop',
      capacity: 'Up to 5 passengers',
      features: ['Flexible Schedule', 'Full Tank Included', 'GPS Included', 'Insurance Available'],
      availability: 'Available',
    },
  ];

  return baseTransfers;
};

// API methods
const bookingApi = {
  /**
   * Search for hotels
   * @param {Object} params - Search parameters
   * @param {string} params.destination - Destination city
   * @param {string} params.checkIn - Check-in date
   * @param {string} params.checkOut - Check-out date
   * @param {string} params.guests - Number of guests
   * @returns {Promise<Array>} - Array of hotel listings
   */
  searchHotels: async (params) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateHotels(params.destination, params.checkIn, params.checkOut, params.guests);
  },

  /**
   * Search for homes and apartments
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} - Array of home listings
   */
  searchHomes: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateHomes(params.destination, params.checkIn, params.checkOut, params.guests);
  },

  /**
   * Search for long-stay accommodations
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} - Array of long-stay listings
   */
  searchLongStays: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateLongStays(params.destination, params.checkIn, params.checkOut, params.guests);
  },

  /**
   * Search for flights
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} - Array of flight options
   */
  searchFlights: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateFlights(params.from || 'LAX', params.to || 'JFK', params.checkIn, params.checkOut);
  },

  /**
   * Search for activities and tours
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} - Array of activity options
   */
  searchActivities: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateActivities(params.destination);
  },

  /**
   * Search for airport transfers
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} - Array of transfer options
   */
  searchTransfers: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateTransfers(params.pickup || 'Hotel', params.destination || 'Airport');
  },

  /**
   * Get booking details (for future use with real API)
   * @param {string} bookingId - Booking ID
   * @returns {Promise<Object>} - Booking details
   */
  getBookingDetails: async (bookingId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      id: bookingId,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
  },
};

export default bookingApi;
