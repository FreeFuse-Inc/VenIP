import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useDataMode } from '../services/dataMode';
import eventService from '../services/eventService';

export const EventContext = createContext();

export const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const EventProvider = ({ children }) => {
  const { useTestData } = useDataMode();

  // Initialize state from the service layer based on data mode
  const [events, setEvents] = useState(() => eventService.getEvents(useTestData));
  const [sponsorships, setSponsorships] = useState(() => eventService.getSponsorships(useTestData));
  const [vendorQuotes] = useState(() => eventService.getVendorQuotes(useTestData));
  const [sponsors, setSponsors] = useState(() => eventService.getSponsors(useTestData));
  const [vendorServices, setVendorServices] = useState(() => eventService.getVendorServices(useTestData));
  const [vendorCommitments, setVendorCommitments] = useState(() => eventService.getVendorCommitments(useTestData));
  const [venues, setVenues] = useState(() => eventService.getVenues(useTestData));

  // Re-initialize when data mode changes
  useEffect(() => {
    setEvents(eventService.getEvents(useTestData));
    setSponsorships(eventService.getSponsorships(useTestData));
    setSponsors(eventService.getSponsors(useTestData));
    setVendorServices(eventService.getVendorServices(useTestData));
    setVendorCommitments(eventService.getVendorCommitments(useTestData));
    setVenues(eventService.getVenues(useTestData));
  }, [useTestData]);

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

    const maxEventId = events && events.length > 0 ? Math.max(...events.map((e) => e.id || 0)) : 0;
    const newEventId = maxEventId + 1;

    const newEvent = {
      id: newEventId,
      ...eventData,
      createdBy: eventData.createdBy || 'npo',
      status: 'Planning',
      vendors: [],
      date: eventDate,
      name: eventData.name || eventData.eventName,
    };

    const maxSponsorshipId = sponsorships && sponsorships.length > 0 ? Math.max(...sponsorships.map((s) => s.id || 0)) : 0;

    setEvents((prev) => [...prev, newEvent]);

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

    setSponsorships((prev) => {
      const actualMaxId = prev && prev.length > 0 ? Math.max(...prev.map((s) => s.id || 0)) : 0;
      return [...prev, { ...newSponsorship, id: actualMaxId + 1 }];
    });

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

  const createSponsor = useCallback((sponsorData, npoId) => {
    setSponsors((prev) => {
      const newId = Math.max(...prev.map((s) => s.id), 0) + 1;
      const newSponsor = {
        id: newId,
        ...sponsorData,
        createdByNPO: npoId || 'npo',
        createdAt: getLocalDateString(),
        available: sponsorData.available !== undefined ? sponsorData.available : false,
        rating: sponsorData.rating || 4.5,
        reviews: sponsorData.reviews || 0,
      };
      return [...prev, newSponsor];
    });
  }, []);

  const updateSponsor = useCallback((id, updatedData) => {
    setSponsors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );
  }, []);

  const deleteSponsor = useCallback((id) => {
    setSponsors((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getNPOSponsorCompanies = useCallback((npoId) => {
    return sponsors.filter((s) => s.createdByNPO === npoId);
  }, [sponsors]);

  const getAvailableSponsorCompanies = useCallback((excludeNPOId) => {
    return sponsors.filter((s) => s.available && s.createdByNPO !== excludeNPOId);
  }, [sponsors]);

  const getNPOSponsors = useCallback((eventIds) => {
    return sponsorships.filter((s) => eventIds.includes(s.eventId));
  }, [sponsorships]);

  const getNPOEventIds = useCallback((npoId) => {
    return events
      .filter((e) => e.createdBy === npoId)
      .map((e) => e.id);
  }, [events]);

  // Vendor Services CRUD
  const createVendorService = useCallback((serviceData, vendorId) => {
    setVendorServices((prev) => {
      const newId = Math.max(...prev.map((s) => s.id), 0) + 1;
      const newService = {
        id: newId,
        ...serviceData,
        vendorId: vendorId || 'vendor',
        createdAt: getLocalDateString(),
        rating: serviceData.rating || 4.5,
        reviews: serviceData.reviews || 0,
      };
      return [...prev, newService];
    });
  }, []);

  const updateVendorService = useCallback((id, updates) => {
    setVendorServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteVendorService = useCallback((id) => {
    setVendorServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getVendorServices = useCallback((vendorId) => {
    return vendorServices.filter((s) => s.vendorId === vendorId);
  }, [vendorServices]);

  const getVendorCommitments = useCallback((vendorId) => {
    return vendorCommitments.filter((c) => c.vendorId === vendorId);
  }, [vendorCommitments]);

  const updateCommitmentStatus = useCallback((id, newStatus) => {
    setVendorCommitments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  }, []);

  const value = {
    events,
    sponsorships,
    vendorQuotes,
    venues,
    sponsors,
    vendorServices,
    vendorCommitments,
    createEvent,
    createEventWithSponsorship,
    createSponsorship,
    createSponsor,
    createVenue,
    getEventsByRole,
    getEventById,
    updateEvent,
    updateSponsorship,
    updateSponsor,
    updateVenue,
    deleteEvent,
    deleteSponsorship,
    deleteSponsor,
    deleteVenue,
    getNPOVenues,
    getAvailableVenues,
    getNPOSponsors,
    getNPOSponsorCompanies,
    getAvailableSponsorCompanies,
    getNPOEventIds,
    createVendorService,
    updateVendorService,
    deleteVendorService,
    getVendorServices,
    getVendorCommitments,
    updateCommitmentStatus,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
