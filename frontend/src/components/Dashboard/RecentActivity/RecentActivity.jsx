import React from 'react';
import './RecentActivity.css';

const RecentActivity = ({ items = [] }) => (
  <div className="recent">
    <h4>Recent Activity</h4>
    {!items.length ? <p className="muted">No recent activity.</p> : (
      <ul>
        {items.map((it, i) => (
          <li key={i}>
            <strong>{it.title}</strong> — <small>{new Date(it.when).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    )}
  </div>
);
export default RecentActivity;
