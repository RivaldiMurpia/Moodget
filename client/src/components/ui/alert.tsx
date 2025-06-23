'use client';

import React, { useState } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  icon,
  dismissible = true,
  onDismiss,
  action,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-800',
      icon: <i className="fas fa-check-circle"></i>,
      iconColor: 'text-green-400',
      button: 'bg-green-50 text-green-800 hover:bg-green-100',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-800',
      icon: <i className="fas fa-exclamation-circle"></i>,
      iconColor: 'text-red-400',
      button: 'bg-red-50 text-red-800 hover:bg-red-100',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      icon: <i className="fas fa-exclamation-triangle"></i>,
      iconColor: 'text-yellow-400',
      button: 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      text: 'text-blue-800',
      icon: <i className="fas fa-info-circle"></i>,
      iconColor: 'text-blue-400',
      button: 'bg-blue-50 text-blue-800 hover:bg-blue-100',
    },
  };

  const styles = typeStyles[type];

  return (
    <div
      className={`
        rounded-md border p-4
        ${styles.bg}
        ${styles.border}
        ${className}
      `}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <span className={styles.iconColor}>
            {icon || styles.icon}
          </span>
        </div>
        <div className="ml-3 flex-1">
          <div className={`text-sm ${styles.text}`}>
            {title && (
              <h3 className="font-medium mb-1">{title}</h3>
            )}
            <div className="text-sm">{message}</div>
          </div>
          {action && (
            <div className="mt-4">
              <button
                type="button"
                onClick={action.onClick}
                className={`
                  rounded-md px-3 py-1.5 text-sm font-medium
                  ${styles.button}
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                `}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              className={`
                inline-flex rounded-md p-1.5
                ${styles.button}
                focus:outline-none focus:ring-2 focus:ring-offset-2
              `}
              onClick={handleDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Banner variant for full-width alerts
interface BannerAlertProps extends Omit<AlertProps, 'className'> {
  position?: 'top' | 'bottom';
  fullWidth?: boolean;
}

export const BannerAlert: React.FC<BannerAlertProps> = ({
  position = 'top',
  fullWidth = true,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed ${position}-0 left-0 right-0 z-50
        ${fullWidth ? '' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}
      `}
    >
      <Alert
        {...props}
        className="rounded-none shadow-md"
        onDismiss={() => {
          setIsVisible(false);
          props.onDismiss?.();
        }}
      />
    </div>
  );
};

// Toast-style alert variant
interface ToastAlertProps extends Omit<AlertProps, 'className'> {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  duration?: number;
}

export const ToastAlert: React.FC<ToastAlertProps> = ({
  position = 'top-right',
  duration = 5000,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        props.onDismiss?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, props]);

  if (!isVisible) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div
      className={`
        fixed ${positionClasses[position]} z-50
        w-96 max-w-[calc(100vw-2rem)]
      `}
    >
      <Alert
        {...props}
        className="shadow-lg"
        onDismiss={() => {
          setIsVisible(false);
          props.onDismiss?.();
        }}
      />
    </div>
  );
};

export default Alert;
