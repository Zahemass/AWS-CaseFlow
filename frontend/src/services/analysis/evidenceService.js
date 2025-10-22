import apiClient from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const buildEvidenceChain = async (caseId) =>
  (await apiClient.post(ENDPOINTS.ANALYSIS.EVIDENCE, { caseId })).data;
