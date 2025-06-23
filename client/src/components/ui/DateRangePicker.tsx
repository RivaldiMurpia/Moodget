'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  onChange: (range: DateRange) => void;
  initialRange?: DateRange;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onChange,
  initialRange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>(
    initialRange || {
      startDate: new Date(),
      endDate: new Date(),
    }
  );
  const [tempRange, setTempRange] = useState<DateRange>(selectedRange);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const presetRanges = [
    {
      label: 'Today',
      range: {
        startDate: new Date(),
        endDate: new Date(),
      },
    },
    {
      label: 'Last 7 days',
      range: {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      },
    },
    {
      label: 'Last 30 days',
      range: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      },
    },
    {
      label: 'This month',
      range: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(),
      },
    },
    {
      label: 'Last month',
      range: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      },
    },
  ];

  const handleApply = () => {
    setSelectedRange(tempRange);
    onChange(tempRange);
    setIsOpen(false);
  };

  const handlePresetClick = (range: DateRange) => {
    setTempRange(range);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <span>
          {formatDate(selectedRange.startDate)} - {formatDate(selectedRange.endDate)}
        </span>
        <i className="fas fa-calendar-alt ml-2"></i>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown */}
          <Card
            className="absolute right-0 mt-2 w-72 z-50"
            noBorder
          >
            <div className="p-4">
              <div className="space-y-4">
                {/* Date inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={tempRange.startDate.toISOString().split('T')[0]}
                      onChange={(e) =>
                        setTempRange((prev) => ({
                          ...prev,
                          startDate: new Date(e.target.value),
                        }))
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={tempRange.endDate.toISOString().split('T')[0]}
                      onChange={(e) =>
                        setTempRange((prev) => ({
                          ...prev,
                          endDate: new Date(e.target.value),
                        }))
                      }
                      min={tempRange.startDate.toISOString().split('T')[0]}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Preset ranges */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Preset Ranges
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {presetRanges.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => handlePresetClick(preset.range)}
                        className="text-sm text-left px-3 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    variant="secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleApply}>
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;
