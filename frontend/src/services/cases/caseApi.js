import apiClient from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const getCases = async () => (await apiClient.get(ENDPOINTS.CASES.BASE)).data;

export const getCaseById = async (id) => (await apiClient.get(`${ENDPOINTS.CASES.BASE}/${id}`)).data;

export const createCase = async (payload) => (await apiClient.post(ENDPOINTS.CASES.BASE, payload)).data;

export const updateCase = async (id, payload) => (await apiClient.put(`${ENDPOINTS.CASES.BASE}/${id}`, payload)).data;

export const deleteCase = async (id) => (await apiClient.delete(`${ENDPOINTS.CASES.BASE}/${id}`)).data;
