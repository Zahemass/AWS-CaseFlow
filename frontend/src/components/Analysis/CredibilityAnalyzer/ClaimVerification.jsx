import React from 'react';

const ClaimVerification = ({ claims = [] }) => {
  return (
    <div className="claims-section">
      <h4>Claims</h4>
      {claims.length === 0 ? (
        <p className="no-claims">No claims to verify.</p>
      ) : (
        <div className="claims-list">
          {claims.map((claim, index) => (
            <div key={index} className="claim-item">
              {claim}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimVerification;
