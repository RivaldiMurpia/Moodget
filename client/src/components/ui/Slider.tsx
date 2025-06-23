'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  formatValue?: (value: number) => string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  marks?: { value: number; label: string }[];
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  disabled = false,
  className = '',
  error,
  formatValue,
  color = 'indigo',
  size = 'md',
  marks,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const colorClasses = {
    indigo: 'bg-indigo-600',
    red: 'bg-red-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600',
  };

  const sizeClasses = {
    sm: {
      track: 'h-1',
      thumb: 'h-3 w-3',
      label: 'text-sm',
    },
    md: {
      track: 'h-2',
      thumb: 'h-4 w-4',
      label: 'text-base',
    },
    lg: {
      track: 'h-3',
      thumb: 'h-5 w-5',
      label: 'text-lg',
    },
  };

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const getValue = (percentage: number) => {
    const rawValue = ((max - min) * percentage) / 100 + min;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(Math.max(steppedValue, min), max);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;

    const percentage = ((event.clientX - rect.left) / rect.width) * 100;
    onChange(getValue(percentage));
    setIsDragging(true);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = ((event.clientX - rect.left) / rect.width) * 100;
    onChange(getValue(percentage));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <label className={`font-medium text-gray-700 ${sizeClasses[size].label}`}>
              {label}
            </label>
          )}
          {showValue && (
            <span className={`text-gray-500 ${sizeClasses[size].label}`}>
              {displayValue}
            </span>
          )}
        </div>
      )}

      <div
        ref={sliderRef}
        className={`
          relative cursor-pointer
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
        onMouseDown={handleMouseDown}
      >
        {/* Track background */}
        <div
          className={`
            rounded-full bg-gray-200
            ${sizeClasses[size].track}
          `}
        />

        {/* Track fill */}
        <div
          className={`
            absolute top-0 left-0 rounded-full
            ${colorClasses[color as keyof typeof colorClasses]}
            ${sizeClasses[size].track}
          `}
          style={{ width: `${getPercentage(value)}%` }}
        />

        {/* Thumb */}
        <div
          className={`
            absolute top-1/2 -translate-x-1/2 -translate-y-1/2
            rounded-full bg-white shadow-md border-2
            ${colorClasses[color as keyof typeof colorClasses].replace('bg-', 'border-')}
            ${sizeClasses[size].thumb}
          `}
          style={{ left: `${getPercentage(value)}%` }}
        />

        {/* Marks */}
        {marks && (
          <div className="absolute w-full top-full pt-2">
            {marks.map((mark) => (
              <div
                key={mark.value}
                className="absolute -translate-x-1/2"
                style={{ left: `${getPercentage(mark.value)}%` }}
              >
                <div
                  className={`
                    w-1 h-1 rounded-full mb-1
                    ${value >= mark.value ? colorClasses[color as keyof typeof colorClasses] : 'bg-gray-300'}
                  `}
                />
                <div className={`text-xs text-gray-500 ${sizeClasses[size].label}`}>
                  {mark.label}
                </div>
              </div>
            ))}
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

// Range slider variant
interface RangeSliderProps extends Omit<SliderProps, 'value' | 'onChange'> {
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  value: [minValue, maxValue],
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  disabled = false,
  className = '',
  error,
  formatValue,
  color = 'indigo',
  size = 'md',
  marks,
}) => {
  const [activeDragger, setActiveDragger] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const colorClasses = {
    indigo: 'bg-indigo-600',
    red: 'bg-red-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600',
  };

  const sizeClasses = {
    sm: {
      track: 'h-1',
      thumb: 'h-3 w-3',
      label: 'text-sm',
    },
    md: {
      track: 'h-2',
      thumb: 'h-4 w-4',
      label: 'text-base',
    },
    lg: {
      track: 'h-3',
      thumb: 'h-5 w-5',
      label: 'text-lg',
    },
  };

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const getValue = (percentage: number) => {
    const rawValue = ((max - min) * percentage) / 100 + min;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(Math.max(steppedValue, min), max);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!activeDragger || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = ((event.clientX - rect.left) / rect.width) * 100;
    const newValue = getValue(percentage);

    if (activeDragger === 'min') {
      onChange([Math.min(newValue, maxValue), maxValue]);
    } else {
      onChange([minValue, Math.max(newValue, minValue)]);
    }
  };

  const handleMouseUp = () => {
    setActiveDragger(null);
  };

  useEffect(() => {
    if (activeDragger) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeDragger]);

  const displayMinValue = formatValue ? formatValue(minValue) : minValue;
  const displayMaxValue = formatValue ? formatValue(maxValue) : maxValue;

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <label className={`font-medium text-gray-700 ${sizeClasses[size].label}`}>
              {label}
            </label>
          )}
          {showValue && (
            <span className={`text-gray-500 ${sizeClasses[size].label}`}>
              {displayMinValue} - {displayMaxValue}
            </span>
          )}
        </div>
      )}

      <div
        ref={sliderRef}
        className={`
          relative cursor-pointer
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        {/* Track background */}
        <div
          className={`
            rounded-full bg-gray-200
            ${sizeClasses[size].track}
          `}
        />

        {/* Track fill */}
        <div
          className={`
            absolute top-0 rounded-full
            ${colorClasses[color as keyof typeof colorClasses]}
            ${sizeClasses[size].track}
          `}
          style={{
            left: `${getPercentage(minValue)}%`,
            width: `${getPercentage(maxValue) - getPercentage(minValue)}%`,
          }}
        />

        {/* Min thumb */}
        <div
          onMouseDown={() => !disabled && setActiveDragger('min')}
          className={`
            absolute top-1/2 -translate-x-1/2 -translate-y-1/2
            rounded-full bg-white shadow-md border-2 cursor-pointer
            ${colorClasses[color as keyof typeof colorClasses].replace('bg-', 'border-')}
            ${sizeClasses[size].thumb}
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          style={{ left: `${getPercentage(minValue)}%` }}
        />

        {/* Max thumb */}
        <div
          onMouseDown={() => !disabled && setActiveDragger('max')}
          className={`
            absolute top-1/2 -translate-x-1/2 -translate-y-1/2
            rounded-full bg-white shadow-md border-2 cursor-pointer
            ${colorClasses[color as keyof typeof colorClasses].replace('bg-', 'border-')}
            ${sizeClasses[size].thumb}
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          style={{ left: `${getPercentage(maxValue)}%` }}
        />

        {/* Marks */}
        {marks && (
          <div className="absolute w-full top-full pt-2">
            {marks.map((mark) => (
              <div
                key={mark.value}
                className="absolute -translate-x-1/2"
                style={{ left: `${getPercentage(mark.value)}%` }}
              >
                <div
                  className={`
                    w-1 h-1 rounded-full mb-1
                    ${mark.value >= minValue && mark.value <= maxValue
                      ? colorClasses[color as keyof typeof colorClasses]
                      : 'bg-gray-300'
                    }
                  `}
                />
                <div className={`text-xs text-gray-500 ${sizeClasses[size].label}`}>
                  {mark.label}
                </div>
              </div>
            ))}
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

export default Slider;
