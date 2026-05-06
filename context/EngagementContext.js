import React, { createContext, useState, useEffect, useCallback } from 'react';
import engagementService from '../services/engagementService';
import { useAuth } from '../hooks/useAuth';
import { useBusiness } from '../hooks/useBusiness';
import socketService from '../services/socketService';

export const EngagementContext = createContext();

export const EngagementProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [comments, setComments] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [stats, setStats] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const { currentBusiness } = useBusiness();

  useEffect(() => {
    if (isAuthenticated && currentBusiness) {
      loadStats();
      setupSocketListeners();
    }
    return () => {
      cleanupSocketListeners();
    };
  }, [isAuthenticated, currentBusiness]);

  const setupSocketListeners = () => {
    socketService.onNewMessage((data) => {
      if (data.businessId === currentBusiness?.id) {
        handleNewMessage(data);
      }
    });

    socketService.onNewComment((data) => {
      if (data.businessId === currentBusiness?.id) {
        handleNewComment(data);
      }
    });

    socketService.onNewMention((data) => {
      if (data.businessId === currentBusiness?.id) {
        handleNewMention(data);
      }
    });

    socketService.onUserTyping((data) => {
      if (currentConversation?.id === data.conversationId) {
        // Handle typing indicator
      }
    });
  };

  const cleanupSocketListeners = () => {
    // Remove listeners if needed
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
    if (currentConversation?.id === message.conversationId) {
      // Update conversation list with new message
      setConversations(prev => prev.map(conv => 
        conv.id === message.conversationId 
          ? { ...conv, lastMessage: message.text, lastMessageTime: message.createdAt, unread: conv.unread + 1 }
          : conv
      ));
    }
    setUnreadCount(prev => prev + 1);
  };

  const handleNewComment = (comment) => {
    setComments(prev => [comment, ...prev]);
  };

  const handleNewMention = (mention) => {
    setMentions(prev => [mention, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const loadStats = async () => {
    if (!currentBusiness) return;
    try {
      setLoading(true);
      const data = await engagementService.getStats(currentBusiness.id);
      setStats(data);
      setUnreadCount(data.unread || 0);
    } catch (err) {
      setError(err.message || 'Failed to load engagement stats');
    } finally {
      setLoading(false);
    }
  };

  const getConversations = async (params = {}) => {
    if (!currentBusiness) return [];
    try {
      setLoading(true);
      const data = await engagementService.getConversations(currentBusiness.id, params);
      setConversations(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getMessages = async (conversationId) => {
    try {
      setLoading(true);
      const data = await engagementService.getMessages(conversationId);
      setMessages(data.messages);
      setCurrentConversation(data.conversation);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load messages');
      return { messages: [], conversation: null };
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (conversationId, message) => {
    try {
      const data = await engagementService.sendMessage(conversationId, message);
      setMessages(prev => [...prev, data.message]);
      return data.message;
    } catch (err) {
      setError(err.message || 'Failed to send message');
      throw err;
    }
  };

  const getComments = async (postId, params = {}) => {
    if (!currentBusiness) return [];
    try {
      setLoading(true);
      const data = await engagementService.getComments(currentBusiness.id, { postId, ...params });
      setComments(data.comments);
      return data.comments;
    } catch (err) {
      setError(err.message || 'Failed to load comments');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const replyToComment = async (commentId, message) => {
    try {
      const data = await engagementService.replyToComment(commentId, message);
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, reply: data.reply }
          : comment
      ));
      return data;
    } catch (err) {
      setError(err.message || 'Failed to reply');
      throw err;
    }
  };

  const likeComment = async (commentId) => {
    try {
      const data = await engagementService.likeComment(commentId);
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: (comment.likes || 0) + 1, liked: true }
          : comment
      ));
      return data;
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  const getMentions = async (params = {}) => {
    if (!currentBusiness) return [];
    try {
      setLoading(true);
      const data = await engagementService.getMentions(currentBusiness.id, params);
      setMentions(data.mentions);
      return data.mentions;
    } catch (err) {
      setError(err.message || 'Failed to load mentions');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const replyToMention = async (mentionId, message) => {
    try {
      const data = await engagementService.replyToMention(mentionId, message);
      setMentions(prev => prev.map(mention => 
        mention.id === mentionId 
          ? { ...mention, reply: { text: message, createdAt: new Date() }, replied: true }
          : mention
      ));
      return data;
    } catch (err) {
      setError(err.message || 'Failed to reply');
      throw err;
    }
  };

  const markAsRead = async (engagementId) => {
    try {
      await engagementService.markAsRead(engagementId);
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const resolveEngagement = async (engagementId) => {
    try {
      await engagementService.resolveEngagement(engagementId);
      // Update local state
    } catch (err) {
      console.error('Failed to resolve engagement:', err);
    }
  };

  const deleteEngagement = async (engagementId) => {
    try {
      await engagementService.deleteEngagement(engagementId);
      setMentions(prev => prev.filter(m => m.id !== engagementId));
    } catch (err) {
      console.error('Failed to delete engagement:', err);
    }
  };

  const value = {
    conversations,
    currentConversation,
    messages,
    comments,
    mentions,
    stats,
    unreadCount,
    loading,
    error,
    getConversations,
    getMessages,
    sendMessage,
    getComments,
    replyToComment,
    likeComment,
    getMentions,
    replyToMention,
    markAsRead,
    resolveEngagement,
    deleteEngagement,
    loadStats,
  };

  return (
    <EngagementContext.Provider value={value}>
      {children}
    </EngagementContext.Provider>
  );
};