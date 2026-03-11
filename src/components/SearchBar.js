import React from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = 'Search...',
  onSubmit 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button 
          type="button" 
          className="clear-btn"
          onClick={() => onChange('')}
        >
          ✕
        </button>
      )}
    </form>
  );
};

export default SearchBar;
