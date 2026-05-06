// frontend/hooks/useBusiness.js
import { useState, useContext, createContext } from 'react';
import { businessApi } from '../services/businessApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BusinessContext = createContext();

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within BusinessProvider');
  }
  return context;
};

export const BusinessProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState([]);
  const [currentBusiness, setCurrentBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all businesses for current user
  const loadBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await businessApi.getBusinesses();
      
      console.log('Load businesses response:', response);
      
      // Backend returns: { businesses: [...] }
      const businessesList = response?.businesses || [];
      setBusinesses(businessesList);
      
      // Load current business from storage
      const savedBusinessId = await AsyncStorage.getItem('currentBusinessId');
      if (savedBusinessId && businessesList.length > 0) {
        const current = businessesList.find(b => b._id === savedBusinessId);
        if (current) {
          setCurrentBusiness(current);
        } else if (businessesList.length > 0) {
          await switchBusiness(businessesList[0]._id);
        }
      } else if (businessesList.length > 0 && !savedBusinessId) {
        await switchBusiness(businessesList[0]._id);
      }
      
      return businessesList;
    } catch (err) {
      console.error('Load businesses error:', err);
      setError(err.message || 'Failed to load businesses');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create a new business
  const createBusiness = async (businessData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform data to match backend schema
      const transformedData = {
        name: businessData.name,
        industry: getIndustryValue(businessData.industry),
        website: businessData.website || '',
        description: businessData.description || '',
      };
      
      console.log('Creating business with data:', transformedData);
      
      const response = await businessApi.createBusiness(transformedData);
      
      console.log('Create business response:', response);
      
      // Backend returns: { message: 'Business created successfully', business }
      const newBusiness = response?.business;
      
      if (newBusiness && newBusiness._id) {
        console.log('New business created:', newBusiness);
        setBusinesses(prev => [...prev, newBusiness]);
        // Auto-select this business
        await switchBusiness(newBusiness._id);
        return { success: true, business: newBusiness };
      } else {
        console.error('Invalid response structure - missing business:', response);
        return { success: false, error: 'Invalid response from server' };
      }
    } catch (err) {
      console.error('Create business error:', err);
      setError(err.message || 'Failed to create business');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Switch current business
  const switchBusiness = async (businessId) => {
    try {
      setLoading(true);
      setError(null);
      await businessApi.switchBusiness(businessId);
      await AsyncStorage.setItem('currentBusinessId', businessId);
      
      const business = businesses.find(b => b._id === businessId);
      if (business) {
        setCurrentBusiness(business);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Switch business error:', err);
      setError(err.message || 'Failed to switch business');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update business
  const updateBusiness = async (businessId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await businessApi.updateBusiness(businessId, updateData);
      
      // Backend returns: { message: 'Business updated successfully', business }
      const updatedBusiness = response?.business;
      
      if (updatedBusiness) {
        setBusinesses(prev => prev.map(b => 
          b._id === businessId ? updatedBusiness : b
        ));
        
        if (currentBusiness?._id === businessId) {
          setCurrentBusiness(updatedBusiness);
        }
      }
      
      return { success: true, business: updatedBusiness };
    } catch (err) {
      console.error('Update business error:', err);
      setError(err.message || 'Failed to update business');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete business
  const deleteBusiness = async (businessId) => {
    try {
      setLoading(true);
      setError(null);
      await businessApi.deleteBusiness(businessId);
      
      const updatedBusinesses = businesses.filter(b => b._id !== businessId);
      setBusinesses(updatedBusinesses);
      
      if (currentBusiness?._id === businessId) {
        if (updatedBusinesses.length > 0) {
          await switchBusiness(updatedBusinesses[0]._id);
        } else {
          setCurrentBusiness(null);
          await AsyncStorage.removeItem('currentBusinessId');
        }
      }
      
      return { success: true };
    } catch (err) {
      console.error('Delete business error:', err);
      setError(err.message || 'Failed to delete business');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Get single business by ID
  const getBusiness = async (businessId) => {
    try {
      setLoading(true);
      const response = await businessApi.getBusiness(businessId);
      
      // Backend returns: { business: {...}, aiLearning: {...} }
      return response?.business || null;
    } catch (err) {
      console.error('Get business error:', err);
      setError(err.message || 'Failed to get business');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get business stats
  const getBusinessStats = async (businessId) => {
    try {
      const response = await businessApi.getBusinessStats(businessId);
      
      // Backend returns: { stats: {...} }
      return response?.stats || null;
    } catch (err) {
      console.error('Failed to get business stats:', err);
      return null;
    }
  };

  // Update brand voice
  const updateBrandVoice = async (businessId, brandVoice) => {
    try {
      const response = await businessApi.updateBrandVoice(businessId, brandVoice);
      
      // Backend returns: { message: 'Brand voice updated successfully', brandVoice }
      return { success: true, brandVoice: response?.brandVoice };
    } catch (err) {
      console.error('Update brand voice error:', err);
      return { success: false, error: err.message };
    }
  };

  // Update target audience
  const updateTargetAudience = async (businessId, targetAudience) => {
    try {
      const response = await businessApi.updateTargetAudience(businessId, targetAudience);
      
      // Backend returns: { message: 'Target audience updated successfully', targetAudience }
      return { success: true, targetAudience: response?.targetAudience };
    } catch (err) {
      console.error('Update target audience error:', err);
      return { success: false, error: err.message };
    }
  };

  const value = {
    businesses,
    currentBusiness,
    loading,
    error,
    loadBusinesses,
    createBusiness,
    switchBusiness,
    updateBusiness,
    deleteBusiness,
    getBusiness,
    getBusinessStats,
    updateBrandVoice,
    updateTargetAudience,
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};

// Helper function to get industry value from label (matches backend enum)
const getIndustryValue = (label) => {
  const industryMap = {
    'Technology': 'technology',
    'Software': 'software',
    'E-commerce': 'ecommerce',
    'Retail': 'retail',
    'Fashion': 'fashion',
    'Beauty': 'beauty',
    'Food & Beverage': 'food_beverage',
    'Travel': 'travel',
    'Hospitality': 'hospitality',
    'Healthcare': 'healthcare',
    'Fitness': 'fitness',
    'Education': 'education',
    'Finance': 'finance',
    'Real Estate': 'real_estate',
    'Automotive': 'automotive',
    'Entertainment': 'entertainment',
    'Media': 'media',
    'Nonprofit': 'nonprofit',
    'Professional Services': 'professional_services',
    'Manufacturing': 'manufacturing',
    'Construction': 'construction',
    'Agriculture': 'agriculture',
    'Energy': 'energy',
    'Telecommunications': 'telecommunications',
    'Transportation': 'transportation',
    'Other': 'other',
  };
  return industryMap[label] || 'other';
};