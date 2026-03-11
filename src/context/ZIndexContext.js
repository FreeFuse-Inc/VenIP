import React, { createContext, useState, useCallback } from 'react';

export const ZIndexContext = createContext();

export const ZIndexProvider = ({ children }) => {
  const [zIndexMap, setZIndexMap] = useState({
    cartSidebar: 1000,
    aiAssistant: 999,
  });

  const raiseZIndex = useCallback((component) => {
    setZIndexMap((prev) => ({
      cartSidebar: component === 'cartSidebar' ? 1001 : 1000,
      aiAssistant: component === 'aiAssistant' ? 1001 : 999,
    }));
  }, []);

  return (
    <ZIndexContext.Provider value={{ zIndexMap, raiseZIndex }}>
      {children}
    </ZIndexContext.Provider>
  );
};
