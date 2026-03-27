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

const feedbackService = {
  getFeedback(useTestData) {
    if (useTestData) return buildMockFeedback();
    return [];
  },

  getFeedbackRequests(useTestData) {
    if (useTestData) return buildMockFeedbackRequests();
    return [];
  },

  getIntegrations(useTestData) {
    // Integrations are always local config for now
    return buildDefaultIntegrations();
  },
};

export default feedbackService;
