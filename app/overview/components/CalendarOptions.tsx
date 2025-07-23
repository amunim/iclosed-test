"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const CalendarOptions = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [calendar1, setCalendar1] = useState(true)
    const [calendar2, setCalendar2] = useState(true)

    return (
        <div className={cn("max-w-sm border-l border-r bg-white pb-6 shadow-sm text-gray-600 min-h-screen transition-all", isOpen ? "min-w-fit" : "min-w-14")}>
            <div className="flex items-center justify-start border-b h-[66px]">
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                    {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </Button>
                {isOpen && <h2 className="text-lg font-semibold">Calendar view</h2>}
            </div>

            <div className={cn("space-y-6 mt-4 px-4 pb-4 border-b", isOpen ? "block" : "hidden")}>
                {/* View calendar for */}
                <div className="space-y-1">
                    <Label className="text-sm">View calendar for</Label>
                    <Select defaultValue="my-schedule">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select schedule" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="my-schedule">My Schedule</SelectItem>
                            <SelectItem value="team">Team Schedule</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Filter by */}
                <div className="space-y-1">
                    <Label className="text-sm">Filter by</Label>
                    <Select defaultValue="events">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="events">Events</SelectItem>
                            <SelectItem value="meetings">Meetings</SelectItem>
                            <SelectItem value="tasks">Tasks</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Events */}
                <div className="space-y-1">
                    <Label className="text-sm">Event(s)</Label>
                    <Select defaultValue="all-events">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Event type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-events">All events</SelectItem>
                            <SelectItem value="upcoming">Upcoming only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            </div>
            <div className={cn("space-y-6 mt-4 px-4", isOpen ? "block" : "hidden")}>
                {/* Connected calendars */}
                <div className="space-y-2">
                    <Label className="text-sm">Connected calendar(s)</Label>
                    <p className="text-xs text-muted-foreground">Checking for scheduling conflicts. Enable or disable event visibility.</p>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="calendar1"
                            checked={calendar1}
                            onCheckedChange={(check) => setCalendar1(check.valueOf() as boolean)} />
                        <Label htmlFor="calendar1" className="flex items-center gap-2">
                            <Image width={16} height={16} src="/icons/calendar-google.png" alt="Google Calendar" className="w-4 h-4" />
                            zack.bing@gmail.com
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="calendar2"
                            checked={calendar2}
                            onCheckedChange={(check) => setCalendar2(check.valueOf() as boolean)} />
                        <Label htmlFor="calendar2" className="flex items-center gap-2">
                            <Image width={16} height={16} src="/icons/calendar-google.png" alt="Google Calendar" className="w-4 h-4" />
                            zack.bing@gmail.com
                        </Label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalendarOptions
