'use client';

import React from 'react';

interface RadioProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  required?: boolean;
  name?: string;
  value: string;
}

const Radio: React.FC<RadioProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  error,
  size = 'md',
  className = '',
  required = false,
  name,
  value,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={className}>
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            type="radio"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            required={required}
            name={name}
            value={value}
            className={`
              form-radio border-gray-300 text-indigo-600
              focus:ring-indigo-500 focus:ring-offset-0
              disabled:opacity-50 disabled:cursor-not-allowed
              ${sizeClasses[size]}
              ${error ? 'border-red-300' : ''}
            `}
          />
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                className={`
                  font-medium text-gray-700
                  ${labelSizeClasses[size]}
                  ${disabled ? 'opacity-50' : ''}
                `}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {description && (
              <p className={`text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                {description}
              </p>
            )}
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

// Radio group component
interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
  size?: RadioProps['size'];
  required?: boolean;
  name: string;
  columns?: 1 | 2 | 3 | 4;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  label,
  error,
  className = '',
  size = 'md',
  required = false,
  name,
  columns = 1,
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {options.map((option) => (
          <Radio
            key={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            size={size}
            name={name}
            value={option.value}
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

// Card radio component
interface CardRadioProps extends Omit<RadioProps, 'className'> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const CardRadio: React.FC<CardRadioProps> = ({
  checked,
  onChange,
  title,
  subtitle,
  icon,
  disabled = false,
  error,
  size = 'md',
  className = '',
  required = false,
  name,
  value,
}) => {
  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={className}>
      <label
        className={`
          relative block rounded-lg border p-4 cursor-pointer
          focus-within:ring-2 focus-within:ring-indigo-500
          ${checked ? 'bg-indigo-50 border-indigo-600' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-600'}
          ${error ? 'border-red-300' : ''}
        `}
      >
        <input
          type="radio"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          required={required}
          name={name}
          value={value}
          className="sr-only"
        />
        <div className="flex items-center">
          {icon && (
            <span
              className={`
                mr-3 inline-flex shrink-0 items-center justify-center rounded-lg
                ${checked ? 'text-indigo-600' : 'text-gray-500'}
              `}
            >
              {icon}
            </span>
          )}
          <div>
            <p
              className={`
                font-medium
                ${checked ? 'text-indigo-900' : 'text-gray-900'}
                ${labelSizeClasses[size]}
              `}
            >
              {title}
              {required && <span className="text-red-500 ml-1">*</span>}
            </p>
            {subtitle && (
              <p className={`text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {checked && (
          <span
            className="absolute top-4 right-4 text-indigo-600"
            aria-hidden="true"
          >
            <i className="fas fa-check-circle"></i>
          </span>
        )}
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Radio;
