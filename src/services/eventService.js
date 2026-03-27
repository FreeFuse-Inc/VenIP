// Helper to get today's date string
const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ─── Mock Data ──────────────────────────────────────────────────────────────

const buildMockEvents = () => {
  const today = getLocalDateString();
  return [
    {
      id: 1,
      name: 'Summer Charity Gala',
      type: 'charity',
      date: today,
      status: 'Active',
      description: 'Fundraising event for local charities',
      createdBy: 'npo',
      location: 'Downtown Convention Center',
      attendees: 500,
      vendors: ['Caterer', 'DJ', 'Decorator'],
    },
    {
      id: 2,
      name: 'Annual Gala 2024',
      type: 'charity',
      date: '2024-12-15',
      status: 'Active',
      description: 'Annual fundraising gala event',
      createdBy: 'npo',
      location: 'Downtown Convention Center',
      attendees: 500,
      vendors: ['Caterer', 'DJ', 'Decorator'],
    },
    {
      id: 3,
      name: 'Tech Conference 2025',
      type: 'business',
      date: '2025-02-20',
      status: 'Planning',
      description: 'Annual technology conference',
      createdBy: 'npo',
      location: 'Tech Hub Building',
      attendees: 1000,
      vendors: ['AV Company', 'Security'],
    },
    {
      id: 4,
      name: 'Community Wellness Summit',
      type: 'health',
      date: '2025-01-15',
      status: 'Active',
      description: 'Health and wellness focused event',
      createdBy: 'npo',
      location: 'Community Center',
      attendees: 500,
      vendors: [],
    },
  ];
};

const buildMockSponsorships = () => {
  const today = getLocalDateString();
  return [
    {
      id: 1,
      eventName: 'Summer Charity Gala',
      eventId: 1,
      sponsorshipLevel: 'Gold',
      amount: '$5,000',
      date: today,
      status: 'Active',
      description: 'Gold sponsor for Summer Charity Gala',
    },
    {
      id: 2,
      eventName: 'Annual Gala 2024',
      eventId: 2,
      sponsorshipLevel: 'Gold',
      amount: '$5,000',
      date: '2024-12-15',
      status: 'Active',
      description: 'Gold sponsor for Annual Gala',
    },
    {
      id: 3,
      eventName: 'Tech Conference 2025',
      eventId: 3,
      sponsorshipLevel: 'Platinum',
      amount: '$10,000',
      date: '2025-02-20',
      status: 'Active',
      description: 'Platinum sponsor for Tech Conference',
    },
  ];
};

const buildMockVendorQuotes = () => {
  const today = getLocalDateString();
  return [
    {
      id: 1,
      eventName: 'Summer Charity Gala',
      eventId: 1,
      service: 'Catering',
      quoteAmount: '$2,500',
      status: 'Pending',
      date: today,
    },
    {
      id: 2,
      eventName: 'Annual Gala 2024',
      eventId: 2,
      service: 'Catering',
      quoteAmount: '$2,500',
      status: 'Pending',
      date: '2024-12-15',
    },
    {
      id: 3,
      eventName: 'Tech Conference 2025',
      eventId: 3,
      service: 'AV Equipment',
      quoteAmount: '$5,000',
      status: 'Accepted',
      date: '2025-02-20',
    },
  ];
};

const buildMockSponsors = () => {
  const today = getLocalDateString();
  return [
    {
      id: 1,
      companyName: 'Acme Corporation',
      industry: 'Technology',
      contactPerson: 'John Smith',
      email: 'john@acme.com',
      sponsorshipLevel: 'Platinum',
      investment: '$10,000',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop',
      rating: 4.8,
      reviews: 124,
      benefits: ['Logo Placement', 'VIP Access', 'Social Media', 'Keynote Slot'],
      available: false,
      createdByNPO: 'npo',
      createdAt: today,
    },
    {
      id: 2,
      companyName: 'Green Earth Foundation',
      industry: 'Environmental',
      contactPerson: 'Lisa Green',
      email: 'lisa@greenearth.org',
      sponsorshipLevel: 'Gold',
      investment: '$5,000',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop',
      rating: 4.9,
      reviews: 89,
      benefits: ['Logo Placement', 'Booth Space', 'Newsletter Feature'],
      available: false,
      createdByNPO: 'npo',
      createdAt: today,
    },
    {
      id: 3,
      companyName: 'Metro Financial Group',
      industry: 'Finance',
      contactPerson: 'Robert Chen',
      email: 'robert@metrofinancial.com',
      sponsorshipLevel: 'Gold',
      investment: '$7,500',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop',
      rating: 4.5,
      reviews: 67,
      benefits: ['Logo Placement', 'VIP Access', 'Panel Speaker'],
      available: false,
      createdByNPO: 'npo',
      createdAt: '2025-01-10',
    },
    {
      id: 4,
      companyName: 'Sunrise Media',
      industry: 'Media',
      contactPerson: 'Amanda Torres',
      email: 'amanda@sunrisemedia.com',
      sponsorshipLevel: 'Silver',
      investment: '$3,000',
      status: 'Pending',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=500&h=300&fit=crop',
      rating: 4.7,
      reviews: 156,
      benefits: ['Social Media', 'Event Coverage', 'Press Release'],
      available: false,
      createdByNPO: 'npo',
      createdAt: '2025-01-05',
    },
    {
      id: 5,
      companyName: 'CloudTech Solutions',
      industry: 'Technology',
      contactPerson: 'David Park',
      email: 'david@cloudtech.io',
      sponsorshipLevel: 'Bronze',
      investment: '$1,500',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop',
      rating: 4.9,
      reviews: 42,
      benefits: ['Logo Placement', 'Booth Space'],
      available: true,
      createdByNPO: 'sponsor',
      createdAt: '2025-01-01',
    },
  ];
};

const buildMockVendorServices = () => {
  const today = getLocalDateString();
  return [
    {
      id: 1,
      vendorId: 'vendor',
      serviceName: 'Premium Catering Package',
      category: 'Catering',
      description: 'Full-service catering for events up to 500 guests including menu customization, wait staff, and cleanup.',
      priceRange: '$2,000 - $8,000',
      basePrice: 2000,
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500&h=300&fit=crop',
      rating: 4.8,
      reviews: 124,
      features: ['Menu Customization', 'Wait Staff', 'Bar Service', 'Cleanup'],
      availability: 'Available',
      createdAt: today,
    },
    {
      id: 2,
      vendorId: 'vendor',
      serviceName: 'DJ & Entertainment Package',
      category: 'Entertainment',
      description: 'Professional DJ services with sound system, lighting, and MC for events of any size.',
      priceRange: '$1,500 - $5,000',
      basePrice: 1500,
      image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=500&h=300&fit=crop',
      rating: 4.9,
      reviews: 89,
      features: ['Sound System', 'LED Lighting', 'MC Services', 'Custom Playlists'],
      availability: 'Available',
      createdAt: today,
    },
    {
      id: 3,
      vendorId: 'vendor',
      serviceName: 'Event Photography & Video',
      category: 'Photography',
      description: 'Capture every moment with professional photography and videography coverage.',
      priceRange: '$1,200 - $4,000',
      basePrice: 1200,
      image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=500&h=300&fit=crop',
      rating: 4.7,
      reviews: 156,
      features: ['Photo Coverage', 'Video Coverage', 'Drone Shots', 'Same-Day Edits'],
      availability: 'Available',
      createdAt: today,
    },
    {
      id: 4,
      vendorId: 'vendor',
      serviceName: 'Floral & Décor Design',
      category: 'Décor',
      description: 'Transform any venue with stunning floral arrangements and custom décor design.',
      priceRange: '$800 - $6,000',
      basePrice: 800,
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=300&fit=crop',
      rating: 4.6,
      reviews: 67,
      features: ['Floral Arrangements', 'Table Settings', 'Stage Design', 'Theme Décor'],
      availability: 'Unavailable',
      createdAt: '2026-01-10',
    },
    {
      id: 5,
      vendorId: 'vendor',
      serviceName: 'Event Coordination',
      category: 'Coordination',
      description: 'End-to-end event coordination and day-of management to ensure seamless execution.',
      priceRange: '$1,000 - $3,500',
      basePrice: 1000,
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&h=300&fit=crop',
      rating: 4.9,
      reviews: 42,
      features: ['Timeline Management', 'Vendor Coordination', 'Day-of Management', 'Guest Management'],
      availability: 'Available',
      createdAt: '2026-01-05',
    },
    {
      id: 6,
      vendorId: 'vendor',
      serviceName: 'AV & Sound Systems',
      category: 'AV/Sound',
      description: 'Professional audio-visual equipment rental and technical support for conferences and events.',
      priceRange: '$1,800 - $7,000',
      basePrice: 1800,
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=500&h=300&fit=crop',
      rating: 4.5,
      reviews: 98,
      features: ['Projectors & Screens', 'Microphones', 'Live Streaming', 'Technical Support'],
      availability: 'Available',
      createdAt: '2026-02-01',
    },
  ];
};

const buildMockVendorCommitments = () => {
  return [
    {
      id: 1,
      vendorId: 'vendor',
      serviceId: 1,
      serviceName: 'Premium Catering Package',
      eventName: 'Summer Charity Gala',
      clientName: 'Green Earth Foundation',
      clientEmail: 'events@greenearth.org',
      clientPhone: '(555) 111-2222',
      eventDate: '2026-04-15',
      eventLocation: 'Downtown Convention Center',
      attendees: 300,
      agreedPrice: '$4,500',
      status: 'Confirmed',
      bookedAt: '2026-03-01',
      notes: 'Vegan options required for 30% of guests',
    },
    {
      id: 2,
      vendorId: 'vendor',
      serviceId: 2,
      serviceName: 'DJ & Entertainment Package',
      eventName: 'Tech Conference 2026',
      clientName: 'Innovate Labs',
      clientEmail: 'events@innovatelabs.com',
      clientPhone: '(555) 333-4444',
      eventDate: '2026-05-20',
      eventLocation: 'Tech Hub Building',
      attendees: 800,
      agreedPrice: '$3,200',
      status: 'Pending',
      bookedAt: '2026-03-10',
      notes: 'Need opening and closing sets, plus background music during breaks',
    },
    {
      id: 3,
      vendorId: 'vendor',
      serviceId: 3,
      serviceName: 'Event Photography & Video',
      eventName: 'Community Wellness Summit',
      clientName: 'Healthy Living Corp',
      clientEmail: 'media@healthyliving.org',
      clientPhone: '(555) 555-6666',
      eventDate: '2026-03-10',
      eventLocation: 'Community Center Hall',
      attendees: 200,
      agreedPrice: '$2,800',
      status: 'Completed',
      bookedAt: '2026-02-15',
      notes: 'Delivered 500+ photos and highlight reel',
    },
    {
      id: 4,
      vendorId: 'vendor',
      serviceId: 1,
      serviceName: 'Premium Catering Package',
      eventName: 'Annual Awards Night',
      clientName: 'Metro Financial Group',
      clientEmail: 'events@metrofinancial.com',
      clientPhone: '(555) 777-8888',
      eventDate: '2026-06-01',
      eventLocation: 'Riverside Park Pavilion',
      attendees: 150,
      agreedPrice: '$3,800',
      status: 'Confirmed',
      bookedAt: '2026-03-15',
      notes: 'Black-tie dinner service, premium bar package',
    },
    {
      id: 5,
      vendorId: 'vendor',
      serviceId: 5,
      serviceName: 'Event Coordination',
      eventName: 'Spring Fundraiser',
      clientName: 'Sunrise Media',
      clientEmail: 'hello@sunrisemedia.com',
      clientPhone: '(555) 999-0000',
      eventDate: '2026-04-28',
      eventLocation: 'Downtown Convention Center',
      attendees: 400,
      agreedPrice: '$2,500',
      status: 'Cancelled',
      bookedAt: '2026-02-20',
      notes: 'Event postponed to later date',
    },
  ];
};

const buildMockVenues = () => {
  const today = getLocalDateString();
  return [
    {
      id: 1,
      name: 'Downtown Convention Center',
      location: 'Downtown District',
      capacity: 1000,
      amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment'],
      rate: '$2,500/day',
      available: true,
      image: 'https://images.unsplash.com/photo-1519167758993-c8585aa81ead?w=500&h=300&fit=crop',
      rating: 4.8,
      reviews: 124,
      createdByNPO: 'npo',
      createdAt: today,
    },
    {
      id: 2,
      name: 'Community Center Hall',
      location: 'Midtown',
      capacity: 500,
      amenities: ['WiFi', 'Parking', 'Sound System'],
      rate: '$1,200/day',
      available: true,
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&h=300&fit=crop',
      rating: 4.5,
      reviews: 89,
      createdByNPO: 'npo',
      createdAt: today,
    },
    {
      id: 3,
      name: 'Tech Hub Building',
      location: 'Innovation Park',
      capacity: 800,
      amenities: ['WiFi', 'High-speed Internet', 'Presentation Tech', 'Breakout Rooms'],
      rate: '$3,000/day',
      available: true,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
      rating: 4.9,
      reviews: 156,
      createdByNPO: 'npo',
      createdAt: '2025-01-10',
    },
    {
      id: 4,
      name: 'Riverside Park Pavilion',
      location: 'Riverside',
      capacity: 300,
      amenities: ['Outdoor Space', 'Parking', 'Restrooms'],
      rate: '$800/day',
      available: true,
      image: 'https://images.unsplash.com/photo-1509439773649-0a0eb3706ead?w=500&h=300&fit=crop',
      rating: 4.6,
      reviews: 78,
      createdByNPO: 'sponsor',
      createdAt: '2025-01-05',
    },
  ];
};

// ─── Service API ────────────────────────────────────────────────────────────

const eventService = {
  // ── Events ──
  getEvents(useTestData) {
    if (useTestData) return buildMockEvents();
    // Supabase: would call supabase.from('events').select('*')
    return [];
  },

  // ── Sponsorships ──
  getSponsorships(useTestData) {
    if (useTestData) return buildMockSponsorships();
    return [];
  },

  // ── Vendor Quotes ──
  getVendorQuotes(useTestData) {
    if (useTestData) return buildMockVendorQuotes();
    return [];
  },

  // ── Sponsors ──
  getSponsors(useTestData) {
    if (useTestData) return buildMockSponsors();
    return [];
  },

  // ── Vendor Services ──
  getVendorServices(useTestData) {
    if (useTestData) return buildMockVendorServices();
    return [];
  },

  // ── Vendor Commitments ──
  getVendorCommitments(useTestData) {
    if (useTestData) return buildMockVendorCommitments();
    return [];
  },

  // ── Venues ──
  getVenues(useTestData) {
    if (useTestData) return buildMockVenues();
    return [];
  },
};

export default eventService;
