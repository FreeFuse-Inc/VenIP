import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const STORAGE_KEY = 'venip_user';

const buildDefaultUser = () => ({
  id: `user_${Date.now()}`,
  email: null,
  fullName: null,
  companyName: null,
  phone: null,
  billingAddress: null,
  cart: [],
  bookingHistory: [],
  createdAt: new Date().toISOString(),
});

// ─── Snake ↔ Camel helpers ──────────────────────────────────────────────────

const toCamel = (s) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
const toSnake = (s) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

const mapKeys = (obj, fn) => {
  if (Array.isArray(obj)) return obj.map((item) => mapKeys(item, fn));
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [fn(k), v])
    );
  }
  return obj;
};

const snakeToCamel = (obj) => mapKeys(obj, toCamel);
const camelToSnake = (obj) => mapKeys(obj, toSnake);

const userService = {
  /**
   * Load user from localStorage (test mode) or Supabase profile (live mode).
   */
  loadUser(useTestData) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // corrupt data — fall through
      }
    }
    const newUser = buildDefaultUser();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  /** Persist user state to localStorage */
  saveUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  // ─── Supabase Profile ──────────────────────────────────────────────────────

  async loadProfile(authUserId) {
    if (!isSupabaseConfigured() || !authUserId) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUserId)
      .single();

    if (error) {
      console.error('loadProfile error:', error);
      return null;
    }
    return snakeToCamel(data);
  },

  async updateProfile(authUserId, updates) {
    if (!isSupabaseConfigured() || !authUserId) return null;

    const { data, error } = await supabase
      .from('profiles')
      .update(camelToSnake(updates))
      .eq('id', authUserId)
      .select()
      .single();

    if (error) throw error;
    return snakeToCamel(data);
  },

  // ─── Cart (Supabase) ──────────────────────────────────────────────────────

  async getCart(authUserId) {
    if (!isSupabaseConfigured() || !authUserId) return [];

    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', authUserId)
      .order('added_at', { ascending: true });

    if (error) { console.error('getCart error:', error); return []; }
    return (data || []).map((row) => ({
      id: row.id,
      ...row.item_data,
      addedAt: row.added_at,
    }));
  },

  async addCartItem(authUserId, itemData) {
    if (!isSupabaseConfigured() || !authUserId) return null;

    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: authUserId, item_data: itemData })
      .select()
      .single();

    if (error) throw error;
    return { id: data.id, ...data.item_data, addedAt: data.added_at };
  },

  async removeCartItem(cartItemId) {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId);
    if (error) throw error;
  },

  async clearCart(authUserId) {
    if (!isSupabaseConfigured() || !authUserId) return;
    const { error } = await supabase.from('cart_items').delete().eq('user_id', authUserId);
    if (error) throw error;
  },

  // ─── Booking History (Supabase) ────────────────────────────────────────────

  async getBookingHistory(authUserId) {
    if (!isSupabaseConfigured() || !authUserId) return [];

    const { data, error } = await supabase
      .from('booking_history')
      .select('*')
      .eq('user_id', authUserId)
      .order('booked_at', { ascending: false });

    if (error) { console.error('getBookingHistory error:', error); return []; }
    return (data || []).map(snakeToCamel);
  },

  async addBookingHistory(authUserId, bookingData) {
    if (!isSupabaseConfigured() || !authUserId) return null;

    const { data, error } = await supabase
      .from('booking_history')
      .insert({ user_id: authUserId, ...camelToSnake(bookingData) })
      .select()
      .single();

    if (error) throw error;
    return snakeToCamel(data);
  },

  async updateBookingHistory(bookingId, updates) {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('booking_history')
      .update(camelToSnake(updates))
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return snakeToCamel(data);
  },

  async deleteBookingHistory(bookingId) {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.from('booking_history').delete().eq('id', bookingId);
    if (error) throw error;
  },
};

export default userService;
