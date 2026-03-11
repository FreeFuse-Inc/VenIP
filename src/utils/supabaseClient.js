import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// These values should be set in environment variables for production
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && 
         supabaseUrl !== '' && 
         supabaseAnonKey !== '';
};

// Create Supabase client (will be null if not configured)
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// OAuth provider options
export const signInWithGoogle = async () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY environment variables.');
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/auth/callback',
    },
  });
  
  if (error) throw error;
  return data;
};

export const signInWithFacebook = async () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY environment variables.');
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: window.location.origin + '/auth/callback',
    },
  });
  
  if (error) throw error;
  return data;
};

export const signInWithApple = async () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY environment variables.');
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: window.location.origin + '/auth/callback',
    },
  });
  
  if (error) throw error;
  return data;
};

// Sign out
export const signOut = async () => {
  if (!supabase) return;
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Get current session
export const getSession = async () => {
  if (!supabase) return null;
  
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Get current user
export const getUser = async () => {
  if (!supabase) return null;
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export default supabase;
