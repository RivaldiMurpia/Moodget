'use client';

import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  indeterminate?: boolean;
  required?: boolean;
  name?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  error,
  size = 'md',
  className = '',
  indeterminate = false,
  required = false,
  name,
}) => {
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

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
            ref={checkboxRef}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            required={required}
            name={name}
            className={`
              form-checkbox rounded border-gray-300 text-indigo-600
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

// Checkbox group component
interface CheckboxOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  error?: string;
  className?: string;
  size?: CheckboxProps['size'];
  required?: boolean;
  name?: string;
  columns?: 1 | 2 | 3 | 4;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
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
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

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
          <Checkbox
            key={option.value}
            checked={value.includes(option.value)}
            onChange={(checked) => handleChange(option.value, checked)}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
            size={size}
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

// Card checkbox component
interface CardCheckboxProps extends Omit<CheckboxProps, 'className'> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const CardCheckbox: React.FC<CardCheckboxProps> = ({
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
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          required={required}
          name={name}
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
            <i className="fas fa-check"></i>
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

export default Checkbox;
