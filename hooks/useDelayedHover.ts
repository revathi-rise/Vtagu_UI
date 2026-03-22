// hooks/useDelayedHover.ts
'use client';

import { useState, useRef } from "react";

export function useDelayedHover(delay = 400) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: number) => {
    timeoutRef.current = setTimeout(() => {
      setHoveredId(id);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredId(null);
  };

  return { hoveredId, handleMouseEnter, handleMouseLeave };
}