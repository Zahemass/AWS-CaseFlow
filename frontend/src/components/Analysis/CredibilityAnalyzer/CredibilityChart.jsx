import React from 'react';

const CredibilityChart = ({ score = 0 }) => {
  const percentage = Math.round(score * 100);
  const circumference = 2 * Math.PI * 36; // radius = 36
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="panel">
      <h4>Score Gauge</h4>
      <div className="chart-container">
        <div className="score-gauge">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#007bff" />
                <stop offset="100%" stopColor="#0056b3" />
              </linearGradient>
            </defs>
            <circle
              className="gauge-bg"
              cx="40"
              cy="40"
              r="36"
            />
            <circle
              className="gauge-fill"
              cx="40"
              cy="40"
              r="36"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="gauge-text">{percentage}%</div>
        </div>
      </div>
    </div>
  );
};

export default CredibilityChart;