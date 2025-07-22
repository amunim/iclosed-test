import { addDays } from 'date-fns';
import { create } from 'zustand';

interface CalendarState {
    startDate?: Date;
    endDate?: Date;
    setStartDate: (date?: Date) => void;
    setEndDate: (date?: Date) => void;
    resetDates: () => void;
}

const useCalendarStore = create<CalendarState>((set, get) => ({
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    setStartDate: (date?: Date) => set({ startDate: date }),
    setEndDate: (date?: Date) => set({ endDate: date }),
    resetDates: () => set({
        startDate: new Date(),
        endDate: addDays(new Date(), 7),
    }),
}));

export { useCalendarStore };