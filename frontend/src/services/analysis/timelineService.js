import apiClient from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const generateTimeline = async (caseId) =>
  (await apiClient.post(ENDPOINTS.ANALYSIS.TIMELINE, { caseId })).data;
