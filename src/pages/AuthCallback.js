import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import { RoleContext } from '../context/RoleContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUserRole } = useContext(RoleContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        setError('Supabase is not configured');
        return;
      }

      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError) {
          throw authError;
        }

        if (session) {
          // Try to determine role from user metadata or profiles table
          const userMeta = session.user?.user_metadata;
          let role = userMeta?.role || null;

          // If no role in metadata, try fetching from profiles table
          if (!role) {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
              role = profile?.role || null;
            } catch {
              // profiles table may not exist yet — that's fine
            }
          }

          // Default to npo if no role found
          role = role || 'npo';
          setUserRole(role);
          navigate(`/dashboard/${role}`);
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err.message);
      }
    };

    handleAuthCallback();
  }, [navigate, setUserRole]);

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
