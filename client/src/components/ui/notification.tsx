'use client';

import React, { useState, useEffect } from 'react';

interface NotificationProps {
  title: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  duration?: number;
  showIcon?: boolean;
  showClose?: boolean;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const Notification: React.FC<NotificationProps> = ({
  title,
  message,
  type = 'info',
  position = 'top-right',
  duration = 5000,
  showIcon = true,
  showClose = true,
  onClose,
  action,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  const typeClasses = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-400',
      title: 'text-blue-800',
      message: 'text-blue-600',
      iconName: 'fa-info-circle',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-400',
      title: 'text-green-800',
      message: 'text-green-600',
      iconName: 'fa-check-circle',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-400',
      title: 'text-yellow-800',
      message: 'text-yellow-600',
      iconName: 'fa-exclamation-circle',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-400',
      title: 'text-red-800',
      message: 'text-red-600',
      iconName: 'fa-times-circle',
    },
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed z-50 w-96 max-w-[calc(100vw-2rem)]
        ${positionClasses[position]}
        transform transition-all duration-300
        ${isLeaving
          ? position.includes('right')
            ? 'translate-x-full opacity-0'
            : '-translate-x-full opacity-0'
          : 'translate-x-0 opacity-100'
        }
        ${className}
      `}
      role="alert"
    >
      <div
        className={`
          relative overflow-hidden rounded-lg border p-4 shadow-lg
          ${typeClasses[type].bg}
          ${typeClasses[type].border}
        `}
      >
        <div className="flex items-start space-x-3">
          {/* Icon */}
          {showIcon && (
            <div className={`flex-shrink-0 ${typeClasses[type].icon}`}>
              <i className={`fas ${typeClasses[type].iconName}`} />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 pt-0.5">
            <p className={`text-sm font-medium ${typeClasses[type].title}`}>
              {title}
            </p>
            {message && (
              <p className={`mt-1 text-sm ${typeClasses[type].message}`}>
                {message}
              </p>
            )}
            {action && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={action.onClick}
                  className={`
                    text-sm font-medium
                    ${typeClasses[type].title}
                    hover:opacity-75
                  `}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>

          {/* Close button */}
          {showClose && (
            <button
              type="button"
              className={`
                flex-shrink-0 rounded-lg p-1.5
                ${typeClasses[type].message}
                hover:bg-white hover:bg-opacity-25
              `}
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <i className="fas fa-times" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {duration && duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div
              className={`h-full ${typeClasses[type].border} opacity-25`}
              style={{
                animation: `notification-progress ${duration}ms linear`,
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes notification-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

// Toast notification system
interface ToastOptions extends Omit<NotificationProps, 'title' | 'message'> {}

interface Toast extends NotificationProps {
  id: string;
}

interface ToastContextValue {
  show: (title: string, message?: string, options?: ToastOptions) => void;
  success: (title: string, message?: string, options?: ToastOptions) => void;
  error: (title: string, message?: string, options?: ToastOptions) => void;
  warning: (title: string, message?: string, options?: ToastOptions) => void;
  info: (title: string, message?: string, options?: ToastOptions) => void;
}

export const ToastContext = React.createContext<ToastContextValue>({
  show: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = (title: string, message?: string, options: ToastOptions = {}) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, message, ...options }]);
  };

  const success = (title: string, message?: string, options: ToastOptions = {}) => {
    show(title, message, { ...options, type: 'success' });
  };

  const error = (title: string, message?: string, options: ToastOptions = {}) => {
    show(title, message, { ...options, type: 'error' });
  };

  const warning = (title: string, message?: string, options: ToastOptions = {}) => {
    show(title, message, { ...options, type: 'warning' });
  };

  const info = (title: string, message?: string, options: ToastOptions = {}) => {
    show(title, message, { ...options, type: 'info' });
  };

  const handleClose = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ show, success, error, warning, info }}>
      {children}
      {toasts.map((toast) => (
        <Notification
          key={toast.id}
          {...toast}
          onClose={() => handleClose(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default Notification;
