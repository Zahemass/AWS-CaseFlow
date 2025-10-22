import apiClient from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const listDocuments = async () => (await apiClient.get(ENDPOINTS.DOCUMENTS.BASE)).data;

export const deleteDocument = async (id) => (await apiClient.delete(`${ENDPOINTS.DOCUMENTS.BASE}/${id}`)).data;
