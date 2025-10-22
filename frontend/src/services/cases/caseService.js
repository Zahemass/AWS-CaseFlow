import * as caseApi from './caseApi';

export const listCases = async () => await caseApi.getCases();

export const getCaseDetails = async (id) => await caseApi.getCaseById(id);

export const createNewCase = async (caseData) => await caseApi.createCase(caseData);

export const updateExistingCase = async (id, updates) => await caseApi.updateCase(id, updates);

export const removeCase = async (id) => await caseApi.deleteCase(id);
