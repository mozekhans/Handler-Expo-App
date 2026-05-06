import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import businessService from '../services/businessService';
import { useAuth } from '../hooks/useAuth';

export const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [currentBusiness, setCurrentBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadBusinesses();
    } else {
      setBusinesses([]);
      setCurrentBusiness(null);
    }
  }, [isAuthenticated, user]);

  const loadBusinesses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await businessService.getBusinesses();
      setBusinesses(data);
      
      const savedBusinessId = await AsyncStorage.getItem('currentBusinessId');
      if (savedBusinessId && data.some(b => b.id === savedBusinessId)) {
        setCurrentBusiness(data.find(b => b.id === savedBusinessId));
      } else if (data.length > 0) {
        setCurrentBusiness(data[0]);
        await AsyncStorage.setItem('currentBusinessId', data[0].id);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createBusiness = async (businessData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newBusiness = await businessService.createBusiness(businessData);
      setBusinesses(prev => [...prev, newBusiness]);
      setCurrentBusiness(newBusiness);
      await AsyncStorage.setItem('currentBusinessId', newBusiness.id);
      
      return { success: true, data: newBusiness };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateBusiness = async (id, data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedBusiness = await businessService.updateBusiness(id, data);
      setBusinesses(prev => prev.map(b => b.id === id ? updatedBusiness : b));
      
      if (currentBusiness?.id === id) {
        setCurrentBusiness(updatedBusiness);
      }
      
      return { success: true, data: updatedBusiness };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBusiness = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await businessService.deleteBusiness(id);
      setBusinesses(prev => prev.filter(b => b.id !== id));
      
      if (currentBusiness?.id === id) {
        const nextBusiness = businesses.find(b => b.id !== id);
        setCurrentBusiness(nextBusiness || null);
        await AsyncStorage.setItem('currentBusinessId', nextBusiness?.id || '');
      }
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const switchBusiness = async (businessId) => {
    const business = businesses.find(b => b.id === businessId);
    if (business) {
      setCurrentBusiness(business);
      await AsyncStorage.setItem('currentBusinessId', businessId);
    }
  };

  const refreshCurrentBusiness = async () => {
    if (!currentBusiness) return;
    
    try {
      const updated = await businessService.getBusiness(currentBusiness.id);
      setCurrentBusiness(updated);
      setBusinesses(prev => prev.map(b => b.id === currentBusiness.id ? updated : b));
    } catch (error) {
      setError(error.message);
    }
  };

  const value = {
    businesses,
    currentBusiness,
    isLoading,
    error,
    hasBusiness: businesses.length > 0,
    loadBusinesses,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    switchBusiness,
    refreshCurrentBusiness
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};