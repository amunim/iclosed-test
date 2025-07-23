import { addDays } from 'date-fns';
import { create } from 'zustand';

interface CalendarState {
    startDate?: Date;
    endDate?: Date;
    timezone: string; // e.g. 'America/New_York'
    setTimezone: (timezone: string) => void;
    setStartDate: (date?: Date) => void;
    setEndDate: (date?: Date) => void;
    resetDates: () => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    timezone: 'Asia/Karachi', // Default timezone
    setTimezone: (timezone: string) => set({ timezone }),
    setStartDate: (date?: Date) => set({ startDate: date }),
    setEndDate: (date?: Date) => set({ endDate: date }),

    resetDates: () => set({
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
    }),
}));
