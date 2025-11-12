import React, { createContext, useState, useCallback } from 'react';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      eventName: 'Annual Gala 2024',
      eventId: 1,
      sponsorshipLevel: 'Gold',
      amount: '$5,000',
      date: '2024-12-15',
      status: 'Active',
      description: 'Gold sponsor for Annual Gala',
    },
    {
      id: 2,
      eventName: 'Tech Conference 2025',
      eventId: 2,
      sponsorshipLevel: 'Platinum',
      amount: '$10,000',
      date: '2025-02-20',
      status: 'Active',
      description: 'Platinum sponsor for Tech Conference',
    },
  ]);

  const [vendorQuotes, setVendorQuotes] = useState([
    {
      id: 1,
      eventName: 'Annual Gala 2024',
      eventId: 1,
      service: 'Catering',
      quoteAmount: '$2,500',
      status: 'Pending',
      date: '2024-12-15',
    },
    {
      id: 2,
      eventName: 'Tech Conference 2025',
      eventId: 2,
      service: 'AV Equipment',
      quoteAmount: '$5,000',
      status: 'Accepted',
      date: '2025-02-20',
    },
  ]);

  const createEvent = useCallback((eventData) => {
    const newEvent = {
      id: Math.max(...events.map((e) => e.id), 0) + 1,
      ...eventData,
      createdBy: eventData.createdBy || 'npo',
      status: 'Planning',
      vendors: [],
      date: eventData.date || new Date().toISOString().split('T')[0],
    };
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  }, [events]);

  const getEventsByRole = useCallback((role) => {
    if (role === 'npo') {
      return events;
    } else if (role === 'sponsor') {
      return sponsorships;
    } else if (role === 'vendor') {
      return vendorQuotes;
    }
    return [];
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

  const value = {
    events,
    sponsorships,
    vendorQuotes,
    createEvent,
    getEventsByRole,
    getEventById,
    updateEvent,
    deleteEvent,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
