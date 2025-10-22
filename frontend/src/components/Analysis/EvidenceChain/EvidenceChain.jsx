// EvidenceChain.jsx
import React from 'react';
import './EvidenceChain.css';
import EvidenceGraph from './EvidenceGraph';

const EvidenceChain = ({ nodes = [] }) => (
  <div className="evidence">
    <h3>Evidence Chain</h3>
    <EvidenceGraph nodes={nodes} />
  </div>
);
export default EvidenceChain;
