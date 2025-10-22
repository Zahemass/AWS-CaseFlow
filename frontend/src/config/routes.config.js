// Route Configuration
export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Protected Routes
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
  
  // Error
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
};

// Route Helpers
export const buildRoute = (route, params = {}) => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
};

// Navigation Configuration
export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
    requiresAuth: true,
  },
  {
    label: 'Cases',
    path: ROUTES.CASES,
    icon: 'Briefcase',
    requiresAuth: true,
  },
  {
    label: 'Documents',
    path: ROUTES.DOCUMENTS,
    icon: 'FileText',
    requiresAuth: true,
  },
  {
    label: 'Analysis',
    path: ROUTES.ANALYSIS,
    icon: 'LineChart',
    requiresAuth: true,
    children: [
      {
        label: 'Contradictions',
        path: ROUTES.CONTRADICTIONS,
        icon: 'AlertTriangle',
      },
      {
        label: 'Timeline',
        path: ROUTES.TIMELINE,
        icon: 'Clock',
      },
      {
        label: 'Credibility',
        path: ROUTES.CREDIBILITY,
        icon: 'ShieldCheck',
      },
      {
        label: 'Evidence Chain',
        path: ROUTES.EVIDENCE_CHAIN,
        icon: 'Network',
      },
    ],
  },
  {
    label: 'AI Agent',
    path: ROUTES.AGENT_CHAT,
    icon: 'Bot',
    requiresAuth: true,
  },
];

export default ROUTES;