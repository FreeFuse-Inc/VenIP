import React, { createContext, useState, useCallback } from 'react';

export const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [feedback, setFeedback] = useState([
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
  ]);

  const [feedbackRequests, setFeedbackRequests] = useState([
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
  ]);

  const [integrations, setIntegrations] = useState({
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

  const submitFeedback = useCallback((feedbackData) => {
    const newFeedback = {
      id: Math.max(...feedback.map((f) => f.id), 0) + 1,
      ...feedbackData,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    setFeedback((prev) => [...prev, newFeedback]);
    return newFeedback;
  }, [feedback]);

  const updateFeedbackStatus = useCallback((feedbackId, status) => {
    setFeedback((prev) =>
      prev.map((f) => (f.id === feedbackId ? { ...f, status } : f))
    );
  }, []);

  const getFeedbackByEvent = useCallback((eventId) => {
    return feedback.filter((f) => f.eventId === eventId);
  }, [feedback]);

  const getNewFeedbackCount = useCallback(() => {
    return feedback.filter((f) => f.status === 'new').length;
  }, [feedback]);

  const createFeedbackRequest = useCallback((requestData) => {
    const newRequest = {
      id: Math.max(...feedbackRequests.map((r) => r.id), 0) + 1,
      ...requestData,
      sentAt: new Date().toISOString().split('T')[0],
      status: 'sent',
    };
    setFeedbackRequests((prev) => [...prev, newRequest]);
    return newRequest;
  }, [feedbackRequests]);

  const connectIntegration = useCallback((service, apiKey, additionalData = {}) => {
    setIntegrations((prev) => ({
      ...prev,
      [service]: {
        ...prev[service],
        connected: true,
        apiKey,
        ...additionalData,
      },
    }));
  }, []);

  const disconnectIntegration = useCallback((service) => {
    setIntegrations((prev) => ({
      ...prev,
      [service]: {
        ...prev[service],
        connected: false,
        apiKey: '',
      },
    }));
  }, []);

  const getIntegrationStatus = useCallback((service) => {
    return integrations[service]?.connected || false;
  }, [integrations]);

  const value = {
    feedback,
    feedbackRequests,
    integrations,
    submitFeedback,
    updateFeedbackStatus,
    getFeedbackByEvent,
    getNewFeedbackCount,
    createFeedbackRequest,
    connectIntegration,
    disconnectIntegration,
    getIntegrationStatus,
  };

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>;
};
