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
}

// Helper function to generate random dates
export const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random time duration (1-4 hours)
export const getRandomDuration = () => {
    return Math.floor(Math.random() * 4 + 1) * 60 * 60 * 1000; // 1-4 hours in milliseconds
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
    
    // Generate 10 events for this month
    for (let i = 0; i < 10; i++) {
        const startTime = getRandomDate(monthStart, monthEnd);
        const endTime = new Date(startTime.getTime() + getRandomDuration());
        
        events.push({
            id: `month-event-${i + 1}`,
            title: EVENT_TITLES[Math.floor(Math.random() * EVENT_TITLES.length)],
            time: { from: startTime, to: endTime },
            color: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
            status: EVENT_STATUSES[Math.floor(Math.random() * EVENT_STATUSES.length)],
            description: `Random event ${i + 1} for this month`,
            meetingLink: Math.random() > 0.5 ? `https://meet.example.com/${i + 1}` : undefined
        });
    }
    
    // Generate 5 additional events for this week
    for (let i = 0; i < 5; i++) {
        const startTime = getRandomDate(weekStart, weekEnd);
        const endTime = new Date(startTime.getTime() + getRandomDuration());
        
        events.push({
            id: `week-event-${i + 1}`,
            title: EVENT_TITLES[Math.floor(Math.random() * EVENT_TITLES.length)],
            time: { from: startTime, to: endTime },
            color: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
            status: EVENT_STATUSES[Math.floor(Math.random() * EVENT_STATUSES.length)],
            description: `Random event ${i + 1} for this week`,
            meetingLink: Math.random() > 0.5 ? `https://meet.example.com/week-${i + 1}` : undefined
        });
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
