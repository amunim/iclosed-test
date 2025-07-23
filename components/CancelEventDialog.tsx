// components/CancelEventModal.tsx

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "./ui/badge"
import { Label } from "@/components/ui/label"
import { darkenColor, Event } from "@/lib/utils/events"
import { Card, CardContent, CardTitle } from "./ui/card"
import { format } from "date-fns"
import Image from "next/image"
import { Avatar } from "./ui/avatar"
import { useEventsStore } from "@/lib/store/eventsstore"
import { useState } from "react"

interface CancelEventModalProps {
    trigger: React.ReactNode,
    event: Event
}

export function CancelEventModal({ trigger, event }: CancelEventModalProps) {
    const [open, setOpen] = useState(false)
    const [reason, setReason] = useState("")
    const { removeEvent } = useEventsStore()

    const handleCancel = () => {
        setOpen(false)
    }

    const handleCancelEvent = () => {
        removeEvent(event.id)
        setOpen(false)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-w-[400px] w-[400px]">
                <DialogHeader className="">
                    <DialogTitle>Cancel this event?</DialogTitle>
                </DialogHeader>
                <hr className="-mx-5" />
                <div className="space-y-4">
                    <Card className="w-full border py-3 relative px-2 pl-0 shadow-none">
                        <CardContent className="space-y-3">
                            <div className="flex flex-row items-center justify-between">
                                {event.meetingLink && (
                                    <Image
                                        width={32}
                                        height={32}
                                        src="/icons/calendar-google.png"
                                        alt="Google Meet"
                                        className="mr-1.5 flex-shrink-0" />
                                )}
                                <div className="mr-6">
                                    <CardTitle
                                        className={`text-md`}
                                        style={{ borderLeft: '4px solid ' + (event.meetingLink ? '#dadce0' : darkenColor(event.color, 0.2)), paddingLeft: event.meetingLink ? '0' : '8px' }}>
                                        {event.title}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">{event.meetingLink ? (event.description || event.id) : `${format(event.time.from, "EEEE MMMM d")} • ${format(event.time.from, "p")} - ${format(event.time.to, "p")}`}</p>
                                </div>
                                {event.meetingLink && <Badge variant={event.status === 'busy' ? "destructive" : "outline"} className={event.status == 'available' ? 'bg-[rgba(222,_247,_236,_1)] border-[rgba(132,_225,_188,_1)] text-[rgba(3,_84,_63,_1)]' : ''}>
                                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </Badge>}
                            </div>
                            {event.meetingLink && <p className="text-sm text-muted-foreground">
                                {format(event.time.from, "EEEE MMMM d")} • {format(event.time.from, "p")} - {format(event.time.to, "p")}
                            </p>}
                            {!event.meetingLink && event.host &&
                                <div className="flex justify-between items-center">
                                    <div className="flex items-start">
                                        <Avatar className="w-7 h-7 rounded-full flex items-center self-end justify-center shrink-0 text-white mb-2 mr-2"
                                            style={{ background: "linear-gradient(37.58deg, #001D6B -92.47%, #031953 -92.47%, #1044CE 74.77%)" }}>H</Avatar>
                                        <div className="flex flex-col items-start">
                                            <span className="font-medium -mb-2">{event.host}</span>
                                            <span className="text-muted-foreground">{event.hostEmail}</span>
                                        </div>
                                    </div>
                                    <div className="border bg-gray-100 border-gray-300 h-fit rounded-sm px-2">
                                        Host
                                    </div>
                                </div>}
                            {!event.meetingLink &&
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">{event.invitee}</span>
                                        <span className="text-muted-foreground">{event.inviteeEmail}</span>
                                    </div>
                                    <div className="border bg-gray-100 border-gray-300 h-fit rounded-sm px-2">
                                        Invitee
                                    </div>
                                </div>}
                        </CardContent>
                    </Card>
                    <div>
                        <Label htmlFor="reason" className="text-sm">Reason for canceling? <span className="text-xs text-gray-500">(Optional)</span></Label>
                        <Textarea 
                            id="reason" 
                            placeholder="Enter reason for cancelling" 
                            className="mt-2" 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">Cancellation email will be sent to the invitee.</p>
                    </div>
                </div>
                <hr className="-mx-5" />
                <DialogFooter className="mt-1 flex !justify-between flex-row">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button variant="default" onClick={handleCancelEvent} style={{
                        background: 'radial-gradient(135% 135% at 50% -30%, #031953 0%, rgba(0, 45, 164, 0.9) 100%)'
                    }}>Cancel event</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
