// src/hooks/useTargetAudience.js
import { useState, useEffect, useCallback } from 'react';
import BusinessApi from '../../services/businessApi';
import { useBusiness } from './useBusiness';

export const useTargetAudience = (businessId) => {
  const { business, refetch: refetchBusiness } = useBusiness(businessId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [localTargetAudience, setLocalTargetAudience] = useState(null);

  const defaultTargetAudience = {
    industry: '',
    subIndustry: '',
    ageRange: { min: 18, max: 65 },
    gender: [],
    locations: [],
    languages: ['en'],
    interests: [],
    behaviors: [],
    income: '',
    education: [],
    occupation: [],
    psychographics: {
      values: [],
      lifestyles: [],
      personality: [],
    },
  };

  useEffect(() => {
    if (business?.branding?.targetAudience) {
      setLocalTargetAudience(business.branding.targetAudience);
    } else {
      setLocalTargetAudience(defaultTargetAudience);
    }
  }, [business]);

  const saveTargetAudience = useCallback(async (targetAudienceData) => {
    try {
      setSaving(true);
      setError(null);
      const response = await BusinessApi.updateTargetAudience(businessId, { 
        targetAudience: targetAudienceData 
      });
      await refetchBusiness();
      setLocalTargetAudience(targetAudienceData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save target audience');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [businessId, refetchBusiness]);

  const updateField = useCallback((field, value) => {
    setLocalTargetAudience(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateAgeRange = useCallback((key, value) => {
    setLocalTargetAudience(prev => ({
      ...prev,
      ageRange: { ...prev.ageRange, [key]: value }
    }));
  }, []);

  const addLocation = useCallback((location) => {
    if (!location.trim()) return;
    setLocalTargetAudience(prev => ({
      ...prev,
      locations: [...new Set([...prev.locations, location.trim()])]
    }));
  }, []);

  const removeLocation = useCallback((location) => {
    setLocalTargetAudience(prev => ({
      ...prev,
      locations: prev.locations.filter(l => l !== location)
    }));
  }, []);

  const addInterest = useCallback((interest) => {
    if (!interest.trim()) return;
    setLocalTargetAudience(prev => ({
      ...prev,
      interests: [...new Set([...prev.interests, interest.trim()])]
    }));
  }, []);

  const removeInterest = useCallback((interest) => {
    setLocalTargetAudience(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  }, []);

  const updatePsychographics = useCallback((category, values) => {
    setLocalTargetAudience(prev => ({
      ...prev,
      psychographics: {
        ...prev.psychographics,
        [category]: values
      }
    }));
  }, []);

  const getAudienceSummary = useCallback(() => {
    const audience = localTargetAudience || defaultTargetAudience;
    
    return {
      primaryAge: `${audience.ageRange.min}-${audience.ageRange.max}`,
      primaryGender: audience.gender.length > 0 ? audience.gender.join('/') : 'All',
      topLocations: audience.locations.slice(0, 3),
      topInterests: audience.interests.slice(0, 5),
      languages: audience.languages,
      income: audience.income,
      education: audience.education,
    };
  }, [localTargetAudience]);

  const hasChanges = useCallback(() => {
    if (!business?.branding?.targetAudience || !localTargetAudience) return true;
    return JSON.stringify(business.branding.targetAudience) !== 
           JSON.stringify(localTargetAudience);
  }, [business, localTargetAudience]);

  return {
    targetAudience: localTargetAudience || defaultTargetAudience,
    saving,
    error,
    saveTargetAudience,
    updateField,
    updateAgeRange,
    addLocation,
    removeLocation,
    addInterest,
    removeInterest,
    updatePsychographics,
    getAudienceSummary,
    hasChanges: hasChanges(),
    setLocalTargetAudience,
  };
};