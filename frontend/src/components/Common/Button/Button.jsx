import React from 'react';
import './Button.css';

const Button = ({ label, onClick, type = 'button', disabled = false }) => (
  <button className={`btn ${disabled ? 'btn-disabled' : ''}`} onClick={onClick} type={type}>
    {label}
  </button>
);

export default Button;
