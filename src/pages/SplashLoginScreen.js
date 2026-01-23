import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../context/RoleContext';
import '../styles/SplashLoginScreen.css';

const SplashLoginScreen = () => {
  const navigate = useNavigate();
  const { setUserRole } = useContext(RoleContext);
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleDemoLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setUserRole(account.role);
    navigate(`/dashboard/${account.role}`);
  };

  return (
    <div className="splash-login-container">
      <div className="splash-login-content">
        <div className="splash-logo-section">
          <div className="splash-logo-icon-wrapper">
            <span className="splash-logo-stars">✦</span>
          </div>
          <h1 className="splash-logo-text">VenIP</h1>
          <p className="splash-tagline">Event Planning & Vendor Management</p>
        </div>

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

        <form className="splash-login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input
                type="email"
                id="email"
                className="auth-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="auth-input"
                placeholder="Enter your password"
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

          <button type="submit" className="splash-login-btn">
            Sign In
          </button>
        </form>

        <div className="demo-accounts-section">
          <p className="demo-accounts-title">Demo Accounts</p>
          <div className="demo-accounts-list">
            {demoAccounts.map((account) => (
              <div
                key={account.role}
                className="demo-account-item"
                onClick={() => handleDemoLogin(account)}
              >
                <span className="demo-account-label" style={{ color: account.color }}>
                  {account.label}:
                </span>
                <span className="demo-account-creds">
                  {account.email} / {account.password}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="splash-footer">
          <p>Powered by <span className="splash-brand">FreeFuse</span></p>
        </div>
      </div>
    </div>
  );
};

export default SplashLoginScreen;
