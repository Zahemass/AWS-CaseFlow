import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width='100%', height=16, rounded=true }) => (
  <div className={`sk ${rounded?'rounded':''}`} style={{width, height}} />
);
export default Skeleton;
