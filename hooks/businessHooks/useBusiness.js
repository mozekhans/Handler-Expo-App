// src/hooks/useBusiness.js
import { useEffect, useCallback } from 'react';
import { useBusinessStore } from '../../stores/businessStore';

/**
 * Hook for managing a single business
 * @param {string} businessId - The ID of the business to load
 * @returns {Object} Business data and operations
 */
export const useBusiness = (businessId) => {
  const { 
    currentBusiness, 
    aiLearning, 
    loading, 
    error, 
    loadBusiness,
    updateBusiness: updateBusinessStore,
    deleteBusiness: deleteBusinessStore,
  } = useBusinessStore();

  // Load business when ID changes
  useEffect(() => {
    if (businessId) {
      loadBusiness(businessId);
    }
  }, [businessId, loadBusiness]);

  // Refetch business data
  const refetch = useCallback(() => {
    if (businessId) {
      return loadBusiness(businessId);
    }
  }, [businessId, loadBusiness]);

  // Update business
  const updateBusiness = useCallback(async (data) => {
    if (!businessId) {
      throw new Error('Business ID is required');
    }
    return updateBusinessStore(businessId, data);
  }, [businessId, updateBusinessStore]);

  // Delete business
  const deleteBusiness = useCallback(async () => {
    if (!businessId) {
      throw new Error('Business ID is required');
    }
    return deleteBusinessStore(businessId);
  }, [businessId, deleteBusinessStore]);

  // Check if business has specific feature
  const hasFeature = useCallback((featureName) => {
    return currentBusiness?.hasFeatureAccess?.(featureName) || false;
  }, [currentBusiness]);

  // Check if user is owner
  const isOwner = useCallback(() => {
    if (!currentBusiness) return false;
    const userId = useBusinessStore.getState().user?.id;
    return currentBusiness.owner === userId;
  }, [currentBusiness]);

  // Check if user is team member
  const isTeamMember = useCallback((userId) => {
    return currentBusiness?.isTeamMember?.(userId) || false;
  }, [currentBusiness]);

  // Get business stats
  const getStats = useCallback(() => {
    if (!currentBusiness?.stats) return null;
    return {
      totalPosts: currentBusiness.stats.totalPosts || 0,
      totalEngagement: currentBusiness.stats.totalEngagement || 0,
      totalFollowers: currentBusiness.stats.totalFollowers || 0,
      totalReach: currentBusiness.stats.totalReach || 0,
      averageEngagementRate: currentBusiness.stats.averageEngagementRate || 0,
      topPerformingPlatform: currentBusiness.stats.topPerformingPlatform,
    };
  }, [currentBusiness]);

  return {
    business: currentBusiness,
    aiLearning,
    loading,
    error,
    refetch,
    updateBusiness,
    deleteBusiness,
    hasFeature,
    isOwner,
    isTeamMember,
    getStats,
  };
};

export default useBusiness;