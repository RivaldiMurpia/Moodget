'use client';

import React, { useState, useCallback } from 'react';

interface TreeNode {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
  data?: any;
}

interface TreeViewProps {
  items: TreeNode[];
  defaultExpanded?: string[];
  defaultSelected?: string[];
  multiSelect?: boolean;
  showIcons?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onSelect?: (selectedIds: string[]) => void;
  onToggle?: (expandedIds: string[]) => void;
  className?: string;
}

const TreeView: React.FC<TreeViewProps> = ({
  items,
  defaultExpanded = [],
  defaultSelected = [],
  multiSelect = false,
  showIcons = true,
  size = 'md',
  onSelect,
  onToggle,
  className = '',
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded)
  );
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set(defaultSelected)
  );

  const sizeClasses = {
    sm: {
      text: 'text-sm',
      icon: 'w-4 h-4',
      spacing: 'py-1',
      indent: 'ml-4',
    },
    md: {
      text: 'text-base',
      icon: 'w-5 h-5',
      spacing: 'py-1.5',
      indent: 'ml-6',
    },
    lg: {
      text: 'text-lg',
      icon: 'w-6 h-6',
      spacing: 'py-2',
      indent: 'ml-8',
    },
  };

  const handleToggle = useCallback((itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      onToggle?.(Array.from(next));
      return next;
    });
  }, [onToggle]);

  const handleSelect = useCallback((itemId: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (multiSelect) {
        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
      } else {
        next.clear();
        next.add(itemId);
      }
      onSelect?.(Array.from(next));
      return next;
    });
  }, [multiSelect, onSelect]);

  const renderTreeItem = (item: TreeNode, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isSelected = selectedItems.has(item.id);

    return (
      <div key={item.id}>
        <div
          className={`
            flex items-center
            ${sizeClasses[size].spacing}
            ${level > 0 ? sizeClasses[size].indent : ''}
            ${item.disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:bg-gray-50'
            }
            ${isSelected ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'}
          `}
        >
          {/* Expand/collapse button */}
          {hasChildren && (
            <button
              type="button"
              onClick={() => !item.disabled && handleToggle(item.id)}
              className={`
                flex-shrink-0 mr-1
                text-gray-400 hover:text-gray-500
                ${item.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <i
                className={`
                  fas fa-chevron-right
                  transition-transform duration-200
                  ${isExpanded ? 'rotate-90' : ''}
                  ${sizeClasses[size].icon}
                `}
              />
            </button>
          )}

          {/* Icon */}
          {showIcons && (
            <div className={`flex-shrink-0 mr-2 ${sizeClasses[size].icon}`}>
              {item.icon}
            </div>
          )}

          {/* Label */}
          <div
            onClick={() => !item.disabled && handleSelect(item.id)}
            className={`
              flex-1 truncate
              ${sizeClasses[size].text}
              ${item.disabled ? '' : 'hover:text-indigo-600'}
            `}
          >
            {item.label}
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {item.children!.map((child) => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {items.map((item) => renderTreeItem(item))}
    </div>
  );
};

// File system tree variant
interface FileNode extends TreeNode {
  type: 'file' | 'folder';
  size?: number;
  modified?: Date;
}

interface FileTreeProps extends Omit<TreeViewProps, 'items'> {
  items: FileNode[];
  showSize?: boolean;
  showModified?: boolean;
  onOpen?: (file: FileNode) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({
  items,
  showSize = false,
  showModified = false,
  onOpen,
  defaultExpanded = [],
  ...props
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const renderFileDetails = (file: FileNode) => {
    const details = [];

    if (showSize && file.size !== undefined) {
      details.push(formatFileSize(file.size));
    }

    if (showModified && file.modified) {
      details.push(file.modified.toLocaleDateString());
    }

    return details.length > 0 && (
      <div className="ml-2 text-sm text-gray-500">
        {details.join(' • ')}
      </div>
    );
  };

  const treeItems = items.map((item) => ({
    ...item,
    icon: (
      <i
        className={`
          ${item.type === 'folder'
            ? expandedNodes.has(item.id)
              ? 'fas fa-folder-open text-yellow-400'
              : 'fas fa-folder text-yellow-400'
            : 'fas fa-file text-gray-400'
          }
        `}
      />
    ),
    onClick: item.type === 'file' ? () => onOpen?.(item) : undefined,
  }));

  const handleToggle = (expandedIds: string[]) => {
    setExpandedNodes(new Set(expandedIds));
  };

  return (
    <TreeView
      {...props}
      items={treeItems}
      showIcons={true}
      defaultExpanded={defaultExpanded}
      onToggle={handleToggle}
    />
  );
};

export default TreeView;
