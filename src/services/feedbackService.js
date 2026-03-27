import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

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

// ─── Mock Data ──────────────────────────────────────────────────────────────

const buildMockFeedback = () => [
  {
    id: 1,
    eventId: 1,
    eventName: 'Annual Gala 2024',
    eventDate: '2024-12-15',
    submittedBy: 'John Sponsor',
    submittedByRole: 'sponsor',
    submittedAt: '2024-12-16',
    type: 'venue',
    ratings: {
      location: 5,
      cleanliness: 4,
      amenities: 5,
      staff: 4,
      value: 4,
    },
    comments: 'Great venue for the event. Staff was helpful.',
    status: 'new',
  },
];

const buildMockFeedbackRequests = () => [
  {
    id: 1,
    eventId: 2,
    eventName: 'Community Cleanup',
    eventDate: '2025-01-20',
    recipients: ['vendor@example.com'],
    feedbackType: 'service',
    status: 'pending',
    sentAt: '2025-01-21',
  },
];

const buildDefaultIntegrations = () => ({
  zapier: {
    connected: false,
    apiKey: '',
    webhookUrl: '',
  },
  stripe: {
    connected: false,
    apiKey: '',
    stripeConnectId: '',
  },
});

// ─── Service API ────────────────────────────────────────────────────────────

const feedbackService = {
  async getFeedback(useTestData) {
    if (useTestData) return buildMockFeedback();
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) { console.error('getFeedback error:', error); return []; }
    return (data || []).map(snakeToCamel);
  },

  async createFeedback(feedbackData) {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('feedback')
      .insert(camelToSnake(feedbackData))
      .select()
      .single();

    if (error) throw error;
    return snakeToCamel(data);
  },

  async updateFeedbackStatus(feedbackId, status) {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('feedback')
      .update({ status })
      .eq('id', feedbackId)
      .select()
      .single();

    if (error) throw error;
    return snakeToCamel(data);
  },

  async getFeedbackRequests(useTestData) {
    if (useTestData) return buildMockFeedbackRequests();
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('feedback_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) { console.error('getFeedbackRequests error:', error); return []; }
    return (data || []).map(snakeToCamel);
  },

  async createFeedbackRequest(requestData) {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('feedback_requests')
      .insert(camelToSnake(requestData))
      .select()
      .single();

    if (error) throw error;
    return snakeToCamel(data);
  },

  getIntegrations(useTestData) {
    // Integrations are always local config for now
    return buildDefaultIntegrations();
  },
};

export default feedbackService;
