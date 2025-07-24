import { useEffect, useRef } from 'react';

type UseStickyRowSyncProps = {
    horizontalScrollRef: React.RefObject<HTMLElement>; // horizontal scroll container
};

export function useStickyRowSync({
    horizontalScrollRef,
}: UseStickyRowSyncProps) {
    const stickyRowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const horizontalScroll = horizontalScrollRef.current;
        const stickyRow = stickyRowRef.current;

        if (!horizontalScroll || !stickyRow) return;

        const handleHorizontalScroll = () => {
            if (stickyRow) {
                stickyRow.style.transform = `translateX(-${horizontalScroll.scrollLeft}px)`;
            }
        };

        horizontalScroll.addEventListener('scroll', handleHorizontalScroll);

        return () => {
            horizontalScroll.removeEventListener('scroll', handleHorizontalScroll);
        };
    }, [horizontalScrollRef]);

    return stickyRowRef;
}
