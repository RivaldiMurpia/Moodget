'use client';

import React, { useState, useCallback } from 'react';

interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  variant?: 'default' | 'bordered' | 'separated';
  multiple?: boolean;
  defaultExpanded?: string[];
  size?: 'sm' | 'md' | 'lg';
  iconPosition?: 'left' | 'right';
  className?: string;
  onChange?: (expandedIds: string[]) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  variant = 'default',
  multiple = false,
  defaultExpanded = [],
  size = 'md',
  iconPosition = 'right',
  className = '',
  onChange,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  const sizeClasses = {
    sm: {
      button: 'py-2 px-3',
      content: 'p-3',
      text: 'text-sm',
      icon: 'w-4 h-4',
    },
    md: {
      button: 'py-3 px-4',
      content: 'p-4',
      text: 'text-base',
      icon: 'w-5 h-5',
    },
    lg: {
      button: 'py-4 px-5',
      content: 'p-5',
      text: 'text-lg',
      icon: 'w-6 h-6',
    },
  };

  const variantClasses = {
    default: {
      wrapper: 'divide-y divide-gray-200',
      item: '',
      button: 'hover:bg-gray-50',
      content: '',
    },
    bordered: {
      wrapper: 'border border-gray-200 rounded-lg divide-y divide-gray-200',
      item: '',
      button: 'hover:bg-gray-50',
      content: '',
    },
    separated: {
      wrapper: 'space-y-2',
      item: 'border border-gray-200 rounded-lg overflow-hidden',
      button: 'hover:bg-gray-50',
      content: '',
    },
  };

  const toggleItem = useCallback((itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        if (!multiple) {
          next.clear();
        }
        next.add(itemId);
      }
      onChange?.(Array.from(next));
      return next;
    });
  }, [multiple, onChange]);

  const renderIcon = (isExpanded: boolean) => (
    <i
      className={`
        fas fa-chevron-down
        transform transition-transform duration-200
        ${isExpanded ? 'rotate-180' : ''}
      `}
    />
  );

  return (
    <div className={`${variantClasses[variant].wrapper} ${className}`}>
      {items.map((item) => {
        const isExpanded = expandedItems.has(item.id);

        return (
          <div
            key={item.id}
            className={variantClasses[variant].item}
          >
            <button
              type="button"
              onClick={() => !item.disabled && toggleItem(item.id)}
              className={`
                w-full flex items-center justify-between
                ${sizeClasses[size].button}
                ${sizeClasses[size].text}
                ${variantClasses[variant].button}
                ${item.disabled ? 'cursor-not-allowed opacity-50' : ''}
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              `}
              disabled={item.disabled}
              aria-expanded={isExpanded}
            >
              <div className="flex items-center space-x-3">
                {iconPosition === 'left' && item.icon && (
                  <span className={sizeClasses[size].icon}>
                    {item.icon}
                  </span>
                )}
                <span className="font-medium text-gray-900">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {iconPosition === 'right' && item.icon && (
                  <span className={sizeClasses[size].icon}>
                    {item.icon}
                  </span>
                )}
                <span className={sizeClasses[size].icon}>
                  {renderIcon(isExpanded)}
                </span>
              </div>
            </button>
            {isExpanded && (
              <div
                className={`
                  ${sizeClasses[size].content}
                  ${variantClasses[variant].content}
                  ${sizeClasses[size].text}
                  text-gray-600
                `}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// FAQ Accordion variant
interface FAQItem extends Omit<AccordionItem, 'icon'> {
  question: string;
  answer: React.ReactNode;
}

interface FAQAccordionProps extends Omit<AccordionProps, 'items'> {
  items: FAQItem[];
  showNumbers?: boolean;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  showNumbers = false,
  ...props
}) => {
  const faqItems = items.map((item, index) => ({
    ...item,
    title: (
      <div className="flex items-center space-x-2">
        {showNumbers && (
          <span className="text-indigo-600 font-semibold">
            {(index + 1).toString().padStart(2, '0')}.
          </span>
        )}
        <span>{item.question}</span>
      </div>
    ),
    content: item.answer,
  }));

  return (
    <Accordion
      {...props}
      items={faqItems}
      variant="bordered"
    />
  );
};

// Nested Accordion variant
interface NestedAccordionItem extends Omit<AccordionItem, 'content'> {
  children?: NestedAccordionItem[];
  content?: React.ReactNode;
}

interface NestedAccordionProps extends Omit<AccordionProps, 'items'> {
  items: NestedAccordionItem[];
  level?: number;
}

export const NestedAccordion: React.FC<NestedAccordionProps> = ({
  items,
  level = 0,
  ...props
}) => {
  const renderNestedItems = (items: NestedAccordionItem[]) => {
    return items.map((item) => ({
      ...item,
      content: item.children ? (
        <div className="ml-4">
          <NestedAccordion
            {...props}
            items={item.children}
            level={level + 1}
          />
        </div>
      ) : (
        item.content
      ),
      icon: item.children ? (
        <i className="fas fa-folder text-yellow-400" />
      ) : (
        <i className="fas fa-file text-gray-400" />
      ),
    }));
  };

  return (
    <Accordion
      {...props}
      items={renderNestedItems(items)}
      variant={level === 0 ? 'bordered' : 'default'}
      iconPosition="left"
    />
  );
};

export default Accordion;
