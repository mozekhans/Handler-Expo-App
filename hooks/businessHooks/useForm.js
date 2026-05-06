// src/hooks/useForm.js
import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validateFn = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (validateFn) {
      const validationErrors = validateFn({ [field]: values[field] });
      if (validationErrors[field]) {
        setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
      }
    }
  }, [values, validateFn]);

  const setFieldValue = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setFieldTouched = useCallback((field, isTouched = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  const validateForm = useCallback(() => {
    if (!validateFn) return true;
    
    const validationErrors = validateFn(values);
    setErrors(validationErrors);
    
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    return Object.keys(validationErrors).length === 0;
  }, [values, validateFn]);

  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = useCallback(async (submitFn) => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await submitFn(values);
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm]);

  const getFieldProps = useCallback((field) => ({
    value: values[field] || '',
    onChangeText: (value) => handleChange(field, value),
    onBlur: () => handleBlur(field),
    error: touched[field] ? errors[field] : '',
  }), [values, errors, touched, handleChange, handleBlur]);

  const isDirty = useCallback(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateForm,
    resetForm,
    handleSubmit,
    getFieldProps,
    isDirty: isDirty(),
    setValues,
  };
};