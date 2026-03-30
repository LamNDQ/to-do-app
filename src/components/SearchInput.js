import React from "react";
import "../styles/SearchInput.css";

/**
 * Reusable search input with button
 */
function SearchInput({ value, onChange, onSearch, placeholder, loading }) {
  const handleKey = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="search-input-row">
      <input
        className="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
      />
      <button
        className="search-btn"
        onClick={onSearch}
        disabled={loading}
      >
        {loading ? <span className="spinner" /> : "Search"}
      </button>
    </div>
  );
}

export default SearchInput;
