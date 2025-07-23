import { startOfDay, setHours, getHours, getDay } from 'date-fns';
import { DateRange } from './index';

export interface WeekDayAvailability {
    day: number; // 0-6 for Sunday-Saturday
    availability: DateRange; // same day only time matters
    breakTimes: DateRange[];
}

export interface UnavailabilityInfo {
    percentage: number;
    hasBreakTime: boolean;
    hasBlockedTime: boolean;
}

/**
 * Calculate unavailability info for a specific hour on a specific day
 * @param day - The date to check
 * @param hour - The hour (0-23) to check
 * @param weekDays - Array of weekly availability configurations
 * @param blockedTimes - Array of specific blocked time ranges
 * @returns Object containing percentage unavailable and flags for break/blocked time
 */
export const getUnavailabilityInfo = (
    day: Date,
    hour: number,
    weekDays: WeekDayAvailability[],
    blockedTimes: DateRange[]
): UnavailabilityInfo => {
    const dayOfWeek = getDay(day); // 0 = Sunday, 1 = Monday, etc.
    const cellStart = setHours(startOfDay(day), hour);
    const cellEnd = setHours(startOfDay(day), hour + 1);

    // Check if this day is in weekDays availability
    const dayAvailability = weekDays.find(wd => wd.day === dayOfWeek);
    
    let unavailableMinutes = 0;
    let hasBreakTime = false;
    let hasBlockedTime = false;
    
    // If no availability defined for this day, it's 100% unavailable
    if (!dayAvailability) {
        return { percentage: 100, hasBreakTime: false, hasBlockedTime: false };
    }

    // Check if the hour falls outside the general availability window
    const availStart = getHours(dayAvailability.availability.from);
    const availEnd = getHours(dayAvailability.availability.to);
    
    if (hour < availStart || hour >= availEnd) {
        return { percentage: 100, hasBreakTime: false, hasBlockedTime: false };
    }

    // Check break times within this hour
    dayAvailability.breakTimes.forEach(breakTime => {
        const breakStart = getHours(breakTime.from);
        const breakEnd = getHours(breakTime.to);
        
        // If break overlaps with this hour
        if (breakStart <= hour && breakEnd > hour) {
            const overlapStart = Math.max(hour, breakStart);
            const overlapEnd = Math.min(hour + 1, breakEnd);
            unavailableMinutes += (overlapEnd - overlapStart) * 60;
            hasBreakTime = true;
        }
    });

    // Check blocked times for this specific date and hour
    blockedTimes.forEach(blockedTime => {
        const blockedStart = blockedTime.from;
        const blockedEnd = blockedTime.to;
        
        // Check if blocked time overlaps with this cell
        if (blockedStart <= cellEnd && blockedEnd >= cellStart) {
            const overlapStart = blockedStart > cellStart ? blockedStart : cellStart;
            const overlapEnd = blockedEnd < cellEnd ? blockedEnd : cellEnd;
            const overlapMinutes = (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60);
            unavailableMinutes += overlapMinutes;
            hasBlockedTime = true;
        }
    });

    const percentage = Math.min(100, (unavailableMinutes / 60) * 100);
    return { percentage, hasBreakTime, hasBlockedTime };
};
