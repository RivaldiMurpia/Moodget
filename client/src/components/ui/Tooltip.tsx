'use client';

import React, { useState, useRef, useEffect } from 'react';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

interface Position {
  top: number;
  left: number;
}

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
  maxWidth?: string;
  arrow?: boolean;
  disabled?: boolean;
  interactive?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
  maxWidth = 'max-w-xs',
  arrow = true,
  disabled = false,
  interactive = false,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState<Position>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutId = useRef<number | null>(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top + scrollY - tooltipRect.height - 8;
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'right':
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + scrollX + 8;
        break;
      case 'bottom':
        top = triggerRect.bottom + scrollY + 8;
        left = triggerRect.left + scrollX + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + scrollY + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left + scrollX - tooltipRect.width - 8;
        break;
    }

    // Ensure tooltip stays within viewport
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Adjust horizontal position
    if (left < 0) {
      left = 0;
    } else if (left + tooltipRect.width > viewport.width) {
      left = viewport.width - tooltipRect.width;
    }

    // Adjust vertical position
    if (top < 0) {
      top = 0;
    } else if (top + tooltipRect.height > viewport.height) {
      top = viewport.height - tooltipRect.height;
    }

    setTooltipPosition({ top, left });
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    
    timeoutId.current = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutId.current !== null) {
      window.clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
    }

    return () => {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutId.current !== null) {
        window.clearTimeout(timeoutId.current);
      }
    };
  }, []);

  const arrowPosition = {
    top: 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-gray-700',
    right: 'left-[-6px] top-1/2 transform -translate-y-1/2 border-r-gray-700',
    bottom: 'top-[-6px] left-1/2 transform -translate-x-1/2 border-b-gray-700',
    left: 'right-[-6px] top-1/2 transform -translate-y-1/2 border-l-gray-700',
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
          className={`
            fixed z-50 px-3 py-2 text-sm text-white bg-gray-700
            rounded shadow-lg pointer-events-${interactive ? 'auto' : 'none'}
            ${maxWidth}
            ${className}
          `}
        >
          {content}
          {arrow && (
            <div
              className={`
                absolute w-3 h-3 rotate-45 bg-gray-700 border-gray-700
                ${arrowPosition[position]}
              `}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Rich tooltip variant with title and description
interface RichTooltipProps extends Omit<TooltipProps, 'content'> {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const RichTooltip: React.FC<RichTooltipProps> = ({
  title,
  description,
  icon,
  ...props
}) => {
  const content = (
    <div className="text-left">
      <div className="flex items-center mb-1">
        {icon && <span className="mr-2">{icon}</span>}
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-gray-100">{description}</p>
    </div>
  );

  return <Tooltip content={content} {...props} />;
};

export default Tooltip;
