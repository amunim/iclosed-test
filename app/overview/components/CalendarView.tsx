'use client';

import { useCalendarStore, useAvailabilityStore, useEventsStore } from '@/lib/store';
import { format, addDays } from 'date-fns';
import { differenceInCalendarDays } from 'date-fns';
import { useMemo, useRef, useState, useEffect } from 'react';
import { getUnavailabilityInfo } from '@/lib/utils/calendar';
import { getEventsInSlot, isValidDropTarget, rescheduleEvent, convertEventToTimezone } from '@/lib/utils/events';
import { EventCard } from '@/components/EventCard';
import { DragGhost } from '@/components/DragGhost';
import { useDraggable } from "react-use-draggable-scroll";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useStickyRowSync } from '@/lib/hooks/useStickyRowSync';
import { useDragAndDrop } from '@/lib/hooks/useDragAndDrop';
import type { Event } from '@/lib/utils/events';

export default function CalendarView() {
    const { startDate, endDate, timezone } = useCalendarStore();
    const { weekDays, blockedTimes } = useAvailabilityStore();
    const { events, updateEvent } = useEventsStore();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    const horizontalScrollRef = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
    const stickyRowRefHeader = useStickyRowSync({
        horizontalScrollRef: horizontalScrollRef,
    });
    const stickyRowRefFooter = useStickyRowSync({
        horizontalScrollRef: horizontalScrollRef,
    });
    const { events: dragEvents } = useDraggable(horizontalScrollRef);
    
    const {
        dragState,
        startDrag,
        updateDropTarget,
        endDrag,
        calculateQuarterFromPosition
    } = useDragAndDrop();

    // Mouse tracking for drag ghost
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseUp = () => {
            if (dragState.isDragging) {
                const result = endDrag();
                if (result.dragData && result.dropTarget && result.dropTarget.isValid) {
                    // Reschedule the event with proper timezone handling
                    const rescheduledEvent = rescheduleEvent(
                        result.dragData.event,
                        result.dropTarget.day,
                        result.dropTarget.hour,
                        result.dropTarget.quarter,
                        timezone
                    );
                    
                    updateEvent(result.dragData.event.id, rescheduledEvent);
                }
            }
        };

        if (dragState.isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragState.isDragging, endDrag, updateEvent, timezone]);

    // Handle drag start
    const handleDragStart = (event: Event, element: HTMLElement, clientX: number, clientY: number) => {
        // Convert the event to display timezone to get the correct day and hour
        const convertedEvent = convertEventToTimezone(event, timezone);
        const eventDay = new Date(convertedEvent.time.from);
        eventDay.setHours(0, 0, 0, 0);
        const eventHour = convertedEvent.time.from.getHours();
        
        startDrag(event, { day: eventDay, hour: eventHour }, element, clientX, clientY);
    };

    // Handle cell mouse enter for drop target feedback
    const handleCellMouseEnter = (day: Date, hour: number, cellElement: HTMLElement, clientY: number) => {
        if (dragState.isDragging && dragState.dragData) {
            const quarter = calculateQuarterFromPosition(cellElement, clientY);
            const eventDuration = (dragState.dragData.event.time.to.getTime() - dragState.dragData.event.time.from.getTime()) / (1000 * 60);
            
            const isValid = isValidDropTarget(
                day,
                hour,
                quarter,
                eventDuration,
                weekDays,
                blockedTimes,
                events,
                timezone,
                dragState.dragData.event.id
            );

            updateDropTarget({
                day,
                hour,
                quarter,
                isValid
            });
        }
    };

    // Handle cell mouse move for continuous quarter position updates
    const handleCellMouseMove = (day: Date, hour: number, cellElement: HTMLElement, clientY: number) => {
        if (dragState.isDragging && dragState.dragData) {
            const quarter = calculateQuarterFromPosition(cellElement, clientY);
            const eventDuration = (dragState.dragData.event.time.to.getTime() - dragState.dragData.event.time.from.getTime()) / (1000 * 60);
            
            const isValid = isValidDropTarget(
                day,
                hour,
                quarter,
                eventDuration,
                weekDays,
                blockedTimes,
                events,
                timezone,
                dragState.dragData.event.id
            );

            // Only update if the quarter position or validity has changed
            if (!dragState.dropTarget || 
                dragState.dropTarget.quarter !== quarter || 
                dragState.dropTarget.isValid !== isValid ||
                format(dragState.dropTarget.day, 'yyyy-MM-dd') !== format(day, 'yyyy-MM-dd') ||
                dragState.dropTarget.hour !== hour) {
                updateDropTarget({
                    day,
                    hour,
                    quarter,
                    isValid
                });
            }
        }
    };

    const handleCellMouseLeave = () => {
        if (dragState.isDragging) {
            updateDropTarget(null);
        }
    };
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

    // Calculate available slots for each day
    const calculateAvailableSlots = (day: Date): number => {
        let availableSlots = 0;
        
        // Get the day of week (0 = Sunday, 1 = Monday, etc.)
        const dayOfWeek = day.getDay();
        
        // Find availability for this specific day
        const dayAvailability = weekDays.find(wd => wd.day === dayOfWeek);
        
        // If no availability defined for this day, return 0
        if (!dayAvailability) {
            return 0;
        }
        
        // Get the available hours from the day's availability
        const startHour = dayAvailability.availability.from.getHours();
        const endHour = dayAvailability.availability.to.getHours();
        
        // Check each hour slot within the day's availability
        for (let hour = startHour; hour < endHour; hour++) {
            const unavailabilityInfo = getUnavailabilityInfo(day, hour, weekDays, blockedTimes);
            const eventsInSlot = getEventsInSlot(events, day, hour, timezone);
            
            // If slot is fully unavailable due to working hours/breaks/blocks, skip it
            if (unavailabilityInfo.percentage >= 100) continue;
            
            // Check if there are any 'busy' events in this slot
            const hasBusyEvent = eventsInSlot.some(eventInfo => eventInfo.event.status === 'busy');
            
            // If no busy events, this slot is available
            // (available events don't block the slot)
            if (!hasBusyEvent) {
                availableSlots++;
            }
        }
        
        return availableSlots;
    };

    return (
        <div className='sticky top-0 z-20'>
            <div className="absolute top-0">
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
                ref={horizontalScrollRef}
                {...dragEvents}>
                <div className="flex flex-col">
                    {/* Header row */}
                    <div className="flex fixed z-10 top-[66px]" ref={stickyRowRefHeader}>
                        {/* Empty first cell */}
                        <div className="min-w-20 w-20 h-12 p-2 border-l border-b border-gray-300 top-0 left-0 bg-white -z-10"></div>

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

                    {/* pt-12 accounting for the fixed header row */}
                    <div className="pt-12">
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
                                    
                                    // Check if this cell is a valid drop target
                                    const isDropTarget = dragState.dropTarget && 
                                        format(dragState.dropTarget.day, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
                                        dragState.dropTarget.hour === hour - 1;
                                    
                                    const dropTargetClass = isDropTarget 
                                        ? (dragState.dropTarget?.isValid ? 'border-green-400 border-2 bg-green-50' : 'border-red-400 border-2 bg-red-50')
                                        : '';

                                    return (
                                        <div
                                            key={`${hour}-${dayIndex}`}
                                            className={`min-w-42 h-16 p-1 pl-0 border-b border-r border-gray-300 flex-1 ${colorClass} relative z-0 ${dropTargetClass}`}
                                            onMouseEnter={(e) => handleCellMouseEnter(day, hour - 1, e.currentTarget, e.clientY)}
                                            onMouseMove={(e) => handleCellMouseMove(day, hour - 1, e.currentTarget, e.clientY)}
                                            onMouseLeave={handleCellMouseLeave}
                                            style={{
                                                cursor: dragState.isDragging 
                                                    ? (isDropTarget && dragState.dropTarget?.isValid ? 'copy' : 'not-allowed')
                                                    : 'default'
                                            }}
                                        >
                                            {/* Quarter line indicator for drag and drop */}
                                            {isDropTarget && dragState.isDragging && dragState.dropTarget && (
                                                <div
                                                    className="absolute left-0 right-0 z-30 flex items-center"
                                                    style={{
                                                        top: `${(dragState.dropTarget.quarter / 4) * 100}%`,
                                                        transform: 'translateY(-50%)'
                                                    }}
                                                >
                                                    <div className="flex-1 flex items-center">
                                                        <div 
                                                            className={`w-2 h-2 rounded-full ${dragState.dropTarget.isValid ? 'bg-green-500' : 'bg-red-500'}`}
                                                        />
                                                        <div 
                                                            className={`flex-1 h-0.5 ${dragState.dropTarget.isValid ? 'bg-green-500' : 'bg-red-500'}`}
                                                        />
                                                        <div 
                                                            className={`w-2 h-2 rounded-full ${dragState.dropTarget.isValid ? 'bg-green-500' : 'bg-red-500'}`}
                                                        />
                                                    </div>
                                                </div>
                                            )}
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

                                                // Calculate minute offset within the hour for precise positioning
                                                const convertedEvent = convertEventToTimezone(eventInfo.event, timezone);
                                                const slotStart = new Date(day);
                                                slotStart.setHours(hour - 1, 0, 0, 0);
                                                
                                                // Calculate the minute offset from the start of the hour slot
                                                const eventStartMinutes = convertedEvent.time.from.getMinutes();
                                                const minuteOffset = (eventStartMinutes / 60) * 100; // Convert to percentage
                                                
                                                const availableHeight = 100 - unavailabilityInfo.percentage;
                                                const eventHeight = (eventInfo.heightPercentage / 100) * availableHeight;
                                                const showText = eventInfo.position === 'start' || eventInfo.position === 'full';
                                                
                                                // Apply minute offset only if the event starts in this slot
                                                const shouldApplyMinuteOffset = eventInfo.position === 'start' || eventInfo.position === 'full';
                                                const finalTopOffset = shouldApplyMinuteOffset 
                                                    ? topOffset + (minuteOffset * availableHeight / 100)
                                                    : topOffset + (showText ? 0 : -1);
                                                
                                                if (topOffset == 100)
                                                    return null;

                                                return (
                                                    <div
                                                        key={`${eventInfo.event.id}-${eventIndex}`}
                                                        className="absolute inset-x-1 z-10"
                                                        style={{
                                                            top: finalTopOffset + '%',
                                                            height: `${eventHeight}%`,
                                                            left: 0,
                                                            borderTopLeftRadius: eventInfo.position === 'start' || eventInfo.position === 'full' ? '6px' : '0',
                                                            borderTopRightRadius: eventInfo.position === 'start' || eventInfo.position === 'full' ? '6px' : '0',
                                                            borderBottomLeftRadius: eventInfo.position === 'end' || eventInfo.position === 'full' ? '6px' : '0',
                                                            borderBottomRightRadius: eventInfo.position === 'end' || eventInfo.position === 'full' ? '6px' : '0',
                                                        }}
                                                    >
                                                        <EventCard 
                                                            event={eventInfo.event} 
                                                            showText={showText}
                                                            isDragging={dragState.isDragging && dragState.dragData?.event.id === eventInfo.event.id}
                                                            onDragStart={handleDragStart}
                                                            day={day}
                                                            hour={hour - 1}
                                                        />
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

                    {/* Header row */}
                    <div className="flex fixed z-10 bottom-0" ref={stickyRowRefFooter}>
                        {/* Empty first cell */}
                        <div className="min-w-20 w-20 h-8 p-2 border-l border-t border-gray-300 top-0 left-0 bg-white -z-10"></div>

                        {days.map((day, index) => {
                            const availableSlots = calculateAvailableSlots(day);
                            return (
                                <div
                                    key={index}
                                    className={`h-8 min-w-42 p-2 border-b border-r border-gray-300 text-center flex-1 top-0 bg-white z-10`}
                                >
                                    <span className='text-muted-foreground'>Available slots: </span>
                                    <span className='font-semibold'>{availableSlots}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Drag ghost */}
            {dragState.isDragging && dragState.dragData && (
                <DragGhost 
                    event={dragState.dragData.event}
                    position={mousePosition}
                />
            )}
        </div>
    );
}