'use client';

import { useCalendarStore, useAvailabilityStore } from '@/lib/store';
import { format, addDays } from 'date-fns';
import { differenceInCalendarDays } from 'date-fns';
import { useMemo } from 'react';
import { getUnavailabilityInfo } from '@/lib/utils/calendar';

export default function CalendarView() {
    const { startDate, endDate } = useCalendarStore();
    const { weekDays, blockedTimes } = useAvailabilityStore();
    const timeSlots = Array.from({ length: 24 }, (_, i) => i + 9);
    const daysCount = useMemo(() =>
        startDate && endDate
            ? Math.max(1, differenceInCalendarDays(endDate, startDate) + 1)
            : 7, [startDate, endDate]);
    const days = Array.from({ length: daysCount }, (_, i) =>
        addDays(startDate || new Date(), i)
    );

    return (
        <div>
            <div className="relative">
                <div className="absolute top-0 left-0 overflow-hidden bg-white">
                    <div className="flex flex-col sticky">
                        <div className="h-10 min-w-20 p-2 border-b border-gray-300 sticky top-0 left-0 bg-white z-20"></div> {/* Top-left empty cell */}

                        {/* Time rows */}
                        {timeSlots.map((hour) => (
                            <div key={hour} className="flex w-20 h-12">
                                {/* Time column */}
                                <div className="w-20 border-gray-300 border-r text-sm font-medium text-gray-600 flex items-center justify-end -mb-12 sticky left-0 z-20">
                                    {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}&nbsp;&nbsp;&nbsp;
                                    <div className='w-4'>
                                        <svg className="text-gray-600" width="100%" height="1" xmlns="http://www.w3.org/2000/svg">
                                            <line x1="0" y1="1" x2="100%" y2="1" stroke="oklch(87.2% 0.01 258.338)" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Horizontal scroll */}
            <div className='overflow-x-auto'>
                <div className="flex flex-col">
                    {/* Header row */}
                    <div className="flex">
                        {/* Empty first cell */}
                        <div className="min-w-20 w-20 h-10 p-2 border-l border-gray-300 top-0 left-0 bg-white -z-10"></div>

                        {days.map((day, index) => (
                            <div
                                key={index}
                                className="h-10 min-w-42 p-2 border-b border-r border-gray-300 text-center flex-1 text-black sticky top-0 bg-white z-10"
                            >
                                {format(day, 'EEE dd').toUpperCase()}
                            </div>
                        ))}
                    </div>


                    {/* Time rows */}
                    {timeSlots.map((hour) => (
                        <div key={hour} className="flex">
                            {/* Empty time column same size as first column to leave space (offset) */}
                            <div className="min-w-20 w-20 h-12 p-2 border-l border-gray-300 sticky top-0 left-0 bg-white -z-10"></div>

                            {/* Day cells */}
                            {days.map((day, dayIndex) => {
                                const unavailabilityInfo = getUnavailabilityInfo(day, hour-1, weekDays, blockedTimes);
                                const colorClass = 'bg-white';

                                return (
                                    <div
                                        key={`${hour}-${dayIndex}`}
                                        className={`min-w-42 h-12 p-1 border-b border-r border-gray-300 flex-1 ${colorClass} relative`}
                                    >
                                        {/* Gray overlay for unavailable time */}
                                        {unavailabilityInfo.percentage > 0 && (
                                            <div 
                                                className={`absolute inset-x-0 top-0 bg-gray-300 opacity-60 ${
                                                    (unavailabilityInfo.hasBreakTime || unavailabilityInfo.hasBlockedTime) 
                                                        ? 'diagonal-lines' 
                                                        : ''
                                                }`}
                                                style={{ 
                                                    height: `${unavailabilityInfo.percentage}%`,
                                                    width: '100%',
                                                    ...(unavailabilityInfo.hasBreakTime || unavailabilityInfo.hasBlockedTime) && {
                                                        backgroundImage: `repeating-linear-gradient(
                                                            135deg,
                                                            transparent,
                                                            transparent 6px,
                                                            rgba(0, 0, 0, 0.3) 8px,
                                                            rgba(0, 0, 0, 0.3) 9px
                                                        )`
                                                    }
                                                }}
                                            />
                                        )}
                                        {/* Cell content can go here */}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}