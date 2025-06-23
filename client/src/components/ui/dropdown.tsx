'use client';

import React, { useState, useRef } from 'react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

interface DropdownItem {
  label: string | React.ReactNode;
  value?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  danger?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: 'left' | 'right';
  width?: string;
  className?: string;
  menuClassName?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = 'left',
  width = 'w-48',
  className = '',
  menuClassName = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick?.();
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5
            ${position === 'right' ? 'right-0' : 'left-0'}
            ${width}
            ${menuClassName}
          `}
        >
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="dropdown-button"
          >
            {items.map((item, index) => (
              <React.Fragment key={index}>
                {item.divider ? (
                  <div className="my-1 border-t border-gray-100" />
                ) : (
                  <button
                    className={`
                      group flex w-full items-center px-4 py-2 text-sm
                      ${
                        item.disabled
                          ? 'cursor-not-allowed text-gray-400'
                          : item.danger
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    role="menuitem"
                  >
                    {item.icon && (
                      <span
                        className={`
                          mr-3 h-5 w-5
                          ${
                            item.disabled
                              ? 'text-gray-400'
                              : item.danger
                              ? 'text-red-500'
                              : 'text-gray-500'
                          }
                        `}
                      >
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Button dropdown variant
interface ButtonDropdownProps extends Omit<DropdownProps, 'trigger'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const ButtonDropdown: React.FC<ButtonDropdownProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <Dropdown
      {...props}
      trigger={
        <button
          className={`
            inline-flex items-center justify-center rounded-md
            font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {label}
          <i className="fas fa-chevron-down ml-2 -mr-1"></i>
        </button>
      }
    />
  );
};

// Icon dropdown variant
interface IconDropdownProps extends Omit<DropdownProps, 'trigger'> {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const IconDropdown: React.FC<IconDropdownProps> = ({
  icon,
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
  };

  return (
    <Dropdown
      {...props}
      trigger={
        <button
          className={`
            text-gray-500 hover:text-gray-600
            rounded-full hover:bg-gray-100
            ${sizeClasses[size]}
            ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {icon}
        </button>
      }
    />
  );
};

export default Dropdown;
