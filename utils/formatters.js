import { format, formatDistance, formatDistanceToNow, formatRelative } from 'date-fns';
import { DATE_FORMATS } from './constants';

export const formatters = {
  // Date formatting
  formatDate: (date, formatStr = DATE_FORMATS.DISPLAY) => {
    if (!date) return '';
    try {
      return format(new Date(date), formatStr);
    } catch {
      return '';
    }
  },

  formatDateTime: (date) => {
    return formatters.formatDate(date, DATE_FORMATS.DISPLAY_TIME);
  },

  formatRelativeTime: (date) => {
    if (!date) return '';
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return '';
    }
  },

  formatTimeAgo: (date) => {
    return formatters.formatRelativeTime(date);
  },

  formatTimeRange: (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    return `${formatters.formatDate(startDate)} - ${formatters.formatDate(endDate)}`;
  },

  // Number formatting
  formatNumber: (num, decimals = 0) => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  },

  formatCompactNumber: (num) => {
    if (num === null || num === undefined) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },

  formatPercentage: (value, decimals = 1) => {
    if (value === null || value === undefined) return '0%';
    return value.toFixed(decimals) + '%';
  },

  // Currency formatting
  formatCurrency: (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return '$0';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  },

  formatCompactCurrency: (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return '$0';
    
    const symbol = currency === 'USD' ? '$' : 
                   currency === 'EUR' ? '€' : 
                   currency === 'GBP' ? '£' : '$';
    
    if (amount >= 1000000) {
      return symbol + (amount / 1000000).toFixed(1) + 'M';
    }
    if (amount >= 1000) {
      return symbol + (amount / 1000).toFixed(1) + 'K';
    }
    return symbol + amount;
  },

  // Text formatting
  formatTitle: (str) => {
    if (!str) return '';
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  },

  formatPlural: (count, singular, plural = null) => {
    if (count === 1) return `${count} ${singular}`;
    return `${count} ${plural || singular + 's'}`;
  },

  formatTruncate: (str, length = 50, suffix = '...') => {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
  },

  formatInitials: (firstName, lastName) => {
    if (!firstName && !lastName) return '';
    return (firstName?.charAt(0) || '') + (lastName?.charAt(0) || '');
  },

  // File size formatting
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    if (bytes === null || bytes === undefined) return '';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Duration formatting
  formatDuration: (seconds) => {
    if (!seconds) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },

  // Phone number formatting
  formatPhoneNumber: (phone) => {
    if (!phone) return '';
    
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    
    return phone;
  },

  // URL formatting
  formatUrl: (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return 'https://' + url;
  },

  formatDomain: (url) => {
    if (!url) return '';
    try {
      const hostname = new URL(formatters.formatUrl(url)).hostname;
      return hostname.replace('www.', '');
    } catch {
      return url;
    }
  },

  // List formatting
  formatList: (items, conjunction = 'and') => {
    if (!items || items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return items.join(` ${conjunction} `);
    
    const last = items.pop();
    return items.join(', ') + `, ${conjunction} ` + last;
  },

  // Rating formatting
  formatRating: (rating, max = 5) => {
    if (!rating) return '0';
    return `${rating}/${max}`;
  },

  // Bytes to human readable
  formatBytes: (bytes, decimals = 2) => {
    return formatters.formatFileSize(bytes);
  },

  // Percentage to string
  formatPercent: (value, decimals = 1) => {
    return formatters.formatPercentage(value, decimals);
  },

  // Convert to slug
  formatSlug: (str) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  },

  // Format follower count
  formatFollowers: (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M followers';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K followers';
    }
    return count + ' followers';
  },

  // Format engagement rate
  formatEngagementRate: (likes, comments, shares, followers) => {
    if (!followers || followers === 0) return '0%';
    const total = (likes || 0) + (comments || 0) + (shares || 0);
    const rate = (total / followers) * 100;
    return rate.toFixed(2) + '%';
  },

  // Format time for posts
  formatPostTime: (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffHours = Math.abs(now - postDate) / 36e5;
    
    if (diffHours < 1) {
      return Math.round(diffHours * 60) + 'm ago';
    }
    if (diffHours < 24) {
      return Math.round(diffHours) + 'h ago';
    }
    if (diffHours < 168) {
      return Math.round(diffHours / 24) + 'd ago';
    }
    return formatters.formatDate(date, 'MMM d');
  },

  // Format message preview
  formatMessagePreview: (message, maxLength = 50) => {
    if (!message) return '';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  },

  // Format hashtags
  formatHashtags: (hashtags) => {
    if (!hashtags || !Array.isArray(hashtags)) return '';
    return hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
  },

  // Format mentions
  formatMentions: (mentions) => {
    if (!mentions || !Array.isArray(mentions)) return '';
    return mentions.map(mention => mention.startsWith('@') ? mention : `@${mention}`).join(' ');
  }
};

export const {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatTimeAgo,
  formatTimeRange,
  formatNumber,
  formatCompactNumber,
  formatPercentage,
  formatCurrency,
  formatCompactCurrency,
  formatTitle,
  formatPlural,
  formatTruncate,
  formatInitials,
  formatFileSize,
  formatDuration,
  formatPhoneNumber,
  formatUrl,
  formatDomain,
  formatList,
  formatRating,
  formatBytes,
  formatPercent,
  formatSlug,
  formatFollowers,
  formatEngagementRate,
  formatPostTime,
  formatMessagePreview,
  formatHashtags,
  formatMentions
} = formatters;