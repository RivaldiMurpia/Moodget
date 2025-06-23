'use client';

import React from 'react';

type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'gray';

type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  dot?: boolean;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  dot = false,
  icon,
  removable = false,
  onRemove,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-medium';

  const variantStyles: Record<BadgeVariant, string> = {
    primary: 'bg-indigo-100 text-indigo-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  const dotColors: Record<BadgeVariant, string> = {
    primary: 'bg-indigo-400',
    secondary: 'bg-gray-400',
    success: 'bg-green-400',
    danger: 'bg-red-400',
    warning: 'bg-yellow-400',
    info: 'bg-blue-400',
    gray: 'bg-gray-400',
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  const dotSizes: Record<BadgeSize, string> = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${rounded ? 'rounded-full' : 'rounded'}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`
            ${dotSizes[size]}
            ${dotColors[variant]}
            rounded-full mr-1.5
          `}
        />
      )}
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className={`
            ml-1.5 hover:bg-opacity-20 hover:bg-black
            rounded focus:outline-none
            ${size === 'sm' ? 'p-0.5' : 'p-1'}
          `}
        >
          <span className="sr-only">Remove</span>
          <svg
            className={`
              ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}
            `}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

// Dot indicator variant
export const DotIndicator: React.FC<
  Omit<BadgeProps, 'dot' | 'removable' | 'icon'>
> = (props) => <Badge {...props} dot />;

// Status badge variant with predefined styles
interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'active' | 'inactive' | 'pending' | 'error';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  ...props
}) => {
  const statusConfig: Record<
    string,
    { variant: BadgeVariant; label: string }
  > = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'gray', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    error: { variant: 'danger', label: 'Error' },
  };

  const config = statusConfig[status];

  return (
    <Badge {...props} variant={config.variant} dot>
      {props.children || config.label}
    </Badge>
  );
};

// Counter badge variant
interface CounterBadgeProps extends Omit<BadgeProps, 'children'> {
  count: number;
  max?: number;
}

export const CounterBadge: React.FC<CounterBadgeProps> = ({
  count,
  max = 99,
  ...props
}) => (
  <Badge {...props} rounded>
    {count > max ? `${max}+` : count}
  </Badge>
);

export default Badge;
