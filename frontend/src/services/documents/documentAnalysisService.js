// src/services/documents/documentAnalysisService.js
import apiClient from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const getDocAnalysis = async (documentId) => {
  const res = await apiClient.get(`${ENDPOINTS.DOC_ANALYSIS.BY_DOC}?documentId=${documentId}`);
  return res.data.item;
};

export const getCaseAnalyses = async (caseId) => {
  const res = await apiClient.get(`${ENDPOINTS.DOC_ANALYSIS.BY_CASE}${caseId}`);
  return res.data.items || [];
};
