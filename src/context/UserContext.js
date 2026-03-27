import React, { createContext, useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';
import { useDataMode } from '../services/dataMode';
import { useAuth } from './AuthContext';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { useTestData } = useDataMode();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data — local for test mode, Supabase profile + cart + bookings for live
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);

      if (useTestData || !authUser?.id) {
        // Test-data mode or no auth — use localStorage
        const loadedUser = userService.loadUser(useTestData);
        if (!cancelled) {
          setUser(loadedUser);
          setIsLoading(false);
        }
        return;
      }

      // Live mode — load profile, cart, and booking history from Supabase
      try {
        const [profile, cart, bookingHistory] = await Promise.all([
          userService.loadProfile(authUser.id),
          userService.getCart(authUser.id),
          userService.getBookingHistory(authUser.id),
        ]);

        if (!cancelled) {
          setUser({
            id: authUser.id,
            email: profile?.email || authUser.email,
            fullName: profile?.fullName || null,
            companyName: profile?.companyName || null,
            phone: profile?.phone || null,
            billingAddress: null,
            cart: cart || [],
            bookingHistory: bookingHistory || [],
            createdAt: profile?.createdAt || new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('UserContext load error:', err);
        if (!cancelled) {
          // Fallback to localStorage on error
          setUser(userService.loadUser(true));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [useTestData, authUser?.id, authUser?.email]);

  const updateUser = useCallback(async (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    if (useTestData || !authUser?.id) {
      userService.saveUser(updatedUser);
      return;
    }

    // Persist profile fields to Supabase
    const profileFields = ['fullName', 'companyName', 'phone', 'email', 'role'];
    const profileUpdates = {};
    let hasProfileUpdate = false;
    for (const key of profileFields) {
      if (key in updates) {
        profileUpdates[key] = updates[key];
        hasProfileUpdate = true;
      }
    }

    if (hasProfileUpdate) {
      try {
        await userService.updateProfile(authUser.id, profileUpdates);
      } catch (err) {
        console.error('updateProfile error:', err);
      }
    }
  }, [user, useTestData, authUser?.id]);

  const addToCart = useCallback(async (item) => {
    if (!user) return;

    const cartItem = {
      id: `cart_${Date.now()}_${Math.random()}`,
      ...item,
      addedAt: new Date().toISOString(),
    };

    if (useTestData || !authUser?.id) {
      const updatedCart = [...user.cart, cartItem];
      const updatedUser = { ...user, cart: updatedCart };
      setUser(updatedUser);
      userService.saveUser(updatedUser);
      return cartItem;
    }

    try {
      const created = await userService.addCartItem(authUser.id, item);
      if (created) {
        setUser((prev) => ({ ...prev, cart: [...prev.cart, created] }));
        return created;
      }
    } catch (err) {
      console.error('addToCart error:', err);
    }
    return cartItem;
  }, [user, useTestData, authUser?.id]);

  const removeFromCart = useCallback(async (cartItemId) => {
    if (!user) return;

    setUser((prev) => ({
      ...prev,
      cart: prev.cart.filter((item) => item.id !== cartItemId),
    }));

    if (useTestData || !authUser?.id) {
      const updatedUser = { ...user, cart: user.cart.filter((item) => item.id !== cartItemId) };
      userService.saveUser(updatedUser);
      return;
    }

    try {
      await userService.removeCartItem(cartItemId);
    } catch (err) {
      console.error('removeFromCart error:', err);
    }
  }, [user, useTestData, authUser?.id]);

  const updateCartItem = useCallback((cartItemId, updates) => {
    if (!user) return;

    const updatedCart = user.cart.map((item) =>
      item.id === cartItemId ? { ...item, ...updates } : item
    );
    const updatedUser = { ...user, cart: updatedCart };
    setUser(updatedUser);

    if (useTestData || !authUser?.id) {
      userService.saveUser(updatedUser);
    }
  }, [user, useTestData, authUser?.id]);

  const clearCart = useCallback(async () => {
    if (!user) return;

    setUser((prev) => ({ ...prev, cart: [] }));

    if (useTestData || !authUser?.id) {
      userService.saveUser({ ...user, cart: [] });
      return;
    }

    try {
      await userService.clearCart(authUser.id);
    } catch (err) {
      console.error('clearCart error:', err);
    }
  }, [user, useTestData, authUser?.id]);

  const addToBookingHistory = useCallback(async (booking) => {
    if (!user) return;

    const bookingRecord = {
      id: `booking_${Date.now()}`,
      ...booking,
      bookedAt: new Date().toISOString(),
    };

    if (useTestData || !authUser?.id) {
      const updatedHistory = [...user.bookingHistory, bookingRecord];
      const updatedUser = { ...user, bookingHistory: updatedHistory };
      setUser(updatedUser);
      userService.saveUser(updatedUser);
      return bookingRecord;
    }

    try {
      const created = await userService.addBookingHistory(authUser.id, booking);
      if (created) {
        setUser((prev) => ({
          ...prev,
          bookingHistory: [created, ...prev.bookingHistory],
        }));
        return created;
      }
    } catch (err) {
      console.error('addToBookingHistory error:', err);
    }
    return bookingRecord;
  }, [user, useTestData, authUser?.id]);

  const getCartTotal = useCallback(() => {
    if (!user || !user.cart) return 0;
    return user.cart.reduce((total, item) => {
      const price = parseFloat(String(item.totalPrice || '0').replace(/[$,]/g, '')) || 0;
      return total + price;
    }, 0);
  }, [user]);

  const getCartItemCount = useCallback(() => {
    return user?.cart?.length || 0;
  }, [user]);

  const updateBookingInHistory = useCallback(async (bookingId, updates) => {
    if (!user) return;

    setUser((prev) => ({
      ...prev,
      bookingHistory: prev.bookingHistory.map((booking) =>
        booking.id === bookingId ? { ...booking, ...updates } : booking
      ),
    }));

    if (useTestData || !authUser?.id) {
      const updatedHistory = user.bookingHistory.map((booking) =>
        booking.id === bookingId ? { ...booking, ...updates } : booking
      );
      userService.saveUser({ ...user, bookingHistory: updatedHistory });
      return;
    }

    try {
      await userService.updateBookingHistory(bookingId, updates);
    } catch (err) {
      console.error('updateBookingInHistory error:', err);
    }
  }, [user, useTestData, authUser?.id]);

  const deleteBookingFromHistory = useCallback(async (bookingId) => {
    if (!user) return;

    setUser((prev) => ({
      ...prev,
      bookingHistory: prev.bookingHistory.filter((booking) => booking.id !== bookingId),
    }));

    if (useTestData || !authUser?.id) {
      const updatedHistory = user.bookingHistory.filter((booking) => booking.id !== bookingId);
      userService.saveUser({ ...user, bookingHistory: updatedHistory });
      return;
    }

    try {
      await userService.deleteBookingHistory(bookingId);
    } catch (err) {
      console.error('deleteBookingFromHistory error:', err);
    }
  }, [user, useTestData, authUser?.id]);

  const deleteBookingFromCart = useCallback(async (itemId) => {
    if (!user) return;

    setUser((prev) => ({
      ...prev,
      cart: prev.cart.filter((item) => item.id !== itemId),
    }));

    if (useTestData || !authUser?.id) {
      const updatedCart = user.cart.filter((item) => item.id !== itemId);
      userService.saveUser({ ...user, cart: updatedCart });
      return;
    }

    try {
      await userService.removeCartItem(itemId);
    } catch (err) {
      console.error('deleteBookingFromCart error:', err);
    }
  }, [user, useTestData, authUser?.id]);

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
