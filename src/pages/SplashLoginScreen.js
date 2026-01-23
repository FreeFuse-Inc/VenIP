import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../context/RoleContext';
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
  isSupabaseConfigured,
  supabase
} from '../utils/supabaseClient';
import '../styles/SplashLoginScreen.css';

const SplashLoginScreen = () => {
  const navigate = useNavigate();
  const { setUserRole } = useContext(RoleContext);
  const [activeTab, setActiveTab] = useState('signin');
  
  // Sign In state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign Up state
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupCompany, setSignupCompany] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Forgot Password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState(null);

  const roles = [
    {
      id: 'npo',
      name: 'Event Organizer',
      description: 'Plan and manage events',
      icon: '📅',
      color: '#FF6B6B',
    },
    {
      id: 'vendor',
      name: 'Vendor',
      description: 'Offer services & venues',
      icon: '🏪',
      color: '#D4AF37',
    },
    {
      id: 'sponsor',
      name: 'Sponsor',
      description: 'Support events financially',
      icon: '💛',
      color: '#FFD93D',
    },
    {
      id: 'super-admin',
      name: 'Super Admin',
      description: 'System administration',
      icon: '🛡️',
      color: '#8B5CF6',
    },
  ];

  const demoAccounts = [
    {
      role: 'super-admin',
      label: 'Admin',
      email: 'admin@venip.com',
      password: 'admin123',
      color: '#8B5CF6',
    },
    {
      role: 'npo',
      label: 'NPO',
      email: 'npo@charity.org',
      password: 'npo123',
      color: '#FF6B6B',
    },
    {
      role: 'vendor',
      label: 'Vendor',
      email: 'vendor@catering.com',
      password: 'vendor123',
      color: '#D4AF37',
    },
    {
      role: 'sponsor',
      label: 'Sponsor',
      email: 'sponsor@techcorp.com',
      password: 'sponsor123',
      color: '#FFD93D',
    },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    
    const matchedAccount = demoAccounts.find(
      acc => acc.email === email && acc.password === password
    );

    if (matchedAccount) {
      setUserRole(matchedAccount.role);
      navigate(`/dashboard/${matchedAccount.role}`);
    } else if (email && password) {
      alert('Invalid credentials. Please use a demo account or check your email/password.');
    } else {
      alert('Please enter your email and password');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    
    if (!signupFullName || !signupEmail || !signupPassword) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }
    
    setUserRole(selectedRole);
    navigate(`/dashboard/${selectedRole}`);
  };

  const handleDemoLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setUserRole(account.role);
    navigate(`/dashboard/${account.role}`);
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setIsRoleDropdownOpen(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail) {
      setResetError('Please enter your email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setResetError('Please enter a valid email address');
      return;
    }

    if (!isSupabaseConfigured() || !supabase) {
      // For demo purposes, show success even without Supabase
      setResetLoading(true);
      setTimeout(() => {
        setResetLoading(false);
        setResetSuccess(true);
      }, 1500);
      return;
    }

    try {
      setResetLoading(true);
      setResetError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + '/auth/reset-password',
      });

      if (error) throw error;

      setResetSuccess(true);
    } catch (error) {
      setResetError(error.message);
    } finally {
      setResetLoading(false);
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setResetEmail('');
    setResetError(null);
    setResetSuccess(false);
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  return (
    <div className="splash-page-wrapper">
      {/* Decorative background elements */}
      <div className="splash-bg-decoration">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>


      {/* Centered floating login card */}
      <main className="splash-main-content">
        <div className="splash-login-card">
          {/* Card top branding */}
          <div className="card-brand">
            <div className="card-brand-icon">
              <span>✦</span>
            </div>
            <span className="card-brand-name">VenIP</span>
          </div>

          <p className="card-subtitle">
            Event Planning & Vendor Management Platform
          </p>

          {/* Auth tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === 'signin' ? 'active' : ''}`}
              onClick={() => setActiveTab('signin')}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {activeTab === 'signin' ? (
            <>
              <form className="splash-login-form" onSubmit={handleLogin}>
                <div className="input-group">
                  <div className="input-wrapper">
                    <span className="input-icon">✉</span>
                    <input
                      type="email"
                      id="email"
                      className="auth-input"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="auth-input"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>

                <div className="forgot-password-row">
                  <button
                    type="button"
                    className="forgot-password-btn"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setResetEmail(email); // Pre-fill with current email if any
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="splash-login-btn">
                Login
              </button>
              </form>

              {/* Divider */}
              <div className="auth-divider">
                <span>Or sign in with</span>
              </div>

              {/* Social login buttons */}
              {authError && (
                <div className="auth-error-message">
                  {authError}
                </div>
              )}
              <div className="social-login-row">
                <button
                  type="button"
                  className={`social-btn ${socialLoading === 'google' ? 'loading' : ''}`}
                  title="Sign in with Google"
                  onClick={async () => {
                    if (!isSupabaseConfigured()) {
                      setAuthError('Supabase not configured. Please set up environment variables.');
                      return;
                    }
                    try {
                      setSocialLoading('google');
                      setAuthError(null);
                      await signInWithGoogle();
                    } catch (error) {
                      setAuthError(error.message);
                      setSocialLoading(null);
                    }
                  }}
                  disabled={socialLoading !== null}
                >
                  {socialLoading === 'google' ? (
                    <span className="btn-spinner"></span>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  className={`social-btn ${socialLoading === 'facebook' ? 'loading' : ''}`}
                  title="Sign in with Facebook"
                  onClick={async () => {
                    if (!isSupabaseConfigured()) {
                      setAuthError('Supabase not configured. Please set up environment variables.');
                      return;
                    }
                    try {
                      setSocialLoading('facebook');
                      setAuthError(null);
                      await signInWithFacebook();
                    } catch (error) {
                      setAuthError(error.message);
                      setSocialLoading(null);
                    }
                  }}
                  disabled={socialLoading !== null}
                >
                  {socialLoading === 'facebook' ? (
                    <span className="btn-spinner"></span>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  className={`social-btn ${socialLoading === 'apple' ? 'loading' : ''}`}
                  title="Sign in with Apple"
                  onClick={async () => {
                    if (!isSupabaseConfigured()) {
                      setAuthError('Supabase not configured. Please set up environment variables.');
                      return;
                    }
                    try {
                      setSocialLoading('apple');
                      setAuthError(null);
                      await signInWithApple();
                    } catch (error) {
                      setAuthError(error.message);
                      setSocialLoading(null);
                    }
                  }}
                  disabled={socialLoading !== null}
                >
                  {socialLoading === 'apple' ? (
                    <span className="btn-spinner"></span>
                  ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Demo Accounts Section */}
              <div className="demo-accounts-section">
                <p className="demo-accounts-title">Quick Demo Access</p>
                <div className="demo-accounts-grid">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.role}
                      type="button"
                      className="demo-account-btn"
                      onClick={() => handleDemoLogin(account)}
                      style={{ '--accent-color': account.color }}
                    >
                      <span className="demo-label">{account.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <form className="splash-login-form signup-form" onSubmit={handleSignup}>
              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="fullName"
                    className="auth-input"
                    placeholder="Full Name"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">✉</span>
                  <input
                    type="email"
                    id="signupEmail"
                    className="auth-input"
                    placeholder="Email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    id="signupPassword"
                    className="auth-input"
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                  >
                    {showSignupPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <span className="input-icon">🏢</span>
                  <input
                    type="text"
                    id="company"
                    className="auth-input"
                    placeholder="Company (Optional)"
                    value={signupCompany}
                    onChange={(e) => setSignupCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="role-selector">
                  <button
                    type="button"
                    className={`role-dropdown-trigger ${isRoleDropdownOpen ? 'open' : ''}`}
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  >
                    {selectedRoleData ? (
                      <div className="selected-role-display">
                        <span className="role-icon-small" style={{ backgroundColor: `${selectedRoleData.color}20`, color: selectedRoleData.color }}>
                          {selectedRoleData.icon}
                        </span>
                        <div className="role-info">
                          <span className="role-name-small">{selectedRoleData.name}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="selected-role-display">
                        <span className="role-icon-small placeholder">📋</span>
                        <div className="role-info">
                          <span className="role-name-small placeholder-text">Select your role</span>
                        </div>
                      </div>
                    )}
                    <span className={`dropdown-chevron ${isRoleDropdownOpen ? 'open' : ''}`}>▼</span>
                  </button>

                  {isRoleDropdownOpen && (
                    <div className="role-dropdown-menu">
                      {roles.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          className={`role-option ${selectedRole === role.id ? 'selected' : ''}`}
                          onClick={() => handleRoleSelect(role.id)}
                        >
                          <span className="role-icon-small" style={{ backgroundColor: `${role.color}20`, color: role.color }}>
                            {role.icon}
                          </span>
                          <div className="role-info">
                            <span className="role-name-small">{role.name}</span>
                            <span className="role-desc-small">{role.description}</span>
                          </div>
                          {selectedRole === role.id && (
                            <span className="role-check" style={{ color: role.color }}>✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="splash-login-btn signup-btn">
                Create Account
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="splash-page-footer">
        <p>Powered by <span className="splash-brand">FreeFuse</span></p>
      </footer>
    </div>
  );
};

export default SplashLoginScreen;
