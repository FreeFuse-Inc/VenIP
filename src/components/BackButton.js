import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/BackButton.css';

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isRootPage = () => {
    const rootPages = ['/', '/dashboard/npo', '/dashboard/vendor', '/dashboard/sponsor'];
    return rootPages.includes(location.pathname);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Don't show back button on root pages
  if (isRootPage()) {
    return null;
  }

  return (
    <button
      className="back-button"
      onClick={handleGoBack}
      title="Go back to previous page"
      aria-label="Go back to previous page"
    >
      <span className="back-icon">←</span>
      <span className="back-text">Back</span>
    </button>
  );
};

export default BackButton;
