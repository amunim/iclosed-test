import { create } from 'zustand';
import { Event, generateRandomEvents } from '../utils/events';

interface EventsState {
    events: Event[];
    addEvent: (event: Event) => void;
    removeEvent: (id: string) => void;
    updateEvent: (id: string, updates: Partial<Event>) => void;
    getEventById: (id: string) => Event | undefined;
    getEventsByStatus: (status: 'busy' | 'available') => Event[];
}

export const useEventsStore = create<EventsState>((set, get) => ({
    events: generateRandomEvents(),
    
    addEvent: (event: Event) =>
        set((state) => ({
            events: [...state.events, event]
        })),
        
    removeEvent: (id: string) =>
        set((state) => ({
            events: state.events.filter((event) => event.id !== id)
        })),
        
    updateEvent: (id: string, updates: Partial<Event>) =>
        set((state) => ({
            events: state.events.map((event) =>
                event.id === id ? { ...event, ...updates } : event
            )
        })),
        
    getEventById: (id: string) => {
        const state = get();
        return state.events.find((event) => event.id === id);
    },
    
    getEventsByStatus: (status: 'busy' | 'available') => {
        const state = get();
        return state.events.filter((event) => event.status === status);
    }
}));
