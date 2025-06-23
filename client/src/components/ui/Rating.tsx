'use client';

import React, { useState, useCallback } from 'react';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  precision?: 0.5 | 1;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  disabled?: boolean;
  showValue?: boolean;
  icon?: 'star' | 'heart' | 'circle';
  color?: 'default' | 'primary' | 'warning';
  label?: string;
  error?: string;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  max = 5,
  precision = 1,
  size = 'md',
  readOnly = false,
  disabled = false,
  showValue = false,
  icon = 'star',
  color = 'warning',
  label,
  error,
  className = '',
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeClasses = {
    sm: {
      icon: 'w-4 h-4',
      text: 'text-sm',
      spacing: 'space-x-1',
    },
    md: {
      icon: 'w-6 h-6',
      text: 'text-base',
      spacing: 'space-x-1.5',
    },
    lg: {
      icon: 'w-8 h-8',
      text: 'text-lg',
      spacing: 'space-x-2',
    },
  };

  const colorClasses = {
    default: {
      filled: 'text-gray-900',
      empty: 'text-gray-300',
      hover: 'text-gray-400',
    },
    primary: {
      filled: 'text-indigo-500',
      empty: 'text-indigo-100',
      hover: 'text-indigo-200',
    },
    warning: {
      filled: 'text-yellow-400',
      empty: 'text-yellow-100',
      hover: 'text-yellow-200',
    },
  };

  const iconTypes = {
    star: 'fa-star',
    heart: 'fa-heart',
    circle: 'fa-circle',
  };

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (readOnly || disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = x / rect.width;

    if (precision === 0.5) {
      setHoverValue(index + (percent > 0.5 ? 1 : 0.5));
    } else {
      setHoverValue(index + 1);
    }
  }, [precision, readOnly, disabled]);

  const handleMouseLeave = useCallback(() => {
    setHoverValue(null);
  }, []);

  const handleClick = useCallback((newValue: number) => {
    if (!readOnly && !disabled && onChange) {
      onChange(newValue);
    }
  }, [onChange, readOnly, disabled]);

  const renderIcon = (index: number) => {
    const isActive = (hoverValue ?? value) > index;
    const isPartiallyFilled = precision === 0.5 && 
      Math.ceil((hoverValue ?? value)) === index + 1 && 
      (hoverValue ?? value) % 1 === 0.5;

    return (
      <div
        key={index}
        className={`
          relative
          ${!readOnly && !disabled ? 'cursor-pointer' : ''}
          ${disabled ? 'opacity-50' : ''}
        `}
        onMouseMove={(e) => handleMouseMove(e, index)}
        onClick={() => handleClick(index + 1)}
      >
        {/* Empty icon */}
        <i
          className={`
            fas ${iconTypes[icon]}
            ${sizeClasses[size].icon}
            ${colorClasses[color].empty}
          `}
        />

        {/* Filled icon */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            width: isPartiallyFilled ? '50%' : isActive ? '100%' : '0%',
          }}
        >
          <i
            className={`
              fas ${iconTypes[icon]}
              ${sizeClasses[size].icon}
              ${colorClasses[color].filled}
            `}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className={`block font-medium text-gray-700 mb-1 ${sizeClasses[size].text}`}>
          {label}
        </label>
      )}

      <div
        className={`
          inline-flex items-center
          ${sizeClasses[size].spacing}
          ${disabled ? 'cursor-not-allowed' : ''}
        `}
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: max }, (_, i) => renderIcon(i))}

        {showValue && (
          <span className={`ml-2 text-gray-600 ${sizeClasses[size].text}`}>
            {hoverValue ?? value}
          </span>
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

// Emoji rating variant
interface EmojiRatingProps extends Omit<RatingProps, 'icon' | 'max' | 'precision'> {
  emojis?: string[];
  labels?: string[];
}

export const EmojiRating: React.FC<EmojiRatingProps> = ({
  emojis = ['😡', '😕', '😐', '🙂', '😄'],
  labels = ['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'],
  ...props
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={props.className}>
      {props.label && (
        <label className="block font-medium text-gray-700 mb-1">
          {props.label}
        </label>
      )}

      <div className="flex items-center justify-between max-w-md">
        {emojis.map((emoji, index) => {
          const isActive = (hoveredIndex ?? props.value - 1) >= index;
          
          return (
            <button
              key={index}
              type="button"
              className={`
                flex flex-col items-center p-2 rounded-lg
                transition-transform duration-200
                ${isActive ? 'transform scale-110' : ''}
                ${props.disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'}
                ${props.readOnly ? 'cursor-default' : ''}
              `}
              onClick={() => !props.readOnly && !props.disabled && props.onChange?.(index + 1)}
              onMouseEnter={() => !props.readOnly && !props.disabled && setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              disabled={props.disabled || props.readOnly}
            >
              <span className="text-2xl mb-1">{emoji}</span>
              <span className="text-sm text-gray-600">{labels[index]}</span>
            </button>
          );
        })}
      </div>

      {props.error && (
        <p className="mt-1 text-sm text-red-600">
          {props.error}
        </p>
      )}
    </div>
  );
};

export default Rating;
