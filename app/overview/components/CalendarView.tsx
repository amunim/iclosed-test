'use client';

import { useCalendarStore } from '@/lib/store';
import { format, addDays, startOfDay, setHours } from 'date-fns';
import { differenceInCalendarDays } from 'date-fns';
import { useMemo } from 'react';

// Function to determine cell color based on time range
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCellColor(start: Date, end: Date): string {
    // Sample logic - you can modify this based on your requirements
    const hour = start.getHours();
    const dayOfWeek = start.getDay();

    // You can use 'end' parameter for duration-based logic if needed
    // const duration = end.getTime() - start.getTime();

    // Example: weekends are gray, business hours (9-17) are white, others are gray
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return 'bg-gray-200';
    }
    if (hour >= 9 && hour < 17) {
        return 'bg-white';
    }
    return 'bg-gray-100';
}

export default function CalendarView() {
    const { startDate, endDate } = useCalendarStore();
    const timeSlots = Array.from({ length: 13 }, (_, i) => i + 9);
    const daysCount = useMemo(() =>
        startDate && endDate
            ? Math.max(1, differenceInCalendarDays(endDate, startDate) + 1)
            : 7, [startDate, endDate]);
    const days = Array.from({ length: daysCount }, (_, i) =>
        addDays(startDate || new Date(), i)
    );

    return (
        <div className='overflow-scroll w-full max-w-full'>
            <div className="flex flex-col max-h-full max-w-full">
                {/* Header row */}
                <div className="flex">
                    <div className="min-w-20 p-2 border-b border-gray-300"></div> {/* Empty cell for time column */}

                    {days.map((day, index) => (
                        <div
                            key={index}
                            className="min-w-42 p-2 border-b border-r border-gray-300 text-center flex-1 text-black"
                        >
                            {format(day, 'EEE dd').toUpperCase()}
                        </div>
                    ))}
                </div>

                {/* Time rows */}
                {timeSlots.map((hour) => (
                    <div key={hour} className="flex">
                        {/* Time column */}
                        <div className="min-w-20 border-gray-300 border-x text-sm font-medium text-gray-600 flex items-center justify-end -mb-12">
                            {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}&nbsp;&nbsp;&nbsp;
                            <div className='w-4'>
                                <svg className="text-gray-600" width="100%" height="1" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="0" y1="1" x2="100%" y2="1" stroke="oklch(87.2% 0.01 258.338)" strokeWidth="2" />
                                </svg>
                            </div>

                        </div>

                        {/* Day cells */}
                        {days.map((day, dayIndex) => {
                            const cellStart = setHours(startOfDay(day), hour);
                            const cellEnd = setHours(startOfDay(day), hour + 1);
                            const colorClass = getCellColor(cellStart, cellEnd);

                            return (
                                <div
                                    key={`${hour}-${dayIndex}`}
                                    className={`min-w-42 h-12 p-1 border-b border-r border-gray-300 flex-1 ${colorClass}`}
                                >
                                    {/* Cell content can go here */}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}