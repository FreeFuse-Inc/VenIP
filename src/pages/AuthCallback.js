import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        setError('Supabase is not configured');
        return;
      }

      try {
        // Get the session from the URL hash
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          throw authError;
        }

        if (session) {
          // Successfully authenticated - redirect to dashboard
          // Default to NPO role for OAuth users
          navigate('/dashboard/npo');
        } else {
          // No session found - redirect back to login
          navigate('/');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err.message);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #e8f4fc 0%, #ffffff 100%)',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: '#ef4444', margin: '0 0 12px 0' }}>Authentication Error</h2>
          <p style={{ color: '#6b7280', margin: '0 0 20px 0' }}>{error}</p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#1a1a1a',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #e8f4fc 0%, #ffffff 100%)'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e5e7eb',
        borderTopColor: '#D4AF37',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}></div>
      <p style={{ color: '#6b7280', marginTop: '16px' }}>Completing sign in...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthCallback;
