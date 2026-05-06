// src/hooks/useBrandVoice.js
import { useState, useEffect, useCallback } from 'react';
import BusinessApi from '../../services/businessApi';
import { useBusiness } from './useBusiness';

export const useBrandVoice = (businessId) => {
  const { business, refetch: refetchBusiness } = useBusiness(businessId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [localBrandVoice, setLocalBrandVoice] = useState(null);

  const defaultBrandVoice = {
    tone: 'professional',
    style: {
      useEmojis: false,
      useHashtags: true,
      useMentions: true,
      sentenceLength: 'medium',
      formality: 7,
      enthusiasm: 5,
      humor: 3,
    },
    keywords: [],
    bannedWords: [],
    preferredWords: [],
    samplePosts: [],
  };

  useEffect(() => {
    if (business?.branding?.brandVoice) {
      setLocalBrandVoice(business.branding.brandVoice);
    } else {
      setLocalBrandVoice(defaultBrandVoice);
    }
  }, [business]);

  const saveBrandVoice = useCallback(async (brandVoiceData) => {
    try {
      setSaving(true);
      setError(null);
      const response = await BusinessApi.updateBrandVoice(businessId, { 
        brandVoice: brandVoiceData 
      });
      await refetchBusiness();
      setLocalBrandVoice(brandVoiceData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save brand voice');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [businessId, refetchBusiness]);

  const updateTone = useCallback((tone) => {
    setLocalBrandVoice(prev => ({ ...prev, tone }));
  }, []);

  const updateStyle = useCallback((key, value) => {
    setLocalBrandVoice(prev => ({
      ...prev,
      style: { ...prev.style, [key]: value }
    }));
  }, []);

  const addKeyword = useCallback((keyword) => {
    if (!keyword.trim()) return;
    setLocalBrandVoice(prev => ({
      ...prev,
      keywords: [...new Set([...prev.keywords, keyword.trim()])]
    }));
  }, []);

  const removeKeyword = useCallback((keyword) => {
    setLocalBrandVoice(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  }, []);

  const addBannedWord = useCallback((word) => {
    if (!word.trim()) return;
    setLocalBrandVoice(prev => ({
      ...prev,
      bannedWords: [...new Set([...prev.bannedWords, word.trim()])]
    }));
  }, []);

  const removeBannedWord = useCallback((word) => {
    setLocalBrandVoice(prev => ({
      ...prev,
      bannedWords: prev.bannedWords.filter(w => w !== word)
    }));
  }, []);

  const addPreferredWord = useCallback((word) => {
    if (!word.trim()) return;
    setLocalBrandVoice(prev => ({
      ...prev,
      preferredWords: [...new Set([...prev.preferredWords, word.trim()])]
    }));
  }, []);

  const removePreferredWord = useCallback((word) => {
    setLocalBrandVoice(prev => ({
      ...prev,
      preferredWords: prev.preferredWords.filter(w => w !== word)
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setLocalBrandVoice(defaultBrandVoice);
  }, []);

  const hasChanges = useCallback(() => {
    if (!business?.branding?.brandVoice || !localBrandVoice) return true;
    return JSON.stringify(business.branding.brandVoice) !== JSON.stringify(localBrandVoice);
  }, [business, localBrandVoice]);

  return {
    brandVoice: localBrandVoice || defaultBrandVoice,
    saving,
    error,
    saveBrandVoice,
    updateTone,
    updateStyle,
    addKeyword,
    removeKeyword,
    addBannedWord,
    removeBannedWord,
    addPreferredWord,
    removePreferredWord,
    resetToDefault,
    hasChanges: hasChanges(),
    setLocalBrandVoice,
  };
};