// hooks/useEngagementActions.js
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import engagementService from '../services/engagementService';

export const useEngagementActions = (businessId) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);

  const executeAction = useCallback(async (action, handler) => {
    try {
      setActionLoading(true);
      setCurrentAction(action);
      const result = await handler();
      return result;
    } catch (error) {
      const message = error.response?.data?.message || error.message || `Failed to ${action}`;
      Alert.alert('Error', message);
      throw error;
    } finally {
      setActionLoading(false);
      setCurrentAction(null);
    }
  }, []);

  const replyToEngagement = useCallback(async (engagementId, message, aiGenerated = false) => {
    return executeAction('reply', () =>
      engagementService.replyToEngagement(businessId, engagementId, {
        message,
        aiGenerated,
      })
    );
  }, [businessId, executeAction]);

  const bulkReply = useCallback(async (engagementIds, message, aiGenerated = false) => {
    return executeAction('bulk reply', () =>
      engagementService.bulkReply(businessId, {
        engagementIds,
        message,
        aiGenerated,
      })
    );
  }, [businessId, executeAction]);

  const generateAIResponse = useCallback(async (text, context = {}) => {
    return executeAction('generate AI response', () =>
      engagementService.generateAIResponse(businessId, {
        text,
        context,
      })
    );
  }, [businessId, executeAction]);

  const generateBulkAIResponses = useCallback(async (comments, options = {}) => {
    return executeAction('generate bulk AI responses', () =>
      engagementService.generateAIResponse(businessId, {
        comments,
        ...options,
      }, true) // bulk endpoint
    );
  }, [businessId, executeAction]);

  const analyzeSentiment = useCallback(async (text) => {
    return executeAction('analyze sentiment', () =>
      engagementService.analyzeSentiment(businessId, text)
    );
  }, [businessId, executeAction]);

  const assignEngagement = useCallback(async (engagementId, userId) => {
    return executeAction('assign', () =>
      engagementService.assignEngagement(businessId, engagementId, userId)
    );
  }, [businessId, executeAction]);

  const markAsSpam = useCallback(async (engagementId) => {
    return executeAction('mark as spam', () =>
      engagementService.markAsSpam(businessId, engagementId)
    );
  }, [businessId, executeAction]);

  const markAsRead = useCallback(async (engagementId) => {
    return executeAction('mark as read', () =>
      engagementService.markAsRead(businessId, engagementId)
    );
  }, [businessId, executeAction]);

  const markAllAsRead = useCallback(async () => {
    return executeAction('mark all as read', () =>
      engagementService.markAllAsRead(businessId)
    );
  }, [businessId, executeAction]);

  const addNote = useCallback(async (engagementId, noteData) => {
    return executeAction('add note', () =>
      engagementService.addNote(businessId, engagementId, noteData)
    );
  }, [businessId, executeAction]);

  const addTag = useCallback(async (engagementId, tag) => {
    return executeAction('add tag', () =>
      engagementService.addTag(businessId, engagementId, tag)
    );
  }, [businessId, executeAction]);

  const removeTag = useCallback(async (engagementId, tag) => {
    return executeAction('remove tag', () =>
      engagementService.removeTag(businessId, engagementId, tag)
    );
  }, [businessId, executeAction]);

  const getConversation = useCallback(async (engagementId) => {
    return executeAction('get conversation', () =>
      engagementService.getConversation(businessId, engagementId)
    );
  }, [businessId, executeAction]);

  const getStats = useCallback(async (params = {}) => {
    return executeAction('get stats', () =>
      engagementService.getStats(businessId, params)
    );
  }, [businessId, executeAction]);

  const exportEngagements = useCallback(async (params = {}) => {
    return executeAction('export', () =>
      engagementService.exportEngagements(businessId, params)
    );
  }, [businessId, executeAction]);

  return {
    actionLoading,
    currentAction,
    replyToEngagement,
    bulkReply,
    generateAIResponse,
    generateBulkAIResponses,
    analyzeSentiment,
    assignEngagement,
    markAsSpam,
    markAsRead,
    markAllAsRead,
    addNote,
    addTag,
    removeTag,
    getConversation,
    getStats,
    exportEngagements,
  };
};