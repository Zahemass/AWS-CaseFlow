import React from 'react';
import './DocumentMetadata.css';

const Row = ({ label, value }) => (
  <div className="meta-row">
    <div className="meta-label">{label}</div>
    <div className="meta-value">{value ?? '-'}</div>
  </div>
);

const DocumentMetadata = ({ meta = {} }) => (
  <div className="doc-meta">
    <h4>Metadata</h4>
    <Row label="Name" value={meta.name} />
    <Row label="Type" value={meta.type} />
    <Row label="Uploaded At" value={meta.createdAt && new Date(meta.createdAt).toLocaleString()} />
    <Row label="Uploaded By" value={meta.owner} />
  </div>
);
export default DocumentMetadata;
