import React from 'react';
import './DocumentList.css';
import DocumentCard from './DocumentCard';
import EmptyState from '../../Common/EmptyState/EmptyState';

const DocumentList = ({ documents = [], onSelect }) => {
  if (!documents.length) return <EmptyState message="No documents uploaded." />;

  return (
    <div className="document-list">
      {documents.map((d, index) => (
        <DocumentCard
          key={d.id || d.s3Key || d.name || `doc-${index}`}
          doc={d}
          onClick={() => onSelect(d)}
        />
      ))}
    </div>
  );
};

export default DocumentList;
