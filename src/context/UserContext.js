import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('venip_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        initializeNewUser();
      }
    } else {
      initializeNewUser();
    }
    setIsLoading(false);
  }, []);

  const initializeNewUser = () => {
    const newUser = {
      id: `user_${Date.now()}`,
      email: null,
      fullName: null,
      companyName: null,
      phone: null,
      billingAddress: null,
      cart: [],
      bookingHistory: [],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('venip_user', JSON.stringify(newUser));
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('venip_user', JSON.stringify(updatedUser));
  };

  const addToCart = (item) => {
    if (!user) return;

    const cartItem = {
      id: `cart_${Date.now()}_${Math.random()}`,
      ...item,
      addedAt: new Date().toISOString(),
    };

    const updatedCart = [...user.cart, cartItem];
    updateUser({ cart: updatedCart });
    return cartItem;
  };

  const removeFromCart = (cartItemId) => {
    if (!user) return;

    const updatedCart = user.cart.filter((item) => item.id !== cartItemId);
    updateUser({ cart: updatedCart });
  };

  const updateCartItem = (cartItemId, updates) => {
    if (!user) return;

    const updatedCart = user.cart.map((item) =>
      item.id === cartItemId ? { ...item, ...updates } : item
    );
    updateUser({ cart: updatedCart });
  };

  const clearCart = () => {
    if (!user) return;
    updateUser({ cart: [] });
  };

  const addToBookingHistory = (booking) => {
    if (!user) return;

    const bookingRecord = {
      id: `booking_${Date.now()}`,
      ...booking,
      bookedAt: new Date().toISOString(),
    };

    const updatedHistory = [...user.bookingHistory, bookingRecord];
    updateUser({ bookingHistory: updatedHistory });
    return bookingRecord;
  };

  const getCartTotal = () => {
    if (!user || !user.cart) return 0;
    return user.cart.reduce((total, item) => {
      const price = parseFloat(item.totalPrice.replace(/[$,]/g, '')) || 0;
      return total + price;
    }, 0);
  };

  const getCartItemCount = () => {
    return user?.cart?.length || 0;
  };

  const updateBookingInHistory = (bookingId, updates) => {
    if (!user) return;

    const updatedHistory = user.bookingHistory.map((booking) =>
      booking.id === bookingId ? { ...booking, ...updates } : booking
    );
    updateUser({ bookingHistory: updatedHistory });
  };

  const deleteBookingFromHistory = (bookingId) => {
    if (!user) return;

    const updatedHistory = user.bookingHistory.filter((booking) => booking.id !== bookingId);
    updateUser({ bookingHistory: updatedHistory });
  };

  const deleteBookingFromCart = (itemId) => {
    if (!user) return;

    const updatedCart = user.cart.filter((item) => item.id !== itemId);
    updateUser({ cart: updatedCart });
  };

  const value = {
    user,
    isLoading,
    updateUser,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    addToBookingHistory,
    getCartTotal,
    getCartItemCount,
    updateBookingInHistory,
    deleteBookingFromHistory,
    deleteBookingFromCart,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
