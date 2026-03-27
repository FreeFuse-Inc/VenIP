import React, { useState } from 'react';
import { useDataMode } from '../services/dataMode';
import '../styles/DevToolbar.css';

const DevToolbar = () => {
  const { useTestData, toggleDataMode } = useDataMode();
  const [collapsed, setCollapsed] = useState(false);

  // Only show in development or when explicitly enabled
  const isVisible =
    process.env.NODE_ENV === 'development' ||
    localStorage.getItem('venip_show_dev_toolbar') === 'true';

  if (!isVisible) return null;

  if (collapsed) {
    return (
      <button
        className="dev-toolbar-collapsed"
        onClick={() => setCollapsed(false)}
        title="Open Dev Toolbar"
      >
        <span className="dev-toolbar-collapsed-icon">
          {useTestData ? '🧪' : '🔌'}
        </span>
      </button>
    );
  }

  return (
    <div className="dev-toolbar">
      <div className="dev-toolbar-header">
        <span className="dev-toolbar-title">Dev Tools</span>
        <button
          className="dev-toolbar-collapse-btn"
          onClick={() => setCollapsed(true)}
          title="Collapse"
        >
          ✕
        </button>
      </div>

      <div className="dev-toolbar-row">
        <div className="dev-toolbar-label">
          <span className="dev-toolbar-mode-icon">
            {useTestData ? '🧪' : '🔌'}
          </span>
          <span className="dev-toolbar-mode-text">
            {useTestData ? 'Test Data' : 'Live Mode'}
          </span>
        </div>
        <button
          className={`dev-toolbar-toggle ${useTestData ? 'active' : ''}`}
          onClick={toggleDataMode}
          aria-label="Toggle test data mode"
        >
          <span className="dev-toolbar-toggle-knob" />
        </button>
      </div>
    </div>
  );
};

export default DevToolbar;
