'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, ExternalLink, X } from "lucide-react"
import { format } from "date-fns"
import { useEventsStore } from "@/lib/store"
import { darkenColor, Event } from "@/lib/utils/events"
import Image from "next/image"
import { CancelEventModal } from "./CancelEventDialog"
import { DeleteEventDialog } from "./DeleteEventDialog"
import RescheduleEventModal from "./RescheduleEventDialog"

export const EventPopover = ({ event, closePopover }: { event: Event, closePopover: () => void }) => {
    const updateEvent = useEventsStore((state) => state.updateEvent)
    const removeEvent = useEventsStore((state) => state.removeEvent)

    const handleToggleAvailability = () => {
        updateEvent(event.id, {
            status: event.status === 'busy' ? 'available' : 'busy'
        })
    }

    const handleDelete = () => {
        removeEvent(event.id)
    }

    return (
        <Card className="w-full max-w-sm shadow-lg border py-3 relative px-2">
            <CardContent className="space-y-3">
                <X className="absolute top-2 right-2 cursor-pointer text-muted-foreground" onClick={() => closePopover()} />
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
                            className="text-md"
                            {...(!event.meetingLink && {
                                style: {
                                    borderLeft: '4px solid ' + darkenColor(event.color, 0.2),
                                    paddingLeft: '8px'
                                }
                            })}
                        >
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
                {!event.meetingLink &&
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col items-start">
                            <span className="font-medium underline">{event.invitee}</span>
                            <span className="text-muted-foreground">{event.inviteeEmail}</span>
                        </div>
                        <div className="border bg-gray-100 border-gray-300 h-fit rounded-sm px-2">
                            Invitee
                        </div>
                    </div>}

                {event.meetingLink && <div className="flex justify-between">
                    <Button variant="ghost" size="icon" onClick={handleToggleAvailability} className="border-2 !w-fit px-2">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.2427 11.2427C12.3679 10.1175 13.0001 8.59135 13.0001 7.00004C13.0001 5.40873 12.3679 3.8826 11.2427 2.75737C10.1175 1.63215 8.59135 1 7.00004 1C5.40873 1 3.8826 1.63215 2.75737 2.75737M11.2427 11.2427L2.75737 2.75737M11.2427 11.2427C10.1175 12.3679 8.59135 13.0001 7.00004 13.0001C5.40873 13.0001 3.8826 12.3679 2.75737 11.2427C1.63215 10.1175 1 8.59135 1 7.00004C1 5.40873 1.63215 3.8826 2.75737 2.75737" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {event.status === 'busy' ? "Mark available" : "Mark busy"}
                    </Button>

                    <div className="flex gap-2">
                        <DeleteEventDialog event={event} trigger={<Button variant="ghost" size="icon" className="border-2">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        } />
                        {event.meetingLink && (
                            <Button variant="ghost" size="icon" onClick={() => window.open(event.meetingLink, "_blank")} className="border-2">
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>}
                {!event.meetingLink && <div className="flex justify-end gap-2">
                    <CancelEventModal event={event} trigger={<Button variant="ghost" size="default" className="border-2 px-4">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.66667 8.33333L7 7M7 7L8.33333 5.66667M7 7L5.66667 5.66667M7 7L8.33333 8.33333M13 7C13 7.78793 12.8448 8.56815 12.5433 9.2961C12.2417 10.0241 11.7998 10.6855 11.2426 11.2426C10.6855 11.7998 10.0241 12.2417 9.2961 12.5433C8.56815 12.8448 7.78793 13 7 13C6.21207 13 5.43185 12.8448 4.7039 12.5433C3.97595 12.2417 3.31451 11.7998 2.75736 11.2426C2.20021 10.6855 1.75825 10.0241 1.45672 9.2961C1.15519 8.56815 1 7.78793 1 7C1 5.4087 1.63214 3.88258 2.75736 2.75736C3.88258 1.63214 5.4087 1 7 1C8.5913 1 10.1174 1.63214 11.2426 2.75736C12.3679 3.88258 13 5.4087 13 7Z" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        Cancel
                    </Button>} />
                    <RescheduleEventModal trigger={<Button variant="ghost" size="default" className="border-2 px-4">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.66675 1.66727V5.0006H2.05475M2.05475 5.0006C2.49731 3.90602 3.29054 2.98921 4.3101 2.39384C5.32967 1.79848 6.51795 1.55821 7.68873 1.7107C8.8595 1.86318 9.94661 2.3998 10.7797 3.23645C11.6127 4.07311 12.1446 5.16251 12.2921 6.33394M2.05475 5.0006H5.00008M12.3334 12.3339V9.0006H11.9461M11.9461 9.0006C11.5029 10.0945 10.7094 11.0106 9.68997 11.6055C8.67051 12.2003 7.48257 12.4403 6.31215 12.2879C5.14172 12.1354 4.05488 11.5992 3.22177 10.7631C2.38866 9.92699 1.85632 8.83823 1.70808 7.66727M11.9461 9.0006H9.00008" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        Reschedule
                    </Button>} />
                </div>}
            </CardContent>
        </Card>
    )
}
