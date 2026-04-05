'use client';

import { ReactNode, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ScrollRevealProps {
    children: ReactNode;
    width?: "fit-content" | "100%";
}

/**
 * High-performance ScrollReveal component.
 * Uses IntersectionObserver and GPU-accelerated CSS transitions
 * to prevent main-thread jank during scrolling.
 */
export const ScrollReveal = ({ children, width = "100%" }: ScrollRevealProps) => {
    const revealRef = useRef<HTMLDivElement>(null);
    const entry = useIntersectionObserver(revealRef, {
        threshold: 0.1,
        rootMargin: "-100px",
        freezeOnceVisible: true, // Optimizes by un-observing after reveal
    });

    const isVisible = !!entry?.isIntersecting;

    return (
        <div 
            ref={revealRef}
            style={{ position: "relative", width, overflow: "visible" }}
            className={`reveal-hidden ${isVisible ? 'reveal-visible' : ''} gpu-accelerated`}
        >
            {children}
        </div>
    );
};
