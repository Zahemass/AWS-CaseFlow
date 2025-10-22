import React from 'react';
import './ContradictionDetector.css';
import ContradictionCard from './ContradictionCard';
import ContradictionComparison from './ContradictionComparison';

const ContradictionDetector = ({ items = [] }) => {
  console.log('ContradictionDetector received items:', items);
  
  return (
    <div className="contradiction">
      <h3> Contradictions</h3>
      {!items || items.length === 0 ? (
        <p className="muted">No contradictions found.</p>
      ) : (
        <div className="contradiction-grid">
          {items.map((item, i) => (
            <ContradictionCard key={i} data={item} />
          ))}
        </div>
      )}
    
    </div>
  );
};

export default ContradictionDetector;