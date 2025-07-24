import React from 'react';
import { Event } from '@/lib/utils/events';
import { darkenColor } from '@/lib/utils/events';
import { format } from 'date-fns';
import Image from 'next/image';

interface DragGhostProps {
    event: Event;
    position: { x: number; y: number };
}

export const DragGhost = ({ event, position }: DragGhostProps) => {
    const { title, time, meetingLink, color } = event;
    
    const formatTime = (date: Date) => format(date, 'h:mm a');
    const backgroundColor = meetingLink ? '#f1f3f4' : color;
    const borderLeftColor = meetingLink ? '#dadce0' : darkenColor(color, 0.2);

    return (
        <div
            className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
            style={{
                left: position.x,
                top: position.y,
                width: '160px',
                height: '60px',
            }}
        >
            <div
                className="w-full h-full overflow-hidden flex items-start px-2 py-1 box-border rounded-lg shadow-lg opacity-90"
                style={{
                    backgroundColor,
                    borderLeft: `4px solid ${borderLeftColor}`,
                    transform: 'scale(0.9) rotate(5deg)',
                }}
            >
                <div className="whitespace-normal overflow-hidden text-ellipsis flex-wrap items-start">
                    <div className="font-medium text-sm text-[#202124] overflow-hidden text-ellipsis whitespace-nowrap flex">
                        {meetingLink && (
                            <Image
                                width={16}
                                height={16}
                                src="/icons/calendar-google.png"
                                alt="Google Meet"
                                className="mr-1.5 flex-shrink-0"
                            />
                        )}
                        {title}&nbsp;
                    </div>
                    <span className="text-xs text-[#5f6368] leading-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {formatTime(time.from)} – {formatTime(time.to)}
                    </span>
                </div>
            </div>
        </div>
    );
};
