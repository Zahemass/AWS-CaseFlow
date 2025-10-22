import apiClient from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const analyzeCredibility = async (caseId) =>
  (await apiClient.post(ENDPOINTS.ANALYSIS.CREDIBILITY, { caseId })).data;
