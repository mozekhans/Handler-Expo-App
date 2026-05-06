// src/hooks/useCompetitors.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import BusinessApi from '../../services/businessApi';

export const useCompetitors = (businessId) => {
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const loadCompetitors = useCallback(async () => {
    if (!businessId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await BusinessApi.getCompetitors(businessId);
      setCompetitors(response.competitors || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load competitors');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const addCompetitor = useCallback(async (data) => {
    try {
      setError(null);
      const response = await BusinessApi.addCompetitor(businessId, data);
      await loadCompetitors();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add competitor');
      throw err;
    }
  }, [businessId, loadCompetitors]);

  const updateCompetitor = useCallback(async (competitorId, data) => {
    try {
      setError(null);
      const response = await BusinessApi.updateCompetitor(businessId, competitorId, data);
      await loadCompetitors();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update competitor');
      throw err;
    }
  }, [businessId, loadCompetitors]);

  const removeCompetitor = useCallback(async (competitorId) => {
    try {
      setError(null);
      await BusinessApi.removeCompetitor(businessId, competitorId);
      await loadCompetitors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove competitor');
      throw err;
    }
  }, [businessId, loadCompetitors]);

  const addCompetitorNote = useCallback(async (competitorId, note) => {
    try {
      setError(null);
      const response = await BusinessApi.addCompetitorNote(businessId, competitorId, note);
      await loadCompetitors();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add note');
      throw err;
    }
  }, [businessId, loadCompetitors]);

  const getCompetitorById = useCallback((competitorId) => {
    return competitors.find(c => c._id === competitorId);
  }, [competitors]);

  const filteredAndSortedCompetitors = useMemo(() => {
    let filtered = [...competitors];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(competitor => 
        competitor.name?.toLowerCase().includes(query) ||
        competitor.industry?.toLowerCase().includes(query) ||
        competitor.description?.toLowerCase().includes(query) ||
        competitor.website?.toLowerCase().includes(query)
      );
    }

    // Apply industry filter
    if (filterIndustry) {
      filtered = filtered.filter(competitor => 
        competitor.industry === filterIndustry
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'socialAccounts') {
        aValue = a.socialAccounts?.length || 0;
        bValue = b.socialAccounts?.length || 0;
      }
      if (sortBy === 'marketShare') {
        aValue = a.analysis?.marketShare || 0;
        bValue = b.analysis?.marketShare || 0;
      }
      if (sortBy === 'totalFollowers') {
        aValue = a.socialAccounts?.reduce((sum, acc) => sum + (acc.followers || 0), 0) || 0;
        bValue = b.socialAccounts?.reduce((sum, acc) => sum + (acc.followers || 0), 0) || 0;
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
  }, [competitors, searchQuery, filterIndustry, sortBy, sortOrder]);

  const getCompetitorStats = useMemo(() => {
    const total = competitors.length;
    const withSocialAccounts = competitors.filter(c => c.socialAccounts?.length > 0).length;
    const avgMarketShare = competitors.reduce(
      (sum, c) => sum + (c.analysis?.marketShare || 0), 
      0
    ) / (total || 1);
    
    const industries = [...new Set(competitors.map(c => c.industry).filter(Boolean))];
    
    const totalFollowers = competitors.reduce(
      (sum, c) => sum + (c.socialAccounts?.reduce(
        (accSum, acc) => accSum + (acc.followers || 0), 0
      ) || 0),
      0
    );

    const topCompetitor = [...competitors].sort((a, b) => {
      const aShare = a.analysis?.marketShare || 0;
      const bShare = b.analysis?.marketShare || 0;
      return bShare - aShare;
    })[0];

    return {
      total,
      withSocialAccounts,
      avgMarketShare: Math.round(avgMarketShare * 10) / 10,
      industries: industries.length,
      totalFollowers,
      topCompetitor,
    };
  }, [competitors]);

  const getSWOTSummary = useMemo(() => {
    const summary = {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
    };

    competitors.forEach(competitor => {
      if (competitor.analysis?.strengths) {
        summary.strengths.push(...competitor.analysis.strengths);
      }
      if (competitor.analysis?.weaknesses) {
        summary.weaknesses.push(...competitor.analysis.weaknesses);
      }
      if (competitor.analysis?.opportunities) {
        summary.opportunities.push(...competitor.analysis.opportunities);
      }
      if (competitor.analysis?.threats) {
        summary.threats.push(...competitor.analysis.threats);
      }
    });

    // Count frequencies
    const countFrequencies = (arr) => {
      const freq = {};
      arr.forEach(item => { freq[item] = (freq[item] || 0) + 1; });
      return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([item]) => item);
    };

    return {
      strengths: countFrequencies(summary.strengths),
      weaknesses: countFrequencies(summary.weaknesses),
      opportunities: countFrequencies(summary.opportunities),
      threats: countFrequencies(summary.threats),
    };
  }, [competitors]);

  useEffect(() => {
    if (businessId) {
      loadCompetitors();
    }
  }, [businessId, loadCompetitors]);

  return {
    competitors: filteredAndSortedCompetitors,
    allCompetitors: competitors,
    loading,
    error,
    searchQuery,
    filterIndustry,
    sortBy,
    sortOrder,
    stats: getCompetitorStats,
    swotSummary: getSWOTSummary,
    setSearchQuery,
    setFilterIndustry,
    setSortBy,
    setSortOrder,
    loadCompetitors,
    addCompetitor,
    updateCompetitor,
    removeCompetitor,
    addCompetitorNote,
    getCompetitorById,
  };
};