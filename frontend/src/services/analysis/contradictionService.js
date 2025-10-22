import apiClient from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const detectContradictions = async (caseId) =>
  (await apiClient.post(ENDPOINTS.ANALYSIS.CONTRADICTIONS, { caseId })).data;
