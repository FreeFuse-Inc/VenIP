import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { useDataMode } from '../services/dataMode';
import feedbackService from '../services/feedbackService';

export const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const { useTestData } = useDataMode();

  const [feedback, setFeedback] = useState([]);
  const [feedbackRequests, setFeedbackRequests] = useState([]);
  const [integrations, setIntegrations] = useState(() => feedbackService.getIntegrations(useTestData));
  const [isLoading, setIsLoading] = useState(true);

  const dataModeRef = useRef(useTestData);
  dataModeRef.current = useTestData;

  // Fetch feedback data
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const loadAll = async () => {
      try {
        const [fb, fbReqs] = await Promise.all([
          Promise.resolve(feedbackService.getFeedback(useTestData)),
          Promise.resolve(feedbackService.getFeedbackRequests(useTestData)),
        ]);

        if (!cancelled) {
          setFeedback(fb || []);
          setFeedbackRequests(fbReqs || []);
          setIntegrations(feedbackService.getIntegrations(useTestData));
        }
      } catch (err) {
        console.error('FeedbackContext loadAll error:', err);
        if (!cancelled) {
          setFeedback([]);
          setFeedbackRequests([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadAll();
    return () => { cancelled = true; };
  }, [useTestData]);

  const submitFeedback = useCallback(async (feedbackData) => {
    const payload = {
      ...feedbackData,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'new',
    };

    if (!dataModeRef.current) {
      try {
        const created = await feedbackService.createFeedback(payload);
        if (created) {
          setFeedback((prev) => [created, ...prev]);
          return created;
        }
      } catch (err) {
        console.error('submitFeedback error:', err);
      }
    }

    // Test data fallback
    const newFeedback = {
      id: Math.max(...feedback.map((f) => f.id), 0) + 1,
      ...payload,
    };
    setFeedback((prev) => [...prev, newFeedback]);
    return newFeedback;
  }, [feedback]);

  const updateFeedbackStatus = useCallback(async (feedbackId, status) => {
    setFeedback((prev) =>
      prev.map((f) => (f.id === feedbackId ? { ...f, status } : f))
    );

    if (!dataModeRef.current) {
      try {
        await feedbackService.updateFeedbackStatus(feedbackId, status);
      } catch (err) {
        console.error('updateFeedbackStatus error:', err);
      }
    }
  }, []);

  const getFeedbackByEvent = useCallback((eventId) => {
    return feedback.filter((f) => f.eventId === eventId);
  }, [feedback]);

  const getNewFeedbackCount = useCallback(() => {
    return feedback.filter((f) => f.status === 'new').length;
  }, [feedback]);

  const createFeedbackRequest = useCallback(async (requestData) => {
    const payload = {
      ...requestData,
      sentAt: new Date().toISOString().split('T')[0],
      status: 'sent',
    };

    if (!dataModeRef.current) {
      try {
        const created = await feedbackService.createFeedbackRequest(payload);
        if (created) {
          setFeedbackRequests((prev) => [created, ...prev]);
          return created;
        }
      } catch (err) {
        console.error('createFeedbackRequest error:', err);
      }
    }

    // Test data fallback
    const newRequest = {
      id: Math.max(...feedbackRequests.map((r) => r.id), 0) + 1,
      ...payload,
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
    isLoading,
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
