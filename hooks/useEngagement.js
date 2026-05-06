// import { useContext } from 'react';
// import { EngagementContext } from '../context/EngagementContext';

// export const useEngagement = () => {
//   const context = useContext(EngagementContext);
//   if (!context) {
//     throw new Error('useEngagement must be used within an EngagementProvider');
//   }
//   return context;
// };















// hooks/useEngagements.js
import { useState, useEffect, useCallback, useRef } from 'react';
import engagementService from '../services/engagementService';

export const useEngagements = (businessId, initialFilters = {}) => {
  const [engagements, setEngagements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  
  const filtersRef = useRef(initialFilters);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  const fetchEngagements = useCallback(async (page = 1, filters = {}) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    
    try {
      setError(null);
      
      if (page === 1) {
        setLoading(true);
      }

      const params = {
        page,
        limit: 20,
        ...filters,
      };

      // Remove undefined values
      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      const response = await engagementService.getEngagements(businessId, params);

      if (page === 1) {
        setEngagements(response.engagements || []);
      } else {
        setEngagements(prev => [...prev, ...(response.engagements || [])]);
      }

      if (response.stats) {
        setStats(response.stats);
      }

      setPagination(response.pagination || {
        page,
        limit: 20,
        total: 0,
        pages: 0,
      });

      pageRef.current = page;
      filtersRef.current = filters;

    } catch (err) {
      setError(err.message || 'Failed to fetch engagements');
      if (page === 1) {
        setEngagements([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      loadingRef.current = false;
    }
  }, [businessId]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    fetchEngagements(1, filtersRef.current);
  }, [fetchEngagements]);

  const loadMore = useCallback(() => {
    const { page, pages } = pagination;
    if (page < pages && !loadingRef.current) {
      fetchEngagements(page + 1, filtersRef.current);
    }
  }, [pagination, fetchEngagements]);

  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filtersRef.current, ...newFilters };
    // Remove undefined values
    Object.keys(updatedFilters).forEach(key => 
      updatedFilters[key] === undefined && delete updatedFilters[key]
    );
    filtersRef.current = updatedFilters;
    fetchEngagements(1, updatedFilters);
  }, [fetchEngagements]);

  const clearFilters = useCallback(() => {
    filtersRef.current = {};
    fetchEngagements(1, {});
  }, [fetchEngagements]);

  const getEngagementById = useCallback((id) => {
    return engagements.find(eng => eng._id === id) || null;
  }, [engagements]);

  const updateEngagementLocally = useCallback((id, updates) => {
    setEngagements(prev => 
      prev.map(eng => eng._id === id ? { ...eng, ...updates } : eng)
    );
  }, []);

  const removeEngagementLocally = useCallback((id) => {
    setEngagements(prev => prev.filter(eng => eng._id !== id));
  }, []);

  useEffect(() => {
    if (businessId) {
      fetchEngagements(1, initialFilters);
    }
  }, [businessId]);

  return {
    engagements,
    stats,
    loading,
    refreshing,
    error,
    pagination,
    refresh,
    loadMore,
    updateFilters,
    clearFilters,
    getEngagementById,
    updateEngagementLocally,
    removeEngagementLocally,
    fetchEngagements,
    currentFilters: filtersRef.current,
  };
};