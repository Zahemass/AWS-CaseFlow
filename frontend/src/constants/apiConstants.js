// ✅ API Base URLs
export const API_BASE_URL =
  import.meta.env.VITE_API_GATEWAY_URL || 'https://api.caseflow.ai';

// ✅ Endpoint paths (used in services/api/endpoints.js)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  CASES: {
    BASE: '/cases',
    DETAIL: (id) => `/cases/${id}`,
    CREATE: '/cases/create',
  },
  DOCUMENTS: {
    BASE: '/documents',
    UPLOAD: '/documents/upload',
    DELETE: (id) => `/documents/${id}`,
    METADATA: (id) => `/documents/${id}/metadata`,
  },
  ANALYSIS: {
    CONTRADICTIONS: '/analysis/contradictions',
    TIMELINE: '/analysis/timeline',
    CREDIBILITY: '/analysis/credibility',
    EVIDENCE_CHAIN: '/analysis/evidence-chain',
  },
  AGENT: {
    CHAT: '/agent/chat',
    STREAM: '/agent/stream',
  },
};

// ✅ Common Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// ✅ HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// ✅ Pagination defaults
export const PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
};

// ✅ API Timeout (ms)
export const API_TIMEOUT = 30000;
