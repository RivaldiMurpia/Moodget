'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import { LoadingOverlay } from '@/components/ui/LoadingSpinner';

interface StatTrendProps {
  value: number;
  trend: 'up' | 'down' | 'neutral';
  percentage?: boolean;
}

const StatTrend: React.FC<StatTrendProps> = ({ value, trend, percentage = true }) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const trendIcons = {
    up: <i className="fas fa-arrow-up mr-1"></i>,
    down: <i className="fas fa-arrow-down mr-1"></i>,
    neutral: <i className="fas fa-minus mr-1"></i>,
  };

  return (
    <span className={`inline-flex items-center text-sm ${trendColors[trend]}`}>
      {trendIcons[trend]}
      {value.toFixed(1)}
      {percentage && '%'}
    </span>
  );
};

interface StatsCardProps {
  title: string;
  value: number | string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  subtitle?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  isCurrency?: boolean;
  onClick?: () => void;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  trend,
  subtitle,
  icon,
  isLoading = false,
  isCurrency = true,
  onClick,
  className = '',
}) => {
  const formattedValue = isCurrency
    ? typeof value === 'number'
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value)
      : value
    : value;

  return (
    <Card className={className}>
      <div
        className={onClick ? 'cursor-pointer hover:opacity-75 transition-opacity' : ''}
        onClick={onClick}
      >
        <LoadingOverlay isLoading={isLoading}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {formattedValue}
                </p>
                {(trend || subtitle) && (
                  <p className="mt-1">
                    {trend && (
                      <StatTrend
                        value={trend.value}
                        trend={trend.direction}
                      />
                    )}
                    {subtitle && (
                      <span className="text-sm text-gray-500 ml-1">
                        {subtitle}
                      </span>
                    )}
                  </p>
                )}
              </div>
              {icon && (
                <div className="p-3 bg-indigo-50 rounded-full">
                  {icon}
                </div>
              )}
            </div>
          </div>
        </LoadingOverlay>
      </div>
    </Card>
  );
};

// Stats grid component for displaying multiple stats
interface StatsGridProps {
  stats: Array<StatsCardProps>;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  stats,
  columns = 4,
  className = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-4 ${gridCols[columns]} ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

// Compact stats list for sidebar or small spaces
interface CompactStatsListProps {
  stats: Array<{
    label: string;
    value: string | number;
    trend?: {
      value: number;
      direction: 'up' | 'down' | 'neutral';
    };
  }>;
  className?: string;
}

export const CompactStatsList: React.FC<CompactStatsListProps> = ({
  stats,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{stat.label}</span>
          <div className="text-right">
            <span className="block text-sm font-medium text-gray-900">
              {typeof stat.value === 'number'
                ? new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(stat.value)
                : stat.value}
            </span>
            {stat.trend && (
              <StatTrend
                value={stat.trend.value}
                trend={stat.trend.direction}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
