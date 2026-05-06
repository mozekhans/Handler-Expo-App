export const APP_NAME = "AI Social Media Manager";
export const APP_VERSION = "1.0.0";

// API Endpoints
export const API_BASE_URL = process.env.API_URL || "http://localhost:5000/api";
export const SOCKET_URL = process.env.SOCKET_URL || "http://localhost:5000";

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
  NOTIFICATIONS: "notifications",
  CURRENT_BUSINESS: "currentBusinessId",
  ONBOARDING_COMPLETED: "onboardingCompleted",
};

// Social Media Platforms
export const PLATFORMS = {
  FACEBOOK: "facebook",
  INSTAGRAM: "instagram",
  TWITTER: "twitter",
  LINKEDIN: "linkedin",
  TIKTOK: "tiktok",
  PINTEREST: "pinterest",
  YOUTUBE: "youtube",
  SNAPCHAT: "snapchat",
  REDDIT: "reddit",
  THREADS: "threads",
};

export const PLATFORM_LABELS = {
  [PLATFORMS.FACEBOOK]: "Facebook",
  [PLATFORMS.INSTAGRAM]: "Instagram",
  [PLATFORMS.TWITTER]: "Twitter",
  [PLATFORMS.LINKEDIN]: "LinkedIn",
  [PLATFORMS.TIKTOK]: "TikTok",
  [PLATFORMS.PINTEREST]: "Pinterest",
  [PLATFORMS.YOUTUBE]: "YouTube",
  [PLATFORMS.SNAPCHAT]: "Snapchat",
  [PLATFORMS.REDDIT]: "Reddit",
  [PLATFORMS.THREADS]: "Threads",
};

export const PLATFORM_COLORS = {
  [PLATFORMS.FACEBOOK]: "#1877f2",
  [PLATFORMS.INSTAGRAM]: "#e4405f",
  [PLATFORMS.TWITTER]: "#1da1f2",
  [PLATFORMS.LINKEDIN]: "#0077b5",
  [PLATFORMS.TIKTOK]: "#000000",
  [PLATFORMS.PINTEREST]: "#bd081c",
  [PLATFORMS.YOUTUBE]: "#ff0000",
  [PLATFORMS.SNAPCHAT]: "#fffc00",
  [PLATFORMS.REDDIT]: "#ff4500",
  [PLATFORMS.THREADS]: "#000000",
};

export const PLATFORM_ICONS = {
  [PLATFORMS.FACEBOOK]: "facebook",
  [PLATFORMS.INSTAGRAM]: "instagram",
  [PLATFORMS.TWITTER]: "twitter",
  [PLATFORMS.LINKEDIN]: "linkedin",
  [PLATFORMS.TIKTOK]: "music-note",
  [PLATFORMS.PINTEREST]: "pinterest",
  [PLATFORMS.YOUTUBE]: "youtube",
  [PLATFORMS.SNAPCHAT]: "snapchat",
  [PLATFORMS.REDDIT]: "reddit",
  [PLATFORMS.THREADS]: "chat",
};

// Content Status
export const CONTENT_STATUS = {
  DRAFT: "draft",
  REVIEW: "review",
  APPROVED: "approved",
  REJECTED: "rejected",
  SCHEDULED: "scheduled",
  PUBLISHED: "published",
  FAILED: "failed",
  ARCHIVED: "archived",
};

export const CONTENT_STATUS_LABELS = {
  [CONTENT_STATUS.DRAFT]: "Draft",
  [CONTENT_STATUS.REVIEW]: "Review",
  [CONTENT_STATUS.APPROVED]: "Approved",
  [CONTENT_STATUS.REJECTED]: "Rejected",
  [CONTENT_STATUS.SCHEDULED]: "Scheduled",
  [CONTENT_STATUS.PUBLISHED]: "Published",
  [CONTENT_STATUS.FAILED]: "Failed",
  [CONTENT_STATUS.ARCHIVED]: "Archived",
};

export const CONTENT_STATUS_COLORS = {
  [CONTENT_STATUS.DRAFT]: "#9e9e9e",
  [CONTENT_STATUS.REVIEW]: "#ff9800",
  [CONTENT_STATUS.APPROVED]: "#4caf50",
  [CONTENT_STATUS.REJECTED]: "#f44336",
  [CONTENT_STATUS.SCHEDULED]: "#2196f3",
  [CONTENT_STATUS.PUBLISHED]: "#4caf50",
  [CONTENT_STATUS.FAILED]: "#f44336",
  [CONTENT_STATUS.ARCHIVED]: "#9e9e9e",
};

// Content Types
export const CONTENT_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  CAROUSEL: "carousel",
  REEL: "reel",
  STORY: "story",
  THREAD: "thread",
};

// Engagement Types
export const ENGAGEMENT_TYPES = {
  COMMENT: "comment",
  MESSAGE: "message",
  MENTION: "mention",
  LIKE: "like",
  SHARE: "share",
  FOLLOW: "follow",
  UNFOLLOW: "unfollow",
  REPLY: "reply",
  RETWEET: "retweet",
};

// Sentiment Types
export const SENTIMENT_TYPES = {
  POSITIVE: "positive",
  NEGATIVE: "negative",
  NEUTRAL: "neutral",
  MIXED: "mixed",
};

export const SENTIMENT_COLORS = {
  [SENTIMENT_TYPES.POSITIVE]: "#4caf50",
  [SENTIMENT_TYPES.NEGATIVE]: "#f44336",
  [SENTIMENT_TYPES.NEUTRAL]: "#ff9800",
  [SENTIMENT_TYPES.MIXED]: "#9c27b0",
};

// Campaign Objectives
export const CAMPAIGN_OBJECTIVES = {
  AWARENESS: "awareness",
  CONSIDERATION: "consideration",
  CONVERSION: "conversion",
  ENGAGEMENT: "engagement",
  TRAFFIC: "traffic",
  LEADS: "leads",
  SALES: "sales",
  VIDEO_VIEWS: "video_views",
  APP_INSTALLS: "app_installs",
};

export const CAMPAIGN_OBJECTIVE_LABELS = {
  [CAMPAIGN_OBJECTIVES.AWARENESS]: "Brand Awareness",
  [CAMPAIGN_OBJECTIVES.CONSIDERATION]: "Consideration",
  [CAMPAIGN_OBJECTIVES.CONVERSION]: "Conversion",
  [CAMPAIGN_OBJECTIVES.ENGAGEMENT]: "Engagement",
  [CAMPAIGN_OBJECTIVES.TRAFFIC]: "Traffic",
  [CAMPAIGN_OBJECTIVES.LEADS]: "Lead Generation",
  [CAMPAIGN_OBJECTIVES.SALES]: "Sales",
  [CAMPAIGN_OBJECTIVES.VIDEO_VIEWS]: "Video Views",
  [CAMPAIGN_OBJECTIVES.APP_INSTALLS]: "App Installs",
};

// Campaign Status
export const CAMPAIGN_STATUS = {
  DRAFT: "draft",
  SCHEDULED: "scheduled",
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  ARCHIVED: "archived",
};

export const CAMPAIGN_STATUS_LABELS = {
  [CAMPAIGN_STATUS.DRAFT]: "Draft",
  [CAMPAIGN_STATUS.SCHEDULED]: "Scheduled",
  [CAMPAIGN_STATUS.ACTIVE]: "Active",
  [CAMPAIGN_STATUS.PAUSED]: "Paused",
  [CAMPAIGN_STATUS.COMPLETED]: "Completed",
  [CAMPAIGN_STATUS.ARCHIVED]: "Archived",
};

export const CAMPAIGN_STATUS_COLORS = {
  [CAMPAIGN_STATUS.DRAFT]: "#9e9e9e",
  [CAMPAIGN_STATUS.SCHEDULED]: "#2196f3",
  [CAMPAIGN_STATUS.ACTIVE]: "#4caf50",
  [CAMPAIGN_STATUS.PAUSED]: "#ff9800",
  [CAMPAIGN_STATUS.COMPLETED]: "#9c27b0",
  [CAMPAIGN_STATUS.ARCHIVED]: "#9e9e9e",
};

// Subscription Tiers
export const SUBSCRIPTION_TIERS = {
  FREE: "free",
  BASIC: "basic",
  PROFESSIONAL: "professional",
  ENTERPRISE: "enterprise",
};

export const SUBSCRIPTION_TIER_LABELS = {
  [SUBSCRIPTION_TIERS.FREE]: "Free",
  [SUBSCRIPTION_TIERS.BASIC]: "Basic",
  [SUBSCRIPTION_TIERS.PROFESSIONAL]: "Professional",
  [SUBSCRIPTION_TIERS.ENTERPRISE]: "Enterprise",
};

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  BUSINESS_OWNER: "business_owner",
  TEAM_MEMBER: "team_member",
  VIEWER: "viewer",
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: "Admin",
  [USER_ROLES.BUSINESS_OWNER]: "Business Owner",
  [USER_ROLES.TEAM_MEMBER]: "Team Member",
  [USER_ROLES.VIEWER]: "Viewer",
};

// Notification Types
export const NOTIFICATION_TYPES = {
  ENGAGEMENT: "engagement",
  COMMENT: "comment",
  MESSAGE: "message",
  MENTION: "mention",
  POST_PUBLISHED: "post_published",
  POST_SCHEDULED: "post_scheduled",
  CAMPAIGN: "campaign",
  REPORT: "report",
  ALERT: "alert",
  SUBSCRIPTION: "subscription",
  PAYMENT: "payment",
  TEAM: "team",
  SYSTEM: "system",
};

// Notification Priorities
export const NOTIFICATION_PRIORITIES = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  DISPLAY_TIME: "MMM dd, yyyy hh:mm a",
  ISO: "yyyy-MM-dd",
  ISO_TIME: "yyyy-MM-dd HH:mm:ss",
  TIME: "hh:mm a",
  MONTH_DAY: "MMM dd",
  YEAR_MONTH: "yyyy-MM",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  AUDIO_SIZE: 50 * 1024 * 1024, // 50MB
  DOCUMENT_SIZE: 25 * 1024 * 1024, // 25MB
  MAX_FILES: 10,
};

// Image Quality
export const IMAGE_QUALITY = {
  THUMBNAIL: 0.3,
  PREVIEW: 0.6,
  HIGH: 0.9,
};

// Video Quality
export const VIDEO_QUALITY = {
  LOW: "480p",
  MEDIUM: "720p",
  HIGH: "1080p",
  ULTRA: "4K",
};

// Time Ranges
export const TIME_RANGES = {
  TODAY: "today",
  YESTERDAY: "yesterday",
  LAST_7_DAYS: "last_7_days",
  LAST_30_DAYS: "last_30_days",
  LAST_90_DAYS: "last_90_days",
  THIS_MONTH: "this_month",
  LAST_MONTH: "last_month",
  THIS_YEAR: "this_year",
  CUSTOM: "custom",
};

export const TIME_RANGE_LABELS = {
  [TIME_RANGES.TODAY]: "Today",
  [TIME_RANGES.YESTERDAY]: "Yesterday",
  [TIME_RANGES.LAST_7_DAYS]: "Last 7 Days",
  [TIME_RANGES.LAST_30_DAYS]: "Last 30 Days",
  [TIME_RANGES.LAST_90_DAYS]: "Last 90 Days",
  [TIME_RANGES.THIS_MONTH]: "This Month",
  [TIME_RANGES.LAST_MONTH]: "Last Month",
  [TIME_RANGES.THIS_YEAR]: "This Year",
  [TIME_RANGES.CUSTOM]: "Custom",
};

// Chart Types
export const CHART_TYPES = {
  LINE: "line",
  BAR: "bar",
  PIE: "pie",
  DOUGHNUT: "doughnut",
  AREA: "area",
  RADAR: "radar",
};

// Tone Types
export const TONES = {
  PROFESSIONAL: "professional",
  CASUAL: "casual",
  FRIENDLY: "friendly",
  HUMOROUS: "humorous",
  INSPIRATIONAL: "inspirational",
  EDUCATIONAL: "educational",
  AUTHORITATIVE: "authoritative",
  EMPATHETIC: "empathetic",
};

// Labels
export const TONE_LABELS = {
  [TONES.PROFESSIONAL]: "Professional",
  [TONES.CASUAL]: "Casual",
  [TONES.FRIENDLY]: "Friendly",
  [TONES.HUMOROUS]: "Humorous",
  [TONES.INSPIRATIONAL]: "Inspirational",
  [TONES.EDUCATIONAL]: "Educational",
  [TONES.AUTHORITATIVE]: "Authoritative",
  [TONES.EMPATHETIC]: "Empathetic",
};

// Icons
export const TONE_ICONS = {
  [TONES.PROFESSIONAL]: "💼",
  [TONES.CASUAL]: "😎",
  [TONES.FRIENDLY]: "😊",
  [TONES.HUMOROUS]: "😂",
  [TONES.INSPIRATIONAL]: "✨",
  [TONES.EDUCATIONAL]: "📚",
  [TONES.AUTHORITATIVE]: "🧠",
  [TONES.EMPATHETIC]: "❤️",
};

// FINAL: Array for UI (THIS is what your screen needs)
export const TONE_OPTIONS = Object.values(TONES).map((value) => ({
  value,
  label: TONE_LABELS[value],
  icon: TONE_ICONS[value],
}));

// Integrations
export const INTEGRATION_TYPES = [
  { value: "crm", label: "CRM" },
  { value: "ecommerce", label: "Ecommerce" },
  { value: "analytics", label: "Analytics" },
  { value: "support", label: "Support" },
  { value: "email", label: "Email" },
  { value: "payment", label: "Payment" },
];

export const INTEGRATION_PROVIDERS = {
  crm: [
    { value: "salesforce", label: "Salesforce" },
    { value: "hubspot", label: "HubSpot" },
  ],

  ecommerce: [
    { value: "shopify", label: "Shopify" },
    { value: "woocommerce", label: "WooCommerce" },
  ],

  analytics: [{ value: "google_analytics", label: "Google Analytics" }],

  support: [{ value: "zendesk", label: "Zendesk" }],

  email: [{ value: "mailchimp", label: "Mailchimp" }],

  payment: [{ value: "stripe", label: "Stripe" }],
};

// Export Formats
export const EXPORT_FORMATS = {
  PDF: "pdf",
  EXCEL: "excel",
  CSV: "csv",
  JSON: "json",
};

// Week Days
export const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Months
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "Resource not found.",
  VALIDATION: "Please check your input and try again.",
  SERVER: "Server error. Please try again later.",
  TIMEOUT: "Request timed out. Please try again.",
  OFFLINE: "You are offline. Please check your internet connection.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: "Changes saved successfully.",
  DELETED: "Item deleted successfully.",
  PUBLISHED: "Content published successfully.",
  SCHEDULED: "Content scheduled successfully.",
  SENT: "Message sent successfully.",
  UPLOADED: "File uploaded successfully.",
};

// Permissions
export const PERMISSIONS = {
  CAMERA: "camera",
  PHOTO_LIBRARY: "photo_library",
  NOTIFICATIONS: "notifications",
  LOCATION: "location",
  STORAGE: "storage",
};

// Deep Links
export const DEEP_LINKS = {
  POST: "app://post/",
  CAMPAIGN: "app://campaign/",
  ENGAGEMENT: "app://engagement/",
  ANALYTICS: "app://analytics/",
  PROFILE: "app://profile/",
  SETTINGS: "app://settings/",
};

// App Routes
export const ROUTES = {
  AUTH: {
    LOGIN: "Login",
    REGISTER: "Register",
    FORGOT_PASSWORD: "ForgotPassword",
    VERIFY_EMAIL: "VerifyEmail",
    TWO_FACTOR: "TwoFactor",
  },
  BUSINESS: {
    SELECT: "BusinessSelect",
    CREATE: "CreateBusiness",
  },
  MAIN: {
    DASHBOARD: "Dashboard",
    CONTENT: "Content",
    ENGAGEMENT: "Engagement",
    ANALYTICS: "Analytics",
    CALENDAR: "Calendar",
    CAMPAIGNS: "Campaigns",
  },
  CONTENT: {
    CREATE_POST: "CreatePost",
    EDIT_POST: "EditPost",
    POST_DETAILS: "PostDetails",
    MEDIA_LIBRARY: "MediaLibrary",
  },
  ENGAGEMENT: {
    CONVERSATION: "Conversation",
    COMMENTS: "Comments",
    MENTIONS: "Mentions",
  },
  PROFILE: {
    PROFILE: "Profile",
    EDIT_PROFILE: "EditProfile",
  },
  SETTINGS: {
    SETTINGS: "Settings",
    SECURITY: "Security",
    NOTIFICATIONS: "Notifications",
    INTEGRATIONS: "Integrations",
  },
  SUBSCRIPTION: {
    PLANS: "Plans",
    BILLING: "Billing",
    INVOICES: "Invoices",
  },
  HELP: {
    HELP_CENTER: "HelpCenter",
    FAQ: "FAQ",
    CONTACT_SUPPORT: "ContactSupport",
  },
};

export const SOCIAL_PLATFORMS = {
  FACEBOOK: "facebook",
  INSTAGRAM: "instagram",
  TWITTER: "twitter",
  LINKEDIN: "linkedin",
  TIKTOK: "tiktok",
  YOUTUBE: "youtube",
};

// export const CONTENT_STATUS = {
//   DRAFT: "draft",
//   SCHEDULED: "scheduled",
//   PUBLISHED: "published",
//   FAILED: "failed",
//   REVIEW: "review",
//   APPROVED: "approved",
//   REJECTED: "rejected",
//   DELETED: "deleted",
// };

export const STATUS_COLORS = {
  draft: "#6c757d",
  scheduled: "#17a2b8",
  published: "#28a745",
  failed: "#dc3545",
  review: "#ffc107",
  approved: "#20c997",
  rejected: "#fd7e14",
  deleted: "#343a40",
};

// export const PLATFORM_ICONS = {
//   facebook: "facebook",
//   instagram: "instagram",
//   twitter: "twitter",
//   linkedin: "linkedin",
//   tiktok: "music-note",
//   youtube: "youtube",
// };

export const MEDIA_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  GIF: "gif",
  AUDIO: "audio",
  DOCUMENT: "document",
};
