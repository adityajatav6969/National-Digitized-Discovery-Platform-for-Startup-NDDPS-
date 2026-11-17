import React, { useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, onClear }) => {
  const timerRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      const val = e.target.value;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChange(val);
      }, 300);
    },
    [onChange]
  );

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        defaultValue={value}
        onChange={handleChange}
        placeholder="Search startups by name, tagline, domain..."
        className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 transition-colors duration-200"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Clear search"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
