// hooks/useNotifications.js
import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider.\n' +
      'Wrap your app root with: <NotificationProvider>...</NotificationProvider>'
    );
  }
  
  return context;
};