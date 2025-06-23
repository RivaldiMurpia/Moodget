'use client';

import React, { useState, useEffect, useRef } from 'react';
import Input from '@/components/ui/Input';

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
  initialValue?: string;
  showIcon?: boolean;
  autoFocus?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = 'Search...',
  delay = 300,
  className = '',
  initialValue = '',
  showIcon = true,
  autoFocus = false,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, delay);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        className="pr-10"
        autoFocus={autoFocus}
        startIcon={
          showIcon ? (
            <i className="fas fa-search text-gray-400"></i>
          ) : undefined
        }
        endIcon={
          searchTerm ? (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <i className="fas fa-times"></i>
            </button>
          ) : undefined
        }
      />
    </div>
  );
};

// Advanced search component with filters
interface Filter {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less';
  value: string;
}

interface AdvancedSearchProps extends Omit<SearchInputProps, 'onSearch'> {
  onSearch: (search: string, filters: Filter[]) => void;
  availableFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'date';
  }>;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  availableFields,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<Filter[]>([]);

  const operators = {
    text: [
      { value: 'equals', label: 'Equals' },
      { value: 'contains', label: 'Contains' },
    ],
    number: [
      { value: 'equals', label: 'Equals' },
      { value: 'greater', label: 'Greater than' },
      { value: 'less', label: 'Less than' },
    ],
    date: [
      { value: 'equals', label: 'Equals' },
      { value: 'greater', label: 'After' },
      { value: 'less', label: 'Before' },
    ],
  };

  const handleAddFilter = () => {
    setFilters([
      ...filters,
      {
        field: availableFields[0].name,
        operator: 'equals',
        value: '',
      },
    ]);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setFilters(newFilters);
    onSearch(searchTerm, newFilters);
  };

  const handleFilterChange = (
    index: number,
    field: keyof Filter,
    value: string
  ) => {
    const newFilters = filters.map((filter, i) => {
      if (i === index) {
        return { ...filter, [field]: value };
      }
      return filter;
    });
    setFilters(newFilters);
    onSearch(searchTerm, newFilters);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value, filters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <SearchInput {...props} onSearch={handleSearch} />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <i className={`fas fa-filter mr-1`}></i>
          Filters
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          {filters.map((filter, index) => (
            <div key={index} className="flex items-center space-x-4">
              <select
                value={filter.field}
                onChange={(e) =>
                  handleFilterChange(index, 'field', e.target.value)
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {availableFields.map((field) => (
                  <option key={field.name} value={field.name}>
                    {field.label}
                  </option>
                ))}
              </select>

              <select
                value={filter.operator}
                onChange={(e) =>
                  handleFilterChange(index, 'operator', e.target.value as Filter['operator'])
                }
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {operators[
                  availableFields.find((f) => f.name === filter.field)?.type || 'text'
                ].map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>

              <Input
                value={filter.value}
                onChange={(e) =>
                  handleFilterChange(index, 'value', e.target.value)
                }
                className="flex-1"
              />

              <button
                onClick={() => handleRemoveFilter(index)}
                className="text-red-600 hover:text-red-800 focus:outline-none"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}

          <button
            onClick={handleAddFilter}
            className="text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none"
          >
            <i className="fas fa-plus mr-1"></i>
            Add Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
