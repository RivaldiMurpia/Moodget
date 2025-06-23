import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      startIcon,
      endIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const baseStyles = 'block rounded-md shadow-sm focus:ring-2 focus:ring-offset-0 transition-colors';
    const widthStyle = fullWidth ? 'w-full' : '';
    const stateStyles = error
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500';
    
    const iconStyles = 'absolute inset-y-0 flex items-center pointer-events-none text-gray-400';

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className={`${iconStyles} left-3`}>
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              ${baseStyles}
              ${widthStyle}
              ${stateStyles}
              ${startIcon ? 'pl-10' : 'pl-3'}
              ${endIcon ? 'pr-10' : 'pr-3'}
              ${className}
              py-2 text-sm
            `}
            {...props}
          />
          {endIcon && (
            <div className={`${iconStyles} right-3`}>
              {endIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={`mt-1 text-sm ${
              error ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
