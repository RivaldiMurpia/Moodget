'use client';

import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  className?: string;
  color?: string;
  loading?: boolean;
  error?: string;
  required?: boolean;
  name?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  className = '',
  color = 'indigo',
  loading = false,
  error,
  required = false,
  name,
}) => {
  const sizeClasses = {
    sm: {
      switch: 'w-8 h-4',
      dot: 'h-3 w-3',
      translate: 'translate-x-4',
      label: 'text-sm',
    },
    md: {
      switch: 'w-11 h-6',
      dot: 'h-5 w-5',
      translate: 'translate-x-5',
      label: 'text-base',
    },
    lg: {
      switch: 'w-14 h-8',
      dot: 'h-7 w-7',
      translate: 'translate-x-6',
      label: 'text-lg',
    },
  };

  const colorClasses = {
    indigo: 'bg-indigo-600',
    red: 'bg-red-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600',
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && !loading) {
        onChange(!checked);
      }
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center">
        {/* Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled || loading}
          onClick={() => !disabled && !loading && onChange(!checked)}
          onKeyDown={handleKeyDown}
          className={`
            relative inline-flex shrink-0 cursor-pointer rounded-full
            border-2 border-transparent transition-colors duration-200
            ease-in-out focus:outline-none focus:ring-2 focus:ring-${color}-500
            focus:ring-offset-2
            ${sizeClasses[size].switch}
            ${
              checked
                ? colorClasses[color as keyof typeof colorClasses]
                : 'bg-gray-200'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${loading ? 'cursor-wait' : ''}
          `}
          name={name}
        >
          <span
            className={`
              pointer-events-none inline-block rounded-full
              bg-white shadow transform ring-0 transition duration-200 ease-in-out
              ${sizeClasses[size].dot}
              ${checked ? sizeClasses[size].translate : 'translate-x-0'}
            `}
          >
            {loading && (
              <svg
                className="animate-spin h-full w-full text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
          </span>
        </button>

        {/* Label and Description */}
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <span
                className={`
                  font-medium text-gray-900
                  ${sizeClasses[size].label}
                  ${disabled ? 'opacity-50' : ''}
                `}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </span>
            )}
            {description && (
              <p className={`text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

// Switch group component
interface SwitchOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface SwitchGroupProps {
  options: SwitchOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  className?: string;
  error?: string;
  required?: boolean;
  name?: string;
}

export const SwitchGroup: React.FC<SwitchGroupProps> = ({
  options,
  value,
  onChange,
  label,
  className = '',
  error,
  required = false,
  name,
}) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="space-y-4">
        {options.map((option) => (
          <Switch
            key={option.value}
            checked={value.includes(option.value)}
            onChange={(checked) => handleChange(option.value, checked)}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            name={name}
          />
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Switch;
