import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../context/RoleContext';
import '../styles/RoleSelection.css';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { setUserRole } = useContext(RoleContext);

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

  const handleRoleSelect = (role) => {
    setUserRole(role.id);
    navigate(`/dashboard/${role.id}`);
  };

  return (
    <div className="role-selection-container">
      <div className="role-selection-content">
        <div className="role-selection-header">
          <h1>Welcome to VenIP</h1>
          <p>Choose your role to get started</p>
        </div>

        <div className="role-cards-grid">
          {roles.map((role) => (
            <button
              key={role.id}
              className="role-card"
              onClick={() => handleRoleSelect(role)}
              style={{ borderColor: role.color }}
            >
              <div className="role-icon" style={{ backgroundColor: role.color }}>
                {role.icon}
              </div>
              <h2 className="role-name">{role.name}</h2>
              <p className="role-description">{role.description}</p>
              <span className="role-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
