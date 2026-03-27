import bookingApi from '../utils/bookingApi';

/**
 * Booking service that wraps bookingApi.
 * When useTestData is true  → delegates to the existing mock generators.
 * When useTestData is false → returns empty arrays (ready for real API / Supabase edge functions).
 */
const bookingService = {
  async searchHotels(params, useTestData) {
    if (useTestData) return bookingApi.searchHotels(params);
    return [];
  },

  async searchHomes(params, useTestData) {
    if (useTestData) return bookingApi.searchHomes(params);
    return [];
  },

  async searchLongStays(params, useTestData) {
    if (useTestData) return bookingApi.searchLongStays(params);
    return [];
  },

  async searchFlights(params, useTestData) {
    if (useTestData) return bookingApi.searchFlights(params);
    return [];
  },

  async searchActivities(params, useTestData) {
    if (useTestData) return bookingApi.searchActivities(params);
    return [];
  },

  async searchTransfers(params, useTestData) {
    if (useTestData) return bookingApi.searchTransfers(params);
    return [];
  },

  async getBookingDetails(bookingId, useTestData) {
    if (useTestData) return bookingApi.getBookingDetails(bookingId);
    return null;
  },
};

export default bookingService;
