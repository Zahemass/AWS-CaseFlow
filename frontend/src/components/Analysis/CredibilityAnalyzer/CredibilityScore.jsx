import React from 'react';

const CredibilityScore = ({ score = 0 }) => {
  const percentage = Math.round(score * 100);
  
  return (
    <div className="panel">
      <h4>Credibility Score</h4>
      <div className="score-display">
        <div className="score-value">{percentage}%</div>
        <p className="score-label">Higher is better</p>
      </div>
    </div>
  );
};

export default CredibilityScore;
