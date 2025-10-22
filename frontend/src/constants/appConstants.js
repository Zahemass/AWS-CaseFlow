// ✅ App Info
export const APP_NAME = 'CaseFlow AI';
export const APP_VERSION = '1.0.0';

// ✅ Branding
export const BRAND_COLORS = {
  primary: '#3b82f6',
  secondary: '#2563eb',
  accent: '#1e40af',
  background: '#f8fafc',
};

// ✅ Default Roles (for Cognito groups or role-based UI)
export const USER_ROLES = {
  ADMIN: 'Admin',
  LAWYER: 'Lawyer',
  ANALYST: 'Analyst',
  VIEWER: 'Viewer',
};

// ✅ Feature Toggles
export const FEATURE_FLAGS = {
  CONTRADICTION_DETECTION: true,
  CREDIBILITY_ANALYSIS: true,
  TIMELINE_BUILDER: true,
  EVIDENCE_CHAIN: true,
};

// ✅ Default File Settings
export const FILE_CONSTANTS = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: ['.pdf', '.doc', '.docx', '.txt'],
  CHUNK_SIZE: 5 * 1024 * 1024, // 5MB
};

// ✅ AWS References
export const AWS_REFERENCES = {
  REGION: import.meta.env.VITE_AWS_REGION,
  S3_BUCKET: import.meta.env.VITE_AWS_S3_BUCKET,
  DYNAMO_TABLE_CASES: import.meta.env.VITE_DYNAMODB_CASES_TABLE,
};

// ✅ Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'caseflow_token',
  USER: 'caseflow_user',
  THEME: 'caseflow_theme',
};
