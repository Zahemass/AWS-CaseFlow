import React from 'react';
import './EmptyState.css';
import emptyIcon from '../../../assets/images/empty-state.svg';

const EmptyState = ({ message }) => (
  <div className="empty-state">
    <img src={emptyIcon} alt="Empty" />
    <p>{message}</p>
  </div>
);

export default EmptyState;
