'use client';

import React, { Fragment } from 'react';
import { createPortal } from 'react-dom';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  overlay?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  title?: string;
  footer?: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  position = 'right',
  size = 'md',
  className = '',
  overlay = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  title,
  footer,
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    if (!closeOnEsc) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose, closeOnEsc]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: {
      left: 'w-72',
      right: 'w-72',
      top: 'h-1/3',
      bottom: 'h-1/3',
    },
    md: {
      left: 'w-96',
      right: 'w-96',
      top: 'h-1/2',
      bottom: 'h-1/2',
    },
    lg: {
      left: 'w-[32rem]',
      right: 'w-[32rem]',
      top: 'h-2/3',
      bottom: 'h-2/3',
    },
    xl: {
      left: 'w-[40rem]',
      right: 'w-[40rem]',
      top: 'h-3/4',
      bottom: 'h-3/4',
    },
    full: {
      left: 'w-screen',
      right: 'w-screen',
      top: 'h-screen',
      bottom: 'h-screen',
    },
  };

  const positionClasses = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full',
  };

  const translateClasses = {
    left: 'translate-x-[-100%]',
    right: 'translate-x-[100%]',
    top: 'translate-y-[-100%]',
    bottom: 'translate-y-[100%]',
  };

  if (!mounted) return null;

  const drawerContent = (
    <Fragment>
      {overlay && (
        <div
          className={`
            fixed inset-0 bg-black bg-opacity-50 transition-opacity
            ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
      )}
      <div
        role="dialog"
        aria-modal="true"
        className={`
          fixed bg-white shadow-xl transition-transform duration-300 ease-in-out
          ${positionClasses[position]}
          ${sizeClasses[size][position]}
          ${isOpen ? 'transform-none' : translateClasses[position]}
          ${className}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            {title && (
              <h2 className="text-lg font-medium text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-200 px-4 py-3">
            {footer}
          </div>
        )}
      </div>
    </Fragment>
  );

  return createPortal(drawerContent, document.body);
};

// Panel drawer variant
interface PanelDrawerProps extends Omit<DrawerProps, 'children'> {
  header?: React.ReactNode;
  content: React.ReactNode;
  actions?: React.ReactNode;
}

export const PanelDrawer: React.FC<PanelDrawerProps> = ({
  header,
  content,
  actions,
  ...props
}) => {
  return (
    <Drawer {...props}>
      {header && (
        <div className="mb-4">
          {header}
        </div>
      )}
      <div className="flex-1">
        {content}
      </div>
      {actions && (
        <div className="mt-4 flex justify-end space-x-3">
          {actions}
        </div>
      )}
    </Drawer>
  );
};

// Form drawer variant
interface FormDrawerProps extends Omit<DrawerProps, 'children'> {
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

export const FormDrawer: React.FC<FormDrawerProps> = ({
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  children,
  onClose,
  ...props
}) => {
  return (
    <Drawer
      {...props}
      onClose={onClose}
      footer={
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            disabled={isSubmitting}
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            form="drawer-form"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <i className="fas fa-spinner fa-spin mr-2"></i>
            ) : null}
            {submitLabel}
          </button>
        </div>
      }
    >
      <form id="drawer-form" onSubmit={onSubmit}>
        {children}
      </form>
    </Drawer>
  );
};

export default Drawer;
