'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ReactNode, useState } from "react"
import { useEventsStore } from "@/lib/store/eventsstore"
import { Event } from "@/lib/utils/events"

export function DeleteEventDialog({ trigger, event }: {
    trigger: ReactNode
    event: Event
}
) {
    const [open, setOpen] = useState(false)
    const { removeEvent } = useEventsStore()

    const handleDelete = () => {
        removeEvent(event.id)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className=" w-[80rem] max-w-[80rem]">
                <DialogHeader>
                    <DialogTitle>Delete this event?</DialogTitle>
                </DialogHeader>

                <hr className="-mx-6"/>

                <DialogDescription className="text-black">
                    This will permanently remove the event from both iClosed and your Google Calendar. This action cannot be undone.
                </DialogDescription>

                <hr className="-mx-6" />

                <DialogFooter className="flex !justify-between flex-row">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        No, go back
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Yes, cancel event
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
