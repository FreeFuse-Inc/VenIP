import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../context/RoleContext';
import '../styles/RoleChangeModal.css';

const RoleChangeModal = ({ isOpen, onClose }) => {
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

  const handleRoleSelect = (roleId) => {
    setUserRole(roleId);
    navigate(`/dashboard/${roleId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="role-modal-overlay" onClick={onClose}></div>
      <div className="role-modal">
        <div className="role-modal-header">
          <h2>Change Your Role</h2>
          <button className="role-modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="role-modal-subtitle">Select a role to continue</p>

        <div className="role-modal-grid">
          {roles.map((role) => (
            <button
              key={role.id}
              className="role-modal-card"
              onClick={() => handleRoleSelect(role.id)}
              style={{ borderColor: role.color }}
            >
              <div className="role-modal-icon" style={{ backgroundColor: role.color }}>
                {role.icon}
              </div>
              <h3 className="role-modal-name">{role.name}</h3>
              <p className="role-modal-description">{role.description}</p>
              <span className="role-modal-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default RoleChangeModal;
