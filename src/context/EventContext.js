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

    setSponsorships((prevSponsors) => {
      const newSponsorshipId = Math.max(...prevSponsors.map((s) => s.id), 0) + 1;
      const newSponsorship = {
        id: newSponsorshipId,
        eventName: newEvent.name,
        eventId: newEvent.id,
        sponsorshipLevel: 'Gold',
        amount: '$10,000',
        date: eventDate,
        status: 'Active',
        description: `Sponsorship for ${newEvent.name}`,
      };
      return [...prevSponsors, newSponsorship];
    });

    return newEvent;
  }, [events]);

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

  const value = {
    events,
    sponsorships,
    vendorQuotes,
    createEvent,
    createSponsorship,
    getEventsByRole,
    getEventById,
    updateEvent,
    updateSponsorship,
    deleteEvent,
    deleteSponsorship,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
