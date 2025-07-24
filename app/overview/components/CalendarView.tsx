'use client';

import { useCalendarStore, useAvailabilityStore, useEventsStore } from '@/lib/store';
import { format, addDays } from 'date-fns';
import { differenceInCalendarDays } from 'date-fns';
import { useMemo, useRef } from 'react';
import { getUnavailabilityInfo } from '@/lib/utils/calendar';
import { getEventsInSlot } from '@/lib/utils/events';
import { EventCard } from '@/components/EventCard';
import { useDraggable } from "react-use-draggable-scroll";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function CalendarView() {
    const { startDate, endDate, timezone } = useCalendarStore();
    const { weekDays, blockedTimes } = useAvailabilityStore();
    console.table(weekDays);
    const ref = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
    const { events: dragEvents } = useDraggable(ref);

    const { events } = useEventsStore();
    const timeSlots = useMemo(() => Array.from({ length: 24 }, (_, i) => i + 9), []);
    const daysCount = useMemo(() =>
        startDate && endDate
            ? Math.max(1, differenceInCalendarDays(endDate, startDate) + 1)
            : 7, [startDate, endDate]);
    const days = Array.from({ length: daysCount }, (_, i) =>
        addDays(startDate || new Date(), i)
    );

    // Current time indicator logic
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimePercentage = (currentMinutes / 60) * 100; // Percentage of the hour passed
    const todayIndex = days.findIndex(day =>
        format(day, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')
    );
    const shouldShowCurrentTimeIndicator = todayIndex !== -1 && currentHour >= 9 && currentHour < 33;

    return (
        <div>
            <div className="relative">
                <div className="absolute top-0 left-0 overflow-hidden bg-white z-20">
                    <div className="flex flex-col sticky">
                        <div className="h-12 min-w-20 p-2 border-b border-gray-300 sticky top-0 left-0 bg-white z-20"></div> {/* Top-left empty cell */}

                        {/* Time rows */}
                        {timeSlots.map((hour) => (
                            <div key={hour} className="flex w-20 h-16">
                                {/* Time column */}
                                <div className="w-20 border-gray-300 border-r text-sm font-medium text-gray-600 flex items-center justify-end -mb-16 sticky left-0 z-20">
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
            <div className='overflow-x-auto scrollbar-hide'
                ref={ref}
                {...dragEvents}>
                <div className="flex flex-col">
                    {/* Header row */}
                    <div className="flex">
                        {/* Empty first cell */}
                        <div className="min-w-20 w-20 h-12 p-2 border-l border-gray-300 top-0 left-0 bg-white -z-10"></div>

                        {days.map((day, index) => {
                            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                            const dayText = format(day, 'EEE dd').toUpperCase();
                            const [dayName, dayNumber] = dayText.split(' ');

                            return (
                                <div
                                    key={index}
                                    className={`h-12 min-w-42 p-2 border-b border-r border-gray-300 text-center flex-1 top-0 bg-white z-10 ${isToday ? 'text-blue-600' : 'text-black'}`}
                                >
                                    {dayName} {isToday ? (
                                        <span className="bg-blue-100 rounded-full py-1 px-2 inline-block">
                                            {dayNumber}
                                        </span>
                                    ) : dayNumber}
                                </div>
                            );
                        })}
                    </div>


                    {/* Time rows */}
                    {timeSlots.map((hour) => (
                        <div key={hour} className="flex">
                            {/* Empty time column same size as first column to leave space (offset) */}
                            <div className="min-w-20 w-20 h-12 p-2 border-l border-gray-300 sticky top-0 left-0 bg-white -z-10"></div>

                            {/* Day cells */}
                            {days.map((day, dayIndex) => {
                                const unavailabilityInfo = getUnavailabilityInfo(day, hour - 1, weekDays, blockedTimes);
                                const colorClass = 'bg-white';
                                const eventsInSlot = getEventsInSlot(events, day, hour - 1, timezone);
                                const dayText = format(day, 'eee, do');

                                return (
                                    <div
                                        key={`${hour}-${dayIndex}`}
                                        className={`min-w-42 h-16 p-1 pl-0 border-b border-r border-gray-300 flex-1 ${colorClass} relative z-0`}
                                    >
                                        {/* Gray overlay for unavailable time */}
                                        {unavailabilityInfo.percentage > 0 && (

                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={`absolute inset-x-0 top-0 bg-gray-300 opacity-60 -z-10 ${(unavailabilityInfo.hasBreakTime || unavailabilityInfo.hasBlockedTime)
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
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    align="end"
                                                    side='bottom'
                                                    hideWhenDetached
                                                    className='bg-gray-900 no-arrow text-md'
                                                    style={{
                                                        padding: "4px 8px",
                                                        borderRadius: 8,
                                                        boxShadow: "1px 1px 3px #888",
                                                    }}
                                                >
                                                    {!unavailabilityInfo.hasBreakTime && !unavailabilityInfo.hasBlockedTime && <>
                                                        {dayText} availability: <br /> {`${weekDays.findIndex(wd => wd.day === day.getDay()) !== -1 ? (format(weekDays.filter(wd => wd.day === day.getDay())?.[0]?.availability.from, 'hh a') + ' - ' + format(weekDays.filter(wd => wd.day === day.getDay())?.[0]?.availability.to, 'hh a')) : ' - '}`}
                                                    </>}
                                                    {unavailabilityInfo.hasBreakTime && unavailabilityInfo.breakTimes && <>
                                                        {unavailabilityInfo.breakTimes.map((breakTime, index) => (
                                                            <div key={index}>
                                                                Break Time: <br />
                                                                {format(breakTime.from, 'h a')} - {format(breakTime.to, 'h a')}
                                                                {index < unavailabilityInfo.breakTimes!.length - 1 && <br />}
                                                            </div>
                                                        ))}
                                                    </>}
                                                    {unavailabilityInfo.hasBlockedTime && unavailabilityInfo.blockedTimes && <>
                                                        {unavailabilityInfo.blockedTimes.map((blockedTime, index) => (
                                                            <div key={index}>
                                                                Blocked Time: <br />
                                                                {format(blockedTime.from, 'h a')} - {format(blockedTime.to, 'h a')}
                                                                {index < unavailabilityInfo.blockedTimes!.length - 1 && <br />}
                                                            </div>
                                                        ))}
                                                    </>}
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                        {/* Event cards */}
                                        {eventsInSlot.map((eventInfo, eventIndex) => {
                                            const topOffset = unavailabilityInfo.percentage > 0
                                                ? unavailabilityInfo.percentage
                                                : 0;

                                            const availableHeight = 100 - unavailabilityInfo.percentage;
                                            const eventHeight = (eventInfo.heightPercentage / 100) * availableHeight;
                                            const showText = eventInfo.position === 'start' || eventInfo.position === 'full';
                                            if (topOffset == 100)
                                                return null;

                                            return (
                                                <div
                                                    key={`${eventInfo.event.id}-${eventIndex}`}
                                                    className="absolute inset-x-1 z-10"
                                                    style={{
                                                        top: (topOffset + (showText ? 0 : -1)) + '%',
                                                        height: `${eventHeight}%`,
                                                        left: 0,
                                                        borderTopLeftRadius: eventInfo.position === 'start' || eventInfo.position === 'full' ? '6px' : '0',
                                                        borderTopRightRadius: eventInfo.position === 'start' || eventInfo.position === 'full' ? '6px' : '0',
                                                        borderBottomLeftRadius: eventInfo.position === 'end' || eventInfo.position === 'full' ? '6px' : '0',
                                                        borderBottomRightRadius: eventInfo.position === 'end' || eventInfo.position === 'full' ? '6px' : '0',
                                                    }}
                                                >
                                                    <EventCard event={eventInfo.event} showText={showText} />
                                                </div>
                                            );
                                        })}

                                        {/* Current time indicator */}
                                        {shouldShowCurrentTimeIndicator &&
                                            dayIndex === todayIndex &&
                                            hour === (currentHour + 1) && (
                                                <div
                                                    className="absolute z-20"
                                                    style={{
                                                        top: `${currentTimePercentage}%`,
                                                        left: 0,
                                                        right: 0,
                                                        transform: 'translateY(-50%)'
                                                    }}
                                                >
                                                    <svg width="132" height="8" viewBox="0 0 132 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="4" cy="4" r="4" fill="#E02424" />
                                                        <path d="M8 4H131" stroke="#E02424" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                </div>
                                            )}
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