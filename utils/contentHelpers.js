// utils/helpers.js
export const formatDate = (date, format = 'MM/DD/YYYY') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getPlatformDisplayName = (platform) => {
  const names = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    tiktok: 'TikTok',
    youtube: 'YouTube',
  };
  return names[platform] || platform;
};

export const getStatusColor = (status) => {
  const colors = {
    draft: '#6c757d',
    scheduled: '#17a2b8',
    published: '#28a745',
    failed: '#dc3545',
    review: '#ffc107',
    approved: '#20c997',
    rejected: '#fd7e14',
    deleted: '#343a40',
  };
  return colors[status] || '#6c757d';
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};