// src/hooks/useBusinessStats.js
import { useState, useEffect, useCallback } from 'react';
import BusinessApi from '../../services/businessApi';

export const useBusinessStats = (businessId) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);

  const loadStats = useCallback(async () => {
    if (!businessId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await BusinessApi.getBusinessStats(businessId);
      setStats(response.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const loadHistoricalData = useCallback(async (period = '30d') => {
    if (!businessId) return;
    
    try {
      // This would call a historical stats endpoint if available
      // For now, we'll simulate with the current stats
      const response = await BusinessApi.getBusinessStats(businessId);
      
      // Generate mock historical data
      const data = [];
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toISOString().split('T')[0],
          followers: Math.round((response.stats.totalFollowers || 0) * (0.7 + Math.random() * 0.5)),
          engagement: Math.round((response.stats.averageEngagementRate || 0) * (0.7 + Math.random() * 0.5) * 10) / 10,
          posts: Math.round((response.stats.totalPosts || 0) / 30 * (0.5 + Math.random())),
        });
      }
      
      setHistoricalData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load historical data');
    }
  }, [businessId]);

  const getGrowthRate = useCallback((metric) => {
    if (!historicalData || historicalData.length < 2) return 0;
    
    const first = historicalData[0][metric];
    const last = historicalData[historicalData.length - 1][metric];
    
    if (first === 0) return 0;
    return ((last - first) / first) * 100;
  }, [historicalData]);

  const getPlatformBreakdown = useCallback(() => {
    // This would come from the API in a real implementation
    return [
      { platform: 'Facebook', value: 35, color: '#1877f2' },
      { platform: 'Instagram', value: 30, color: '#e4405f' },
      { platform: 'Twitter', value: 20, color: '#1da1f2' },
      { platform: 'LinkedIn', value: 10, color: '#0077b5' },
      { platform: 'TikTok', value: 5, color: '#000000' },
    ];
  }, []);

  const getEngagementTrend = useCallback(() => {
    if (!stats) return { trend: 'stable', percentage: 0 };
    
    // This would be calculated from real data
    const trend = stats.averageEngagementRate > 3 ? 'up' : 
                  stats.averageEngagementRate > 1.5 ? 'stable' : 'down';
    const percentage = Math.round(Math.random() * 20);
    
    return { trend, percentage };
  }, [stats]);

  useEffect(() => {
    if (businessId) {
      loadStats();
    }
  }, [businessId, loadStats]);

  return {
    stats,
    loading,
    error,
    historicalData,
    loadStats,
    loadHistoricalData,
    getGrowthRate,
    getPlatformBreakdown,
    getEngagementTrend,
  };
};