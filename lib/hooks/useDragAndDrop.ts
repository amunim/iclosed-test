import { useState, useRef, useCallback } from 'react';
import { Event } from '@/lib/utils/events';

export interface DragData {
    event: Event;
    originalSlot: {
        day: Date;
        hour: number;
    };
}

export interface DropTarget {
    day: Date;
    hour: number;
    quarter: number; // 0 = :00, 1 = :15, 2 = :30, 3 = :45
    isValid: boolean;
}

export interface DragState {
    isDragging: boolean;
    dragData: DragData | null;
    dropTarget: DropTarget | null;
    dragOffset: { x: number; y: number };
}

export const useDragAndDrop = () => {
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        dragData: null,
        dropTarget: null,
        dragOffset: { x: 0, y: 0 }
    });

    const dragElementRef = useRef<HTMLElement | null>(null);

    const startDrag = useCallback((event: Event, originalSlot: { day: Date; hour: number }, element: HTMLElement, clientX: number, clientY: number) => {
        const rect = element.getBoundingClientRect();
        const offset = {
            x: clientX - rect.left,
            y: clientY - rect.top
        };

        setDragState({
            isDragging: true,
            dragData: { event, originalSlot },
            dropTarget: null,
            dragOffset: offset
        });

        dragElementRef.current = element;
    }, []);

    const updateDropTarget = useCallback((target: DropTarget | null) => {
        setDragState(prev => ({
            ...prev,
            dropTarget: target
        }));
    }, []);

    const endDrag = useCallback(() => {
        const result = {
            dragData: dragState.dragData,
            dropTarget: dragState.dropTarget
        };

        setDragState({
            isDragging: false,
            dragData: null,
            dropTarget: null,
            dragOffset: { x: 0, y: 0 }
        });

        dragElementRef.current = null;
        return result;
    }, [dragState.dragData, dragState.dropTarget]);

    const calculateQuarterFromPosition = useCallback((element: HTMLElement, clientY: number): number => {
        const rect = element.getBoundingClientRect();
        const relativeY = clientY - rect.top;
        const quarterHeight = rect.height / 4;
        
        if (relativeY < quarterHeight) return 0; // :00
        if (relativeY < quarterHeight * 2) return 1; // :15
        if (relativeY < quarterHeight * 3) return 2; // :30
        return 3; // :45
    }, []);

    return {
        dragState,
        startDrag,
        updateDropTarget,
        endDrag,
        calculateQuarterFromPosition
    };
};
