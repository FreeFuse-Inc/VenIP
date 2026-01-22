import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../context/RoleContext';
import '../styles/SplashLoginScreen.css';

const SplashLoginScreen = () => {
  const navigate = useNavigate();
  const { setUserRole } = useContext(RoleContext);
  const [selectedRole, setSelectedRole] = useState('');

  const roles = [
    {
      id: 'npo',
      name: 'NPO',
      description: 'Event Organizer',
      icon: '🎯',
      color: '#FF6B6B',
    },
    {
      id: 'vendor',
      name: 'Vendor',
      description: 'Service Provider',
      icon: '🛠️',
      color: '#D4AF37',
    },
    {
      id: 'sponsor',
      name: 'Sponsor',
      description: 'Event Sponsor',
      icon: '⭐',
      color: '#FFD93D',
    },
    {
      id: 'super-admin',
      name: 'Super Admin',
      description: 'System Overview & Monitoring',
      icon: '👑',
      color: '#8B5CF6',
    },
  ];

  const handleLogin = () => {
    if (!selectedRole) {
      alert('Please select a role');
      return;
    }
    setUserRole(selectedRole);
    navigate(`/dashboard/${selectedRole}`);
  };

  const selectedRoleData = roles.find(role => role.id === selectedRole);

  return (
    <div className="splash-login-container">
      <div className="splash-login-content">
        <div className="splash-logo-section">
          <div className="splash-logo-icon">🅥</div>
          <h1 className="splash-logo-text">VenIP</h1>
        </div>

        <div className="splash-welcome">
          <h2>Welcome Back</h2>
          <p>Select your role to continue</p>
        </div>

        <div className="splash-login-form">
          <div className="role-dropdown-wrapper">
            <label htmlFor="role-select" className="dropdown-label">Choose Your Role</label>
            <div className="dropdown-container">
              <select
                id="role-select"
                className="role-dropdown"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">Select a role...</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.icon} {role.name} - {role.description}
                  </option>
                ))}
              </select>
              <div className="dropdown-arrow">▼</div>
            </div>
          </div>

          {selectedRoleData && (
            <div className="selected-role-preview">
              <div className="preview-icon" style={{ backgroundColor: selectedRoleData.color }}>
                {selectedRoleData.icon}
              </div>
              <div className="preview-text">
                <p className="preview-role">{selectedRoleData.name}</p>
                <p className="preview-desc">{selectedRoleData.description}</p>
              </div>
            </div>
          )}

          <button
            className="splash-login-btn"
            onClick={handleLogin}
            disabled={!selectedRole}
          >
            Login as {selectedRole ? selectedRoleData.name : 'Role'}
          </button>
        </div>

        <div className="splash-footer">
          <p>Powered by <span className="splash-brand">FreeFuse</span></p>
        </div>
      </div>
    </div>
  );
};

export default SplashLoginScreen;
