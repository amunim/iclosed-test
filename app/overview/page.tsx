"use client";

import CalendarDateRangeHeader from "./components/CalendarDateRangeHeader";
import CalendarOptions from "./components/CalendarOptions";
import CalendarView from "./components/CalendarView";

export default function OverviewPage() {
    return (
        <>
            <CalendarOptions />
            <div className="flex flex-col h-full flex-1 relative overflow-hidden">
                <CalendarDateRangeHeader />
                <CalendarView />
            </div>
        </>
    )
}