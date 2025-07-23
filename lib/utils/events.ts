import { DateRange } from '../utils';

export interface Event {
    id: string;
    title: string;
    time: DateRange; // Start and end time of the event
    color: string; // Color for the event
    status: 'busy' | 'available'; // Status of the event (e.g., "confirmed", "tentative", "cancelled")
    description?: string; // Optional description of the event
    isDeleted?: boolean; // Flag to mark the event as deleted
    meetingLink?: string; // Optional link for virtual meetings
    host: string;
    hostEmail: string;
    invitee: string;
    inviteeEmail: string;
}

// Helper function to generate random dates
export const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random time duration (1-4 hours)
export const getRandomDuration = () => {
    return Math.floor(Math.random() * 4 + 1) * 60 * 60 * 1000; // 1-4 hours in milliseconds
};

// Helper function to get valid time slots (9 AM-6 PM, excluding 1-2 PM lunch)
export const getValidTimeSlots = (date: Date): { start: Date; end: Date }[] => {
    const slots: { start: Date; end: Date }[] = [];
    
    // Morning slots: 9 AM to 1 PM (4 hours)
    for (let hour = 9; hour < 13; hour++) {
        const start = new Date(date);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start);
        end.setHours(hour + 1, 0, 0, 0);
        slots.push({ start, end });
    }
    
    // Afternoon slots: 2 PM to 6 PM (4 hours)
    for (let hour = 14; hour < 18; hour++) {
        const start = new Date(date);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start);
        end.setHours(hour + 1, 0, 0, 0);
        slots.push({ start, end });
    }
    
    return slots;
};

// Helper function to check if two time ranges overlap
export const doEventsOverlap = (event1: { from: Date; to: Date }, event2: { from: Date; to: Date }): boolean => {
    return event1.from < event2.to && event1.to > event2.from;
};

// Helper function to generate a random working day within a date range
export const getRandomWorkingDay = (startRange: Date, endRange: Date): Date => {
    let randomDate: Date;
    do {
        randomDate = getRandomDate(startRange, endRange);
        // Ensure it's a weekday (Monday = 1, Friday = 5)
    } while (randomDate.getDay() === 0 || randomDate.getDay() === 6);
    
    return randomDate;
};

// Helper function to create a date in Pakistan timezone
export const createPakistanDate = (year: number, month: number, day: number, hour: number = 0, minute: number = 0): Date => {
    const date = new Date(year, month, day, hour, minute, 0, 0);
    // Adjust for Pakistan timezone (UTC+5)
    return new Date(date.getTime() - (5 * 60 * 60 * 1000));
};

// Helper function to get valid time slots in Pakistan time (9 AM-6 PM PKT, excluding 1-2 PM lunch)
export const getValidTimeSlotsInPakistan = (date: Date): { start: Date; end: Date }[] => {
    const slots: { start: Date; end: Date }[] = [];
    
    // Morning slots: 9 AM to 1 PM PKT (4 hours)
    for (let hour = 9; hour < 13; hour++) {
        const start = new Date(date);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start);
        end.setHours(hour + 1, 0, 0, 0);
        slots.push({ start, end });
    }
    
    // Afternoon slots: 2 PM to 6 PM PKT (4 hours)
    for (let hour = 14; hour < 18; hour++) {
        const start = new Date(date);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start);
        end.setHours(hour + 1, 0, 0, 0);
        slots.push({ start, end });
    }
    
    return slots;
};

// Event data constants
export const EVENT_TITLES = [
    'Team Standup',
    'Client Meeting',
    'Project Review',
    'Code Review Session',
    'Design Workshop',
    'Product Planning',
    'Technical Discussion',
    'Sprint Retrospective',
    'User Research Call',
    'Architecture Review',
    'Demo Preparation',
    'Quarterly Planning',
    'Training Session',
    'Bug Triage',
    'Feature Kickoff'
];

export const EVENT_COLORS = [
    '#3b82f6', 
    '#ef4444', 
    '#10b981', 
    '#f59e0b', 
    '#8b5cf6', 
    '#06b6d4', 
    '#f97316', 
    '#84cc16'
];

export const EVENT_STATUSES: ('busy' | 'available')[] = ['busy', 'available'];

// Generate random events for this month and week
export const generateRandomEvents = (): Event[] => {
    const events: Event[] = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get start and end of current month
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);
    
    // Get start and end of current week
    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - currentDayOfWeek);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    // Track used time slots to prevent overlaps
    const usedTimeSlots: { from: Date; to: Date }[] = [];
    
    // Helper function to find a non-overlapping time slot
    const findNonOverlappingSlot = (dateRange: { start: Date; end: Date }, maxAttempts = 20): { from: Date; to: Date } | null => {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const randomDay = getRandomWorkingDay(dateRange.start, dateRange.end);
            const validSlots = getValidTimeSlotsInPakistan(randomDay);
            
            if (validSlots.length === 0) continue;
            
            const randomSlot = validSlots[Math.floor(Math.random() * validSlots.length)];
            
            // Create event time (1.5 hours duration) in Pakistan time
            const eventTime = {
                from: new Date(randomSlot.start),
                to: new Date(randomSlot.start.getTime() + 60 * 60 * 1000) // 1.5 hours
            };
            
            // Ensure event doesn't exceed the working day (6 PM PKT)
            if (eventTime.to.getHours() > 18) {
                eventTime.to.setHours(18, 0, 0, 0);
            }
            
            // Check for overlaps with existing events
            const hasOverlap = usedTimeSlots.some(usedSlot => doEventsOverlap(eventTime, usedSlot));
            
            if (!hasOverlap) {
                usedTimeSlots.push(eventTime);
                return eventTime;
            }
        }
        return null;
    };
    
    // Generate 10 events for this month
    for (let i = 0; i < 10; i++) {
        const eventTime = findNonOverlappingSlot({ start: monthStart, end: monthEnd });
        
        if (eventTime) {
            events.push({
                id: `month-event-${i + 1}`,
                title: EVENT_TITLES[Math.floor(Math.random() * EVENT_TITLES.length)],
                time: eventTime,
                color: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
                status: EVENT_STATUSES[Math.floor(Math.random() * EVENT_STATUSES.length)],
                description: `Random event ${i + 1} for this month`,
                meetingLink: Math.random() > 0.5 ? `https://meet.example.com/${i + 1}` : undefined,
                host: `Host ${i + 1}`,
                hostEmail: `host${i + 1}@example.com`,
                invitee: `Invitee ${i + 1}`,
                inviteeEmail: `invitee${i + 1}@example.com`
            });
        }
    }
    
    // Generate 5 additional events for this week
    for (let i = 0; i < 5; i++) {
        const eventTime = findNonOverlappingSlot({ start: weekStart, end: weekEnd });
        
        if (eventTime) {
            events.push({
                id: `week-event-${i + 1}`,
                title: EVENT_TITLES[Math.floor(Math.random() * EVENT_TITLES.length)],
                time: eventTime,
                color: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
                status: EVENT_STATUSES[Math.floor(Math.random() * EVENT_STATUSES.length)],
                description: `Random event ${i + 1} for this week`,
                meetingLink: Math.random() > 0.5 ? `https://meet.example.com/week-${i + 1}` : undefined,
                host: `Host ${i + 1}`,
                hostEmail: `host${i + 1}@example.com`,
                invitee: `Invitee ${i + 1}`,
                inviteeEmail: `invitee${i + 1}@example.com`
            });
        }
    }
    
    return events;
};

// Helper function to create a new event with validation
export const createEvent = (eventData: Omit<Event, 'id'>): Event => {
    return {
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...eventData
    };
};

// Helper function to validate event data
export const validateEvent = (event: Partial<Event>): boolean => {
    return !!(
        event.title && 
        event.title.trim() !== '' &&
        event.time &&
        event.time.from &&
        event.time.to &&
        event.color &&
        event.status
    );
};



// Helper to darken a hex color slightly
export function darkenColor(hex: string, amount = 0.2): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max((num >> 16) - 255 * amount, 0);
  const g = Math.max(((num >> 8) & 0x00ff) - 255 * amount, 0);
  const b = Math.max((num & 0x0000ff) - 255 * amount, 0);
  return `rgb(${r},${g},${b})`;
}

// Helper function to convert UTC event times to a specific timezone
export function convertEventToTimezone(event: Event, timezone: string = 'Asia/Karachi'): Event {
  // For now, we'll use a simple approach since date-fns-tz isn't installed
  // In a real app, you'd want to install @date-fns/tz for proper timezone handling
  
  // Get timezone offset (simplified - in production you'd use proper timezone libraries)
  const getTimezoneOffset = (tz: string): number => {
    const timezoneOffsets: Record<string, number> = {
      'UTC': 0,
      'America/New_York': -5, // EST (adjust for DST in real app)
      'America/Chicago': -6, // CST
      'America/Denver': -7, // MST
      'America/Los_Angeles': -8, // PST
      'Europe/London': 0, // GMT
      'Europe/Paris': 1, // CET
      'Asia/Tokyo': 9, // JST
      'Asia/Karachi': 5, // PKT (Pakistan Standard Time - UTC+5)
      'Asia/Jakarta': 7, // WIB
      'Asia/Bali': 8, // WITA
    };
    return timezoneOffsets[tz] || 5; // Default to Pakistan time if timezone not found
  };
  
  const offsetHours = getTimezoneOffset(timezone);
  const offsetMs = offsetHours * 60 * 60 * 1000;
  
  return {
    ...event,
    time: {
      from: new Date(event.time.from.getTime() + offsetMs),
      to: new Date(event.time.to.getTime() + offsetMs)
    }
  };
}

// Helper function to get events for a specific day and hour slot
export function getEventsInSlot(events: Event[], day: Date, hour: number, timezone: string = 'Asia/Karachi'): {
  event: Event;
  position: 'start' | 'middle' | 'end' | 'full';
  heightPercentage: number;
}[] {
  const slotStart = new Date(day);
  slotStart.setHours(hour, 0, 0, 0);
  
  const slotEnd = new Date(day);
  slotEnd.setHours(hour + 1, 0, 0, 0);
  
  return events
    .map(event => convertEventToTimezone(event, timezone))
    .filter(event => {
      // Check if event overlaps with this hour slot
      return event.time.from < slotEnd && event.time.to > slotStart;
    })
    .map(event => {
      // Calculate position and height within the slot
      const eventStart = Math.max(event.time.from.getTime(), slotStart.getTime());
      const eventEnd = Math.min(event.time.to.getTime(), slotEnd.getTime());
      const slotDuration = slotEnd.getTime() - slotStart.getTime(); // 1 hour
      const eventDuration = eventEnd - eventStart;
      const heightPercentage = (eventDuration / slotDuration) * 100;
      
      // Determine position
      let position: 'start' | 'middle' | 'end' | 'full' = 'middle';
      
      if (event.time.from >= slotStart && event.time.to <= slotEnd) {
        position = 'full'; // Event starts and ends within this slot
      } else if (event.time.from >= slotStart) {
        position = 'start'; // Event starts in this slot
      } else if (event.time.to <= slotEnd) {
        position = 'end'; // Event ends in this slot
      }
      
      return {
        event,
        position,
        heightPercentage
      };
    });
}