import React from 'react';
import './DashboardStats.css';
import StatCard from './StatCard';

const DashboardStats = ({ stats = {} }) => {
  const items = [
    { label: 'Cases', value: stats.cases ?? 0 },
    { label: 'Documents', value: stats.documents ?? 0 },
    { label: 'Analyses', value: stats.analyses ?? 0 },
  ];
  return (
    <div className="dash-stats">
      {items.map((it) => <StatCard key={it.label} {...it} />)}
    </div>
  );
};
export default DashboardStats;
