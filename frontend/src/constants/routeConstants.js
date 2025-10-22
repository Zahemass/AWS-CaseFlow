// ✅ Route Constants (UI routing only)
export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  DASHBOARD: '/dashboard',

  // Cases
  CASES: '/cases',
  CASE_DETAIL: '/cases/:id',
  CREATE_CASE: '/cases/new',

  // Documents
  DOCUMENTS: '/documents',
  DOCUMENT_DETAIL: '/documents/:id',
  UPLOAD_DOCUMENTS: '/documents/upload',

  // Analysis
  ANALYSIS: '/analysis',
  CONTRADICTIONS: '/analysis/contradictions',
  TIMELINE: '/analysis/timeline',
  CREDIBILITY: '/analysis/credibility',
  EVIDENCE_CHAIN: '/analysis/evidence-chain',

  // Agent
  AGENT_CHAT: '/agent',

  // Settings
  SETTINGS: '/settings',
  PROFILE: '/settings/profile',

  // Errors
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
};

// ✅ Helper — Replace route parameters dynamically
export const buildRoutePath = (route, params = {}) => {
  let path = route;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, value);
  }
  return path;
};
