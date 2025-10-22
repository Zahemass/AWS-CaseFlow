import { useState } from 'react';
import { uploadDocument } from '../services/documents/documentService';

const useUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file) => {
    setUploading(true);
    setProgress(0);
    try {
      const result = await uploadDocument(file, setProgress);
      return result;
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return { progress, uploading, uploadFile };
};
export default useUpload;
