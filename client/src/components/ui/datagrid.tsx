'use client';

import React, { useState, useMemo, useCallback } from 'react';

interface Column<T> {
  field: keyof T;
  header: React.ReactNode;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (row: T) => React.ReactNode;
  renderFilter?: (value: any, onChange: (value: any) => void) => React.ReactNode;
}

interface DataGridProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  selectable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  className?: string;
}

function DataGrid<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  selectable = false,
  sortable = true,
  filterable = true,
  pagination = true,
  pageSize = 10,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  onSelectionChange,
  className = '',
}: DataGridProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<T[keyof T]>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    field: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filters, setFilters] = useState<Record<keyof T, any>>({} as Record<keyof T, any>);
  const [currentPage, setCurrentPage] = useState(1);

  // Apply filters
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        const cellValue = row[field];
        if (typeof cellValue === 'string') {
          return cellValue.toLowerCase().includes(value.toLowerCase());
        }
        return cellValue === value;
      });
    });
  }, [data, filters]);

  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  // Apply pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (field: keyof T) => {
    if (!sortable) return;

    setSortConfig((prev) => ({
      field,
      direction: prev?.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilter = (field: keyof T, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedData.map((row) => row[keyField])));
    } else {
      setSelectedRows(new Set());
    }
    onSelectionChange?.(checked ? paginatedData : []);
  };

  const handleSelectRow = (row: T) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(row[keyField])) {
        next.delete(row[keyField]);
      } else {
        next.add(row[keyField]);
      }
      onSelectionChange?.(
        paginatedData.filter((r) => next.has(r[keyField]))
      );
      return next;
    });
  };

  const renderHeader = () => (
    <thead>
      <tr className="bg-gray-50 border-b border-gray-200">
        {selectable && (
          <th className="px-4 py-3 w-12">
            <input
              type="checkbox"
              checked={paginatedData.every((row) => selectedRows.has(row[keyField]))}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
          </th>
        )}
        {columns.map((column) => (
          <th
            key={String(column.field)}
            className={`
              px-4 py-3 text-left text-sm font-medium text-gray-900
              ${column.sortable !== false && sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
            `}
            style={{ width: column.width }}
            onClick={() => column.sortable !== false && handleSort(column.field)}
          >
            <div className="flex items-center space-x-1">
              <span>{column.header}</span>
              {column.sortable !== false && sortable && sortConfig?.field === column.field && (
                <i className={`fas fa-sort-${sortConfig.direction === 'asc' ? 'up' : 'down'}`} />
              )}
            </div>
            {column.filterable !== false && filterable && (
              <div className="mt-2">
                {column.renderFilter?.(
                  filters[column.field],
                  (value) => handleFilter(column.field, value)
                ) ?? (
                  <input
                    type="text"
                    value={filters[column.field] || ''}
                    onChange={(e) => handleFilter(column.field, e.target.value)}
                    className="w-full px-2 py-1 text-sm border rounded"
                    placeholder="Filter..."
                  />
                )}
              </div>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderBody = () => (
    <tbody className="divide-y divide-gray-200">
      {paginatedData.map((row) => (
        <tr
          key={String(row[keyField])}
          onClick={() => onRowClick?.(row)}
          className={`
            ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            ${selectedRows.has(row[keyField]) ? 'bg-indigo-50' : ''}
          `}
        >
          {selectable && (
            <td className="px-4 py-3 w-12">
              <input
                type="checkbox"
                checked={selectedRows.has(row[keyField])}
                onChange={() => handleSelectRow(row)}
                onClick={(e) => e.stopPropagation()}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </td>
          )}
          {columns.map((column) => (
            <td
              key={String(column.field)}
              className="px-4 py-3 text-sm text-gray-900"
            >
              {column.renderCell?.(row) ?? row[column.field]}
            </td>
          ))}
        </tr>
      ))}
      {paginatedData.length === 0 && !loading && (
        <tr>
          <td
            colSpan={columns.length + (selectable ? 1 : 0)}
            className="px-4 py-8 text-sm text-gray-500 text-center"
          >
            {emptyMessage}
          </td>
        </tr>
      )}
    </tbody>
  );

  const renderPagination = () => {
    if (!pagination || totalPages <= 1) return null;

    return (
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">
                {(currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </span>{' '}
              of{' '}
              <span className="font-medium">{sortedData.length}</span>{' '}
              results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">First</span>
                <i className="fas fa-angle-double-left" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <i className="fas fa-angle-left" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => (
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - currentPage) <= 1
                ))
                .map((page, i, array) => {
                  if (i > 0 && array[i - 1] !== page - 1) {
                    return (
                      <span
                        key={`ellipsis-${page}`}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`
                        relative inline-flex items-center px-4 py-2 border text-sm font-medium
                        ${page === currentPage
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }
                      `}
                    >
                      {page}
                    </button>
                  );
                })}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <i className="fas fa-angle-right" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Last</span>
                <i className="fas fa-angle-double-right" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {renderHeader()}
          {renderBody()}
        </table>
      </div>
      {renderPagination()}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
        </div>
      )}
    </div>
  );
}

export default DataGrid;
