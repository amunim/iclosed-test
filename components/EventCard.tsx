import React, { useState, useRef } from 'react';
import { Event } from '@/lib/utils/events';
import { darkenColor } from '@/lib/utils/events';
import { format } from 'date-fns';
import Image from 'next/image';
import { Popover } from './ui/popover';
import { PopoverContent, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover';
import { EventPopover } from './EventPopover';

interface EventCardProps {
    event: Event;
    showText?: boolean;
    isDragging?: boolean;
    onDragStart?: (event: Event, element: HTMLElement, clientX: number, clientY: number) => void;
    day?: Date;
    hour?: number;
}

export const EventCard = ({ 
    event, 
    showText = true, 
    isDragging = false, 
    onDragStart,
    day,
    hour
}: EventCardProps) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const { title, time, meetingLink, color } = event;

    const formatTime = (date: Date) => format(date, 'h:mm a');

    const backgroundColor = meetingLink ? '#f1f3f4' : color;
    const borderLeftColor = meetingLink ? '#dadce0' : darkenColor(color, 0.2);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        console.log('EventCard mouseDown triggered', { hasOnDragStart: !!onDragStart, day, hour });
        if (onDragStart && cardRef.current && day && hour !== undefined) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Starting drag for event:', event.title);
            onDragStart(event, cardRef.current, e.clientX, e.clientY);
        }
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only allow popover to open if not dragging
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    return (
        <div
            ref={cardRef}
            className={`event-card w-full h-full overflow-hidden flex items-start px-2 py-1 box-border rounded-[inherit] z-10 ${
                isDragging ? 'opacity-50 scale-95' : 'cursor-grab active:cursor-grabbing hover:shadow-md'
            }`}
            style={{
                backgroundColor,
                borderTop: isPopoverOpen ? '2px solid rgba(118, 169, 250, 1)' : '',
                borderRight: isPopoverOpen ? '2px solid rgba(118, 169, 250, 1)' : '',
                borderBottom: isPopoverOpen ? '2px solid rgba(118, 169, 250, 1)' : '',
                borderLeft: `4px solid ${borderLeftColor}`,
                transform: isDragging ? 'scale(0.95)' : 'scale(1)',
                transition: isDragging ? 'none' : 'transform 0.2s ease',
                pointerEvents: isDragging ? 'none' : 'auto',
            }}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
        >
            <Popover open={!isDragging && isPopoverOpen} onOpenChange={(open) => !isDragging && setIsPopoverOpen(open)}>
                <PopoverTrigger asChild disabled={isDragging}>
                    {showText && (
                        <div 
                            className="whitespace-normal overflow-hidden text-ellipsis flex-wrap items-start"
                            style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
                        >
                            <div className="font-medium text-sm text-[#202124] overflow-hidden text-ellipsis whitespace-nowrap flex">
                                {showText && meetingLink && (
                                    <Image
                                        width={20}
                                        height={20}
                                        src="/icons/calendar-google.png"
                                        alt="Google Meet"
                                        className="mr-1.5 flex-shrink-0"
                                    />
                                )}
                                {title}&nbsp;
                            </div>
                            {isPopoverOpen && meetingLink && <div className='flex text-xs'>
                                <span className='line-through capitalize'>
                                    {event.status}
                                </span>
                                <span>
                                    &nbsp;→&nbsp;{event.status === 'busy' ? 'Available' : 'Busy'}
                                </span>
                            </div>}
                            <span className="text-sm text-[#5f6368] leading-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                {formatTime(time.from)} – {formatTime(time.to)}
                            </span>
                        </div>
                    )}
                </PopoverTrigger >
                <PopoverPortal>
                    <PopoverContent className='z-100' side='right' align='center'>
                        <EventPopover event={event} closePopover={() => setIsPopoverOpen(false)} />
                    </PopoverContent>
                </PopoverPortal>
            </Popover >
        </div >
    );
};