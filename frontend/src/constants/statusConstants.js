// ✅ HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// ✅ Case Statuses
export const CASE_STATUS = {
  OPEN: 'Open',
  CLOSED: 'Closed',
  PENDING: 'Pending',
  REVIEW: 'Under Review',
};

// ✅ Document Statuses
export const DOCUMENT_STATUS = {
  UPLOADING: 'Uploading',
  COMPLETE: 'Complete',
  FAILED: 'Failed',
};

// ✅ AI Agent Response States
export const AGENT_STATUS = {
  IDLE: 'Idle',
  PROCESSING: 'Processing',
  RESPONDED: 'Responded',
  ERROR: 'Error',
};

// ✅ Generic Operation States
export const OPERATION_STATE = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  IDLE: 'idle',
};

// ✅ UI Color Codes (for badges or status indicators)
export const STATUS_COLORS = {
  success: '#16a34a',
  warning: '#f59e0b',
  danger: '#dc2626',
  info: '#2563eb',
};
