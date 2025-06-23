'use client';

import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  label?: string;
  showValue?: boolean;
  valueFormat?: (value: number, max: number) => string;
  className?: string;
  animated?: boolean;
  striped?: boolean;
  indeterminate?: boolean;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  label,
  showValue = false,
  valueFormat,
  className = '',
  animated = false,
  striped = false,
  indeterminate = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };

  const colorClasses = {
    primary: 'bg-indigo-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    danger: 'bg-red-600',
    info: 'bg-blue-600',
  };

  const formatValue = (value: number, max: number) => {
    if (valueFormat) {
      return valueFormat(value, max);
    }
    return `${Math.round((value / max) * 100)}%`;
  };

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-gray-700">
              {formatValue(value, max)}
            </span>
          )}
        </div>
      )}
      <div
        className={`
          w-full bg-gray-200 rounded-full overflow-hidden
          ${sizeClasses[size]}
        `}
      >
        <div
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
          className={`
            rounded-full transition-all duration-300
            ${colorClasses[color]}
            ${striped ? 'progress-striped' : ''}
            ${animated ? 'progress-animated' : ''}
            ${indeterminate ? 'progress-indeterminate' : ''}
          `}
          style={{
            width: indeterminate ? '100%' : `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

// Circular progress component
interface CircularProgressProps extends Omit<ProgressProps, 'size'> {
  size?: number;
  thickness?: number;
  showBackground?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 40,
  thickness = 4,
  color = 'primary',
  label,
  showValue = false,
  valueFormat,
  className = '',
  animated = false,
  indeterminate = false,
  showBackground = true,
}) => {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    primary: 'stroke-indigo-600',
    success: 'stroke-green-600',
    warning: 'stroke-yellow-500',
    danger: 'stroke-red-600',
    info: 'stroke-blue-600',
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {showBackground && (
            <circle
              className="stroke-gray-200"
              strokeWidth={thickness}
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
            />
          )}
          <circle
            className={`
              ${colorClasses[color]}
              ${indeterminate ? 'progress-circle-indeterminate' : ''}
              ${animated ? 'transition-all duration-300' : ''}
            `}
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={indeterminate ? 0 : offset}
            strokeLinecap="round"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium">
              {valueFormat ? valueFormat(value, max) : `${Math.round(percentage)}%`}
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {label}
        </span>
      )}
    </div>
  );
};

// Progress steps component
interface Step {
  label: string;
  description?: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface ProgressStepsProps {
  steps: Step[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  className = '',
  orientation = 'horizontal',
}) => {
  return (
    <div
      className={`
        ${orientation === 'horizontal' ? 'flex' : 'flex flex-col'}
        ${className}
      `}
    >
      {steps.map((step, index) => (
        <div
          key={index}
          className={`
            flex ${orientation === 'horizontal' ? 'flex-col' : 'flex-row'}
            ${index !== steps.length - 1 ? 'flex-1' : ''}
          `}
        >
          <div
            className={`
              flex items-center
              ${orientation === 'horizontal' ? 'flex-col' : ''}
            `}
          >
            <div
              className={`
                flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full
                ${
                  step.status === 'complete'
                    ? 'bg-indigo-600'
                    : step.status === 'current'
                    ? 'border-2 border-indigo-600 bg-white'
                    : 'border-2 border-gray-300 bg-white'
                }
              `}
            >
              {step.status === 'complete' ? (
                <i className="fas fa-check text-white text-sm"></i>
              ) : (
                <span
                  className={`
                    text-sm font-medium
                    ${step.status === 'current' ? 'text-indigo-600' : 'text-gray-500'}
                  `}
                >
                  {index + 1}
                </span>
              )}
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`
                  ${orientation === 'horizontal' ? 'w-px h-12' : 'w-12 h-px'}
                  ${
                    step.status === 'complete'
                      ? 'bg-indigo-600'
                      : 'bg-gray-300'
                  }
                  ${orientation === 'horizontal' ? 'my-2' : 'mx-2'}
                `}
              />
            )}
          </div>
          <div
            className={`
              ${orientation === 'horizontal' ? 'text-center' : 'ml-4'}
              ${index !== steps.length - 1 ? 'flex-1' : ''}
            `}
          >
            <div className="text-sm font-medium text-gray-900">
              {step.label}
            </div>
            {step.description && (
              <div className="text-sm text-gray-500">
                {step.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Progress;
