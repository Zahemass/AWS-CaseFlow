import apiClient from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const askBedrock = async (input) =>
  (await apiClient.post(ENDPOINTS.AGENT.ASK, { input })).data;
