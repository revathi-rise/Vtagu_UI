import React from 'react';

export default function KidsIcon({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="hotstarKidsBg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFC837" />
          <stop offset="50%" stopColor="#FF8008" />
          <stop offset="100%" stopColor="#FF512F" />
        </linearGradient>
        <linearGradient id="starGlow" x1="0" y1="0" x2="0" y2="100%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF3B0" />
        </linearGradient>
        <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Vibrant Background Circle with Hotstar Gradient */}
      <circle cx="60" cy="60" r="56" fill="url(#hotstarKidsBg)" />
      <circle cx="60" cy="60" r="51" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="6 4" />

      {/* Hotstar Style Playful Mascot Face & Star Crown */}
      <g filter="url(#shadowFilter)">
        {/* Playful Star Crown */}
        <path 
          d="M60 18L66.5 31.2L81 33.3L70.5 43.5L73 58L60 51.1L47 58L49.5 43.5L39 33.3L53.5 31.2L60 18Z" 
          fill="url(#starGlow)"
        />
        
        {/* Playful Eyes */}
        <ellipse cx="48" cy="68" rx="4.5" ry="6.5" fill="#1E1035" />
        <ellipse cx="72" cy="68" rx="4.5" ry="6.5" fill="#1E1035" />
        <circle cx="46.5" cy="66" r="2" fill="white" />
        <circle cx="70.5" cy="66" r="2" fill="white" />

        {/* Cute Cheeks */}
        <circle cx="39" cy="74" r="4.5" fill="#FF4B4B" opacity="0.6" />
        <circle cx="81" cy="74" r="4.5" fill="#FF4B4B" opacity="0.6" />

        {/* Happy Smile */}
        <path 
          d="M48 78C48 78 54 85 60 85C66 85 72 78 72 78" 
          stroke="#1E1035" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
      </g>

      {/* Bold KIDS Banner Badge */}
      <rect x="24" y="88" width="72" height="22" rx="11" fill="#1E1035" stroke="#FFC837" strokeWidth="1.5" />
      <text 
        x="60" 
        y="103" 
        textAnchor="middle" 
        fill="#FFC837" 
        fontSize="12" 
        fontWeight="900" 
        fontFamily="sans-serif"
        letterSpacing="2"
      >
        KIDS
      </text>
    </svg>
  );
}
