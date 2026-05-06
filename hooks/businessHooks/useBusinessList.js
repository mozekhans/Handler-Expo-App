// src/hooks/useBusinessList.js
import { useState, useEffect, useCallback } from 'react';
import { useBusinessStore } from '../../stores/businessStore';
import BusinessApi from '../../services/businessApi';

export const useBusinessList = () => {
  const { 
    businesses, 
    loading, 
    error, 
    loadBusinesses,
    switchBusiness: switchBusinessStore 
  } = useBusinessStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredAndSortedBusinesses = useCallback(() => {
    let filtered = [...businesses];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(business => 
        business.name?.toLowerCase().includes(query) ||
        business.industry?.toLowerCase().includes(query) ||
        business.description?.toLowerCase().includes(query) ||
        business.niche?.toLowerCase().includes(query)
      );
    }

    // Apply industry filter
    if (filterIndustry) {
      filtered = filtered.filter(business => 
        business.industry === filterIndustry
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle nested properties
      if (sortBy === 'stats.followers') {
        aValue = a.stats?.totalFollowers || 0;
        bValue = b.stats?.totalFollowers || 0;
      }
      if (sortBy === 'teamMembers') {
        aValue = a.teamMembers?.length || 0;
        bValue = b.teamMembers?.length || 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [businesses, searchQuery, filterIndustry, sortBy, sortOrder]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadBusinesses();
    setRefreshing(false);
  }, [loadBusinesses]);

  const switchBusiness = useCallback(async (businessId) => {
    try {
      await switchBusinessStore(businessId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to switch business' 
      };
    }
  }, [switchBusinessStore]);

  const getBusinessStats = useCallback(() => {
    const total = businesses.length;
    const active = businesses.filter(b => b.isActive).length;
    const industries = [...new Set(businesses.map(b => b.industry))];
    const totalTeamMembers = businesses.reduce(
      (sum, b) => sum + (b.teamMembers?.length || 0), 
      0
    );
    const totalFollowers = businesses.reduce(
      (sum, b) => sum + (b.stats?.totalFollowers || 0), 
      0
    );

    return {
      total,
      active,
      industries: industries.length,
      totalTeamMembers,
      totalFollowers,
    };
  }, [businesses]);

  const getBusinessById = useCallback((businessId) => {
    return businesses.find(b => b._id === businessId);
  }, [businesses]);

  const getDefaultBusiness = useCallback(() => {
    return businesses.find(b => b.isActive) || businesses[0];
  }, [businesses]);

  useEffect(() => {
    loadBusinesses();
  }, []);

  return {
    businesses: filteredAndSortedBusinesses(),
    allBusinesses: businesses,
    loading,
    refreshing,
    error,
    searchQuery,
    filterIndustry,
    sortBy,
    sortOrder,
    setSearchQuery,
    setFilterIndustry,
    setSortBy,
    setSortOrder,
    refresh,
    switchBusiness,
    getBusinessStats,
    getBusinessById,
    getDefaultBusiness,
    loadBusinesses,
  };
};