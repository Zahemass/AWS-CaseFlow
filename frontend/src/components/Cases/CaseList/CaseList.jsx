import React, { useEffect } from 'react';
import './CaseList.css';
import CaseCard from './CaseCard';
import EmptyState from '../../Common/EmptyState/EmptyState';

const CaseList = ({ cases = [], onSelectCase }) => {
  if (!cases.length) return <EmptyState message="No cases found." />;
  return (
    <div className="case-list">
      {cases.map((c) => (
        <CaseCard key={c.id} caseData={c} onClick={() => onSelectCase(c)} />
      ))}
    </div>
  );
};

export default CaseList;
