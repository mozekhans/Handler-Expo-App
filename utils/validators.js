export const validators = {
  // Required field
  required: (value) => {
    if (value === null || value === undefined || value === '') {
      return 'This field is required';
    }
    return null;
  },

  // Email validation
  email: (value) => {
    if (!value) return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  // Password validation
  password: (value, options = { minLength: 8, requireNumber: true, requireLetter: true }) => {
    if (!value) return null;
    
    if (value.length < options.minLength) {
      return `Password must be at least ${options.minLength} characters`;
    }
    
    if (options.requireNumber && !/\d/.test(value)) {
      return 'Password must contain at least one number';
    }
    
    if (options.requireLetter && !/[a-zA-Z]/.test(value)) {
      return 'Password must contain at least one letter';
    }
    
    return null;
  },

  // Confirm password
  confirmPassword: (value, password) => {
    if (!value) return null;
    
    if (value !== password) {
      return 'Passwords do not match';
    }
    return null;
  },

  // Phone number validation
  phone: (value) => {
    if (!value) return null;
    
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(value)) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  // URL validation
  url: (value) => {
    if (!value) return null;
    
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  // Number validation
  number: (value, options = {}) => {
    if (!value && value !== 0) return null;
    
    const num = Number(value);
    if (isNaN(num)) {
      return 'Please enter a valid number';
    }
    
    if (options.min !== undefined && num < options.min) {
      return `Value must be at least ${options.min}`;
    }
    
    if (options.max !== undefined && num > options.max) {
      return `Value must be at most ${options.max}`;
    }
    
    return null;
  },

  // Integer validation
  integer: (value, options = {}) => {
    if (!value && value !== 0) return null;
    
    const num = Number(value);
    if (isNaN(num) || !Number.isInteger(num)) {
      return 'Please enter a valid integer';
    }
    
    if (options.min !== undefined && num < options.min) {
      return `Value must be at least ${options.min}`;
    }
    
    if (options.max !== undefined && num > options.max) {
      return `Value must be at most ${options.max}`;
    }
    
    return null;
  },

  // Min length
  minLength: (value, min) => {
    if (!value) return null;
    
    if (value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  },

  // Max length
  maxLength: (value, max) => {
    if (!value) return null;
    
    if (value.length > max) {
      return `Must be at most ${max} characters`;
    }
    return null;
  },

  // Exact length
  exactLength: (value, length) => {
    if (!value) return null;
    
    if (value.length !== length) {
      return `Must be exactly ${length} characters`;
    }
    return null;
  },

  // Pattern validation
  pattern: (value, regex, message) => {
    if (!value) return null;
    
    if (!regex.test(value)) {
      return message || 'Invalid format';
    }
    return null;
  },

  // Date validation
  date: (value) => {
    if (!value) return null;
    
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date';
    }
    return null;
  },

  // Future date
  futureDate: (value) => {
    if (!value) return null;
    
    const date = new Date(value);
    if (date <= new Date()) {
      return 'Date must be in the future';
    }
    return null;
  },

  // Past date
  pastDate: (value) => {
    if (!value) return null;
    
    const date = new Date(value);
    if (date >= new Date()) {
      return 'Date must be in the past';
    }
    return null;
  },

  // Array validation
  array: (value, options = {}) => {
    if (!value) return null;
    
    if (!Array.isArray(value)) {
      return 'Must be an array';
    }
    
    if (options.minSize !== undefined && value.length < options.minSize) {
      return `Must have at least ${options.minSize} items`;
    }
    
    if (options.maxSize !== undefined && value.length > options.maxSize) {
      return `Must have at most ${options.maxSize} items`;
    }
    
    return null;
  },

  // Boolean validation
  boolean: (value) => {
    if (value === null || value === undefined) return null;
    
    if (typeof value !== 'boolean') {
      return 'Must be a boolean';
    }
    return null;
  },

  // Username validation
  username: (value) => {
    if (!value) return null;
    
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(value)) {
      return 'Username must be 3-20 characters and can only contain letters, numbers, and underscores';
    }
    return null;
  },

  // Color hex validation
  color: (value) => {
    if (!value) return null;
    
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!colorRegex.test(value)) {
      return 'Please enter a valid hex color code';
    }
    return null;
  },

  // File type validation
  fileType: (file, allowedTypes) => {
    if (!file) return null;
    
    if (!allowedTypes.includes(file.type)) {
      return `File type not allowed. Allowed: ${allowedTypes.join(', ')}`;
    }
    return null;
  },

  // File size validation
  fileSize: (file, maxSize) => {
    if (!file) return null;
    
    if (file.size > maxSize) {
      const mb = maxSize / (1024 * 1024);
      return `File size must be less than ${mb}MB`;
    }
    return null;
  },

  // Compose multiple validators
  compose: (...validators) => {
    return (value, formValues) => {
      for (const validator of validators) {
        if (typeof validator === 'function') {
          const error = validator(value, formValues);
          if (error) return error;
        }
      }
      return null;
    };
  },

  // Social media handle validation
  socialHandle: (platform, value) => {
    if (!value) return null;
    
    const patterns = {
      facebook: /^[a-zA-Z0-9.]{5,50}$/,
      instagram: /^[a-zA-Z0-9._]{1,30}$/,
      twitter: /^[a-zA-Z0-9_]{1,15}$/,
      linkedin: /^[a-zA-Z0-9-]{3,100}$/,
      tiktok: /^[a-zA-Z0-9._]{2,24}$/,
      youtube: /^[a-zA-Z0-9-]{3,20}$/
    };
    
    const pattern = patterns[platform];
    if (!pattern) return null;
    
    if (!pattern.test(value)) {
      return `Invalid ${platform} username format`;
    }
    return null;
  },

  // Hashtag validation
  hashtag: (value) => {
    if (!value) return null;
    
    const cleanTag = value.replace(/^#/, '');
    const hashtagRegex = /^[a-zA-Z0-9_]+$/;
    
    if (!hashtagRegex.test(cleanTag)) {
      return 'Hashtag can only contain letters, numbers, and underscores';
    }
    
    if (cleanTag.length > 50) {
      return 'Hashtag cannot exceed 50 characters';
    }
    
    return null;
  }
};

export const {
  required,
  email,
  password,
  confirmPassword,
  phone,
  url,
  number,
  integer,
  minLength,
  maxLength,
  exactLength,
  pattern,
  date,
  futureDate,
  pastDate,
  array,
  boolean,
  username,
  color,
  fileType,
  fileSize,
  compose,
  socialHandle,
  hashtag
} = validators;