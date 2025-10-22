// Base API Gateway URL (from environment)
export const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

// REST Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  CASES: {
    BASE: '/cases',
  },
  DOCUMENTS: {
    BASE: '/documents',
    UPLOAD: '/documents/upload',
  },
  ANALYSIS: {
  CONTRADICTIONS: '/analysis',
  TIMELINE: '/analysis',
  CREDIBILITY: '/analysis',
  EVIDENCE: '/analysis',
  GET: '/analysis', 
  },
  DOC_ANALYSIS: {
    BY_DOC: '/document-analyse',        // GET ?documentId=
    BY_CASE: '/document-analyse?caseId=', // or /document-analyse/by-case
  },
  AGENT: {
    ASK: '/agent',
  },
};
