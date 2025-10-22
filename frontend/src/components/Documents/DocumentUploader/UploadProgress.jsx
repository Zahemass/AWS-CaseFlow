import React from 'react';

const UploadProgress = ({ percent = 0 }) => (
  <div style={{ width: '100%', marginTop: 10 }}>
    <div
      style={{
        height: 8,
        background: '#eee',
        borderRadius: 6,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${percent}%`,
          background: '#28a745',
          transition: '.2s',
        }}
      />
    </div>
    <small style={{ color: '#666' }}>{percent}%</small>
  </div>
);

export default UploadProgress;
