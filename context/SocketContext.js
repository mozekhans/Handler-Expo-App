import React, { createContext, useEffect, useState } from 'react';
import socketService from '../services/socketService';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (isAuthenticated && user) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user]);

  const connectSocket = async () => {
    try {
      socketService.connect();
      
      if (socketService.on) {
        socketService.on('connect', () => {
          setIsConnected(true);
          setSocketId(socketService.getSocketId());
        });

        socketService.on('disconnect', () => {
          setIsConnected(false);
          setSocketId(null);
        });

        socketService.on('error', (error) => {
          console.error('Socket error:', error);
        });
      }

      // FIX: Check if methods exist before calling them
      if (socketService.onNewEngagement && typeof socketService.onNewEngagement === 'function') {
        socketService.onNewEngagement((data) => {
          if (addNotification) {
            addNotification({
              type: 'engagement',
              title: 'New Engagement',
              body: `New ${data.type} from ${data.user}`,
              data
            });
          }
        });
      }

      if (socketService.onNewMessage && typeof socketService.onNewMessage === 'function') {
        socketService.onNewMessage((data) => {
          if (addNotification) {
            addNotification({
              type: 'message',
              title: 'New Message',
              body: `Message from ${data.user}`,
              data
            });
          }
        });
      }

      if (socketService.onNewMention && typeof socketService.onNewMention === 'function') {
        socketService.onNewMention((data) => {
          if (addNotification) {
            addNotification({
              type: 'mention',
              title: 'You were mentioned',
              body: `Mentioned by ${data.user}`,
              data
            });
          }
        });
      }

      if (socketService.onContentPublished && typeof socketService.onContentPublished === 'function') {
        socketService.onContentPublished((data) => {
          if (addNotification) {
            addNotification({
              type: 'content',
              title: 'Content Published',
              body: `"${data.title}" is now live`,
              data
            });
          }
        });
      }

      // FIX: Add null check for onCampaignUpdate
      if (socketService.onCampaignUpdate && typeof socketService.onCampaignUpdate === 'function') {
        socketService.onCampaignUpdate((data) => {
          if (addNotification) {
            addNotification({
              type: 'campaign',
              title: 'Campaign Update',
              body: data.message,
              data
            });
          }
        });
      } else {
        console.warn('[Socket] onCampaignUpdate method not available in socketService');
      }

      if (socketService.onAnalyticsUpdate && typeof socketService.onAnalyticsUpdate === 'function') {
        socketService.onAnalyticsUpdate((data) => {
          // Handle analytics updates
          console.log('Analytics update:', data);
        });
      }

    } catch (error) {
      console.error('Socket connection error:', error);
    }
  };

  const disconnectSocket = () => {
    if (socketService.disconnect) {
      socketService.disconnect();
    }
    setIsConnected(false);
    setSocketId(null);
  };

  const joinBusiness = (businessId) => {
    if (socketService.joinBusiness) {
      socketService.joinBusiness(businessId);
    }
  };

  const leaveBusiness = (businessId) => {
    if (socketService.leaveBusiness) {
      socketService.leaveBusiness(businessId);
    }
  };

  const sendTyping = (businessId, conversationId, isTyping) => {
    if (socketService.sendTyping) {
      socketService.sendTyping(businessId, conversationId, isTyping);
    }
  };

  const markMessageRead = (businessId, conversationId, messageId) => {
    if (socketService.markMessageRead) {
      socketService.markMessageRead(businessId, conversationId, messageId);
    }
  };

  const value = {
    isConnected,
    socketId,
    joinBusiness,
    leaveBusiness,
    sendTyping,
    markMessageRead
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};