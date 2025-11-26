# Booking API Integration Guide

This document explains how to migrate from the mock booking API to real booking platform APIs (Booking.com, Expedia, etc.) when you have credentials.

## Current State

The Travel Bookings page currently uses a **mock API service** (`src/utils/bookingApi.js`) that:
- Generates realistic booking data without requiring external API calls
- Maintains a consistent data structure that mirrors real booking platforms
- Allows testing and development without API credentials
- Simulates realistic API delays (500ms) for better UX testing

## Architecture

```
AccommodationBookings.js (Component)
        ↓
   bookingApi.js (Service Layer)
        ↓
Real API Providers (Booking.com, Expedia, etc.)
```

This architecture keeps API calls separate from the UI component, making it easy to swap implementations.

## Migration Steps

### Step 1: Obtain API Credentials

Choose your preferred booking platform(s):
- **Booking.com**: https://developer.booking.com/
- **Expedia**: https://developer.expedia.com/
- **Viator** (Activities): https://developer.viator.com/
- **Skyscanner** (Flights): https://partners.skyscanner.com/

### Step 2: Store API Keys Securely

Store API keys in environment variables (NOT in localStorage for sensitive keys):

```bash
# .env file
REACT_APP_BOOKING_API_KEY=your_key_here
REACT_APP_EXPEDIA_API_KEY=your_key_here
REACT_APP_VIATOR_API_KEY=your_key_here
```

### Step 3: Update bookingApi.js

Replace the mock functions with real API calls. Example:

```javascript
// Before (Mock)
searchHotels: async (params) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateHotels(params.destination, params.checkIn, params.checkOut, params.guests);
}

// After (Real API)
searchHotels: async (params) => {
  const apiKey = process.env.REACT_APP_BOOKING_API_KEY;
  const response = await fetch('https://api.booking.com/hotels', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      destination: params.destination,
      checkin: params.checkIn,
      checkout: params.checkOut,
      guests: params.guests,
    }),
  });
  
  if (!response.ok) throw new Error('Booking API error');
  const data = await response.json();
  
  // Map API response to our standard format
  return data.hotels.map(hotel => ({
    id: hotel.id,
    name: hotel.name,
    location: hotel.location,
    price: hotel.price,
    rating: hotel.rating,
    // ... map other fields
  }));
}
```

### Step 4: Data Format Consistency

Ensure real API responses are mapped to the standard format used by the component:

```javascript
{
  id: string,
  name: string,
  location: string,
  price: number,
  currency: string,
  pricePerNight: boolean,
  rating: number,
  reviews: number,
  image: string,
  availability: boolean,
  bedrooms?: number,
  beds?: number,
  bathrooms?: number,
  amenities?: string[],
  // ... other fields based on category
}
```

### Step 5: Handle API Errors Gracefully

Add error handling for API failures:

```javascript
searchHotels: async (params) => {
  try {
    // API call
    const response = await fetch(/* ... */);
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Booking API error:', error);
    // Fallback to mock data or show error message
    return generateHotels(...); // Or return []
  }
}
```

### Step 6: Update Component Logic (if needed)

The component in `AccommodationBookings.js` is designed to work with the API service. If your real API returns different field names, update the mapping in `bookingApi.js` rather than changing the component.

## API Integration Checklist

- [ ] API credentials obtained and stored in environment variables
- [ ] `bookingApi.js` functions updated with real API calls
- [ ] Response data mapped to standard format
- [ ] Error handling implemented
- [ ] Rate limiting handled (if required by API)
- [ ] Price formatting tested
- [ ] Filter logic works with real data
- [ ] Cart integration tested with real prices
- [ ] Performance tested (response time, data volume)

## Testing Real APIs

Before deploying:

1. **Test with small dataset**: Use single city/date searches
2. **Test filters**: Ensure price/rating/amenity filters work
3. **Test edge cases**: No results, API timeout, invalid credentials
4. **Test cart**: Ensure prices calculate correctly
5. **Test performance**: Monitor API response times

## Fallback Strategy

Consider implementing a fallback to mock data if API calls fail:

```javascript
searchHotels: async (params) => {
  try {
    // Try real API first
    return await fetchFromRealAPI(params);
  } catch (error) {
    console.warn('Real API failed, falling back to mock data:', error);
    return generateHotels(params.destination, params.checkIn, params.checkOut, params.guests);
  }
}
```

## Cost Considerations

- **Booking.com API**: Typically charges per successful booking
- **Expedia API**: Various pricing models depending on partnership
- **Activities**: Viator and GetYourGuide have their own commission structures
- **Flights**: Skyscanner offers both free and premium tiers

Plan for API costs before going live.

## Mock Data vs Real Data

### Mock Data (Current)
✅ No API costs
✅ Fast development
✅ No dependencies
❌ Generic data
❌ Not real-time

### Real Data (Future)
✅ Actual availability
✅ Real pricing
✅ Live reviews
✅ Real-time inventory
❌ API costs
❌ Rate limits
❌ Requires credentials

## Support

For questions about specific API implementations:
- Check the API provider's documentation
- Review `src/utils/bookingApi.js` for function signatures
- Ensure response format matches the mock data structure

## Example: Switching from Mock to Real Hotels API

```javascript
// src/utils/bookingApi.js

const bookingApi = {
  searchHotels: async (params) => {
    // Comment out the mock implementation
    // return generateHotels(...);
    
    // Implement real API call
    const apiKey = process.env.REACT_APP_BOOKING_API_KEY;
    
    try {
      const response = await fetch('https://api.booking.com/hotels/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: params.destination,
          checkin_date: params.checkIn,
          checkout_date: params.checkOut,
          number_of_guests: parseInt(params.guests),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform API response to component format
      return data.results.map(hotel => ({
        id: hotel.hotel_id,
        name: hotel.hotel_name,
        location: `${hotel.city} - ${hotel.distance_to_center} away`,
        price: hotel.min_price,
        currency: hotel.currency,
        pricePerNight: true,
        rating: hotel.review_score,
        reviews: hotel.review_count,
        image: hotel.image_url,
        availability: hotel.available,
        bedrooms: hotel.room_type_data.bedrooms,
        bathrooms: hotel.room_type_data.bathrooms,
        amenities: hotel.facilities || [],
      }));
    } catch (error) {
      console.error('Real API error:', error);
      // Fallback to mock data
      return generateHotels(params.destination, params.checkIn, params.checkOut, params.guests);
    }
  },
  
  // ... other functions similarly updated
};
```

This guide should help you transition from mock data to real booking APIs when you're ready!
