"use client";

import { useRef } from 'react';
import CalendarDateRangeHeader from "./components/CalendarDateRangeHeader";
import CalendarOptions from "./components/CalendarOptions";
import CalendarView from "./components/CalendarView";
import { useDraggable } from "react-use-draggable-scroll";

export default function OverviewPage() {
    const ref = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
    const { events: dragEvents } = useDraggable(ref);

    return (
        <div className="flex h-screen w-full">
            <CalendarOptions />
            <div className="flex flex-col h-full flex-1 relative overflow-hidden">
                <CalendarDateRangeHeader />
                {/* Vertical scroll here */}
                <div
                    ref={ref}
                    className="flex-1 overflow-y-auto scrollbar-hide select-none relative"
                    {...dragEvents}>
                    <CalendarView />
                </div>
            </div>
        </div>
    )
}