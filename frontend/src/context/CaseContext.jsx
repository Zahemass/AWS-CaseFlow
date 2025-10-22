import React, { createContext, useContext, useState } from 'react';

const CaseContext = createContext();

export const CaseProvider = ({ children }) => {
  const [selectedCase, setSelectedCase] = useState(null);

  const selectCase = (caseData) => setSelectedCase(caseData);
  const clearCase = () => setSelectedCase(null);

  return (
    <CaseContext.Provider value={{ selectedCase, selectCase, clearCase }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCaseContext = () => useContext(CaseContext);
