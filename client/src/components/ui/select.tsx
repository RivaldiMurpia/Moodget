'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  multiple?: boolean;
  searchable?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  error,
  disabled = false,
  className = '',
  fullWidth = false,
  size = 'md',
  multiple = false,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false));

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-2 px-3',
    lg: 'text-lg py-2.5 px-4',
  };

  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={`
            relative w-full bg-white border rounded-md shadow-sm pl-3 pr-10
            text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500
            focus:border-indigo-500 ${sizeClasses[size]}
            ${
              disabled
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                : 'hover:border-gray-400'
            }
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${fullWidth ? 'w-full' : ''}
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <span className="flex items-center">
            {selectedOption?.icon && (
              <span className="mr-2">{selectedOption.icon}</span>
            )}
            <span className="block truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-gray-400`}></i>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {searchable && (
              <div className="sticky top-0 z-10 bg-white px-2 py-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <ul
              className="py-1"
              role="listbox"
              aria-labelledby="listbox-label"
            >
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`
                    ${
                      option.value === value
                        ? 'text-white bg-indigo-600'
                        : 'text-gray-900 hover:bg-gray-100'
                    }
                    cursor-pointer select-none relative py-2 pl-3 pr-9
                  `}
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value);
                    if (!multiple) {
                      setIsOpen(false);
                      setSearchTerm('');
                    }
                  }}
                >
                  <div className="flex items-center">
                    {option.icon && <span className="mr-2">{option.icon}</span>}
                    <span
                      className={`block truncate ${
                        option.value === value ? 'font-semibold' : 'font-normal'
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>

                  {option.value === value && (
                    <span
                      className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                        option.value === value ? 'text-white' : 'text-indigo-600'
                      }`}
                    >
                      <i className="fas fa-check"></i>
                    </span>
                  )}
                </li>
              ))}
              {filteredOptions.length === 0 && (
                <li className="text-gray-500 py-2 px-3">No options found</li>
              )}
            </ul>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
