// import React, { createContext, useState } from 'react';
// import analyticsService from '../services/analyticsService';
// import { useBusiness } from '../hooks/useBusiness';

// export const AnalyticsContext = createContext();

// export const AnalyticsProvider = ({ children }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { currentBusiness } = useBusiness();

//   const getDashboardData = async (businessId = null) => {
//     const id = businessId || currentBusiness?.id;
//     if (!id) return null;
//     try {
//       setLoading(true);
//       const data = await analyticsService.getDashboardData(id);
//       return data;
//     } catch (err) {
//       setError(err.message || 'Failed to load dashboard data');
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAnalytics = async (businessId = null, params = {}) => {
//     const id = businessId || currentBusiness?.id;
//     if (!id) return null;
//     try {
//       setLoading(true);
//       const data = await analyticsService.getOverview(id, params);
//       return data;
//     } catch (err) {
//       setError(err.message || 'Failed to load analytics');
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getEngagementMetrics = async (businessId = null, params = {}) => {
//     const id = businessId || currentBusiness?.id;
//     if (!id) return null;
//     try {
//       const data = await analyticsService.getEngagementMetrics(id, params);
//       return data;
//     } catch (err) {
//       setError(err.message || 'Failed to load engagement metrics');
//       return null;
//     }
//   };

//   const getContentMetrics = async (businessId = null, params = {}) => {
//     const id = businessId || currentBusiness?.id;
//     if (!id) return null;
//     try {
//       const data = await analyticsService.getContentMetrics(id, params);
//       return data;
//     } catch (err) {
//       setError(err.message || 'Failed to load content metrics');
//       return null;
//     }
//   };

//   const getAudienceMetrics = async (businessId = null, params = {}) => {
//     const id = businessId || currentBusiness?.id;
//     if (!id) return null;
//     try {
//       const data = await analyticsService.getAudienceMetrics(id, params);
//       return data;
//     } catch (err) {
//       setError(err.message || 'Failed to load audience metrics');
//       return null;
//     }
//   };

//   const getCampaignMetrics = async (businessId = null, params = {}) => {
//     const id = businessId || currentBusiness?.id;
//     if (!id) return null;
//     try {
//       const data = await analyticsService.getCampaignMetrics(id, params);
//       return data;
//     } catch (err) {
//       setError(err.message || 'Failed to load campaign metrics');
//       return null;
//     }
//   };

//   const getCompetitorAnalysis = async (businessId = null) => {
//     const id = businessId || currentBusiness?.id;
//     if (!id) return null;
//     try {
//       const data = await analyticsService.getCompetitorAnalysis(id);
//       return data;
//     } catch (err) {
//       setError(err.message || 'Failed to load competitor analysis');
//       return null;
//     }
//   };

//   const getInsights = async (businessId = null) => {
//     const id = businessId || currentBusiness?.id;
//     if (!id) return null;
//     try {
//       const data = await analyticsService.getInsights(id);
//       return data;
//     } catch (err) {
//       setError(err.message || 'Failed to load insights');
//       return null;
//     }
//   };

//   const exportReport = async (businessId = null, data) => {
//     const id = businessId || currentBusiness?.id;
//     if (!id) return null;
//     try {
//       const report = await analyticsService.exportReport(id, data);
//       return report;
//     } catch (err) {
//       setError(err.message || 'Failed to export report');
//       return null;
//     }
//   };

//   const getTimeSeries = async (businessId = null, params) => {
//     const id = businessId || currentBusiness?.id;
//     if (!id) return null;
//     try {
//       const data = await analyticsService.getTimeSeries(id, params);
//       return data;
//     } catch (err) {
//       setError(err.message || 'Failed to load time series data');
//       return null;
//     }
//   };

//   const getRecentActivity = async (businessId = null, limit = 10) => {
//     const id = businessId || currentBusiness?.id;
//     if (!id) return [];
//     try {
//       const data = await analyticsService.getRecentActivity(id, limit);
//       return data;
//     } catch (err) {
//       setError(err.message || 'Failed to load recent activity');
//       return [];
//     }
//   };

//   const value = {
//     loading,
//     error,
//     getDashboardData,
//     getAnalytics,
//     getEngagementMetrics,
//     getContentMetrics,
//     getAudienceMetrics,
//     getCampaignMetrics,
//     getCompetitorAnalysis,
//     getInsights,
//     exportReport,
//     getTimeSeries,
//     getRecentActivity,
//   };

//   return (
//     <AnalyticsContext.Provider value={value}>
//       {children}
//     </AnalyticsContext.Provider>
//   );
// };



import React, { createContext, useState } from 'react';
import analyticsService from '../services/analyticsService';
import { useBusiness } from '../hooks/useBusiness';

export const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentBusiness } = useBusiness();

  const getDashboard = async (businessId = null, params = {}) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      setLoading(true);
      const response = await analyticsService.getDashboard(id, params);
      return response?.dashboard;
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getOverview = async (businessId = null, params = {}) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      setLoading(true);
      const response = await analyticsService.getOverview(id, params);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to load overview');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getEngagementMetrics = async (businessId = null, params = {}) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      setLoading(true);
      const response = await analyticsService.getEngagementMetrics(id, params);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to load engagement metrics');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getContentMetrics = async (businessId = null, params = {}) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      const response = await analyticsService.getContentMetrics(id, params);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to load content metrics');
      return null;
    }
  };

  const getAudienceMetrics = async (businessId = null, params = {}) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      const response = await analyticsService.getAudienceMetrics(id, params);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to load audience metrics');
      return null;
    }
  };

  const getCampaignMetrics = async (businessId = null, params = {}) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      const response = await analyticsService.getCampaignMetrics(id, params);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to load campaign metrics');
      return null;
    }
  };

  const getCompetitorAnalysis = async (businessId = null, competitorIds = []) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      const response = await analyticsService.getCompetitorAnalysis(id, competitorIds);
      return response?.data;
    } catch (err) {
      setError(err.message || 'Failed to load competitor analysis');
      return null;
    }
  };

  const getBenchmarks = async (businessId = null, params = {}) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      const response = await analyticsService.getBenchmarks(id, params);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to load benchmarks');
      return null;
    }
  };

  const getTimeSeries = async (businessId = null, params = {}) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      const response = await analyticsService.getTimeSeries(id, params);
      return response?.timeSeries;
    } catch (err) {
      setError(err.message || 'Failed to load time series');
      return null;
    }
  };

  const getInsights = async (businessId = null) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return [];
    try {
      const response = await analyticsService.getInsights(id);
      return response?.insights || [];
    } catch (err) {
      setError(err.message || 'Failed to load insights');
      return [];
    }
  };

  const getAlerts = async (businessId = null, resolved = false) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return [];
    try {
      const response = await analyticsService.getAlerts(id, resolved);
      return response?.alerts || [];
    } catch (err) {
      setError(err.message || 'Failed to load alerts');
      return [];
    }
  };

  const exportReport = async (businessId = null, reportData) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      setLoading(true);
      const response = await analyticsService.exportReport(id, reportData);
      return response?.data;
    } catch (err) {
      setError(err.message || 'Failed to generate report');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getReportStatus = async (businessId = null, reportId) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      const response = await analyticsService.getReportStatus(id, reportId);
      return response?.data;
    } catch (err) {
      setError(err.message || 'Failed to get report status');
      return null;
    }
  };

  const downloadReport = async (businessId = null, reportId) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      const response = await analyticsService.downloadReport(id, reportId);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to download report');
      return null;
    }
  };

  const listReports = async (businessId = null, params = {}) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      const response = await analyticsService.listReports(id, params);
      return response?.data;
    } catch (err) {
      setError(err.message || 'Failed to list reports');
      return null;
    }
  };

  const deleteReport = async (businessId = null, reportId) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return false;
    try {
      await analyticsService.deleteReport(id, reportId);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete report');
      return false;
    }
  };

  const scheduleReport = async (businessId = null, scheduleData) => {
    const id = businessId || currentBusiness?.id;
    if (!id) return null;
    try {
      const response = await analyticsService.scheduleReport(id, scheduleData);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to schedule report');
      return null;
    }
  };

  const value = {
    loading,
    error,
    getDashboard,
    getOverview,
    getEngagementMetrics,
    getContentMetrics,
    getAudienceMetrics,
    getCampaignMetrics,
    getCompetitorAnalysis,
    getBenchmarks,
    getTimeSeries,
    getInsights,
    getAlerts,
    exportReport,
    getReportStatus,
    downloadReport,
    listReports,
    deleteReport,
    scheduleReport,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};