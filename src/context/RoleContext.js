import React, { createContext, useState, useEffect } from 'react';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  // Initialize from localStorage if available
  const [userRole, setUserRole] = useState(() => {
    const savedRole = localStorage.getItem('venip_user_role');
    return savedRole || null;
  });

  // Persist to localStorage when role changes
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('venip_user_role', userRole);
    }
  }, [userRole]);

  return (
    <RoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};
