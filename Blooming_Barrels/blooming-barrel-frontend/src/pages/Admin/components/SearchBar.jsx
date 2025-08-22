import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ 
  value = '', 
  onChange, 
  placeholder = 'Search...', 
  className = '',
  onClear
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={`search-bar ${className}`}>
      <div className="search-input-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-input"
        />
        {value && (
          <button 
            type="button" 
            className="clear-button"
            onClick={handleClear}
            title="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
