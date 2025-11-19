import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(true);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const toggleCartSidebar = () => {
    setIsCartSidebarOpen(!isCartSidebarOpen);
  };

  const openCartSidebar = () => {
    setIsCartSidebarOpen(true);
  };

  const closeCartSidebar = () => {
    setIsCartSidebarOpen(false);
  };

  const openCheckoutModal = () => {
    setIsCheckoutModalOpen(true);
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
  };

  const value = {
    isCartSidebarOpen,
    isCheckoutModalOpen,
    toggleCartSidebar,
    openCartSidebar,
    closeCartSidebar,
    openCheckoutModal,
    closeCheckoutModal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
