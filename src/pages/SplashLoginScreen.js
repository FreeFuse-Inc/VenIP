import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../context/RoleContext';
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
    
    // For demo purposes, create the account and log in
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

  const selectedRoleData = roles.find(r => r.id === selectedRole);

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

        {activeTab === 'signin' ? (
          <>
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
          </>
        ) : (
          <form className="splash-login-form signup-form" onSubmit={handleSignup}>
            <div className="input-group">
              <label htmlFor="fullName" className="input-label">Full Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="fullName"
                  className="auth-input"
                  placeholder="Enter your name"
                  value={signupFullName}
                  onChange={(e) => setSignupFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="signupEmail" className="input-label">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  type="email"
                  id="signupEmail"
                  className="auth-input"
                  placeholder="Enter your email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="signupPassword" className="input-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  id="signupPassword"
                  className="auth-input"
                  placeholder="Enter your password"
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
              <label htmlFor="company" className="input-label">Company (Optional)</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="company"
                  className="auth-input"
                  placeholder="Your organization"
                  value={signupCompany}
                  onChange={(e) => setSignupCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Select Your Role</label>
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
                        <span className="role-desc-small">{selectedRoleData.description}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="selected-role-display">
                      <span className="role-icon-small placeholder">📅</span>
                      <div className="role-info">
                        <span className="role-name-small">Event Organizer</span>
                        <span className="role-desc-small">Plan and manage events</span>
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
                          <span className="role-check" style={{ color: role.color }}>●</span>
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

        <div className="splash-footer">
          <p>Powered by <span className="splash-brand">FreeFuse</span></p>
        </div>
      </div>
    </div>
  );
};

export default SplashLoginScreen;
