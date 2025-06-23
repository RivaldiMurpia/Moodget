'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

type PopoverPosition = 'top' | 'right' | 'bottom' | 'left';
type PopoverAlign = 'start' | 'center' | 'end';

interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  position?: PopoverPosition;
  align?: PopoverAlign;
  offset?: number;
  arrow?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  closeOnClick?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  disabled?: boolean;
  portal?: boolean;
}

const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  position = 'bottom',
  align = 'center',
  offset = 8,
  arrow = true,
  open: controlledOpen,
  onOpenChange,
  className = '',
  closeOnClick = true,
  closeOnClickOutside = true,
  closeOnEsc = true,
  disabled = false,
  portal = true,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const updatePosition = () => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const arrowSize = 8;

    let top = 0;
    let left = 0;
    let arrowTop = 0;
    let arrowLeft = 0;

    // Calculate position based on trigger element
    switch (position) {
      case 'top':
        top = triggerRect.top - popoverRect.height - offset;
        break;
      case 'right':
        left = triggerRect.right + offset;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        break;
      case 'left':
        left = triggerRect.left - popoverRect.width - offset;
        break;
    }

    // Calculate alignment
    switch (align) {
      case 'start':
        if (position === 'top' || position === 'bottom') {
          left = triggerRect.left;
          arrowLeft = triggerRect.width / 2 - arrowSize;
        } else {
          top = triggerRect.top;
          arrowTop = triggerRect.height / 2 - arrowSize;
        }
        break;
      case 'center':
        if (position === 'top' || position === 'bottom') {
          left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
          arrowLeft = popoverRect.width / 2 - arrowSize;
        } else {
          top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
          arrowTop = popoverRect.height / 2 - arrowSize;
        }
        break;
      case 'end':
        if (position === 'top' || position === 'bottom') {
          left = triggerRect.right - popoverRect.width;
          arrowLeft = popoverRect.width - triggerRect.width / 2 - arrowSize;
        } else {
          top = triggerRect.bottom - popoverRect.height;
          arrowTop = popoverRect.height - triggerRect.height / 2 - arrowSize;
        }
        break;
    }

    // Adjust arrow position
    switch (position) {
      case 'top':
        arrowTop = popoverRect.height - arrowSize;
        break;
      case 'right':
        arrowLeft = -arrowSize;
        break;
      case 'bottom':
        arrowTop = -arrowSize;
        break;
      case 'left':
        arrowLeft = popoverRect.width - arrowSize;
        break;
    }

    setPopoverPosition({ top: top + window.scrollY, left: left + window.scrollX });
    setArrowPosition({ top: arrowTop, left: arrowLeft });
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!closeOnEsc) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isControlled) {
          onOpenChange?.(false);
        } else {
          setUncontrolledOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, closeOnEsc, isControlled, onOpenChange]);

  useEffect(() => {
    if (!closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        if (isControlled) {
          onOpenChange?.(false);
        } else {
          setUncontrolledOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeOnClickOutside, isControlled, onOpenChange]);

  const handleTriggerClick = () => {
    if (disabled) return;

    if (isControlled) {
      onOpenChange?.(!isOpen);
    } else {
      setUncontrolledOpen(!isOpen);
    }
  };

  const handleContentClick = () => {
    if (closeOnClick) {
      if (isControlled) {
        onOpenChange?.(false);
      } else {
        setUncontrolledOpen(false);
      }
    }
  };

  if (!mounted) return null;

  const popoverContent = (
    <>
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        className={disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={popoverRef}
          style={{
            position: 'absolute',
            top: popoverPosition.top,
            left: popoverPosition.left,
          }}
          className={`
            z-50 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5
            ${className}
          `}
          onClick={handleContentClick}
        >
          {content}
          {arrow && (
            <div
              ref={arrowRef}
              style={{
                position: 'absolute',
                top: arrowPosition.top,
                left: arrowPosition.left,
              }}
              className={`
                w-4 h-4 rotate-45 bg-white
                ${position === 'bottom' ? 'border-t border-l' : ''}
                ${position === 'top' ? 'border-b border-r' : ''}
                ${position === 'left' ? 'border-t border-r' : ''}
                ${position === 'right' ? 'border-b border-l' : ''}
                border-gray-200
              `}
            />
          )}
        </div>
      )}
    </>
  );

  return portal ? createPortal(popoverContent, document.body) : popoverContent;
};

// Hover popover variant
interface HoverPopoverProps extends Omit<PopoverProps, 'trigger' | 'closeOnClick' | 'closeOnClickOutside' | 'closeOnEsc'> {
  children: React.ReactNode;
  delay?: number;
}

export const HoverPopover: React.FC<HoverPopoverProps> = ({
  children,
  delay = 200,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutId = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (timeoutId.current !== null) {
      window.clearTimeout(timeoutId.current);
    }
    timeoutId.current = window.setTimeout(() => setIsOpen(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutId.current !== null) {
      window.clearTimeout(timeoutId.current);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId.current !== null) {
        window.clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return (
    <Popover
      {...props}
      trigger={
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {children}
        </div>
      }
      open={isOpen}
      onOpenChange={setIsOpen}
      closeOnClick={false}
      closeOnClickOutside={false}
      closeOnEsc={false}
    />
  );
};

export default Popover;
