'use client'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCalendarStore } from '@/lib/store'
import { SelectRangeEventHandler } from 'react-day-picker'
import TimezoneSelect from '@/components/TimezoneSelect'

export default function CalendarDateRangeHeader() {
    const { startDate, endDate, setStartDate, setEndDate } = useCalendarStore()

    const handleSelect: SelectRangeEventHandler = (nextRange, selectedDay) => {
        if (startDate && endDate) {
            setStartDate(selectedDay);
            setEndDate(undefined);
            return;
        }
        setStartDate(nextRange?.from);
        setEndDate(nextRange?.to);
    };

    return (
        <header className="flex h-[66px] items-center justify-between border-b px-4 border-l bg-white w-full">
            {/* Left: Month + Year */}
            <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <strong>
                    {startDate?.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                </strong>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className='border border-gray-300 !px-[0.3rem] cursor-pointer'>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs cursor-pointer">
                                <strong>{startDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} </strong>
                                to
                                <strong>{endDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="range"
                                defaultMonth={startDate}
                                onSelect={handleSelect}
                                selected={{ from: startDate, to: endDate }}
                                weekStartsOn={1}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button variant="ghost" size="sm" className='border border-gray-300 !px-[0.3rem] cursor-pointer'>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>


            <TimezoneSelect />
        </header>
    )
}
