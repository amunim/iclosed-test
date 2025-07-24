"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { Avatar } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ChevronDown } from "lucide-react"

const members = new Array(10).fill(null).map((_, i) => `Member ${i + 1}`);
export const ScheduleSelector = () => {
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [selected, setSelected] = useState<string>('all')

    return (
        <div className="space-y-1 text-black">
            <Label className="text-sm">View Schedule for</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                        >
                            {selected === 'all' ? 'My Schedule' : selected}
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </PopoverTrigger>

                <PopoverContent className="w-[22rem] p-0 pb-2" align="start">
                    <Command>
                        <div className="py-1 pb-2">
                            <CommandItem
                                value="all"
                                onSelect={() => setSelected('all')}
                                className="flex items-center space-x-2 py-4 font-normal hover:!bg-blue-100"
                            >
                                <Label htmlFor="all">My Schedule</Label>
                            </CommandItem>
                        </div>
                        <CommandList>
                            <Separator className="" />
                            <div className="px-2">
                                <div className="py-4 text-muted-foreground">
                                    <Label htmlFor="all">Filter by member</Label>
                                </div>
                                <div className="border rounded-md border-gray-300">
                                    <CommandInput placeholder="Search by event name..." className="w-full bg-gray-50 h-9" />
                                </div>
                            </div>
                            {members.map((member, index) => (
                                <CommandItem
                                    key={index}
                                    value={member}
                                    onSelect={() => setSelected(member)}
                                    className="flex items-center space-x-1 h-12 hover:!bg-blue-100"
                                >
                                    <div className="w-8 h-12 flex items-center justify-center -mr-2">
                                        <Avatar className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs text-white"
                                            style={{ background: "linear-gradient(37.58deg, #001D6B -92.47%, #031953 -92.47%, #1044CE 74.77%)" }}>A</Avatar>
                                    </div>
                                    <Label htmlFor={`member-${index}`} className="whitespace-nowrap">{member}</Label>
                                </CommandItem>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}