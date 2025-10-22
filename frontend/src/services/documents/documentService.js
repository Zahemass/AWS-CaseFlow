import * as docApi from './documentApi';
import { uploadFile } from './uploadService';

export const listAllDocuments = async () => await docApi.listDocuments();

export const uploadDocument = async (file, onProgress) => await uploadFile(file, onProgress);

export const deleteDocumentById = async (id) => await docApi.deleteDocument(id);
