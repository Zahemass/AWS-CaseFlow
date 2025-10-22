import React from 'react';
import './Card.css';

const Card = ({ children, title, actions }) => (
  <div className="card-wrap">
    {(title || actions) && (
      <div className="card-head">
        {title && <h4>{title}</h4>}
        <div className="card-actions">{actions}</div>
      </div>
    )}
    <div className="card-body">{children}</div>
  </div>
);
export default Card;
