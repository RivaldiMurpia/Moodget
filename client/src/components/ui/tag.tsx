'use client';

import React from 'react';

interface TagProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'soft';
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

const Tag: React.FC<TagProps> = ({
  children,
  variant = 'solid',
  color = 'default',
  size = 'md',
  icon,
  onRemove,
  disabled = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      base: 'px-2 py-0.5 text-xs',
      icon: 'w-3 h-3',
      close: '-mr-1 ml-1.5',
    },
    md: {
      base: 'px-2.5 py-1 text-sm',
      icon: 'w-4 h-4',
      close: '-mr-1.5 ml-2',
    },
    lg: {
      base: 'px-3 py-1.5 text-base',
      icon: 'w-5 h-5',
      close: '-mr-2 ml-2.5',
    },
  };

  const colorClasses = {
    default: {
      solid: 'bg-gray-100 text-gray-800',
      outline: 'border border-gray-300 text-gray-700',
      soft: 'bg-gray-50 text-gray-700',
    },
    primary: {
      solid: 'bg-indigo-100 text-indigo-800',
      outline: 'border border-indigo-300 text-indigo-700',
      soft: 'bg-indigo-50 text-indigo-700',
    },
    success: {
      solid: 'bg-green-100 text-green-800',
      outline: 'border border-green-300 text-green-700',
      soft: 'bg-green-50 text-green-700',
    },
    warning: {
      solid: 'bg-yellow-100 text-yellow-800',
      outline: 'border border-yellow-300 text-yellow-700',
      soft: 'bg-yellow-50 text-yellow-700',
    },
    error: {
      solid: 'bg-red-100 text-red-800',
      outline: 'border border-red-300 text-red-700',
      soft: 'bg-red-50 text-red-700',
    },
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${sizeClasses[size].base}
        ${colorClasses[color][variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon && (
        <span className={`mr-1.5 ${sizeClasses[size].icon}`}>
          {icon}
        </span>
      )}
      {children}
      {onRemove && !disabled && (
        <button
          type="button"
          onClick={onRemove}
          className={`
            ${sizeClasses[size].close}
            rounded-full p-0.5
            hover:bg-black/5
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white
            focus:ring-${color === 'default' ? 'gray' : color}-500
          `}
        >
          <span className="sr-only">Remove</span>
          <i className={`fas fa-times ${sizeClasses[size].icon}`} />
        </button>
      )}
    </span>
  );
};

// Tag group component
interface TagGroupProps {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TagGroup: React.FC<TagGroupProps> = ({
  children,
  spacing = 'md',
  className = '',
}) => {
  const spacingClasses = {
    sm: 'space-x-1',
    md: 'space-x-2',
    lg: 'space-x-3',
  };

  return (
    <div className={`flex flex-wrap ${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
};

// Tag input component
interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  variant?: 'solid' | 'outline' | 'soft';
  disabled?: boolean;
  maxTags?: number;
  validate?: (tag: string) => boolean;
  formatTag?: (tag: string) => string;
  label?: string;
  error?: string;
  className?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  placeholder = 'Add tag...',
  size = 'md',
  color = 'default',
  variant = 'solid',
  disabled = false,
  maxTags,
  validate = (tag) => tag.length > 0,
  formatTag = (tag) => tag.trim(),
  label,
  error,
  className = '',
}) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = formatTag(inputValue);
      
      if (
        tag &&
        validate(tag) &&
        !value.includes(tag) &&
        (!maxTags || value.length < maxTags)
      ) {
        onChange([...value, tag]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleRemove = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const sizeClasses = {
    sm: 'min-h-[1.75rem] text-xs',
    md: 'min-h-[2.25rem] text-sm',
    lg: 'min-h-[2.75rem] text-base',
  };

  return (
    <div className={className}>
      {label && (
        <label className="block font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div
        className={`
          flex flex-wrap items-center gap-2 p-1
          border rounded-md
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${sizeClasses[size]}
        `}
      >
        {value.map((tag) => (
          <Tag
            key={tag}
            size={size}
            color={color}
            variant={variant}
            onRemove={() => handleRemove(tag)}
            disabled={disabled}
          >
            {tag}
          </Tag>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled || (maxTags !== undefined && value.length >= maxTags)}
          className={`
            flex-1 min-w-[8rem] border-0 p-0 focus:ring-0
            disabled:bg-transparent
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Tag;
