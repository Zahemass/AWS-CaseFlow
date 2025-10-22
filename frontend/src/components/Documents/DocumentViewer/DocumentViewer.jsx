import React from 'react';
import './DocumentViewer.css';
import PDFViewer from './PDFViewer';

// ✅ Utility to check if the file is a PDF
const isPdf = (name = '') => name.toLowerCase().endsWith('.pdf');

const DocumentViewer = ({ doc }) => {
  if (!doc) return <div className="doc-viewer">Select a document to preview.</div>;

  const fileName = doc.fileName || doc.name || 'Unnamed Document';
  const fileKey = doc.s3Key || doc.key || doc.id;

  return (
    <div className="doc-viewer">
      <div className="doc-header">
        <h4>{fileName}</h4>
        {doc.type && <span className="badge">{doc.type}</span>}
      </div>

      <div className="doc-body">
        {isPdf(fileName) ? (
          <PDFViewer fileKey={fileKey} />
        ) : (
          <div className="fallback">
            <p>Preview not available. Download from S3 to view.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
