import React from 'react';
import { Event } from '@/lib/utils/events';
import { darkenColor } from '@/lib/utils/events';
import { format } from 'date-fns';
import Image from 'next/image';

export const EventCard = ({ event, showText = true }: { event: Event; showText?: boolean }) => {
    const { title, time, meetingLink, color } = event;

    const formatTime = (date: Date) => format(date, 'h:mm a');

    const backgroundColor = meetingLink ? '#f1f3f4' : color;
    const borderLeftColor = meetingLink ? '#dadce0' : darkenColor(color, 0.2);

    return (
        <div
            className="event-card w-full h-full overflow-hidden flex items-start px-2 py-1 box-border rounded-[inherit]"
            style={{
                backgroundColor,
                borderLeft: `4px solid ${borderLeftColor}`,
            }}
        >
            {showText && meetingLink && (
                <Image
                    width={16}
                    height={16}
                    src="/icons/calendar-google.png"
                    alt="Google Meet"
                    className="mr-1.5 flex-shrink-0"
                />
            )}
            {showText && (
                <div className="whitespace-normal overflow-hidden text-ellipsis flex-wrap items-start">
                    <div className="font-medium text-[13px] text-[#202124] leading-[1.2] overflow-hidden text-ellipsis whitespace-nowrap">
                        {title}&nbsp;
                    </div>
                    <span className="text-xs text-[#5f6368] leading-[1.2] overflow-hidden text-ellipsis whitespace-nowrap">
                        {formatTime(time.from)} – {formatTime(time.to)}
                    </span>
                </div>
            )}
        </div>
    );
};