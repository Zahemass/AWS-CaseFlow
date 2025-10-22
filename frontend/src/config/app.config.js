// Application Configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'CaseFlow AI',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiUrl: import.meta.env.VITE_API_GATEWAY_URL,
  
  // File Upload Settings
  upload: {
    maxSize: parseInt(import.meta.env.VITE_MAX_UPLOAD_SIZE) || 52428800, // 50MB
    allowedTypes: (import.meta.env.VITE_ALLOWED_FILE_TYPES || '.pdf,.doc,.docx,.txt').split(','),
    chunkSize: 5 * 1024 * 1024, // 5MB chunks for multipart upload
  },

  // Feature Flags
  features: {
    contradictionDetection: import.meta.env.VITE_ENABLE_CONTRADICTION_DETECTION === 'true',
    credibilityAnalysis: import.meta.env.VITE_ENABLE_CREDIBILITY_ANALYSIS === 'true',
    timelineBuilder: import.meta.env.VITE_ENABLE_TIMELINE_BUILDER === 'true',
    evidenceChain: import.meta.env.VITE_ENABLE_EVIDENCE_CHAIN === 'true',
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },

  // Debug
  debug: import.meta.env.VITE_DEBUG_MODE === 'true',
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',

  // Timeouts
  timeouts: {
    api: 30000, // 30 seconds
    upload: 300000, // 5 minutes
    agent: 60000, // 1 minute
  },

  // Retry Configuration
  retry: {
    maxAttempts: 3,
    backoffMultiplier: 2,
    initialDelay: 1000,
  },

  // Cache Configuration
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
  },

  // UI Configuration
  ui: {
    toastDuration: 3000,
    skeletonLoaders: true,
    animationsEnabled: true,
  },
};

export default APP_CONFIG;