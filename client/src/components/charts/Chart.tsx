'use client';

import React from 'react';
import Card from '@/components/ui/card';
import { LoadingOverlay } from '@/components/ui/loadingspinner';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface ChartProps {
  data: ChartDataPoint[];
  title?: string;
  type?: 'bar' | 'line';
  height?: number;
  isLoading?: boolean;
  showValues?: boolean;
  color?: string;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({
  data,
  title,
  type = 'bar',
  height = 200,
  isLoading = false,
  showValues = true,
  color = '#4F46E5',
  className = '',
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));

  const getBarHeight = (value: number) => {
    if (maxValue === minValue) return '100%';
    return `${((value - minValue) / (maxValue - minValue)) * 100}%`;
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className={className}>
      <LoadingOverlay isLoading={isLoading}>
        <div className="p-6">
          {title && (
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
          )}
          <div style={{ height: `${height}px` }} className="relative">
            <div className="absolute inset-0 flex items-end justify-between">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center w-full px-1"
                >
                  <div className="relative w-full flex justify-center mb-2">
                    {showValues && (
                      <span className="absolute -top-6 text-xs text-gray-600">
                        {formatValue(item.value)}
                      </span>
                    )}
                    <div
                      className="w-full bg-indigo-100 rounded-t relative overflow-hidden"
                      style={{ height: '100%' }}
                    >
                      <div
                        className="absolute bottom-0 w-full bg-indigo-600 transition-all duration-500"
                        style={{
                          height: getBarHeight(item.value),
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </Card>
  );
};

// Donut chart component
interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  size?: number;
  isLoading?: boolean;
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  size = 200,
  isLoading = false,
  className = '',
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const defaultColors = [
    '#4F46E5', // Indigo
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
  ];

  return (
    <Card className={className}>
      <LoadingOverlay isLoading={isLoading}>
        <div className="p-6">
          {title && (
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
          )}
          <div className="flex flex-col items-center">
            <div style={{ width: size, height: size }} className="relative">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {data.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const angle = (percentage / 100) * 360;
                  const largeArcFlag = angle > 180 ? 1 : 0;
                  
                  // Calculate coordinates for the arc
                  const x1 = 50 + 45 * Math.cos((currentAngle * Math.PI) / 180);
                  const y1 = 50 + 45 * Math.sin((currentAngle * Math.PI) / 180);
                  const x2 = 50 + 45 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
                  const y2 = 50 + 45 * Math.sin(((currentAngle + angle) * Math.PI) / 180);

                  const pathData = `
                    M 50 50
                    L ${x1} ${y1}
                    A 45 45 0 ${largeArcFlag} 1 ${x2} ${y2}
                    Z
                  `;

                  const color = item.color || defaultColors[index % defaultColors.length];
                  currentAngle += angle;

                  return (
                    <path
                      key={index}
                      d={pathData}
                      fill={color}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  );
                })}
                <circle cx="50" cy="50" r="25" fill="white" />
              </svg>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {data.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor:
                        item.color || defaultColors[index % defaultColors.length],
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.label}
                    </p>
                    <p className="text-sm text-gray-500">
                      {((item.value / total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LoadingOverlay>
    </Card>
  );
};

export default Chart;
