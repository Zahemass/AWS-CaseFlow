// src/components/DocumentCard/DocumentCard.jsx
import React from 'react';
import './DocumentList.css';

const DocumentCard = ({ doc, onClick, onPreview, onAIAnalysis, isSelected }) => {
  const displaySize = doc?.size ? `${(doc.size / 1024).toFixed(2)} KB` : '-';
  const displayType = doc?.type?.toUpperCase() || 'FILE';
  const caseLabel = doc?.caseTitle || doc?.caseId || 'Unlinked';

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      default:
        return '📎';
    }
  };

  return (
    <div 
      className={`enhanced-doc-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="doc-card-header">
        <span className="file-icon">{getFileIcon(doc.fileName)}</span>
        <div className="doc-title-section">
          <h4 className="doc-title">{doc.fileName || doc.name || 'Untitled Document'}</h4>
          <span className="case-badge">
            <span className="badge-icon">📁</span>
            {caseLabel}
          </span>
        </div>
      </div>

      <div className="doc-card-actions">
        <button
          className="action-btn preview-btn"
          onClick={(e) => {
            e.stopPropagation();
            onPreview && onPreview(doc);
          }}
          title="Preview Document"
        >
          <span className="btn-icon">👁️</span>
          <span className="btn-text">Preview</span>
        </button>
        <button
          className="action-btn ai-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAIAnalysis && onAIAnalysis(doc);
          }}
          title="View AI Analysis"
        >
          <span className="btn-icon">🤖</span>
          <span className="btn-text">AI Analysis</span>
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;