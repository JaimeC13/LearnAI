"use client";

import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;     
  delay?: number;      
  className?: string;
}

export function Typewriter({
  text,
  speed = 45,
  delay = 300,
  className = "",
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayText("");
    setIsTypingComplete(false);

    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText((prev) => prev + text.charAt(index));
          index++;
        } else {
          setIsTypingComplete(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayText}
      
      <span
        className={`inline-block w-[2px] h-[1.1em] ml-1 align-middle bg-[#752b26] transition-opacity duration-300 ${
          isTypingComplete ? "animate-pulse" : "animate-bounce"
        }`}
      />
    </span>
  );
}