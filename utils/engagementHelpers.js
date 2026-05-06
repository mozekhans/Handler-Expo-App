// utils/helpers.js
export const timeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);
  
  if (seconds < 0) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  
  return new Date(date).toLocaleDateString();
};

export const getSentimentColor = (sentiment) => {
  const colors = {
    very_positive: '#2E7D32',
    positive: '#4CAF50',
    neutral: '#9E9E9E',
    mixed: '#FF9800',
    negative: '#F44336',
    very_negative: '#C62828',
  };
  return colors[sentiment] || colors.neutral;
};

export const getSentimentBgColor = (sentiment) => {
  const colors = {
    very_positive: '#E8F5E9',
    positive: '#E8F5E9',
    neutral: '#F5F5F5',
    mixed: '#FFF3E0',
    negative: '#FFEBEE',
    very_negative: '#FFEBEE',
  };
  return colors[sentiment] || colors.neutral;
};

export const getPriorityColor = (priority) => {
  const colors = {
    urgent: '#F44336',
    high: '#FF9800',
    medium: '#2196F3',
    low: '#4CAF50',
  };
  return colors[priority] || colors.medium;
};

export const getPlatformColor = (platform) => {
  const colors = {
    facebook: '#1877F2',
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    linkedin: '#0A66C2',
    tiktok: '#000000',
    youtube: '#FF0000',
    pinterest: '#E60023',
    snapchat: '#FFFC00',
    reddit: '#FF4500',
    threads: '#000000',
  };
  return colors[platform] || '#9E9E9E';
};

export const getPlatformIcon = (platform) => {
  const icons = {
    facebook: 'logo-facebook',
    instagram: 'logo-instagram',
    twitter: 'logo-twitter',
    linkedin: 'logo-linkedin',
    tiktok: 'logo-tiktok',
    youtube: 'logo-youtube',
    pinterest: 'logo-pinterest',
    snapchat: 'logo-snapchat',
    reddit: 'logo-reddit',
  };
  return icons[platform] || 'globe-outline';
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatDate = (date, format = 'default') => {
  if (!date) return '';
  const d = new Date(date);
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString();
    case 'long':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    case 'time':
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    case 'datetime':
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    case 'iso':
      return d.toISOString();
    default:
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

export const sortByDate = (array, key = 'createdAt', order = 'desc') => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[key]);
    const dateB = new Date(b[key]);
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};