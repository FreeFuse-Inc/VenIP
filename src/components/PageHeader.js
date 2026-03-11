import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PageHeader.css';

const PageHeader = ({ 
  title, 
  subtitle,
  showBack = true,
  backPath,
  actions,
  children 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="page-header">
      <div className="header-left">
        {showBack && (
          <button className="back-btn" onClick={handleBack}>
            <span className="back-icon">←</span>
          </button>
        )}
        <div className="header-titles">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
      
      {(actions || children) && (
        <div className="header-actions">
          {actions}
          {children}
        </div>
      )}
    </header>
  );
};

export default PageHeader;
