import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ open, title='Confirm', message='Are you sure?', onConfirm, onCancel }) => {
  if(!open) return null;
  return (
    <div className="cd-overlay" onClick={onCancel}>
      <div className="cd-card" onClick={(e)=>e.stopPropagation()}>
        <h4>{title}</h4>
        <p>{message}</p>
        <div className="cd-actions">
          <button className="primary" onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmDialog;
