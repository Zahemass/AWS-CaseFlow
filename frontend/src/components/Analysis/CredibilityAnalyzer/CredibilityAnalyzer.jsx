// CredibilityAnalyzer.jsx
import React from 'react';
import './CredibilityAnalyzer.css';
import CredibilityScore from './CredibilityScore';
import ClaimVerification from './ClaimVerification';
import CredibilityChart from './CredibilityChart';

const CredibilityAnalyzer = ({ score = 0.7, claims = [] }) => (
  <div className="credibility">
    <div className="credibility-top">
      <CredibilityScore score={score} />
      <CredibilityChart score={score} />
    </div>
    
  </div>
);
export default CredibilityAnalyzer;
