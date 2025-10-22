import React, { useState, useEffect } from 'react';
import './CasesPage.css';
import { CaseList, CreateCaseModal, CaseStats } from '../../components';
import { listCases, createNewCase } from '../../services/cases/caseService';

const CasesPage = () => {
  const [cases, setCases] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    try {
      const data = await listCases();
      const casesArray = Array.isArray(data) ? data : data?.items || [];
      setCases(casesArray);
    } catch (err) {
      console.error('Error loading cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleCreate = async (caseData) => {
    try {
      await createNewCase(caseData);
      setOpen(false);
      await fetchCases();
    } catch (err) {
      console.error('Error creating case:', err);
    }
  };

  return (
    <div className="cases-page">
      <div className="cases-header">
        <h2>Cases</h2>
        <button onClick={() => setOpen(true)}>+ New Case</button>
      </div>

      {loading ? (
        <p>Loading cases...</p>
      ) : (
        <>
          <CaseStats
            stats={{
              total: cases.length,
              open: cases.filter((c) => c.status === 'Open').length,
              closed: cases.filter((c) => c.status === 'Closed').length,
            }}
          />
          <CaseList cases={cases} />
        </>
      )}

      {open && (
        <CreateCaseModal
          onCreate={handleCreate}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default CasesPage;
