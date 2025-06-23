'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  clearable?: boolean;
  className?: string;
  required?: boolean;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  maxHeight?: number;
  noOptionsMessage?: string;
  loadingMessage?: string;
}

const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  onSearch,
  label,
  placeholder = 'Select an option',
  error,
  disabled = false,
  loading = false,
  clearable = false,
  className = '',
  required = false,
  name,
  size = 'md',
  maxHeight = 250,
  noOptionsMessage = 'No options available',
  loadingMessage = 'Loading...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(comboboxRef, () => setIsOpen(false));

  const sizeClasses = {
    sm: {
      input: 'h-8 text-sm',
      option: 'py-1 px-2 text-sm',
    },
    md: {
      input: 'h-10 text-base',
      option: 'py-2 px-3 text-base',
    },
    lg: {
      input: 'h-12 text-lg',
      option: 'py-3 px-4 text-lg',
    },
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  const selectedOption = options.find((option) => option.value === value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch?.(newQuery);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const handleOptionClick = (option: ComboboxOption) => {
    if (option.disabled) return;
    onChange(option.value);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange('');
    setQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div ref={comboboxRef} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query || (selectedOption?.label ?? '')}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            name={name}
            className={`
              w-full rounded-md border-gray-300 shadow-sm
              focus:border-indigo-500 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-300' : ''}
              ${sizeClasses[size].input}
            `}
          />

          {/* Clear button */}
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
          )}

          {/* Dropdown arrow */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
            )}
          </div>
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            className="
              absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg
              ring-1 ring-black ring-opacity-5 focus:outline-none
            "
            style={{ maxHeight }}
          >
            <div className="overflow-auto py-1">
              {loading ? (
                <div className={`text-gray-500 ${sizeClasses[size].option}`}>
                  {loadingMessage}
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className={`text-gray-500 ${sizeClasses[size].option}`}>
                  {noOptionsMessage}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
                    className={`
                      flex items-center cursor-pointer
                      ${sizeClasses[size].option}
                      ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                      ${index === highlightedIndex ? 'bg-gray-100' : ''}
                      ${option.value === value ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'}
                    `}
                  >
                    {option.icon && (
                      <span className="mr-3 text-gray-500">
                        {option.icon}
                      </span>
                    )}
                    <div>
                      <div className="font-medium">
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-sm text-gray-500">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

// Multi-select combobox variant
interface MultiComboboxProps extends Omit<ComboboxProps, 'value' | 'onChange'> {
  value: string[];
  onChange: (value: string[]) => void;
  max?: number;
}

export const MultiCombobox: React.FC<MultiComboboxProps> = ({
  value,
  onChange,
  max,
  ...props
}) => {
  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      if (max && value.length >= max) return;
      onChange([...value, optionValue]);
    }
  };

  const selectedOptions = props.options.filter((option) =>
    value.includes(option.value)
  );

  return (
    <div className="space-y-2">
      <Combobox
        {...props}
        value=""
        onChange={handleSelect}
      />

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <div
              key={option.value}
              className="
                inline-flex items-center rounded-full bg-indigo-100
                px-3 py-1 text-sm font-medium text-indigo-700
              "
            >
              {option.label}
              <button
                type="button"
                onClick={() => handleSelect(option.value)}
                className="ml-2 text-indigo-500 hover:text-indigo-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Combobox;
