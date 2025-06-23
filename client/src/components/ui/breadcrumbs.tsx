'use client';

import React from 'react';
import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
  separator?: React.ReactNode;
  className?: string;
  maxItems?: number;
  homeIcon?: React.ReactNode;
  onClick?: (href: string) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = <i className="fas fa-chevron-right text-gray-400 mx-2"></i>,
  className = '',
  maxItems = 0,
  homeIcon = <i className="fas fa-home"></i>,
  onClick,
}) => {
  const displayItems = maxItems > 0 ? getDisplayItems(items, maxItems) : items;

  function getDisplayItems(items: Breadcrumb[], maxItems: number): Breadcrumb[] {
    if (items.length <= maxItems) return items;

    const firstItem = items[0];
    const lastItems = items.slice(-2);
    
    return [
      firstItem,
      { label: '...', href: undefined },
      ...lastItems,
    ];
  }

  const handleClick = (href: string | undefined) => {
    if (href && onClick) {
      onClick(href);
    }
  };

  return (
    <nav className={`flex items-center text-sm ${className}`}>
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li
              key={index}
              className="flex items-center"
            >
              {index > 0 && separator}
              {isEllipsis ? (
                <span className="text-gray-500">{item.label}</span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  onClick={() => handleClick(item.href)}
                  className={`
                    flex items-center hover:text-indigo-600
                    ${isLast ? 'text-gray-800 font-medium' : 'text-gray-500'}
                  `}
                >
                  {index === 0 && homeIcon ? (
                    <span className="mr-1">{homeIcon}</span>
                  ) : item.icon ? (
                    <span className="mr-1">{item.icon}</span>
                  ) : null}
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`
                    flex items-center
                    ${isLast ? 'text-gray-800 font-medium' : 'text-gray-500'}
                  `}
                >
                  {index === 0 && homeIcon ? (
                    <span className="mr-1">{homeIcon}</span>
                  ) : item.icon ? (
                    <span className="mr-1">{item.icon}</span>
                  ) : null}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Compact breadcrumbs for mobile
interface CompactBreadcrumbsProps extends Omit<BreadcrumbsProps, 'maxItems'> {
  backIcon?: React.ReactNode;
}

export const CompactBreadcrumbs: React.FC<CompactBreadcrumbsProps> = ({
  items,
  className = '',
  backIcon = <i className="fas fa-chevron-left"></i>,
  onClick,
}) => {
  if (items.length === 0) return null;

  const currentItem = items[items.length - 1];
  const previousItem = items[items.length - 2];

  return (
    <nav className={`flex items-center text-sm ${className}`}>
      {previousItem && previousItem.href && (
        <Link
          href={previousItem.href}
          onClick={() => onClick?.(previousItem.href!)}
          className="flex items-center text-gray-500 hover:text-indigo-600"
        >
          {backIcon}
          <span className="ml-1">{previousItem.label}</span>
        </Link>
      )}
      <span className="mx-2 text-gray-400">/</span>
      <span className="text-gray-800 font-medium">
        {currentItem.label}
      </span>
    </nav>
  );
};

// Dropdown breadcrumbs for complex navigation
interface DropdownBreadcrumbsProps extends BreadcrumbsProps {
  dropdownIcon?: React.ReactNode;
}

export const DropdownBreadcrumbs: React.FC<DropdownBreadcrumbsProps> = ({
  items,
  className = '',
  dropdownIcon = <i className="fas fa-chevron-down ml-1"></i>,
  onClick,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (items.length === 0) return null;

  const currentItem = items[items.length - 1];

  return (
    <nav className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-800 hover:text-indigo-600"
      >
        <span className="font-medium">{currentItem.label}</span>
        {dropdownIcon}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10"
        >
          {items.map((item, index) => (
            <div key={index}>
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={() => {
                    onClick?.(item.href!);
                    setIsOpen(false);
                  }}
                  className="
                    block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100
                    flex items-center
                  "
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </Link>
              ) : (
                <span className="
                  block px-4 py-2 text-sm text-gray-500
                  flex items-center
                ">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Breadcrumbs;
