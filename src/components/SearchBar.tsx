import React from 'react';

// SearchBar component: handles search input with modern styling
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchBar({ value, onChange, placeholder = "Search games..." }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input focus-ring"
        style={{
          paddingLeft: '2.5rem',
          minWidth: '250px',
          background: 'white',
        }}
      />
      {/* Search icon */}
      <svg
        style={{
          position: 'absolute',
          left: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '1.25rem',
          height: '1.25rem',
          color: 'var(--text-light)',
          pointerEvents: 'none',
        }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      
      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-light)',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'var(--background-light)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-light)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBar; 