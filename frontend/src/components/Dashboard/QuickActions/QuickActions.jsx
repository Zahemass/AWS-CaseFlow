import React from 'react';
import './QuickActions.css';

const QuickActions = ({ onNewCase, onUpload }) => (
  <div className="qactions">
    <button onClick={onNewCase}>+ New Case</button>
    <button onClick={onUpload}>Upload Document</button>
  </div>
);
export default QuickActions;
