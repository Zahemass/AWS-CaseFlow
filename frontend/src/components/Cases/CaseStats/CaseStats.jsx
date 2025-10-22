// src/components/CaseStats/CaseStats.jsx
import React from 'react';
import './CaseStats.css';

const Stat = ({ label, value, color }) => (
  <div className="stat-card" style={{ '--accent': color }}>
    <div className="stat-icon">
      {label === 'Total' ? '📁' : label === 'Open' ? '🔓' : '🔒'}
    </div>
    <div className="stat-content">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const CaseStats = ({ stats = {} }) => {
  const { total = 0, open = 0, closed = 0 } = stats;

  return (
    <div className="case-stats">
      <Stat label="Total" value={total} color="#2563eb" />
      <Stat label="Open" value={open} color="#16a34a" />
      <Stat label="Closed" value={closed} color="#9333ea" />
    </div>
  );
};

export default CaseStats;
