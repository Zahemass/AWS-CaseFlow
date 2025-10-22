import React from 'react';
import './CaseDetails.css';

const CaseDetails = ({ data }) => {
  if (!data) return <div className="case-details">Select a case to view details.</div>;
  return (
    <div className="case-details">
      <h3>{data.title}</h3>
      <p>{data.description || 'No description provided.'}</p>
      <div className="meta">
        <span>ID: {data.id}</span>
        <span>Created: {new Date(data.createdAt).toLocaleString()}</span>
        {data.status && <span>Status: {data.status}</span>}
      </div>
    </div>
  );
};
export default CaseDetails;
