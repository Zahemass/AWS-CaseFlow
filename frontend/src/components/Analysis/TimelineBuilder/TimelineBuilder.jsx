// TimelineBuilder.jsx
import React from 'react';
import './TimelineBuilder.css';
import TimelineEvent from './TimelineEvent';
import TimelineControls from './TimelineControls';

const TimelineBuilder = ({ events = [], onAdd, onSort }) => (
  <div className="timeline">
    <div className="timeline-header">
      <h3>Timeline</h3>
      <TimelineControls onSort={onSort} onAdd={onAdd} />
    </div>
    <div className="timeline-list">
      {events.map((e, i) => <TimelineEvent key={i} event={e} />)}
    </div>
  </div>
);
export default TimelineBuilder;
