import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface DateRange {
    from: Date;
    to: Date;
}

/**
 * Helper function to create a date with specific hours and minutes
 * @param hours - The hour (0-23)
 * @param minutes - The minutes (0-59), defaults to 0
 * @returns A new Date object with the specified time
 */
export const createTimeSlot = (hours: number, minutes: number = 0): Date => {
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
};
