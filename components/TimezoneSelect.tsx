'use client'

import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover'
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { ChevronDown, Globe } from 'lucide-react'
import { useState } from 'react'
import { useCalendarStore } from '@/lib/store'

const timezoneGroups: Record<string, { value: string; label: string }[]> = {
    'US/Canada': [
        { value: 'America/Los_Angeles', label: 'Pacific time - US & Canada' },
        { value: 'America/Denver', label: 'Mountain time - US & Canada' },
        { value: 'America/Chicago', label: 'Central time - US & Canada' },
        { value: 'America/New_York', label: 'Eastern time - US & Canada' },
        { value: 'America/Anchorage', label: 'Alaska time' },
    ],
    Asia: [
        { value: 'Asia/Jakarta', label: 'Jakarta, Indonesia' },
        { value: 'Asia/Bali', label: 'Bali, Indonesia' },
        { value: 'Asia/Bali2', label: 'Bali, Indonesia' },
        { value: 'Asia/Bali3', label: 'Bali, Indonesia' },
        { value: 'Asia/Dubai', label: 'UAE - Gulf Standard Time' },
        { value: 'Asia/Karachi', label: 'Pakistan - Pakistan Standard Time' },
        { value: 'Asia/Kolkata', label: 'India - India Standard Time' },
        { value: 'Asia/Dhaka', label: 'Bangladesh - Bangladesh Time' },
        { value: 'Asia/Bangkok', label: 'Thailand - Indochina Time' },
        { value: 'Asia/Singapore', label: 'Singapore - Singapore Time' },
        { value: 'Asia/Hong_Kong', label: 'Hong Kong - Hong Kong Time' },
        { value: 'Asia/Shanghai', label: 'China - China Standard Time' },
        { value: 'Asia/Tokyo', label: 'Japan - Japan Standard Time' },
        { value: 'Asia/Seoul', label: 'South Korea - Korea Standard Time' },
    ],
    Europe: [
        { value: 'Europe/London', label: 'UK - Greenwich Mean Time' },
        { value: 'Europe/Paris', label: 'France - Central European Time' },
        { value: 'Europe/Berlin', label: 'Germany - Central European Time' },
        { value: 'Europe/Rome', label: 'Italy - Central European Time' },
        { value: 'Europe/Madrid', label: 'Spain - Central European Time' },
        { value: 'Europe/Amsterdam', label: 'Netherlands - Central European Time' },
        { value: 'Europe/Stockholm', label: 'Sweden - Central European Time' },
        { value: 'Europe/Helsinki', label: 'Finland - Eastern European Time' },
        { value: 'Europe/Athens', label: 'Greece - Eastern European Time' },
        { value: 'Europe/Moscow', label: 'Russia - Moscow Time' },
    ],
    Australia: [
        { value: 'Australia/Sydney', label: 'Australia - Eastern Time' },
        { value: 'Australia/Melbourne', label: 'Australia - Eastern Time' },
        { value: 'Australia/Perth', label: 'Australia - Western Time' },
    ],
    'South America': [
        { value: 'America/Sao_Paulo', label: 'Brazil - Brasília Time' },
        {
            value: 'America/Argentina/Buenos_Aires',
            label: 'Argentina - Argentina Time',
        },
        { value: 'America/Mexico_City', label: 'Mexico - Central Time' },
    ],
    'New Zealand': [
        { value: 'Pacific/Auckland', label: 'New Zealand - New Zealand Time' },
    ],
    Africa: [
        { value: 'Africa/Cairo', label: 'Egypt - Eastern European Time' },
        { value: 'Africa/Lagos', label: 'Nigeria - West Africa Time' },
        { value: 'Africa/Johannesburg', label: 'South Africa - South Africa Time' },
    ],
    Canada: [
        { value: 'America/Toronto', label: 'Canada - Eastern Time' },
        { value: 'America/Vancouver', label: 'Canada - Pacific Time' },
    ],
    Hawaii: [
        { value: 'Pacific/Honolulu', label: 'USA - Hawaii Time' },
    ]
}

// Helper to get current time in timezone
const getCurrentTimeInTimezone = (timezone: string): string => {
    try {
        return new Date().toLocaleTimeString('en-US', {
            timeZone: timezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch {
        return '--:--'
    }
}

export default function TimezoneSelect() {
    const [open, setOpen] = useState(false)
    const { timezone, setTimezone } = useCalendarStore()

    const handleSelect = (value: string) => {
        setTimezone(value)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[320px] justify-start text-left text-black">
                    <Globe className="mr-2 h-4 w-4" />
                    <div className='flex justify-between w-full'>
                        {timezone
                            ? <><span>{timezoneGroups[
                                Object.keys(timezoneGroups).find(region =>
                                    timezoneGroups[region].some(option => option.value === timezone)
                                ) || ''
                            ]?.find(option => option.value === timezone)?.label}</span><span>{getCurrentTimeInTimezone(
                                timezone
                            )}</span></>
                            : 'Select Timezone'}
                    </div>
                    <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
                <Command>
                    <CommandInput placeholder="Search by city or region..." />
                    <CommandList className="max-h-[300px] overflow-y-auto">
                        {Object.entries(timezoneGroups).map(([region, options]) => (
                            <CommandGroup key={region} heading={region}>
                                {options.map(option => (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => handleSelect(option.value)}
                                        value={option.label}
                                    >
                                        {option.label}
                                        <span className="ml-auto text-xs text-muted-foreground">
                                            {getCurrentTimeInTimezone(option.value)}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
