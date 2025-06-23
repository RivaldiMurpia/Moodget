'use client';

import React, { useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  color?: string;
  description?: string;
}

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  disabled?: boolean;
  disabledDates?: Date[];
  highlightToday?: boolean;
  weekStartsOn?: 0 | 1; // 0 for Sunday, 1 for Monday
  locale?: string;
  showAdjacentDays?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  value = new Date(),
  onChange,
  events = [],
  onEventClick,
  minDate,
  maxDate,
  className = '',
  disabled = false,
  disabledDates = [],
  highlightToday = true,
  weekStartsOn = 0,
  locale = 'en-US',
  showAdjacentDays = true,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(value));

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  };

  const getWeekDays = (): string[] => {
    const weekDays = [];
    const date = new Date(2021, 0, weekStartsOn + 3); // Use a date that starts with Sunday
    
    for (let i = 0; i < 7; i++) {
      weekDays.push(
        new Intl.DateTimeFormat(locale, { weekday: 'short' })
          .format(date)
          .slice(0, 2)
      );
      date.setDate(date.getDate() + 1);
    }
    
    return weekDays;
  };

  const getPreviousMonthDays = (date: Date): Date[] => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDay.getDay();
    const daysFromPreviousMonth = (dayOfWeek - weekStartsOn + 7) % 7;

    if (!showAdjacentDays || daysFromPreviousMonth === 0) return [];

    const previousMonth = new Date(date.getFullYear(), date.getMonth() - 1);
    const daysInPreviousMonth = new Date(
      previousMonth.getFullYear(),
      previousMonth.getMonth() + 1,
      0
    ).getDate();

    return Array.from({ length: daysFromPreviousMonth }, (_, i) => 
      new Date(
        previousMonth.getFullYear(),
        previousMonth.getMonth(),
        daysInPreviousMonth - daysFromPreviousMonth + i + 1
      )
    );
  };

  const getNextMonthDays = (date: Date, daysInCurrentMonth: number): Date[] => {
    const lastDay = new Date(date.getFullYear(), date.getMonth(), daysInCurrentMonth);
    const remainingDays = (7 - lastDay.getDay() + weekStartsOn - 1) % 7;

    if (!showAdjacentDays || remainingDays === 6) return [];

    return Array.from({ length: remainingDays }, (_, i) =>
      new Date(date.getFullYear(), date.getMonth() + 1, i + 1)
    );
  };

  const isDateDisabled = (date: Date): boolean => {
    if (disabled) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some((disabledDate) =>
      date.toDateString() === disabledDate.toDateString()
    );
  };

  const isToday = (date: Date): boolean => {
    return date.toDateString() === new Date().toDateString();
  };

  const isSelected = (date: Date): boolean => {
    return date.toDateString() === value.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      onChange?.(date);
    }
  };

  const handleMonthChange = (increment: number) => {
    setCurrentMonth(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + increment,
      1
    ));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const previousMonthDays = getPreviousMonthDays(currentMonth);
  const nextMonthDays = getNextMonthDays(currentMonth, daysInMonth.length);
  const allDays = [...previousMonthDays, ...daysInMonth, ...nextMonthDays];
  const weekDays = getWeekDays();

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => handleMonthChange(-1)}
          disabled={disabled}
          className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          {new Intl.DateTimeFormat(locale, {
            month: 'long',
            year: 'numeric',
          }).format(currentMonth)}
        </h2>
        <button
          onClick={() => handleMonthChange(1)}
          disabled={disabled}
          className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Week days */}
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {allDays.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isDisabled = isDateDisabled(date);
          const isTodayDate = isToday(date);
          const isSelectedDate = isSelected(date);
          const isCurrentMonthDate = isCurrentMonth(date);

          return (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              className={`
                relative p-2 text-center cursor-pointer
                ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}
                ${!isCurrentMonthDate ? 'text-gray-400' : ''}
                ${
                  isSelectedDate
                    ? 'bg-indigo-600 text-white rounded-lg'
                    : isTodayDate && highlightToday
                    ? 'bg-indigo-50 text-indigo-600 rounded-lg'
                    : 'hover:bg-gray-100 rounded-lg'
                }
              `}
            >
              <span className="text-sm">
                {date.getDate()}
              </span>

              {/* Events */}
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                        className={`
                          w-1.5 h-1.5 rounded-full
                          ${event.color || 'bg-indigo-600'}
                        `}
                        title={event.title}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Mini calendar variant
interface MiniCalendarProps extends Omit<CalendarProps, 'events' | 'onEventClick'> {}

export const MiniCalendar: React.FC<MiniCalendarProps> = (props) => {
  return (
    <Calendar
      {...props}
      className="w-64"
      showAdjacentDays={false}
    />
  );
};

// Event calendar variant
interface EventCalendarProps extends CalendarProps {
  onEventAdd?: (date: Date) => void;
  onEventDelete?: (event: CalendarEvent) => void;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({
  events = [],
  onEventClick,
  onEventAdd,
  onEventDelete,
  ...props
}) => {
  return (
    <div className="space-y-4">
      <Calendar
        {...props}
        events={events}
        onEventClick={onEventClick}
      />
      {onEventAdd && (
        <button
          onClick={() => onEventAdd(props.value || new Date())}
          className="
            w-full px-4 py-2 text-sm font-medium text-white
            bg-indigo-600 hover:bg-indigo-700 rounded-md
          "
        >
          Add Event
        </button>
      )}
    </div>
  );
};

export default Calendar;
