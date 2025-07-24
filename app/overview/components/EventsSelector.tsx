"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { useEventsStore } from "@/lib/store"
import { Event } from "@/lib/utils/events"
import { ChevronDown } from "lucide-react"

interface EventsSelectorProps {
    selected: 'all' | Event
    onSelectionChange: (selection: 'all' | Event) => void
}

const EventsSelector = ({ selected, onSelectionChange }: EventsSelectorProps) => {
    const [eventsPopoverOpen, setEventsPopoverOpen] = useState(false)
    const { events } = useEventsStore()

    const handleApplyFilter = () => {
        setEventsPopoverOpen(false)
        // Optional: apply selected filter logic here
    }

    return (
        <div className="space-y-1 text-black">
            <Label className="text-sm">Event(s)</Label>
            <Popover open={eventsPopoverOpen} onOpenChange={setEventsPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                    >
                        {selected === 'all' ? 'All events' : (selected as Event).title}
                        
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-sm p-2" align="start">
                    <Command>
                        <CommandInput placeholder="Search by event name..." />
                        <CommandList>
                            <RadioGroup
                                value={(selected as Event).id || 'all'}
                                onValueChange={(value) => onSelectionChange(value as 'all' | Event)}
                            >
                                <CommandItem
                                    value="all"
                                    onSelect={() => onSelectionChange('all')}
                                    className="flex items-center space-x-2 py-4 hover:!bg-blue-100"
                                >
                                    <RadioGroupItem value="all" id="all" />
                                    <Label htmlFor="all">All events</Label>
                                </CommandItem>

                                {events.map((event, index) => (
                                    <CommandItem
                                        key={index}
                                        value={event.title}
                                        onSelect={() => onSelectionChange(event)}
                                        className="flex items-center space-x-2 h-12 hover:!bg-blue-100"
                                    >
                                        <RadioGroupItem value={event.id} id={`event-${index}`} />
                                        <div className="w-8 h-12 flex items-center justify-center">
                                            <Image
                                                alt="placeholder user"
                                                width={32}
                                                height={32}
                                                src={"/icons/placeholder-user.png"} />
                                        </div>
                                        <div className="w-1 h-full bg-green-400"></div>
                                        <div className="flex flex-col">
                                            <Label htmlFor={`event-${index}`} className="whitespace-nowrap">{event.title}</Label>
                                            {event.description && <p className="text-xs text-muted-foreground">{event.description}</p>}
                                        </div>
                                    </CommandItem>
                                ))}
                            </RadioGroup>
                        </CommandList>
                    </Command>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="ghost"
                            className="border border-gray-100"
                            onClick={() => {
                                setEventsPopoverOpen(false)
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            style={{ background: 'linear-gradient(93.69deg, #031953 -43.1%, #0236C2 99.55%)' }}
                            onClick={handleApplyFilter}
                        >
                            Apply filter
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default EventsSelector
