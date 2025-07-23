import { create } from 'zustand';
import { DateRange, createTimeSlot } from '../utils';
import { WeekDayAvailability } from '../utils/calendar';

interface AvailabilityState {
    weekDays: WeekDayAvailability[];
    blockedTimes: DateRange[]; // hard-coded blocked times, i.e. date+time ranges
    setWeekDays: (weekDays: WeekDayAvailability[]) => void;
    setBlockedTimes: (blockedTimes: DateRange[]) => void;
    updateWeekDay: (dayIndex: number, availability: WeekDayAvailability) => void;
    addBlockedTime: (blockedTime: DateRange) => void;
    removeBlockedTime: (index: number) => void;
}


export const useAvailabilityStore = create<AvailabilityState>((set, get) => {
    // Initialize default weekday availability (Monday to Friday, 9-6 with 1-2pm break)
    const defaultWeekDays: WeekDayAvailability[] = Array.from({ length: 5 }, (_, index) => {
        // Weekdays - 9am to 6pm with 1-2pm break
        return {
            day: index + 1,
            availability: {
                from: createTimeSlot(9), // 9 AM
                to: createTimeSlot(18), // 6 PM
            },
            breakTimes: [
                {
                    from: createTimeSlot(13), // 1 PM
                    to: createTimeSlot(14), // 2 PM
                },
            ],
        };
    });

    return {
        weekDays: defaultWeekDays,
        blockedTimes: [],
        setWeekDays: (weekDays: WeekDayAvailability[]) => set({ weekDays }),
        setBlockedTimes: (blockedTimes: DateRange[]) => set({ blockedTimes }),
        updateWeekDay: (dayIndex: number, availability: WeekDayAvailability) => {
            const currentWeekDays = get().weekDays;
            const updatedWeekDays = [...currentWeekDays];
            updatedWeekDays[dayIndex] = availability;
            set({ weekDays: updatedWeekDays });
        },
        addBlockedTime: (blockedTime: DateRange) => {
            const currentBlockedTimes = get().blockedTimes;
            set({ blockedTimes: [...currentBlockedTimes, blockedTime] });
        },
        removeBlockedTime: (index: number) => {
            const currentBlockedTimes = get().blockedTimes;
            const updatedBlockedTimes = currentBlockedTimes.filter((_, i) => i !== index);
            set({ blockedTimes: updatedBlockedTimes });
        },
    };
});
