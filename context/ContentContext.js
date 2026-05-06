// import React, { createContext, useState } from "react";
// import contentService from "../services/contentService";
// import { useBusiness } from "../hooks/useBusiness";

// export const ContentContext = createContext();

// export const ContentProvider = ({ children }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [content, setContent] = useState([]);
//   const [currentContent, setCurrentContent] = useState(null);
//   const { currentBusiness } = useBusiness();

//   // const getContent = async (businessId = null, params = {}) => {
//   //   const id = businessId || currentBusiness?.id;
//   //   if (!id) return { items: [], hasMore: false };
//   //   try {
//   //     setLoading(true);
//   //     const data = await contentService.getContent(id, params);
//   //     setContent(data.items);
//   //     return data;
//   //   } catch (err) {
//   //     setError(err.message || 'Failed to load content');
//   //     return { items: [], hasMore: false };
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const getContent = async (businessId = null, params = {}) => {
//     const id = businessId?._id || businessId || currentBusiness?._id;

//     if (!id) {
//       return {
//         content: [],
//         pagination: {
//           page: 1,
//           pages: 1,
//         },
//       };
//     }

//     try {
//       setLoading(true);

//       const data = await contentService.getContent(id, params);

//       if ((params.page || 1) > 1) {
//         setContent((prev) => [...prev, ...(data.content || [])]);
//       } else {
//         setContent(data.content || []);
//       }

//       setPagination(
//         data.pagination || {
//           page: 1,
//           pages: 1,
//         },
//       );

//       return data;
//     } catch (err) {
//       setError(err.message || "Failed to load content");

//       return {
//         content: [],
//         pagination: {
//           page: 1,
//           pages: 1,
//         },
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getContentById = async (contentId) => {
//     try {
//       setLoading(true);
//       const data = await contentService.getContentById(contentId);
//       setCurrentContent(data);
//       return data;
//     } catch (err) {
//       setError(err.message || "Failed to load content");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createContent = async (businessId = null, contentData) => {
//     const id = businessId || currentBusiness?.id;
//     if (!id) return null;
//     try {
//       setLoading(true);
//       const data = await contentService.createContent(id, contentData);
//       setContent((prev) => [data, ...prev]);
//       return data;
//     } catch (err) {
//       setError(err.message || "Failed to create content");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateContent = async (contentId, contentData) => {
//     try {
//       setLoading(true);
//       const data = await contentService.updateContent(contentId, contentData);
//       setContent((prev) => prev.map((c) => (c.id === contentId ? data : c)));
//       if (currentContent?.id === contentId) {
//         setCurrentContent(data);
//       }
//       return data;
//     } catch (err) {
//       setError(err.message || "Failed to update content");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteContent = async (contentId) => {
//     try {
//       setLoading(true);
//       await contentService.deleteContent(contentId);
//       setContent((prev) => prev.filter((c) => c.id !== contentId));
//       if (currentContent?.id === contentId) {
//         setCurrentContent(null);
//       }
//       return true;
//     } catch (err) {
//       setError(err.message || "Failed to delete content");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const publishContent = async (contentId) => {
//     try {
//       const data = await contentService.publishContent(contentId);
//       setContent((prev) =>
//         prev.map((c) =>
//           c.id === contentId ? { ...c, status: "published" } : c,
//         ),
//       );
//       return data;
//     } catch (err) {
//       setError(err.message || "Failed to publish content");
//       return null;
//     }
//   };

//   const scheduleContent = async (contentId, scheduledFor) => {
//     try {
//       const data = await contentService.scheduleContent(
//         contentId,
//         scheduledFor,
//       );
//       setContent((prev) =>
//         prev.map((c) =>
//           c.id === contentId ? { ...c, status: "scheduled", scheduledFor } : c,
//         ),
//       );
//       return data;
//     } catch (err) {
//       setError(err.message || "Failed to schedule content");
//       return null;
//     }
//   };

//   const cancelSchedule = async (contentId) => {
//     try {
//       const data = await contentService.cancelSchedule(contentId);
//       setContent((prev) =>
//         prev.map((c) =>
//           c.id === contentId
//             ? { ...c, status: "draft", scheduledFor: null }
//             : c,
//         ),
//       );
//       return data;
//     } catch (err) {
//       setError(err.message || "Failed to cancel schedule");
//       return null;
//     }
//   };

//   const duplicateContent = async (contentId) => {
//     try {
//       const data = await contentService.duplicateContent(contentId);
//       setContent((prev) => [data, ...prev]);
//       return data;
//     } catch (err) {
//       setError(err.message || "Failed to duplicate content");
//       return null;
//     }
//   };

//   const getContentStats = async (businessId = null, params = {}) => {
//     const id = businessId || currentBusiness?.id;
//     if (!id) return null;
//     try {
//       const data = await contentService.getContentStats(id, params);
//       return data;
//     } catch (err) {
//       setError(err.message || "Failed to load content stats");
//       return null;
//     }
//   };

//   const getScheduledContent = async (businessId = null, startDate, endDate) => {
//     const id = businessId || currentBusiness?.id;
//     if (!id) return [];
//     try {
//       const data = await contentService.getScheduledContent(
//         id,
//         startDate,
//         endDate,
//       );
//       return data;
//     } catch (err) {
//       setError(err.message || "Failed to load scheduled content");
//       return [];
//     }
//   };

//   const analyzePerformance = async (contentId) => {
//     try {
//       const data = await contentService.analyzePerformance(contentId);
//       return data;
//     } catch (err) {
//       setError(err.message || "Failed to analyze performance");
//       return null;
//     }
//   };

//   const value = {
//     content,
//     currentContent,
//     loading,
//     error,
//     getContent,
//     getContentById,
//     createContent,
//     updateContent,
//     deleteContent,
//     publishContent,
//     scheduleContent,
//     cancelSchedule,
//     duplicateContent,
//     getContentStats,
//     getScheduledContent,
//     analyzePerformance,
//   };

//   return (
//     <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
//   );
// };

















import React, { createContext, useState, useCallback } from 'react';
import contentService from '../services/contentService';
import { useBusiness } from '../hooks/useBusiness';

export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);
  const [currentContent, setCurrentContent] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1
  });
  const { currentBusiness } = useBusiness();

  // Helper function to extract business ID
  const getBusinessId = useCallback((businessId = null) => {
    // If businessId is an object with _id, extract it
    if (businessId && typeof businessId === 'object') {
      return businessId._id || businessId.id || businessId.toString();
    }
    // If businessId is already a string, use it
    if (typeof businessId === 'string' && businessId) {
      return businessId;
    }
    // Fallback to currentBusiness
    if (currentBusiness) {
      return currentBusiness._id || currentBusiness.id;
    }
    return null;
  }, [currentBusiness]);

  const getContent = async (businessId = null, params = {}) => {
    try {
      const id = getBusinessId(businessId);
      
      if (!id) {
        console.error('No business ID available for getContent');
        return {
          content: [],
          pagination: { page: 1, pages: 1 }
        };
      }

      setLoading(true);
      setError(null);
      
      const data = await contentService.getContent(id, params);

      if (data) {
        const currentPage = params.page || 1;
        if (currentPage > 1) {
          setContent(prev => [...prev, ...(data.content || [])]);
        } else {
          setContent(data.content || []);
        }
        setPagination(data.pagination || { page: 1, pages: 1 });
      }

      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load content';
      setError(errorMessage);
      console.error('getContent error:', err);
      return {
        content: [],
        pagination: { page: 1, pages: 1 }
      };
    } finally {
      setLoading(false);
    }
  };

  const getContentById = async (businessId, contentId) => {
    try {
      const id = getBusinessId(businessId);
      
      if (!id || !contentId) {
        console.error('Missing businessId or contentId for getContentById');
        return null;
      }

      setLoading(true);
      setError(null);
      
      const data = await contentService.getContentById(id, contentId);
      setCurrentContent(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load content';
      setError(errorMessage);
      console.error('getContentById error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createContent = async (businessId = null, contentData) => {
    try {
      const id = getBusinessId(businessId);
      
      if (!id) {
        console.error('No business ID available for createContent');
        return null;
      }

      setLoading(true);
      setError(null);
      
      const data = await contentService.createContent(id, contentData);
      if (data) {
        setContent(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create content';
      setError(errorMessage);
      console.error('createContent error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (businessId, contentId, contentData) => {
    try {
      const id = getBusinessId(businessId);
      
      if (!id || !contentId) {
        console.error('Missing businessId or contentId for updateContent');
        return null;
      }

      setLoading(true);
      setError(null);
      
      const data = await contentService.updateContent(id, contentId, contentData);
      if (data) {
        setContent(prev => prev.map(c => c._id === contentId ? data : c));
        if (currentContent?._id === contentId) {
          setCurrentContent(data);
        }
      }
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update content';
      setError(errorMessage);
      console.error('updateContent error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (businessId, contentId) => {
    try {
      const id = getBusinessId(businessId);
      
      if (!id || !contentId) {
        console.error('Missing businessId or contentId for deleteContent');
        return false;
      }

      setLoading(true);
      setError(null);
      
      await contentService.deleteContent(id, contentId);
      setContent(prev => prev.filter(c => c._id !== contentId));
      if (currentContent?._id === contentId) {
        setCurrentContent(null);
      }
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete content';
      setError(errorMessage);
      console.error('deleteContent error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const publishContent = async (businessId, contentId) => {
    try {
      const id = getBusinessId(businessId);
      
      if (!id || !contentId) {
        console.error('Missing businessId or contentId for publishContent');
        return null;
      }

      const data = await contentService.publishContent(id, contentId);
      if (data) {
        setContent(prev => prev.map(c => c._id === contentId ? { ...c, status: 'published' } : c));
      }
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to publish content';
      setError(errorMessage);
      console.error('publishContent error:', err);
      return null;
    }
  };

  const scheduleContent = async (businessId, contentId, scheduledFor) => {
    try {
      const id = getBusinessId(businessId);
      
      if (!id || !contentId) {
        console.error('Missing businessId or contentId for scheduleContent');
        return null;
      }

      const data = await contentService.scheduleContent(id, contentId, scheduledFor);
      if (data) {
        setContent(prev => prev.map(c => 
          c._id === contentId ? { ...c, status: 'scheduled', scheduledFor } : c
        ));
      }
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to schedule content';
      setError(errorMessage);
      console.error('scheduleContent error:', err);
      return null;
    }
  };

  const cancelSchedule = async (businessId, contentId) => {
    try {
      const id = getBusinessId(businessId);
      
      if (!id || !contentId) {
        console.error('Missing businessId or contentId for cancelSchedule');
        return null;
      }

      const data = await contentService.cancelSchedule(id, contentId);
      if (data) {
        setContent(prev => prev.map(c => 
          c._id === contentId ? { ...c, status: 'draft', scheduledFor: null } : c
        ));
      }
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to cancel schedule';
      setError(errorMessage);
      console.error('cancelSchedule error:', err);
      return null;
    }
  };

  const duplicateContent = async (businessId, contentId) => {
    try {
      const id = getBusinessId(businessId);
      
      if (!id || !contentId) {
        console.error('Missing businessId or contentId for duplicateContent');
        return null;
      }

      const data = await contentService.duplicateContent(id, contentId);
      if (data) {
        setContent(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to duplicate content';
      setError(errorMessage);
      console.error('duplicateContent error:', err);
      return null;
    }
  };

  const getContentStats = async (businessId = null, params = {}) => {
    try {
      const id = getBusinessId(businessId);
      
      if (!id) {
        console.error('No business ID available for getContentStats');
        return null;
      }

      const data = await contentService.getContentStats(id, params);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load content stats';
      setError(errorMessage);
      console.error('getContentStats error:', err);
      return null;
    }
  };

  const getScheduledContent = async (businessId = null, startDate, endDate) => {
    try {
      const id = getBusinessId(businessId);
      
      if (!id) {
        console.error('No business ID available for getScheduledContent');
        return [];
      }

      const data = await contentService.getScheduledContent(id, startDate, endDate);
      return data || [];
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load scheduled content';
      setError(errorMessage);
      console.error('getScheduledContent error:', err);
      return [];
    }
  };

  const analyzePerformance = async (businessId, contentId) => {
    try {
      const id = getBusinessId(businessId);
      
      if (!id || !contentId) {
        console.error('Missing businessId or contentId for analyzePerformance');
        return null;
      }

      const data = await contentService.analyzePerformance(id, contentId);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to analyze performance';
      setError(errorMessage);
      console.error('analyzePerformance error:', err);
      return null;
    }
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    content,
    currentContent,
    loading,
    error,
    pagination,
    getContent,
    getContentById,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    scheduleContent,
    cancelSchedule,
    duplicateContent,
    getContentStats,
    getScheduledContent,
    analyzePerformance,
    clearError,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};