import { useEffect, useState } from 'react';
import { listAllDocuments, deleteDocumentById } from '../services/documents/documentService';

const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const docs = await listAllDocuments();
      setDocuments(docs);
    } catch (e) {
      console.error('Error fetching documents:', e);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id) => {
    await deleteDocumentById(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return { documents, loading, fetchDocuments, deleteDocument };
};
export default useDocuments;
