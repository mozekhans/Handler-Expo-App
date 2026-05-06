import React, { createContext, useState, useCallback } from 'react';
import socialService from '../services/socialService';
import { useBusiness } from '../hooks/useBusiness';

export const SocialContext = createContext();

export const SocialProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [webhooks, setWebhooks] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [media, setMedia] = useState([]);
  const { currentBusiness } = useBusiness();

  // Helper to get business ID
  const getBusinessId = useCallback((businessId = null) => {
    return businessId || currentBusiness?.id;
  }, [currentBusiness]);

  // OAuth Methods
  const getAuthUrl = useCallback(async (platform, redirectUri, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.getAuthUrl(id, platform, redirectUri);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to get auth URL');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const connectAccount = useCallback(async (platform, code, redirectUri, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.connectAccount(id, platform, code, redirectUri);
      if (response?.success && response?.account) {
        setAccounts(prev => [...prev, response.account]);
        return response.account;
      }
      return null;
    } catch (err) {
      setError(err.message || 'Failed to connect account');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  // Account Management
  const getAccounts = useCallback(async (businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id) return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.getAccounts(id);
      const accountsList = response?.accounts || [];
      setAccounts(accountsList);
      return accountsList;
    } catch (err) {
      setError(err.message || 'Failed to get accounts');
      return [];
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const getAccount = useCallback(async (accountId, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.getAccount(id, accountId);
      const account = response?.account;
      setCurrentAccount(account);
      return account;
    } catch (err) {
      setError(err.message || 'Failed to get account');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const updateAccount = useCallback(async (accountId, settings, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.updateAccount(id, accountId, settings);
      const updatedAccount = response?.account;
      if (updatedAccount) {
        setAccounts(prev => prev.map(a => a.id === accountId ? updatedAccount : a));
        if (currentAccount?.id === accountId) {
          setCurrentAccount(updatedAccount);
        }
      }
      return updatedAccount;
    } catch (err) {
      setError(err.message || 'Failed to update account');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId, currentAccount]);

  const disconnectAccount = useCallback(async (accountId, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return false;
    
    try {
      setLoading(true);
      setError(null);
      await socialService.disconnectAccount(id, accountId);
      setAccounts(prev => prev.filter(a => a.id !== accountId));
      if (currentAccount?.id === accountId) {
        setCurrentAccount(null);
      }
      return true;
    } catch (err) {
      setError(err.message || 'Failed to disconnect account');
      return false;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId, currentAccount]);

  const refreshToken = useCallback(async (accountId, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return false;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.refreshToken(id, accountId);
      return response?.expiresAt;
    } catch (err) {
      setError(err.message || 'Failed to refresh token');
      return false;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const syncAccount = useCallback(async (accountId, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.syncAccount(id, accountId);
      const metrics = response?.metrics;
      if (metrics) {
        setAccounts(prev => prev.map(a => 
          a.id === accountId ? { ...a, metrics, lastSync: new Date() } : a
        ));
        setMetrics(metrics);
      }
      return metrics;
    } catch (err) {
      setError(err.message || 'Failed to sync account');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const syncAllAccounts = useCallback(async (businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.syncAllAccounts(id);
      await getAccounts(id);
      return response?.results;
    } catch (err) {
      setError(err.message || 'Failed to sync accounts');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId, getAccounts]);

  // Webhooks
  const createWebhook = useCallback(async (accountId, url, events, secret = null, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.createWebhook(id, accountId, url, events, secret);
      const webhook = response?.webhook;
      if (webhook) {
        setWebhooks(prev => [...prev, webhook]);
      }
      return webhook;
    } catch (err) {
      setError(err.message || 'Failed to create webhook');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const deleteWebhook = useCallback(async (accountId, webhookId, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId || !webhookId) return false;
    
    try {
      setLoading(true);
      setError(null);
      await socialService.deleteWebhook(id, accountId, webhookId);
      setWebhooks(prev => prev.filter(w => w.id !== webhookId));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete webhook');
      return false;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const testWebhook = useCallback(async (accountId, webhookId, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId || !webhookId) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.testWebhook(id, accountId, webhookId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to test webhook');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  // Insights & Metrics
  const getAccountInsights = useCallback(async (accountId, params = {}, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.getAccountInsights(id, accountId, params);
      const insightsData = response?.insights;
      setInsights(insightsData);
      return insightsData;
    } catch (err) {
      setError(err.message || 'Failed to get insights');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const getAccountMetrics = useCallback(async (accountId, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.getAccountMetrics(id, accountId);
      const metricsData = response?.metrics;
      setMetrics(metricsData);
      return metricsData;
    } catch (err) {
      setError(err.message || 'Failed to get metrics');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  // Posts
  const getPosts = useCallback(async (accountId, params = {}, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.getPosts(id, accountId, params);
      const postsList = response?.posts || [];
      setPosts(postsList);
      return postsList;
    } catch (err) {
      setError(err.message || 'Failed to get posts');
      return [];
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  // Comments
  const getComments = useCallback(async (accountId, postId, params = {}, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId || !postId) return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.getComments(id, accountId, postId, params);
      const commentsList = response?.comments || [];
      setComments(commentsList);
      return commentsList;
    } catch (err) {
      setError(err.message || 'Failed to get comments');
      return [];
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const replyToComment = useCallback(async (accountId, commentId, message, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId || !commentId) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.replyToComment(id, accountId, commentId, message);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to reply to comment');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  // Messages
  const getMessages = useCallback(async (accountId, params = {}, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.getMessages(id, accountId, params);
      const messagesList = response?.messages || [];
      setMessages(messagesList);
      return messagesList;
    } catch (err) {
      setError(err.message || 'Failed to get messages');
      return [];
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const sendMessage = useCallback(async (accountId, recipientId, message, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId || !recipientId) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.sendMessage(id, accountId, recipientId, message);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to send message');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  // Mentions
  const getMentions = useCallback(async (accountId, params = {}, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.getMentions(id, accountId, params);
      const mentionsList = response?.mentions || [];
      setMentions(mentionsList);
      return mentionsList;
    } catch (err) {
      setError(err.message || 'Failed to get mentions');
      return [];
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  // Hashtags
  const getTrendingHashtags = useCallback(async (accountId, platform, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.getTrendingHashtags(id, accountId, platform);
      return response?.hashtags || [];
    } catch (err) {
      setError(err.message || 'Failed to get trending hashtags');
      return [];
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const searchHashtags = useCallback(async (accountId, query, platform, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.searchHashtags(id, accountId, query, platform);
      return response?.hashtags || [];
    } catch (err) {
      setError(err.message || 'Failed to search hashtags');
      return [];
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  // Scheduled Posts
  const getScheduledPosts = useCallback(async (accountId, params = {}, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.getScheduledPosts(id, accountId, params);
      const scheduled = response?.posts || [];
      setScheduledPosts(scheduled);
      return scheduled;
    } catch (err) {
      setError(err.message || 'Failed to get scheduled posts');
      return [];
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const cancelScheduledPost = useCallback(async (accountId, scheduledId, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId || !scheduledId) return false;
    
    try {
      setLoading(true);
      setError(null);
      await socialService.cancelScheduledPost(id, accountId, scheduledId);
      setScheduledPosts(prev => prev.filter(p => p.id !== scheduledId));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to cancel scheduled post');
      return false;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  // Drafts
  const getDrafts = useCallback(async (accountId, params = {}, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.getDrafts(id, accountId, params);
      const draftsList = response?.drafts || [];
      setDrafts(draftsList);
      return draftsList;
    } catch (err) {
      setError(err.message || 'Failed to get drafts');
      return [];
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const saveDraft = useCallback(async (accountId, content, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.saveDraft(id, accountId, content);
      const draft = response?.draft;
      if (draft) {
        setDrafts(prev => [draft, ...prev]);
      }
      return draft;
    } catch (err) {
      setError(err.message || 'Failed to save draft');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const updateDraft = useCallback(async (accountId, draftId, content, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId || !draftId) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.updateDraft(id, accountId, draftId, content);
      const updatedDraft = response?.draft;
      if (updatedDraft) {
        setDrafts(prev => prev.map(d => d.id === draftId ? updatedDraft : d));
      }
      return updatedDraft;
    } catch (err) {
      setError(err.message || 'Failed to update draft');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const deleteDraft = useCallback(async (accountId, draftId, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId || !draftId) return false;
    
    try {
      setLoading(true);
      setError(null);
      await socialService.deleteDraft(id, accountId, draftId);
      setDrafts(prev => prev.filter(d => d.id !== draftId));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete draft');
      return false;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  // Media
  const getMedia = useCallback(async (accountId, params = {}, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return [];
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.getMedia(id, accountId, params);
      const mediaList = response?.media || [];
      setMedia(mediaList);
      return mediaList;
    } catch (err) {
      setError(err.message || 'Failed to get media');
      return [];
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const uploadMedia = useCallback(async (accountId, file, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return null;
    
    try {
      setLoading(true);
      setError(null);
      const response = await socialService.uploadMedia(id, accountId, file);
      const mediaItem = response?.media;
      if (mediaItem) {
        setMedia(prev => [mediaItem, ...prev]);
      }
      return mediaItem;
    } catch (err) {
      setError(err.message || 'Failed to upload media');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  const deleteMedia = useCallback(async (accountId, mediaId, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId || !mediaId) return false;
    
    try {
      setLoading(true);
      setError(null);
      await socialService.deleteMedia(id, accountId, mediaId);
      setMedia(prev => prev.filter(m => m.id !== mediaId));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete media');
      return false;
    } finally {
      setLoading(false);
    }
  }, [getBusinessId]);

  // Account Health & Settings
  const getAccountHealth = useCallback(async (accountId, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return null;
    
    try {
      const response = await socialService.getAccountHealth(id, accountId);
      return response?.health;
    } catch (err) {
      setError(err.message || 'Failed to get account health');
      return null;
    }
  }, [getBusinessId]);

  const getRateLimits = useCallback(async (accountId, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return null;
    
    try {
      const response = await socialService.getRateLimits(id, accountId);
      return response?.limits;
    } catch (err) {
      setError(err.message || 'Failed to get rate limits');
      return null;
    }
  }, [getBusinessId]);

  const getAccountSettings = useCallback(async (accountId, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return null;
    
    try {
      const response = await socialService.getAccountSettings(id, accountId);
      return response?.settings;
    } catch (err) {
      setError(err.message || 'Failed to get account settings');
      return null;
    }
  }, [getBusinessId]);

  const updateAccountSettings = useCallback(async (accountId, settings, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return null;
    
    try {
      const response = await socialService.updateAccountSettings(id, accountId, settings);
      return response?.settings;
    } catch (err) {
      setError(err.message || 'Failed to update account settings');
      return null;
    }
  }, [getBusinessId]);

  const getDefaultPostingTimes = useCallback(async (accountId, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return null;
    
    try {
      const response = await socialService.getDefaultPostingTimes(id, accountId);
      return response?.times;
    } catch (err) {
      setError(err.message || 'Failed to get posting times');
      return null;
    }
  }, [getBusinessId]);

  const updateDefaultPostingTimes = useCallback(async (accountId, times, businessId = null) => {
    const id = getBusinessId(businessId);
    if (!id || !accountId) return null;
    
    try {
      const response = await socialService.updateDefaultPostingTimes(id, accountId, times);
      return response?.times;
    } catch (err) {
      setError(err.message || 'Failed to update posting times');
      return null;
    }
  }, [getBusinessId]);

  // Reset state
  const resetSocialState = useCallback(() => {
    setAccounts([]);
    setCurrentAccount(null);
    setWebhooks([]);
    setPosts([]);
    setComments([]);
    setMessages([]);
    setMentions([]);
    setInsights(null);
    setMetrics(null);
    setScheduledPosts([]);
    setDrafts([]);
    setMedia([]);
    setError(null);
  }, []);

  const value = {
    // State
    loading,
    error,
    accounts,
    currentAccount,
    webhooks,
    posts,
    comments,
    messages,
    mentions,
    insights,
    metrics,
    scheduledPosts,
    drafts,
    media,
    
    // OAuth Methods
    getAuthUrl,
    connectAccount,
    
    // Account Management
    getAccounts,
    getAccount,
    updateAccount,
    disconnectAccount,
    refreshToken,
    syncAccount,
    syncAllAccounts,
    
    // Webhooks
    createWebhook,
    deleteWebhook,
    testWebhook,
    
    // Insights & Metrics
    getAccountInsights,
    getAccountMetrics,
    
    // Posts
    getPosts,
    
    // Comments
    getComments,
    replyToComment,
    
    // Messages
    getMessages,
    sendMessage,
    
    // Mentions
    getMentions,
    
    // Hashtags
    getTrendingHashtags,
    searchHashtags,
    
    // Scheduled Posts
    getScheduledPosts,
    cancelScheduledPost,
    
    // Drafts
    getDrafts,
    saveDraft,
    updateDraft,
    deleteDraft,
    
    // Media
    getMedia,
    uploadMedia,
    deleteMedia,
    
    // Account Health & Settings
    getAccountHealth,
    getRateLimits,
    getAccountSettings,
    updateAccountSettings,
    getDefaultPostingTimes,
    updateDefaultPostingTimes,
    
    // Reset
    resetSocialState,
  };

  return (
    <SocialContext.Provider value={value}>
      {children}
    </SocialContext.Provider>
  );
};