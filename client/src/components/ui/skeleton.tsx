'use client';

import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200';
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave',
    none: '',
  };

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
  };

  const styles: React.CSSProperties = {
    width: width,
    height: height,
  };

  if (variant === 'text' && !height) {
    styles.height = '1em';
  }

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={styles}
    />
  );
};

// Text skeleton with multiple lines
interface TextSkeletonProps {
  lines?: number;
  spacing?: number;
  lastLineWidth?: string | number;
  className?: string;
  animation?: SkeletonProps['animation'];
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({
  lines = 3,
  spacing = 0.5,
  lastLineWidth = '75%',
  className = '',
  animation = 'pulse',
}) => {
  return (
    <div className={`space-y-${spacing} ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          animation={animation}
          width={index === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
};

// Card skeleton for content placeholders
interface CardSkeletonProps {
  header?: boolean;
  lines?: number;
  className?: string;
  animation?: SkeletonProps['animation'];
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  header = true,
  lines = 3,
  className = '',
  animation = 'pulse',
}) => {
  return (
    <div className={`rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {header && (
        <div className="p-4 border-b border-gray-200">
          <Skeleton
            width="40%"
            height={24}
            animation={animation}
          />
        </div>
      )}
      <div className="p-4 space-y-4">
        <TextSkeleton
          lines={lines}
          animation={animation}
        />
      </div>
    </div>
  );
};

// List skeleton for repeating items
interface ListSkeletonProps {
  count?: number;
  itemHeight?: number;
  className?: string;
  animation?: SkeletonProps['animation'];
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  count = 5,
  itemHeight = 60,
  className = '',
  animation = 'pulse',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={itemHeight}
          animation={animation}
          className="rounded"
        />
      ))}
    </div>
  );
};

// Avatar skeleton
interface AvatarSkeletonProps {
  size?: number;
  className?: string;
  animation?: SkeletonProps['animation'];
}

export const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({
  size = 40,
  className = '',
  animation = 'pulse',
}) => {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      animation={animation}
      className={className}
    />
  );
};

// Table skeleton
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
  animation?: SkeletonProps['animation'];
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className = '',
  animation = 'pulse',
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="grid grid-cols-{columns} gap-4 p-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton
              key={index}
              height={24}
              animation={animation}
            />
          ))}
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid grid-cols-{columns} gap-4 p-4 border-b border-gray-200"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              height={20}
              animation={animation}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
