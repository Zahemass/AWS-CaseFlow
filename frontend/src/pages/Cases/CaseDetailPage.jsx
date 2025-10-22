import React, { useState } from 'react';
import './CaseDetailPage.css';
import { CaseDetails, DocumentList } from '../../components';

const CaseDetailPage = () => {
  const [selectedCase] = useState({
    id: '123',
    title: 'Sample Case',
    description: 'This is a sample case detail page.',
    createdAt: new Date(),
    status: 'Open',
  });

  return (
    <div className="case-detail-page">
      <CaseDetails data={selectedCase} />
      <h4>Documents Linked</h4>
      <DocumentList documents={[]} />
    </div>
  );
};

export default CaseDetailPage;
