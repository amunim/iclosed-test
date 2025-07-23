import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ReactNode, useState } from "react"

export default function RescheduleEventModal({ trigger }: {
    trigger: ReactNode
}) {
    const [rescheduleMethod, setRescheduleMethod] = useState("manual")

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-w-[400px] w-[400px]">
                <DialogHeader>
                    <DialogTitle>Reschedule Call</DialogTitle>
                </DialogHeader>
                <hr className="-mx-5" />
                <div className="space-y-4">
                    <RadioGroup
                        value={rescheduleMethod}
                        onValueChange={setRescheduleMethod}
                        className="space-y-2"
                    >
                        <div className="flex items-start space-x-2">
                            <RadioGroupItem className="
    w-5 h-5 rounded-full 
    border-2 border-gray-300 
    bg-gray-300 
    data-[state=checked]:bg-white 
    data-[state=checked]:border-blue-600 
    data-[state=checked]:ring-2 
    data-[state=checked]:ring-blue-600 
    transition 
    [&>.radix-radio-group-indicator]:hidden" value="roundRobin" id="roundRobin" />
                            <div>
                                <Label htmlFor="roundRobin">Round Robin</Label>
                                <p className="text-sm text-muted-foreground">
                                    The call will automatically be scheduled to the best available closer
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-2">
                            <RadioGroupItem className="
    w-5 h-5 rounded-full 
    border-2 border-gray-300 
    bg-gray-300 
    data-[state=checked]:bg-white 
    data-[state=checked]:border-blue-600 
    data-[state=checked]:ring-2 
    data-[state=checked]:ring-blue-600 
    transition 
    [&>.radix-radio-group-indicator]:hidden" value="manual" id="manual" />
                            <div>
                                <Label htmlFor="manual">Select Manually</Label>
                                <p className="text-sm text-muted-foreground">
                                    You can add a call in the past as well by selecting the closer manually
                                </p>
                            </div>
                        </div>
                    </RadioGroup>

                    {rescheduleMethod === "manual" && (
                        <Select>
                            <SelectTrigger className="w-full ml-5">
                                <SelectValue placeholder="Select closer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="closer1">Closer 1</SelectItem>
                                <SelectItem value="closer2">Closer 2</SelectItem>
                                <SelectItem value="closer3">Closer 3</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <hr className="-mx-5" />
                <DialogFooter className="mt-1 flex !justify-between flex-row">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button style={{ background: "radial-gradient(135% 135% at 50% -30%, #031953 0%, rgba(0, 45, 164, 0.9) 100%)" }}>Schedule Call</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
