"use client"

import * as PopoverPrimitive from "@radix-ui/react-popover"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Event } from "@/lib/utils/events"
import EventsSelector from "./EventsSelector"
import { ScheduleSelector } from "./ScheduleSelector"

const CalendarOptions = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [calendar1, setCalendar1] = useState(true)
    const [calendar2, setCalendar2] = useState(true)
    const [selected, setSelected] = useState<'all' | Event>('all')
    const [tooltipOpen, setTooltipOpen] = useState(false)

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
                <ScheduleSelector />

                {/* Filter by */}
                <div className="space-y-1 text-black">
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
                <EventsSelector
                    selected={selected}
                    onSelectionChange={setSelected}
                />

                <div className="space-y-4">
                    {/* Event Duration */}
                    <div className="flex flex-col items-start justify-between">
                        <Label className="text-sm text-gray-500">EVENT DURATION</Label>
                        <span className="text-sm text-black">60 minutes</span>
                    </div>

                    {/* Availability Schedule with Popover */}
                    <div className="flex flex-col items-start justify-between">
                        <div className="flex items-center gap-1">
                            <Label className="text-sm text-gray-500">AVAILABILITY SCHEDULE</Label>
                            <PopoverPrimitive.Root open={tooltipOpen} onOpenChange={setTooltipOpen}>
                                <PopoverPrimitive.Trigger asChild>
                                    <span
                                        onMouseEnter={() => setTooltipOpen(true)}
                                        onMouseLeave={() => setTimeout(() => setTooltipOpen(false), 100)}
                                        className="text-sm text-muted-foreground cursor-pointer">ⓘ</span>
                                </PopoverPrimitive.Trigger>

                                <PopoverPrimitive.Portal>
                                    <PopoverPrimitive.Content
                                        side="right"
                                        align="center"
                                        className={cn(
                                            "rounded-md border bg-popover text-popover-foreground shadow-md w-[220px] p-0 z-50 border-gray-700"
                                        )}>
                                        <div className="bg-gray-700 px-3 py-2 font-medium text-sm border-b border-b-gray-700 rounded-t-md text-white">
                                            Default availability
                                        </div>

                                        <div className="text-sm bg-gray-900 rounded-b-md">
                                            {[
                                                ["Mon", "9 AM - 5 PM"],
                                                ["Tue", "9 AM - 5 PM"],
                                                ["Wed", "9 AM - 5 PM"],
                                                ["Thu", "9 AM - 5 PM"],
                                                ["Fri", "9 AM - 5 PM"],
                                                ["Sat", "-"],
                                                ["Sun", "-"],
                                            ].map(([day, hours]) => (
                                                <div key={day} className="flex gap-6 px-3 border-t border-collapse border-t-gray-700">
                                                    <span className="text-gray-300 border-r border-r-gray-700 py-1.5 w-10">{day}</span>
                                                    <span className="text-white py-1.5 self-start">{hours}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Triangle / Arrow */}
                                        <PopoverPrimitive.Arrow className="fill-gray-800" width={20} height={10} />
                                    </PopoverPrimitive.Content>
                                </PopoverPrimitive.Portal>
                            </PopoverPrimitive.Root>
                        </div>
                        <span className="text-sm text-black">Default availability</span>
                    </div>

                    {/* Slots Available for Week */}
                    <div className="flex flex-col items-start justify-between">
                        <Label className="text-sm text-gray-500">SLOTS AVAILABLE FOR WEEK</Label>
                        <span className="text-sm text-black">26</span>
                    </div>

                    {/* Weekly Occupancy */}
                    <div className="flex flex-col items-start justify-between">
                        <Label className="text-sm text-gray-500">WEEKLY OCCUPANCY</Label>
                        <span className="text-sm text-black">24%</span>
                    </div>
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
