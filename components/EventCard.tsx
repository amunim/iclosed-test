import React, { useState } from 'react';
import { Event } from '@/lib/utils/events';
import { darkenColor } from '@/lib/utils/events';
import { format } from 'date-fns';
import Image from 'next/image';
import { Popover } from './ui/popover';
import { PopoverContent, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover';
import { EventPopover } from './EventPopover';

export const EventCard = ({ event, showText = true }: { event: Event; showText?: boolean }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const { title, time, meetingLink, color } = event;

    const formatTime = (date: Date) => format(date, 'h:mm a');

    const backgroundColor = meetingLink ? '#f1f3f4' : color;
    const borderLeftColor = meetingLink ? '#dadce0' : darkenColor(color, 0.2);

    return (
        <div
            className="event-card w-full h-full overflow-hidden flex items-start px-2 py-1 box-border rounded-[inherit] z-10"
            style={{
                backgroundColor,
                borderTop: isPopoverOpen ? '2px solid rgba(118, 169, 250, 1)' : '',
                borderRight: isPopoverOpen ? '2px solid rgba(118, 169, 250, 1)' : '',
                borderBottom: isPopoverOpen ? '2px solid rgba(118, 169, 250, 1)' : '',
                borderLeft: `4px solid ${borderLeftColor}`,
            }}
        >
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    {showText && (
                        <div className="whitespace-normal overflow-hidden text-ellipsis flex-wrap items-start">
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
                    <PopoverContent side='right' align='center'>
                        <EventPopover event={event} closePopover={() => setIsPopoverOpen(false)} />
                    </PopoverContent>
                </PopoverPortal>
            </Popover >
        </div >
    );
};