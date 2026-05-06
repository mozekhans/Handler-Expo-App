import React, { createContext, useState } from 'react';
import aiService from '../services/aiService';
import { useBusiness } from '../hooks/useBusiness';

export const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const [generating, setGenerating] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [error, setError] = useState(null);
  const { currentBusiness } = useBusiness();

  const generateContent = async (topic, options = {}) => {
    if (!currentBusiness) return null;
    try {
      setGenerating(true);
      setError(null);
      const content = await aiService.generateContent(
        currentBusiness.id,
        options.platform || 'general',
        { topic, ...options }
      );
      return content;
    } catch (err) {
      setError(err.message || 'Failed to generate content');
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const generateHashtags = async (content, businessId = null, count = 10) => {
    try {
      const hashtags = await aiService.generateHashtags(content, businessId || currentBusiness?.id, count);
      return hashtags;
    } catch (err) {
      setError(err.message || 'Failed to generate hashtags');
      return [];
    }
  };

  const generateResponse = async (context, options = {}) => {
    try {
      const response = await aiService.generateResponse(context, options);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to generate response');
      return null;
    }
  };

  const analyzeSentiment = async (text) => {
    try {
      const analysis = await aiService.analyzeSentiment(text);
      return analysis;
    } catch (err) {
      setError(err.message || 'Failed to analyze sentiment');
      return null;
    }
  };

  const optimizeContent = async (content, platform) => {
    if (!currentBusiness) return null;
    try {
      setOptimizing(true);
      const optimized = await aiService.optimizeContent(content, platform, currentBusiness.id);
      return optimized;
    } catch (err) {
      setError(err.message || 'Failed to optimize content');
      return null;
    } finally {
      setOptimizing(false);
    }
  };

  const predictPerformance = async (content, platforms) => {
    if (!currentBusiness) return null;
    try {
      const predictions = await aiService.predictPerformance(content, platforms, currentBusiness.id);
      return predictions;
    } catch (err) {
      setError(err.message || 'Failed to predict performance');
      return null;
    }
  };

  const detectTrends = async (params = {}) => {
    if (!currentBusiness) return [];
    try {
      const trends = await aiService.detectTrends(currentBusiness.id, params);
      return trends;
    } catch (err) {
      setError(err.message || 'Failed to detect trends');
      return [];
    }
  };

  const getContentSuggestions = async (params = {}) => {
    if (!currentBusiness) return [];
    try {
      const suggestions = await aiService.getContentSuggestions(currentBusiness.id, params);
      return suggestions;
    } catch (err) {
      setError(err.message || 'Failed to get suggestions');
      return [];
    }
  };

  const getTrendAlerts = async () => {
    if (!currentBusiness) return [];
    try {
      const alerts = await aiService.getTrendAlerts(currentBusiness.id);
      return alerts;
    } catch (err) {
      setError(err.message || 'Failed to get trend alerts');
      return [];
    }
  };

  const getRecommendations = async (params = {}) => {
    if (!currentBusiness) return [];
    try {
      const recommendations = await aiService.getRecommendations(currentBusiness.id, params);
      return recommendations;
    } catch (err) {
      setError(err.message || 'Failed to get recommendations');
      return [];
    }
  };

  const value = {
    generating,
    optimizing,
    error,
    generateContent,
    generateHashtags,
    generateResponse,
    analyzeSentiment,
    optimizeContent,
    predictPerformance,
    detectTrends,
    getContentSuggestions,
    getTrendAlerts,
    getRecommendations,
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};