// hooks/useToast.js
import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'info',
  });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'info' });
    }, 3000);
  }, []);

  const hideToast = useCallback(() => {
    setToast({ visible: false, message: '', type: 'info' });
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};

export default useToast;