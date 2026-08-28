"use client";

import { useState, useEffect } from "react";

export function useGlowAnimation(duration: number = 1000) {
  const [showGlow, setShowGlow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGlow(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return showGlow;
}