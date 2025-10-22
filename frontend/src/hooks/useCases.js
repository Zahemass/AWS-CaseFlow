import { useState, useEffect } from 'react';
import { listCases, createNewCase, removeCase } from '../services/cases/caseService';

const useCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const data = await listCases();
      setCases(data);
    } catch (e) {
      console.error('Error fetching cases:', e);
    } finally {
      setLoading(false);
    }
  };

  const addCase = async (caseData) => {
    const created = await createNewCase(caseData);
    setCases((prev) => [...prev, created]);
  };

  const deleteCase = async (id) => {
    await removeCase(id);
    setCases((prev) => prev.filter((c) => c.id !== id));
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return { cases, loading, fetchCases, addCase, deleteCase };
};
export default useCases;
