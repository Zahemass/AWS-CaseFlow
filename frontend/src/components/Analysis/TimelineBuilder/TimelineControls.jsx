import React from 'react';

import { FaSortAmountDown, FaSortAmountUp, FaPlus } from 'react-icons/fa';

const TimelineControls = ({ onSort, onAdd }) => {
  return (
    <div className="timeline-controls">
      {onSort && (
        <>
          <button className="timeline-btn" onClick={() => onSort('asc')} title="Sort Ascending">
            <FaSortAmountUp />
            <span>Sort ↑</span>
          </button>
          <button className="timeline-btn" onClick={() => onSort('desc')} title="Sort Descending">
            <FaSortAmountDown />
            <span>Sort ↓</span>
          </button>
        </>
      )}
      {onAdd && (
        <button className="timeline-btn" onClick={onAdd} title="Add Event">
          <FaPlus />
          <span>Add Event</span>
        </button>
      )}
    </div>
  );
};

export default TimelineControls;