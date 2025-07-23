"use client";

import CalendarDateRangeHeader from "./components/CalendarDateRangeHeader";
import CalendarOptions from "./components/CalendarOptions";
import CalendarView from "./components/CalendarView";

export default function OverviewPage() {
    return (
        <div className="flex h-screen w-full">
            <CalendarOptions />
            <div className="flex flex-col h-full flex-1 relative overflow-hidden">
                <CalendarDateRangeHeader />
                <div className="flex-1 overflow-y-auto overflow-x-auto">
                    <CalendarView />
                </div>
            </div>
        </div>
    )
}