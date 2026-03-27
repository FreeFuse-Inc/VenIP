import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useDataMode } from '../services/dataMode';
import feedbackService from '../services/feedbackService';

export const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const { useTestData } = useDataMode();

  const [feedback, setFeedback] = useState(() => feedbackService.getFeedback(useTestData));
  const [feedbackRequests, setFeedbackRequests] = useState(() => feedbackService.getFeedbackRequests(useTestData));
  const [integrations, setIntegrations] = useState(() => feedbackService.getIntegrations(useTestData));

  // Re-initialize when data mode changes
  useEffect(() => {
    setFeedback(feedbackService.getFeedback(useTestData));
    setFeedbackRequests(feedbackService.getFeedbackRequests(useTestData));
    setIntegrations(feedbackService.getIntegrations(useTestData));
  }, [useTestData]);

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
