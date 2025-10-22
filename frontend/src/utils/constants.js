// App Info
export const APP_NAME = 'CaseFlow AI';
export const APP_VERSION = '1.0.0';

// API timeout
export const API_TIMEOUT = 30000;

// AWS-related constants
export const AWS_REGION = import.meta.env.VITE_AWS_REGION;
export const S3_BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;

// Default pagination
export const DEFAULT_PAGE_SIZE = 10;

// File limits
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.txt'];

// Status codes
export const STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};
