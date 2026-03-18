import React, { createContext, useState, useCallback } from 'react';

export const EventContext = createContext();

export const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const EventProvider = ({ children }) => {
  const today = getLocalDateString();

  const [events, setEvents] = useState([
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
  ]);

  const [sponsorships, setSponsorships] = useState([
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
  ]);

  const [vendorQuotes] = useState([
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
  ]);

  const [venues, setVenues] = useState([
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
  ]);

  const createEvent = useCallback((eventData) => {
    const eventDate = eventData.date || getLocalDateString();
    const newEventId = Math.max(...events.map((e) => e.id), 0) + 1;
    const newEvent = {
      id: newEventId,
      ...eventData,
      createdBy: eventData.createdBy || 'npo',
      status: 'Planning',
      vendors: [],
      date: eventDate,
      name: eventData.name || eventData.eventName,
    };

    setEvents((prev) => [...prev, newEvent]);

    return newEvent;
  }, [events]);

  const createEventWithSponsorship = useCallback((eventData) => {
    const eventDate = eventData.date || getLocalDateString();

    // Pre-calculate event ID based on current state
    const maxEventId = events && events.length > 0 ? Math.max(...events.map((e) => e.id || 0)) : 0;
    const newEventId = maxEventId + 1;

    // Create the event
    const newEvent = {
      id: newEventId,
      ...eventData,
      createdBy: eventData.createdBy || 'npo',
      status: 'Planning',
      vendors: [],
      date: eventDate,
      name: eventData.name || eventData.eventName,
    };

    // Pre-calculate sponsorship ID (will be recalculated in setState if needed)
    const maxSponsorshipId = sponsorships && sponsorships.length > 0 ? Math.max(...sponsorships.map((s) => s.id || 0)) : 0;

    // Update events state
    setEvents((prev) => [...prev, newEvent]);

    // Create sponsorship object
    const newSponsorship = {
      id: maxSponsorshipId + 1,
      eventName: newEvent.name,
      eventId: newEvent.id,
      sponsorshipLevel: 'Gold',
      amount: '$10,000',
      date: eventDate,
      status: 'Active',
      description: `Sponsorship for ${newEvent.name}`,
    };

    // Update sponsorships state
    setSponsorships((prev) => {
      // Recalculate ID based on actual current state
      const actualMaxId = prev && prev.length > 0 ? Math.max(...prev.map((s) => s.id || 0)) : 0;
      return [...prev, { ...newSponsorship, id: actualMaxId + 1 }];
    });

    // Return both
    return {
      event: newEvent,
      sponsorship: newSponsorship,
    };
  }, [events, sponsorships]);

  const getEventsByRole = useCallback((role, filterDate) => {
    let relevantItems = [];

    if (role === 'npo') {
      relevantItems = events;
    } else if (role === 'sponsor') {
      relevantItems = sponsorships;
    } else if (role === 'vendor') {
      relevantItems = vendorQuotes;
    }

    if (filterDate) {
      return relevantItems.filter(item => item.date === filterDate);
    }
    return relevantItems;
  }, [events, sponsorships, vendorQuotes]);

  const getEventById = useCallback(
    (id) => {
      return events.find((e) => e.id === parseInt(id));
    },
    [events]
  );

  const updateEvent = useCallback((id, updatedData) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedData } : e))
    );
  }, []);

  const deleteEvent = useCallback((id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const createSponsorship = useCallback((sponsorshipData) => {
    const sponsorshipDate = sponsorshipData.date || getLocalDateString();

    setSponsorships((prev) => {
      const newId = Math.max(...prev.map((s) => s.id), 0) + 1;
      const newSponsorship = {
        id: newId,
        ...sponsorshipData,
        date: sponsorshipDate,
      };
      return [...prev, newSponsorship];
    });
  }, []);

  const updateSponsorship = useCallback((id, updatedData) => {
    setSponsorships((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );
  }, []);

  const deleteSponsorship = useCallback((id) => {
    setSponsorships((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const createVenue = useCallback((venueData, createdByNPO) => {
    setVenues((prev) => {
      const newId = Math.max(...prev.map((v) => v.id), 0) + 1;
      const newVenue = {
        id: newId,
        ...venueData,
        createdByNPO: createdByNPO || 'npo',
        createdAt: getLocalDateString(),
        available: venueData.available !== undefined ? venueData.available : true,
        rating: venueData.rating || 4.5,
        reviews: venueData.reviews || 0,
      };
      return [...prev, newVenue];
    });
  }, []);

  const updateVenue = useCallback((id, updatedData) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updatedData } : v))
    );
  }, []);

  const deleteVenue = useCallback((id) => {
    setVenues((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const getNPOVenues = useCallback((npoId) => {
    return venues.filter((v) => v.createdByNPO === npoId);
  }, [venues]);

  const getAvailableVenues = useCallback((excludeNPOId) => {
    return venues.filter((v) => v.available && v.createdByNPO !== excludeNPOId);
  }, [venues]);

  const getNPOSponsors = useCallback((eventIds) => {
    return sponsorships.filter((s) => eventIds.includes(s.eventId));
  }, [sponsorships]);

  const getNPOEventIds = useCallback((npoId) => {
    return events
      .filter((e) => e.createdBy === npoId)
      .map((e) => e.id);
  }, [events]);

  const value = {
    events,
    sponsorships,
    vendorQuotes,
    venues,
    createEvent,
    createEventWithSponsorship,
    createSponsorship,
    createVenue,
    getEventsByRole,
    getEventById,
    updateEvent,
    updateSponsorship,
    updateVenue,
    deleteEvent,
    deleteSponsorship,
    deleteVenue,
    getNPOVenues,
    getAvailableVenues,
    getNPOSponsors,
    getNPOEventIds,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
