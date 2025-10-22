import React from 'react';

const StatCard = ({ label, value }) => (
  <div className="stat-card">
    <div className="v">{value}</div>
    <div className="l">{label}</div>
  </div>
);
export default StatCard;
