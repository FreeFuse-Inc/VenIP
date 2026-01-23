import React from 'react';
import '../styles/FilterTabs.css';

const FilterTabs = ({ 
  tabs, 
  activeTab, 
  onChange,
  size = 'default' 
}) => {
  return (
    <div className={`filter-tabs ${size === 'compact' ? 'filter-tabs-compact' : ''}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id || tab}
          className={`filter-tab ${activeTab === (tab.id || tab) ? 'active' : ''}`}
          onClick={() => onChange(tab.id || tab)}
        >
          {tab.icon && <span className="tab-icon">{tab.icon}</span>}
          <span className="tab-label">{tab.label || tab}</span>
          {tab.count !== undefined && (
            <span className="tab-count">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
