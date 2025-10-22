// case-card.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CaseList.css';

const CaseCard = ({ caseData, onClick }) => {
  const navigate = useNavigate();

  const handleViewDocuments = (e) => {
    e.stopPropagation(); // Prevent triggering parent click
    navigate(`/documents?caseId=${caseData.id}`);
  };

  return (
    <div className="case-card" onClick={onClick}>
      <h4>{caseData.title}</h4>
      <small>{new Date(caseData.createdAt).toLocaleString()}</small>

      <div className="case-actions">
        <button className="view-docs-btn" onClick={handleViewDocuments}>
          View Documents
        </button>
        <button
  className="analyze-btn"
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/analysis?caseId=${caseData.id}`);
  }}
>
  Run AI Analysis
</button>

      </div>
    </div>
  );
};

export default CaseCard;
