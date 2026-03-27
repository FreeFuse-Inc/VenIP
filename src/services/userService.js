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

const userService = {
  /**
   * Load user from localStorage (or create a new one).
   * When useTestData is false the same logic applies — the user object
   * would later be hydrated from Supabase profiles table.
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

  /** Persist user state */
  saveUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },
};

export default userService;
