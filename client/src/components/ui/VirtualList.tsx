'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  className?: string;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 3,
  onEndReached,
  endReachedThreshold = 0.8,
  className = '',
  loading = false,
  loadingComponent = (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
    </div>
  ),
  emptyComponent = (
    <div className="flex items-center justify-center p-4 text-gray-500">
      No items to display
    </div>
  ),
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentHeight = items.length * itemHeight;

  const visibleItemCount = Math.ceil(height / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + height) / itemHeight) + overscan
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setScrollTop(scrollTop);

    if (
      onEndReached &&
      !loading &&
      scrollTop + clientHeight >= scrollHeight * endReachedThreshold
    ) {
      onEndReached();
    }
  }, [onEndReached, loading, endReachedThreshold]);

  // Reset scroll position when items change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [items]);

  if (items.length === 0 && !loading) {
    return <div className={className}>{emptyComponent}</div>;
  }

  const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
    item,
    index: startIndex + index,
  }));

  return (
    <div
      ref={containerRef}
      className={`overflow-auto relative ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: contentHeight }}
      >
        {visibleItems.map(({ item, index }) => (
          <div
            key={index}
            className="absolute left-0 right-0"
            style={{
              height: itemHeight,
              transform: `translateY(${index * itemHeight}px)`,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {loading && (
        <div className="sticky bottom-0 left-0 right-0 bg-white">
          {loadingComponent}
        </div>
      )}
    </div>
  );
}

// Grid variant
interface VirtualGridProps<T> extends Omit<VirtualListProps<T>, 'itemHeight'> {
  columnCount: number;
  rowHeight: number;
  renderCell: (item: T, index: number) => React.ReactNode;
  gap?: number;
}

export function VirtualGrid<T>({
  items,
  height,
  columnCount,
  rowHeight,
  renderCell,
  gap = 16,
  overscan = 1,
  onEndReached,
  endReachedThreshold = 0.8,
  className = '',
  loading = false,
  loadingComponent,
  emptyComponent,
}: VirtualGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        setContainerWidth(entries[0].contentRect.width);
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const columnWidth = containerWidth
    ? (containerWidth - (columnCount - 1) * gap) / columnCount
    : 0;

  const rowCount = Math.ceil(items.length / columnCount);
  const contentHeight = rowCount * (rowHeight + gap) - gap;

  const visibleRowCount = Math.ceil(height / (rowHeight + gap));
  const startRowIndex = Math.max(0, Math.floor(scrollTop / (rowHeight + gap)) - overscan);
  const endRowIndex = Math.min(
    rowCount,
    Math.ceil((scrollTop + height) / (rowHeight + gap)) + overscan
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    setScrollTop(scrollTop);

    if (
      onEndReached &&
      !loading &&
      scrollTop + clientHeight >= scrollHeight * endReachedThreshold
    ) {
      onEndReached();
    }
  }, [onEndReached, loading, endReachedThreshold]);

  if (items.length === 0 && !loading) {
    return <div className={className}>{emptyComponent}</div>;
  }

  const visibleItems = [];
  for (let rowIndex = startRowIndex; rowIndex < endRowIndex; rowIndex++) {
    for (let colIndex = 0; colIndex < columnCount; colIndex++) {
      const itemIndex = rowIndex * columnCount + colIndex;
      if (itemIndex < items.length) {
        visibleItems.push({
          item: items[itemIndex],
          index: itemIndex,
          position: {
            top: rowIndex * (rowHeight + gap),
            left: colIndex * (columnWidth + gap),
          },
        });
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-auto relative ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: contentHeight }}
      >
        {containerWidth > 0 && visibleItems.map(({ item, index, position }) => (
          <div
            key={index}
            className="absolute"
            style={{
              top: position.top,
              left: position.left,
              width: columnWidth,
              height: rowHeight,
            }}
          >
            {renderCell(item, index)}
          </div>
        ))}
      </div>
      {loading && (
        <div className="sticky bottom-0 left-0 right-0 bg-white">
          {loadingComponent}
        </div>
      )}
    </div>
  );
}

// Infinite scroll variant
interface InfiniteListProps<T> extends Omit<VirtualListProps<T>, 'items' | 'onEndReached' | 'loading' | 'loadingComponent'> {
  items: T[];
  hasMore: boolean;
  loadMore: () => Promise<void>;
  loadingMore?: boolean;
  loadingMoreComponent?: React.ReactNode;
  retryComponent?: React.ReactNode;
}

export function InfiniteList<T>({
  items,
  hasMore,
  loadMore,
  loadingMore = false,
  loadingMoreComponent = (
    <div className="flex items-center justify-center p-4 text-gray-500">
      Loading more items...
    </div>
  ),
  retryComponent = (
    <div className="flex items-center justify-center p-4">
      <button
        onClick={() => loadMore()}
        className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-500"
      >
        Retry
      </button>
    </div>
  ),
  ...props
}: InfiniteListProps<T>) {
  const [error, setError] = useState<Error | null>(null);

  const handleEndReached = useCallback(async () => {
    if (!hasMore || loadingMore || error) return;

    try {
      await loadMore();
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  }, [hasMore, loadingMore, error, loadMore]);

  return (
    <>
      <VirtualList
        {...props}
        items={items}
        onEndReached={handleEndReached}
        loading={loadingMore}
        loadingComponent={loadingMoreComponent}
      />
      {error && retryComponent}
    </>
  );
}

export default VirtualList;
