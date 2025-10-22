import React from 'react';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

const TimelineEvent = ({ event }) => {
  // Handle both string and object formats
  const isObject = typeof event === 'object' && event !== null;
  
  const eventName = isObject 
    ? (event.eventName || event.title || event.name || 'Unnamed Event')
    : event;
  
  const date = isObject ? (event.date || '') : '';
  const description = isObject ? (event.description || '') : '';
  const importance = isObject ? (event.importance || 'MEDIUM') : 'MEDIUM';

  const getImportanceColor = (imp) => {
    switch (imp?.toUpperCase()) {
      case 'CRITICAL': return '#dc2626';
      case 'HIGH': return '#f59e0b';
      case 'MEDIUM': return '#3b82f6';
      case 'LOW': return '#10b981';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="timeline-event">
      <div className="timeline-marker" style={{ backgroundColor: getImportanceColor(importance) }}>
        <FaCalendarAlt />
      </div>
      
      <div className="timeline-content">
        {date && (
          <div className="timeline-date">
            <FaClock className="date-icon" />
            <span>{formatDate(date)}</span>
          </div>
        )}
        
        <h4 className="timeline-title">{eventName}</h4>
        
        {description && (
          <p className="timeline-description">{description}</p>
        )}
        
        <span 
          className="timeline-badge" 
          style={{ 
            backgroundColor: getImportanceColor(importance),
            color: 'white'
          }}
        >
          {importance}
        </span>
      </div>
    </div>
  );
};

export default TimelineEvent;