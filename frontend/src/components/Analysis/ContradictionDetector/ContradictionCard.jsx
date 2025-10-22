import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ContradictionCard = ({ data }) => {
  // Handle both string and object formats
  const isObject = typeof data === 'object' && data !== null;
  
  const conflictDescription = isObject 
    ? (data.conflictDescription || data.description || 'Unknown conflict')
    : data;
  
  const confidence = isObject ? (data.confidence || 0) : 0;
  const severity = isObject ? (data.severity || 'MEDIUM') : 'MEDIUM';
  const specificDetails = isObject ? data.specificDetails : '';
  const affectedDocs = isObject && Array.isArray(data.affectedDocuments) 
    ? data.affectedDocuments 
    : [];

  const getSeverityColor = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'HIGH': return '#dc2626';
      case 'MEDIUM': return '#f59e0b';
      case 'LOW': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="contradiction-card" style={{ borderLeftColor: getSeverityColor(severity) }}>
      <div className="contradiction-header">
        <FaExclamationTriangle 
          className="contradiction-icon" 
          style={{ color: getSeverityColor(severity) }}
        />
        <span className="contradiction-severity">{severity}</span>
      </div>
      
      <div className="contradiction-body">
        <h4>Conflicts with:</h4>
        <p className="conflict-description">{conflictDescription}</p>
        
        {specificDetails && (
          <div className="conflict-details">
            <small>{specificDetails}</small>
          </div>
        )}
        
        {affectedDocs.length > 0 && (
          <div className="affected-docs">
            <small><strong>Documents:</strong></small>
            <ul>
              {affectedDocs.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="contradiction-footer">
        <span className="confidence-label">Confidence:</span>
        <span className="confidence-value">{confidence}%</span>
      </div>
    </div>
  );
};

export default ContradictionCard;