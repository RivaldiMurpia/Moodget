'use client';

import React from 'react';
import { LoadingOverlay } from '@/components/ui/loadingspinner';

interface Column<T> {
  key: string;
  header: string | React.ReactNode;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  onRowClick?: (item: T) => void;
  selectedRow?: T;
  emptyMessage?: string;
  className?: string;
  stickyHeader?: boolean;
}

function Table<T extends { id?: string | number }>({
  data,
  columns,
  isLoading = false,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  selectedRow,
  emptyMessage = 'No data available',
  className = '',
  stickyHeader = false,
}: TableProps<T>) {
  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const isActive = sortColumn === column.key;
    const iconClass = isActive
      ? sortDirection === 'asc'
        ? 'fa-sort-up'
        : 'fa-sort-down'
      : 'fa-sort';

    return (
      <i
        className={`fas ${iconClass} ml-1 ${
          isActive ? 'text-indigo-600' : 'text-gray-400'
        }`}
      ></i>
    );
  };

  return (
    <div className={`relative overflow-x-auto ${className}`}>
      <LoadingOverlay isLoading={isLoading}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={`bg-gray-50 ${stickyHeader ? 'sticky top-0' : ''}`}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`
                    px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${getAlignmentClass(column.align)}
                    ${column.width ? column.width : ''}
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                  `}
                  onClick={() => column.sortable && onSort?.(column.key)}
                  style={column.width ? { width: column.width } : undefined}
                >
                  <span className="flex items-center justify-between">
                    {column.header}
                    {renderSortIcon(column)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr
                  key={item.id || rowIndex}
                  onClick={() => onRowClick?.(item)}
                  className={`
                    ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                    ${
                      selectedRow && item.id === selectedRow.id
                        ? 'bg-indigo-50'
                        : ''
                    }
                  `}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${getAlignmentClass(
                        column.align
                      )}`}
                    >
                      {column.render
                        ? column.render(item)
                        : (item as any)[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </LoadingOverlay>
    </div>
  );
}

// Compact table variant for smaller spaces
export function CompactTable<T extends { id?: string | number }>({
  data,
  columns,
  ...props
}: TableProps<T>) {
  return (
    <Table
      data={data}
      columns={columns.map((col) => ({
        ...col,
        header: typeof col.header === 'string' ? (
          <span className="text-xs">{col.header}</span>
        ) : (
          col.header
        ),
      }))}
      className="text-sm"
      {...props}
    />
  );
}

export default Table;
