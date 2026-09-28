import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const DeafSoundLogo: React.FC<LogoProps> = ({ className = 'h-8 w-auto', size = 32 }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {/* Fallback to high-res SVG neon ear with soundwaves matching Image 1 */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_8px_rgba(76,215,246,0.6)]"
      >
        <defs>
          <linearGradient id="cyberNeon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4cd7f6" />
            <stop offset="100%" stopColor="#00a6e0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Stylized Ear Outline */}
        <path
          d="M 42 22 C 26 22 18 35 18 50 C 18 63 26 74 38 78 C 44 80 47 74 44 68 C 40 60 38 52 38 46 C 38 34 45 28 52 34 C 54 36 57 38 57 42 C 57 48 50 51 46 54 C 41 58 40 63 43 67"
          stroke="url(#cyberNeon)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* Inner ear curve */}
        <path
          d="M 36 43 C 33 46 32 50 34 54 C 36 58 39 58 39 55"
          stroke="url(#cyberNeon)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Dynamic Acoustic Soundwave */}
        <path
          d="M 52 50 L 59 50 L 64 36 L 70 64 L 76 43 L 81 50 L 89 50"
          stroke="url(#cyberNeon)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* Pulse spark radiating lines */}
        <line x1="70" y1="24" x2="70" y2="30" stroke="#4cd7f6" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="84" y1="31" x2="80" y2="35" stroke="#4cd7f6" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="88" y1="58" x2="83" y2="56" stroke="#4cd7f6" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="71" y1="70" x2="71" y2="76" stroke="#4cd7f6" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};
