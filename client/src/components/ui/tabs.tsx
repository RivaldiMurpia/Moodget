'use client';

import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  contentClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  fullWidth = false,
  size = 'md',
  className = '',
  contentClassName = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const getTabStyles = (tab: Tab) => {
    const isActive = activeTab === tab.id;
    const baseClasses = `
      inline-flex items-center justify-center
      focus:outline-none transition-colors
      ${sizeClasses[size]}
      ${tab.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
    `;

    switch (variant) {
      case 'pills':
        return `
          ${baseClasses}
          px-4 py-2 rounded-md
          ${
            isActive
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }
        `;
      case 'underline':
        return `
          ${baseClasses}
          px-4 py-2 border-b-2
          ${
            isActive
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
          }
        `;
      default:
        return `
          ${baseClasses}
          px-4 py-2 rounded-t-lg border-t border-l border-r
          ${
            isActive
              ? 'bg-white border-gray-200 text-indigo-600'
              : 'bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100'
          }
        `;
    }
  };

  return (
    <div className={className}>
      {/* Tab List */}
      <div
        className={`
          flex ${variant === 'default' ? 'border-b border-gray-200' : ''}
          ${fullWidth ? 'w-full' : ''}
          ${variant === 'pills' ? 'space-x-2' : ''}
        `}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`
              ${getTabStyles(tab)}
              ${fullWidth ? 'flex-1' : ''}
            `}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className={`mt-4 ${contentClassName}`}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={tab.id}
            className={activeTab === tab.id ? '' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

// Vertical tabs variant
interface VerticalTabsProps extends Omit<TabsProps, 'variant' | 'fullWidth'> {
  sideWidth?: string;
}

export const VerticalTabs: React.FC<VerticalTabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  size = 'md',
  className = '',
  contentClassName = '',
  sideWidth = 'w-64',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={`flex ${className}`}>
      {/* Sidebar */}
      <div className={`${sideWidth} border-r border-gray-200 pr-4`}>
        <div className="flex flex-col space-y-1" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={`
                flex items-center px-4 py-2 rounded-md text-left
                ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              disabled={tab.disabled}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 pl-6 ${contentClassName}`}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={tab.id}
            className={activeTab === tab.id ? '' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
