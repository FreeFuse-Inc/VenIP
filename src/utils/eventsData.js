// Shared events data - acts as a mock database
// In production, this would come from an API

export const allEvents = [
  {
    id: 1,
    name: 'Annual Gala 2024',
    venue: 'Downtown Convention Center',
    location: 'Downtown Convention Center',
    date: '2024-12-15',
    time: '7:00 PM',
    status: 'Open',
    planningStatus: 'Planning',
    service: 'Catering',
    serviceNeeded: 'Catering',
    budget: '$5,000 - $10,000',
    budgetRange: '$5,000 - $10,000',
    totalBudget: 15000,
    budgetUsed: 4500,
    attendeeTarget: 300,
    attendeeConfirmed: 45,
    eventType: 'Fundraising Gala',
    description: 'Annual fundraising gala to support local communities. Looking for professional catering services to serve 300 guests.',
    additionalInfo: 'Vegetarian and vegan options required. Dietary restrictions must be accommodated.',
  },
  {
    id: 2,
    name: 'Charity Fundraiser',
    venue: 'Grand Hotel',
    location: 'Grand Hotel',
    date: '2025-01-10',
    time: '6:00 PM',
    status: 'Open',
    planningStatus: 'Planning',
    service: 'Decorations',
    serviceNeeded: 'Decorations',
    budget: '$3,000 - $6,000',
    budgetRange: '$3,000 - $6,000',
    totalBudget: 8000,
    budgetUsed: 1200,
    attendeeTarget: 200,
    attendeeConfirmed: 30,
    eventType: 'Charity Event',
    description: 'Charity fundraiser event to raise funds for local shelters. Looking for creative decoration services to transform the venue.',
    additionalInfo: 'Theme: Winter Wonderland. Must include centerpieces and stage decorations.',
  },
  {
    id: 3,
    name: 'Community Cleanup',
    venue: 'Central Park',
    location: 'Central Park',
    date: '2025-01-20',
    time: '9:00 AM',
    status: 'Open',
    planningStatus: 'Planning',
    service: 'Photography',
    serviceNeeded: 'Photography',
    budget: '$1,500 - $3,000',
    budgetRange: '$1,500 - $3,000',
    totalBudget: 5000,
    budgetUsed: 800,
    attendeeTarget: 150,
    attendeeConfirmed: 65,
    eventType: 'Community Event',
    description: 'Community cleanup initiative at Central Park. Need photographer to document the event for social media and press releases.',
    additionalInfo: 'Outdoor event. Need both candid shots and group photos. Drone photography is a plus.',
  },
  {
    id: 4,
    name: 'Corporate Awards Night',
    venue: 'Business Center',
    location: 'Business Center',
    date: '2024-12-20',
    time: '7:30 PM',
    status: 'Pending',
    planningStatus: 'Planning',
    service: 'Catering',
    serviceNeeded: 'Catering',
    budget: '$4,000 - $8,000',
    budgetRange: '$4,000 - $8,000',
    totalBudget: 12000,
    budgetUsed: 3000,
    attendeeTarget: 250,
    attendeeConfirmed: 120,
    eventType: 'Corporate Event',
    description: 'Annual corporate awards ceremony celebrating employee achievements. Formal dinner service required.',
    additionalInfo: 'Black-tie event. Need cocktail hour appetizers and 3-course dinner.',
  },
  {
    id: 5,
    name: 'Wedding Celebration',
    venue: 'Garden Estate',
    location: 'Garden Estate',
    date: '2024-11-28',
    time: '4:00 PM',
    status: 'Active',
    planningStatus: 'Active',
    service: 'Photography',
    serviceNeeded: 'Photography',
    budget: '$2,500 - $5,000',
    budgetRange: '$2,500 - $5,000',
    totalBudget: 20000,
    budgetUsed: 8500,
    attendeeTarget: 180,
    attendeeConfirmed: 165,
    eventType: 'Wedding',
    description: 'Outdoor garden wedding with ceremony and reception. Full day photography coverage needed.',
    additionalInfo: 'Ceremony at 4pm, reception until 11pm. Second photographer preferred.',
  },
];

// Helper function to get event by ID
export const getEventById = (id) => {
  const eventId = parseInt(id, 10);
  return allEvents.find(event => event.id === eventId) || null;
};

// Get available events for vendors (open status)
export const getAvailableEvents = () => {
  return allEvents.filter(event => event.status === 'Open');
};

// Get events for proposals
export const getProposalEvents = () => {
  return allEvents.filter(event => event.status === 'Pending' || event.status === 'Active');
};

// Format date for display
export const formatEventDate = (dateStr) => {
  const date = new Date(dateStr);
  return {
    day: date.getDate(),
    month: date.toLocaleString('en-US', { month: 'short' }),
    full: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
};
