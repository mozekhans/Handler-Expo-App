// src/hooks/useBusinessSettings.js
import { useState, useEffect, useCallback } from 'react';
import BusinessApi from '../../services/businessApi';

export const useBusinessSettings = (businessId) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [localSettings, setLocalSettings] = useState(null);

  const defaultSettings = {
    timezone: 'UTC',
    language: 'en',
    currency: 'USD',
    postingFrequency: 'medium',
    customPostingSchedule: [],
    autoApproveContent: false,
    contentApprovers: [],
    defaultHashtags: [],
    excludedHashtags: [],
    contentCategories: [],
  };

  const loadSettings = useCallback(async () => {
    if (!businessId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await BusinessApi.getSettings(businessId);
      const loadedSettings = response.settings || defaultSettings;
      setSettings(loadedSettings);
      setLocalSettings(loadedSettings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load settings');
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const saveSettings = useCallback(async (newSettings) => {
    try {
      setSaving(true);
      setError(null);
      const response = await BusinessApi.updateSettings(businessId, { 
        settings: newSettings 
      });
      setSettings(newSettings);
      setLocalSettings(newSettings);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [businessId]);

  const updateSetting = useCallback((key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateNestedSetting = useCallback((parent, key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }));
  }, []);

  const addDefaultHashtag = useCallback((hashtag) => {
    if (!hashtag.trim()) return;
    const cleanHashtag = hashtag.startsWith('#') ? hashtag.slice(1).trim() : hashtag.trim();
    setLocalSettings(prev => ({
      ...prev,
      defaultHashtags: [...new Set([...prev.defaultHashtags, cleanHashtag])]
    }));
  }, []);

  const removeDefaultHashtag = useCallback((hashtag) => {
    setLocalSettings(prev => ({
      ...prev,
      defaultHashtags: prev.defaultHashtags.filter(h => h !== hashtag)
    }));
  }, []);

  const addExcludedHashtag = useCallback((hashtag) => {
    if (!hashtag.trim()) return;
    const cleanHashtag = hashtag.startsWith('#') ? hashtag.slice(1).trim() : hashtag.trim();
    setLocalSettings(prev => ({
      ...prev,
      excludedHashtags: [...new Set([...prev.excludedHashtags, cleanHashtag])]
    }));
  }, []);

  const removeExcludedHashtag = useCallback((hashtag) => {
    setLocalSettings(prev => ({
      ...prev,
      excludedHashtags: prev.excludedHashtags.filter(h => h !== hashtag)
    }));
  }, []);

  const addContentCategory = useCallback((category) => {
    if (!category.trim()) return;
    setLocalSettings(prev => ({
      ...prev,
      contentCategories: [...new Set([...prev.contentCategories, category.trim()])]
    }));
  }, []);

  const removeContentCategory = useCallback((category) => {
    setLocalSettings(prev => ({
      ...prev,
      contentCategories: prev.contentCategories.filter(c => c !== category)
    }));
  }, []);

  const addPostingSchedule = useCallback((schedule) => {
    setLocalSettings(prev => ({
      ...prev,
      customPostingSchedule: [...prev.customPostingSchedule, schedule]
    }));
  }, []);

  const updatePostingSchedule = useCallback((index, schedule) => {
    setLocalSettings(prev => ({
      ...prev,
      customPostingSchedule: prev.customPostingSchedule.map((s, i) => 
        i === index ? schedule : s
      )
    }));
  }, []);

  const removePostingSchedule = useCallback((index) => {
    setLocalSettings(prev => ({
      ...prev,
      customPostingSchedule: prev.customPostingSchedule.filter((_, i) => i !== index)
    }));
  }, []);

  const hasChanges = useCallback(() => {
    return JSON.stringify(settings) !== JSON.stringify(localSettings);
  }, [settings, localSettings]);

  const resetChanges = useCallback(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (businessId) {
      loadSettings();
    }
  }, [businessId, loadSettings]);

  return {
    settings: localSettings || defaultSettings,
    originalSettings: settings,
    loading,
    saving,
    error,
    loadSettings,
    saveSettings: () => saveSettings(localSettings),
    updateSetting,
    updateNestedSetting,
    addDefaultHashtag,
    removeDefaultHashtag,
    addExcludedHashtag,
    removeExcludedHashtag,
    addContentCategory,
    removeContentCategory,
    addPostingSchedule,
    updatePostingSchedule,
    removePostingSchedule,
    hasChanges: hasChanges(),
    resetChanges,
  };
};