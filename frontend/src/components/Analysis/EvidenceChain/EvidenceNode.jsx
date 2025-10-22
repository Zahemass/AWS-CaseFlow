import React from 'react';

const EvidenceNode = ({ node }) => (
  <span className="node" title={node.detail || ''}>
    {node.label}
  </span>
);
export default EvidenceNode;
