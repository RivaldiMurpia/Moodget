'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  defaultColors?: string[];
  showInput?: boolean;
  showAlpha?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  error?: string;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  defaultColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#800000',
    '#808000', '#008000', '#800080', '#008080', '#000080',
  ],
  showInput = true,
  showAlpha = false,
  disabled = false,
  size = 'md',
  label,
  error,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [alpha, setAlpha] = useState(100);
  const pickerRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: {
      button: 'w-6 h-6',
      input: 'text-sm',
      swatch: 'w-4 h-4',
    },
    md: {
      button: 'w-8 h-8',
      input: 'text-base',
      swatch: 'w-6 h-6',
    },
    lg: {
      button: 'w-10 h-10',
      input: 'text-lg',
      swatch: 'w-8 h-8',
    },
  };

  // Convert hex to HSL
  const hexToHSL = useCallback((hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }, []);

  // Convert HSL to hex
  const hslToHex = useCallback((h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    const toHex = (n: number) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, []);

  // Initialize HSL values from hex color
  useEffect(() => {
    const { h, s, l } = hexToHSL(value);
    setHue(h);
    setSaturation(s);
    setLightness(l);
  }, [value, hexToHSL]);

  // Handle click outside to close picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = Number(e.target.value);
    setHue(newHue);
    onChange(hslToHex(newHue, saturation, lightness));
  }, [saturation, lightness, onChange, hslToHex]);

  const handleSaturationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSaturation = Number(e.target.value);
    setSaturation(newSaturation);
    onChange(hslToHex(hue, newSaturation, lightness));
  }, [hue, lightness, onChange, hslToHex]);

  const handleLightnessChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newLightness = Number(e.target.value);
    setLightness(newLightness);
    onChange(hslToHex(hue, saturation, newLightness));
  }, [hue, saturation, onChange, hslToHex]);

  const handleAlphaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newAlpha = Number(e.target.value);
    setAlpha(newAlpha);
    // Convert hex to rgba
    const hex = hslToHex(hue, saturation, lightness);
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    onChange(`rgba(${r}, ${g}, ${b}, ${newAlpha / 100})`);
  }, [hue, saturation, lightness, onChange, hslToHex]);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="flex items-center space-x-2">
        {/* Color preview button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            rounded border border-gray-300
            ${sizeClasses[size].button}
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          `}
          style={{ backgroundColor: value }}
        />

        {/* Hex input */}
        {showInput && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`
              border border-gray-300 rounded px-2 py-1
              ${sizeClasses[size].input}
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
          />
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Color picker popup */}
      {isOpen && !disabled && (
        <div
          ref={pickerRef}
          className="
            absolute z-10 mt-2 p-4 bg-white rounded-lg shadow-lg
            border border-gray-200
          "
        >
          {/* Hue slider */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hue
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={handleHueChange}
              className="w-full"
              style={{
                background: `linear-gradient(to right, 
                  #ff0000 0%, #ffff00 17%, #00ff00 33%, 
                  #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%
                )`,
              }}
            />
          </div>

          {/* Saturation slider */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Saturation
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={saturation}
              onChange={handleSaturationChange}
              className="w-full"
              style={{
                background: `linear-gradient(to right, 
                  ${hslToHex(hue, 0, lightness)} 0%,
                  ${hslToHex(hue, 100, lightness)} 100%
                )`,
              }}
            />
          </div>

          {/* Lightness slider */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lightness
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={lightness}
              onChange={handleLightnessChange}
              className="w-full"
              style={{
                background: `linear-gradient(to right,
                  #000000 0%,
                  ${hslToHex(hue, saturation, 50)} 50%,
                  #ffffff 100%
                )`,
              }}
            />
          </div>

          {/* Alpha slider */}
          {showAlpha && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opacity
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={alpha}
                onChange={handleAlphaChange}
                className="w-full"
                style={{
                  background: `linear-gradient(to right,
                    transparent 0%,
                    ${value} 100%
                  )`,
                }}
              />
            </div>
          )}

          {/* Default colors */}
          <div className="grid grid-cols-5 gap-2">
            {defaultColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChange(color)}
                className={`
                  rounded border border-gray-300
                  ${sizeClasses[size].swatch}
                `}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
