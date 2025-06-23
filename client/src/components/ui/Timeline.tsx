'use client';

import React from 'react';

type TimelineStatus = 'default' | 'success' | 'warning' | 'error';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string | Date;
  icon?: React.ReactNode;
  status?: TimelineStatus;
  content?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'alternating' | 'compact';
  showConnectors?: boolean;
  className?: string;
}

const Timeline: React.FC<TimelineProps> = ({
  items,
  orientation = 'vertical',
  size = 'md',
  variant = 'default',
  showConnectors = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      icon: 'w-6 h-6',
      dot: 'w-2.5 h-2.5',
      text: 'text-sm',
      spacing: 'space-y-4',
      padding: 'py-2',
    },
    md: {
      icon: 'w-8 h-8',
      dot: 'w-3 h-3',
      text: 'text-base',
      spacing: 'space-y-6',
      padding: 'py-3',
    },
    lg: {
      icon: 'w-10 h-10',
      dot: 'w-4 h-4',
      text: 'text-lg',
      spacing: 'space-y-8',
      padding: 'py-4',
    },
  };

  const statusClasses = {
    default: {
      bg: 'bg-gray-200',
      border: 'border-gray-200',
      icon: 'text-gray-600',
      dot: 'bg-gray-400',
    },
    success: {
      bg: 'bg-green-100',
      border: 'border-green-200',
      icon: 'text-green-600',
      dot: 'bg-green-400',
    },
    warning: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      dot: 'bg-yellow-400',
    },
    error: {
      bg: 'bg-red-100',
      border: 'border-red-200',
      icon: 'text-red-600',
      dot: 'bg-red-400',
    },
  };

  const renderIcon = (item: TimelineItem) => {
    if (item.icon) {
      return (
        <div
          className={`
            flex items-center justify-center rounded-full
            ${sizeClasses[size].icon}
            ${statusClasses[item.status || 'default'].bg}
            ${statusClasses[item.status || 'default'].icon}
          `}
        >
          {item.icon}
        </div>
      );
    }

    return (
      <div
        className={`
          rounded-full
          ${sizeClasses[size].dot}
          ${statusClasses[item.status || 'default'].dot}
        `}
      />
    );
  };

  const renderDate = (date?: string | Date) => {
    if (!date) return null;

    const formattedDate = typeof date === 'string'
      ? date
      : date.toLocaleDateString();

    return (
      <time
        className={`
          block text-gray-500
          ${sizeClasses[size].text}
        `}
      >
        {formattedDate}
      </time>
    );
  };

  if (orientation === 'horizontal') {
    return (
      <div className={className}>
        <div className="relative flex items-start justify-between">
          {/* Connector line */}
          {showConnectors && (
            <div className="absolute top-4 left-0 right-0 border-t border-gray-200" />
          )}

          {/* Items */}
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`
                relative flex-1 text-center
                ${index === 0 ? 'text-left' : ''}
                ${index === items.length - 1 ? 'text-right' : ''}
              `}
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                {renderIcon(item)}
              </div>

              {/* Content */}
              <div>
                {renderDate(item.date)}
                <h3 className={`font-medium ${sizeClasses[size].text}`}>
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1 text-gray-500">
                    {item.description}
                  </p>
                )}
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className} ${sizeClasses[size].spacing}`}>
      {/* Vertical connector line */}
      {showConnectors && (
        <div
          className="absolute top-0 bottom-0 left-4 border-l border-gray-200"
          style={{ marginLeft: variant === 'compact' ? '3px' : '11px' }}
        />
      )}

      {/* Items */}
      {items.map((item, index) => {
        const isAlternating = variant === 'alternating' && index % 2 === 1;

        return (
          <div
            key={item.id}
            className={`
              relative flex
              ${isAlternating ? 'flex-row-reverse' : 'flex-row'}
              ${variant === 'compact' ? 'items-center' : 'items-start'}
            `}
          >
            {/* Icon */}
            <div className="flex-shrink-0 z-10">
              {renderIcon(item)}
            </div>

            {/* Content */}
            <div
              className={`
                flex-1
                ${sizeClasses[size].padding}
                ${isAlternating ? 'mr-8 text-right' : 'ml-8'}
              `}
            >
              {renderDate(item.date)}
              <h3 className={`font-medium ${sizeClasses[size].text}`}>
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 text-gray-500">
                  {item.description}
                </p>
              )}
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Process timeline variant
interface ProcessStep extends TimelineItem {
  completed?: boolean;
  current?: boolean;
}

interface ProcessTimelineProps extends Omit<TimelineProps, 'items' | 'variant'> {
  steps: ProcessStep[];
  currentStep?: number;
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({
  steps,
  currentStep = 0,
  ...props
}) => {
  const processSteps: TimelineItem[] = steps.map((step, index) => ({
    ...step,
    status: step.completed
      ? 'success' as const
      : index === currentStep
        ? 'warning' as const
        : 'default' as const,
    icon: step.icon || (
      step.completed ? (
        <i className="fas fa-check" />
      ) : (
        <span className="font-medium">{index + 1}</span>
      )
    ),
  }));

  return (
    <Timeline
      {...props}
      items={processSteps}
      variant="default"
    />
  );
};

export default Timeline;
