import React from 'react';
import './Modal.css';

const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;
  return (
    <div className="m-overlay" onClick={onClose}>
      <div className="m-card" onClick={(e)=>e.stopPropagation()}>
        {title && <h3>{title}</h3>}
        <div className="m-body">{children}</div>
      </div>
    </div>
  );
};
export default Modal;
