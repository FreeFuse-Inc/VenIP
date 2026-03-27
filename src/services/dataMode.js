import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DataModeContext = createContext({
  useTestData: true,
  toggleDataMode: () => {},
});

export const useDataMode = () => useContext(DataModeContext);

export const DataModeProvider = ({ children }) => {
  const [useTestData, setUseTestData] = useState(() => {
    const stored = localStorage.getItem('venip_use_test_data');
    // Default to true (test data mode) if not set
    return stored !== null ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem('venip_use_test_data', JSON.stringify(useTestData));
  }, [useTestData]);

  const toggleDataMode = useCallback(() => {
    setUseTestData((prev) => !prev);
  }, []);

  const value = {
    useTestData,
    toggleDataMode,
  };

  return (
    <DataModeContext.Provider value={value}>
      {children}
    </DataModeContext.Provider>
  );
};

export default DataModeContext;
