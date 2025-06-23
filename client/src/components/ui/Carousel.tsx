'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  showProgress?: boolean;
  infinite?: boolean;
  animation?: 'slide' | 'fade';
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  initialIndex?: number;
  onSlideChange?: (index: number) => void;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = false,
  interval = 5000,
  showArrows = true,
  showDots = true,
  showProgress = false,
  infinite = true,
  animation = 'slide',
  orientation = 'horizontal',
  size = 'md',
  className = '',
  initialIndex = 0,
  onSlideChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: {
      container: 'h-32',
      arrow: 'w-8 h-8 text-sm',
      dot: 'w-2 h-2',
    },
    md: {
      container: 'h-48',
      arrow: 'w-10 h-10 text-base',
      dot: 'w-2.5 h-2.5',
    },
    lg: {
      container: 'h-64',
      arrow: 'w-12 h-12 text-lg',
      dot: 'w-3 h-3',
    },
  };

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex(index);
    onSlideChange?.(index);

    // Reset transition state after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, onSlideChange]);

  const goToNext = useCallback(() => {
    const nextIndex = currentIndex === items.length - 1
      ? (infinite ? 0 : currentIndex)
      : currentIndex + 1;
    goToSlide(nextIndex);
  }, [currentIndex, items.length, infinite, goToSlide]);

  const goToPrev = useCallback(() => {
    const prevIndex = currentIndex === 0
      ? (infinite ? items.length - 1 : currentIndex)
      : currentIndex - 1;
    goToSlide(prevIndex);
  }, [currentIndex, items.length, infinite, goToSlide]);

  // Auto play functionality
  useEffect(() => {
    if (autoPlay && items.length > 1) {
      autoPlayTimerRef.current = setInterval(goToNext, interval);
      return () => {
        if (autoPlayTimerRef.current) {
          clearInterval(autoPlayTimerRef.current);
        }
      };
    }
  }, [autoPlay, interval, items.length, goToNext]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = orientation === 'horizontal'
      ? e.touches[0].clientX
      : e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEnd = orientation === 'horizontal'
      ? e.touches[0].clientX
      : e.touches[0].clientY;
    const diff = touchStartRef.current - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
      touchStartRef.current = 0;
    }
  };

  const renderArrows = () => {
    if (!showArrows) return null;

    return (
      <>
        <button
          onClick={goToPrev}
          disabled={!infinite && currentIndex === 0}
          className={`
            absolute z-10 flex items-center justify-center
            rounded-full bg-white/80 shadow-lg
            ${orientation === 'horizontal'
              ? 'left-4 top-1/2 -translate-y-1/2'
              : 'top-4 left-1/2 -translate-x-1/2 rotate-90'
            }
            ${sizeClasses[size].arrow}
            ${!infinite && currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'}
          `}
        >
          <i className="fas fa-chevron-left" />
        </button>
        <button
          onClick={goToNext}
          disabled={!infinite && currentIndex === items.length - 1}
          className={`
            absolute z-10 flex items-center justify-center
            rounded-full bg-white/80 shadow-lg
            ${orientation === 'horizontal'
              ? 'right-4 top-1/2 -translate-y-1/2'
              : 'bottom-4 left-1/2 -translate-x-1/2 rotate-90'
            }
            ${sizeClasses[size].arrow}
            ${!infinite && currentIndex === items.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'}
          `}
        >
          <i className="fas fa-chevron-right" />
        </button>
      </>
    );
  };

  const renderDots = () => {
    if (!showDots) return null;

    return (
      <div
        className={`
          absolute z-10 flex gap-2
          ${orientation === 'horizontal'
            ? 'bottom-4 left-1/2 -translate-x-1/2'
            : 'right-4 top-1/2 -translate-y-1/2 flex-col'
          }
        `}
      >
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
              rounded-full transition-all
              ${sizeClasses[size].dot}
              ${index === currentIndex
                ? 'bg-white'
                : 'bg-white/50 hover:bg-white/75'
              }
            `}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderProgress = () => {
    if (!showProgress) return null;

    return (
      <div
        className={`
          absolute z-10
          ${orientation === 'horizontal'
            ? 'bottom-0 left-0 right-0 h-1'
            : 'top-0 bottom-0 left-0 w-1'
          }
          bg-white/20
        `}
      >
        <div
          className="absolute bg-white transition-all duration-300"
          style={{
            [orientation === 'horizontal' ? 'width' : 'height']: `${(currentIndex + 1) / items.length * 100}%`,
          }}
        />
      </div>
    );
  };

  return (
    <div
      className={`
        relative overflow-hidden
        ${sizeClasses[size].container}
        ${className}
      `}
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Slides container */}
      <div
        className={`
          relative h-full
          ${animation === 'slide'
            ? 'flex transition-transform duration-300'
            : 'transition-opacity duration-300'
          }
          ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'}
        `}
        style={animation === 'slide' ? {
          transform: orientation === 'horizontal'
            ? `translateX(-${currentIndex * 100}%)`
            : `translateY(-${currentIndex * 100}%)`,
          width: orientation === 'horizontal' ? `${items.length * 100}%` : '100%',
          height: orientation === 'horizontal' ? '100%' : `${items.length * 100}%`,
        } : undefined}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={`
              ${animation === 'slide'
                ? orientation === 'horizontal'
                  ? 'w-full shrink-0'
                  : 'h-full shrink-0'
                : 'absolute inset-0'
              }
              ${animation === 'fade' && index === currentIndex ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {item}
          </div>
        ))}
      </div>

      {renderArrows()}
      {renderDots()}
      {renderProgress()}
    </div>
  );
};

// Thumbnail carousel variant
interface ThumbnailCarouselProps extends Omit<CarouselProps, 'showDots'> {
  thumbnails: React.ReactNode[];
  thumbnailSize?: 'sm' | 'md' | 'lg';
}

export const ThumbnailCarousel: React.FC<ThumbnailCarouselProps> = ({
  items,
  thumbnails,
  thumbnailSize = 'sm',
  onSlideChange,
  ...props
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnailSizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  const handleSlideChange = (index: number) => {
    setSelectedIndex(index);
    onSlideChange?.(index);
  };

  return (
    <div className="space-y-4">
      <Carousel
        {...props}
        items={items}
        showDots={false}
        onSlideChange={handleSlideChange}
      />
      <div className="flex gap-2 overflow-auto pb-2">
        {thumbnails.map((thumbnail, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`
              flex-shrink-0 rounded-lg overflow-hidden
              ${thumbnailSizeClasses[thumbnailSize]}
              ${index === selectedIndex
                ? 'ring-2 ring-indigo-500'
                : 'opacity-50 hover:opacity-75'
              }
            `}
          >
            {thumbnail}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
