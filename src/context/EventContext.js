import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
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

  const [events, setEvents] = useState([]);
  const [sponsorships, setSponsorships] = useState([]);
  const [vendorQuotes, setVendorQuotes] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [vendorServices, setVendorServices] = useState([]);
  const [vendorCommitments, setVendorCommitments] = useState([]);
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Track current data mode to avoid stale updates
  const dataModeRef = useRef(useTestData);
  dataModeRef.current = useTestData;

  // Fetch all data (works for both test and Supabase)
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const loadAll = async () => {
      try {
        const [ev, sp, vq, spon, vs, vc, ven] = await Promise.all([
          Promise.resolve(eventService.getEvents(useTestData)),
          Promise.resolve(eventService.getSponsorships(useTestData)),
          Promise.resolve(eventService.getVendorQuotes(useTestData)),
          Promise.resolve(eventService.getSponsors(useTestData)),
          Promise.resolve(eventService.getVendorServices(useTestData)),
          Promise.resolve(eventService.getVendorCommitments(useTestData)),
          Promise.resolve(eventService.getVenues(useTestData)),
        ]);

        if (!cancelled) {
          setEvents(ev || []);
          setSponsorships(sp || []);
          setVendorQuotes(vq || []);
          setSponsors(spon || []);
          setVendorServices(vs || []);
          setVendorCommitments(vc || []);
          setVenues(ven || []);
        }
      } catch (err) {
        console.error('EventContext loadAll error:', err);
        if (!cancelled) {
          setEvents([]);
          setSponsorships([]);
          setVendorQuotes([]);
          setSponsors([]);
          setVendorServices([]);
          setVendorCommitments([]);
          setVenues([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadAll();
    return () => { cancelled = true; };
  }, [useTestData]);

  // ── Events CRUD ──

  const createEvent = useCallback(async (eventData) => {
    const eventDate = eventData.date || getLocalDateString();
    const payload = {
      ...eventData,
      createdBy: eventData.createdBy || 'npo',
      status: 'Planning',
      vendors: eventData.vendors || [],
      date: eventDate,
      name: eventData.name || eventData.eventName,
    };

    if (!dataModeRef.current) {
      try {
        const created = await eventService.createEvent(payload);
        if (created) {
          setEvents((prev) => [created, ...prev]);
          return created;
        }
      } catch (err) {
        console.error('createEvent error:', err);
      }
    }

    // Test data fallback — local-only
    const newEventId = Math.max(...(events.length ? events.map((e) => e.id) : [0]), 0) + 1;
    const newEvent = { id: newEventId, ...payload };
    setEvents((prev) => [...prev, newEvent]);
    return newEvent;
  }, [events]);

  const createEventWithSponsorship = useCallback(async (eventData) => {
    const eventDate = eventData.date || getLocalDateString();
    const eventPayload = {
      ...eventData,
      createdBy: eventData.createdBy || 'npo',
      status: 'Planning',
      vendors: [],
      date: eventDate,
      name: eventData.name || eventData.eventName,
    };

    let newEvent;

    if (!dataModeRef.current) {
      try {
        newEvent = await eventService.createEvent(eventPayload);
        if (newEvent) {
          setEvents((prev) => [newEvent, ...prev]);

          const sponsorPayload = {
            eventName: newEvent.name,
            eventId: newEvent.id,
            sponsorshipLevel: 'Gold',
            amount: '$10,000',
            date: eventDate,
            status: 'Active',
            description: `Sponsorship for ${newEvent.name}`,
          };
          const newSponsorship = await eventService.createSponsorship(sponsorPayload);
          if (newSponsorship) {
            setSponsorships((prev) => [newSponsorship, ...prev]);
          }
          return { event: newEvent, sponsorship: newSponsorship };
        }
      } catch (err) {
        console.error('createEventWithSponsorship error:', err);
      }
    }

    // Test data fallback
    const maxEventId = events.length > 0 ? Math.max(...events.map((e) => e.id || 0)) : 0;
    newEvent = { id: maxEventId + 1, ...eventPayload };
    setEvents((prev) => [...prev, newEvent]);

    const newSponsorship = {
      id: (sponsorships.length > 0 ? Math.max(...sponsorships.map((s) => s.id || 0)) : 0) + 1,
      eventName: newEvent.name,
      eventId: newEvent.id,
      sponsorshipLevel: 'Gold',
      amount: '$10,000',
      date: eventDate,
      status: 'Active',
      description: `Sponsorship for ${newEvent.name}`,
    };
    setSponsorships((prev) => [...prev, newSponsorship]);
    return { event: newEvent, sponsorship: newSponsorship };
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
    (id) => events.find((e) => e.id === parseInt(id)),
    [events]
  );

  const updateEvent = useCallback(async (id, updatedData) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedData } : e))
    );

    if (!dataModeRef.current) {
      try {
        await eventService.updateEvent(id, updatedData);
      } catch (err) {
        console.error('updateEvent error:', err);
      }
    }
  }, []);

  const deleteEvent = useCallback(async (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));

    if (!dataModeRef.current) {
      try {
        await eventService.deleteEvent(id);
      } catch (err) {
        console.error('deleteEvent error:', err);
      }
    }
  }, []);

  // ── Sponsorships CRUD ──

  const createSponsorship = useCallback(async (sponsorshipData) => {
    const sponsorshipDate = sponsorshipData.date || getLocalDateString();
    const payload = { ...sponsorshipData, date: sponsorshipDate };

    if (!dataModeRef.current) {
      try {
        const created = await eventService.createSponsorship(payload);
        if (created) {
          setSponsorships((prev) => [created, ...prev]);
          return created;
        }
      } catch (err) {
        console.error('createSponsorship error:', err);
      }
    }

    setSponsorships((prev) => {
      const newId = Math.max(...prev.map((s) => s.id), 0) + 1;
      return [...prev, { id: newId, ...payload }];
    });
  }, []);

  const updateSponsorship = useCallback(async (id, updatedData) => {
    setSponsorships((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );

    if (!dataModeRef.current) {
      try {
        await eventService.updateSponsorship(id, updatedData);
      } catch (err) {
        console.error('updateSponsorship error:', err);
      }
    }
  }, []);

  const deleteSponsorship = useCallback(async (id) => {
    setSponsorships((prev) => prev.filter((s) => s.id !== id));

    if (!dataModeRef.current) {
      try {
        await eventService.deleteSponsorship(id);
      } catch (err) {
        console.error('deleteSponsorship error:', err);
      }
    }
  }, []);

  // ── Venues CRUD ──

  const createVenue = useCallback(async (venueData, createdByNPO) => {
    const payload = {
      ...venueData,
      createdByNPO: createdByNPO || 'npo',
      createdAt: getLocalDateString(),
      available: venueData.available !== undefined ? venueData.available : true,
      rating: venueData.rating || 4.5,
      reviews: venueData.reviews || 0,
    };

    if (!dataModeRef.current) {
      try {
        const created = await eventService.createVenue(payload);
        if (created) {
          setVenues((prev) => [created, ...prev]);
          return created;
        }
      } catch (err) {
        console.error('createVenue error:', err);
      }
    }

    setVenues((prev) => {
      const newId = Math.max(...prev.map((v) => v.id), 0) + 1;
      return [...prev, { id: newId, ...payload }];
    });
  }, []);

  const updateVenue = useCallback(async (id, updatedData) => {
    setVenues((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updatedData } : v))
    );

    if (!dataModeRef.current) {
      try {
        await eventService.updateVenue(id, updatedData);
      } catch (err) {
        console.error('updateVenue error:', err);
      }
    }
  }, []);

  const deleteVenue = useCallback(async (id) => {
    setVenues((prev) => prev.filter((v) => v.id !== id));

    if (!dataModeRef.current) {
      try {
        await eventService.deleteVenue(id);
      } catch (err) {
        console.error('deleteVenue error:', err);
      }
    }
  }, []);

  const getNPOVenues = useCallback((npoId) => {
    return venues.filter((v) => v.createdByNPO === npoId);
  }, [venues]);

  const getAvailableVenues = useCallback((excludeNPOId) => {
    return venues.filter((v) => v.available && v.createdByNPO !== excludeNPOId);
  }, [venues]);

  // ── Sponsors CRUD ──

  const createSponsor = useCallback(async (sponsorData, npoId) => {
    const payload = {
      ...sponsorData,
      createdByNPO: npoId || 'npo',
      createdAt: getLocalDateString(),
      available: sponsorData.available !== undefined ? sponsorData.available : false,
      rating: sponsorData.rating || 4.5,
      reviews: sponsorData.reviews || 0,
    };

    if (!dataModeRef.current) {
      try {
        const created = await eventService.createSponsor(payload);
        if (created) {
          setSponsors((prev) => [created, ...prev]);
          return created;
        }
      } catch (err) {
        console.error('createSponsor error:', err);
      }
    }

    setSponsors((prev) => {
      const newId = Math.max(...prev.map((s) => s.id), 0) + 1;
      return [...prev, { id: newId, ...payload }];
    });
  }, []);

  const updateSponsor = useCallback(async (id, updatedData) => {
    setSponsors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    );

    if (!dataModeRef.current) {
      try {
        await eventService.updateSponsor(id, updatedData);
      } catch (err) {
        console.error('updateSponsor error:', err);
      }
    }
  }, []);

  const deleteSponsor = useCallback(async (id) => {
    setSponsors((prev) => prev.filter((s) => s.id !== id));

    if (!dataModeRef.current) {
      try {
        await eventService.deleteSponsor(id);
      } catch (err) {
        console.error('deleteSponsor error:', err);
      }
    }
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

  // ── Vendor Services CRUD ──

  const createVendorService = useCallback(async (serviceData, vendorId) => {
    const payload = {
      ...serviceData,
      vendorId: vendorId || 'vendor',
      createdAt: getLocalDateString(),
      rating: serviceData.rating || 4.5,
      reviews: serviceData.reviews || 0,
    };

    if (!dataModeRef.current) {
      try {
        const created = await eventService.createVendorService(payload);
        if (created) {
          setVendorServices((prev) => [created, ...prev]);
          return created;
        }
      } catch (err) {
        console.error('createVendorService error:', err);
      }
    }

    setVendorServices((prev) => {
      const newId = Math.max(...prev.map((s) => s.id), 0) + 1;
      return [...prev, { id: newId, ...payload }];
    });
  }, []);

  const updateVendorService = useCallback(async (id, updates) => {
    setVendorServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );

    if (!dataModeRef.current) {
      try {
        await eventService.updateVendorService(id, updates);
      } catch (err) {
        console.error('updateVendorService error:', err);
      }
    }
  }, []);

  const deleteVendorService = useCallback(async (id) => {
    setVendorServices((prev) => prev.filter((s) => s.id !== id));

    if (!dataModeRef.current) {
      try {
        await eventService.deleteVendorService(id);
      } catch (err) {
        console.error('deleteVendorService error:', err);
      }
    }
  }, []);

  const getVendorServices = useCallback((vendorId) => {
    return vendorServices.filter((s) => s.vendorId === vendorId);
  }, [vendorServices]);

  const getVendorCommitments = useCallback((vendorId) => {
    return vendorCommitments.filter((c) => c.vendorId === vendorId);
  }, [vendorCommitments]);

  const updateCommitmentStatus = useCallback(async (id, newStatus) => {
    setVendorCommitments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );

    if (!dataModeRef.current) {
      try {
        await eventService.updateVendorCommitmentStatus(id, newStatus);
      } catch (err) {
        console.error('updateCommitmentStatus error:', err);
      }
    }
  }, []);

  const value = {
    events,
    sponsorships,
    vendorQuotes,
    venues,
    sponsors,
    vendorServices,
    vendorCommitments,
    isLoading,
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
