import React, { useState } from 'react';

const DocumentFilter = ({ onFilter }) => {
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const fire = () => onFilter?.({ q, type });
  return (
    <div className="filter-bar">
      <input placeholder="Search name…" value={q} onChange={(e)=>setQ(e.target.value)} />
      <select value={type} onChange={(e)=>setType(e.target.value)}>
        <option value="">All types</option>
        <option value="pdf">PDF</option>
        <option value="docx">DOCX</option>
        <option value="txt">TXT</option>
      </select>
      <button onClick={fire}>Apply</button>
    </div>
  );
};
export default DocumentFilter;
