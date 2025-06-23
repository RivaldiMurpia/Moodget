'use client';

import React, { Fragment, useRef, useState } from 'react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

interface MenuItem {
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  submenu?: MenuItem[];
}

interface MenuProps {
  trigger: React.ReactNode;
  items: MenuItem[];
  position?: 'left' | 'right';
  width?: string;
  className?: string;
  disabled?: boolean;
  closeOnClick?: boolean;
}

const Menu: React.FC<MenuProps> = ({
  trigger,
  items,
  position = 'left',
  width = 'w-48',
  className = '',
  disabled = false,
  closeOnClick = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => {
    setIsOpen(false);
    setActiveSubmenu(null);
  });

  const handleItemClick = (item: MenuItem, index: number) => {
    if (item.disabled) return;

    if (item.submenu) {
      setActiveSubmenu(activeSubmenu === index ? null : index);
    } else {
      item.onClick?.();
      if (closeOnClick) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    }
  };

  const renderMenuItem = (item: MenuItem, index: number, isSubmenu = false) => {
    if (item.divider) {
      return <div key={index} className="my-1 border-t border-gray-100" />;
    }

    const isActive = activeSubmenu === index;

    return (
      <div key={index} className="relative">
        <button
          onClick={() => handleItemClick(item, index)}
          className={`
            group flex w-full items-center px-4 py-2 text-sm
            ${
              item.disabled
                ? 'cursor-not-allowed text-gray-400'
                : item.danger
                ? 'text-red-600 hover:bg-red-50'
                : 'text-gray-700 hover:bg-gray-50'
            }
            ${isActive ? 'bg-gray-50' : ''}
          `}
          disabled={item.disabled}
        >
          {item.icon && (
            <span
              className={`
                mr-3 h-5 w-5
                ${
                  item.disabled
                    ? 'text-gray-400'
                    : item.danger
                    ? 'text-red-500'
                    : 'text-gray-500'
                }
              `}
            >
              {item.icon}
            </span>
          )}
          <span className="flex-1">{item.label}</span>
          {item.submenu && (
            <i className={`fas fa-chevron-${isSubmenu ? 'left' : 'right'} ml-2`}></i>
          )}
        </button>

        {item.submenu && isActive && (
          <div
            className={`
              absolute top-0 ${position === 'left' ? 'left-full' : 'right-full'}
              w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5
              ${isSubmenu ? '-mt-1' : ''}
            `}
          >
            {item.submenu.map((subitem, subindex) =>
              renderMenuItem(subitem, `${index}-${subindex}` as any, true)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={menuRef} className={`relative inline-block text-left ${className}`}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 rounded-md bg-white shadow-lg
            ring-1 ring-black ring-opacity-5
            ${position === 'right' ? 'right-0' : 'left-0'}
            ${width}
          `}
        >
          <div className="py-1">
            {items.map((item, index) => renderMenuItem(item, index))}
          </div>
        </div>
      )}
    </div>
  );
};

// Context menu variant
interface ContextMenuProps extends Omit<MenuProps, 'trigger'> {
  children: React.ReactNode;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  items,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;
    setPosition({ x, y });
    setIsOpen(true);
  };

  return (
    <div onContextMenu={handleContextMenu}>
      {children}
      {isOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: position.y,
            left: position.x,
            zIndex: 50,
          }}
          className="rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <Menu
            trigger={<></>}
            items={items}
            {...props}
            className="!block"
          />
        </div>
      )}
    </div>
  );
};

// Command menu variant (like VS Code command palette)
interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  commands: {
    category?: string;
    items: {
      label: string;
      icon?: React.ReactNode;
      shortcut?: string;
      onClick: () => void;
    }[];
  }[];
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  commands,
}) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCommands = commands
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
      <div className="mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
        <div className="relative">
          <i className="fas fa-search pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"></i>
          <input
            ref={inputRef}
            type="text"
            className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="max-h-80 scroll-py-2 divide-y divide-gray-100 overflow-y-auto">
          {filteredCommands.map((category, categoryIndex) => (
            <div key={categoryIndex} className="p-2">
              {category.category && (
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-900">
                  {category.category}
                </div>
              )}
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  onClick={() => {
                    item.onClick();
                    onClose();
                  }}
                  className="group flex cursor-pointer select-none items-center rounded-md px-2 py-2 hover:bg-gray-100"
                >
                  {item.icon && (
                    <span className="mr-3 h-5 w-5 text-gray-500">
                      {item.icon}
                    </span>
                  )}
                  <span className="flex-1 text-sm text-gray-900">
                    {item.label}
                  </span>
                  {item.shortcut && (
                    <span className="ml-3 text-xs text-gray-500">
                      {item.shortcut}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              No commands found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
