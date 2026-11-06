import React from 'react';

interface WaterWaveRipplesProps {
  isSpinning: boolean;
}

export const WaterWaveRipples: React.FC<WaterWaveRipplesProps> = ({ isSpinning }) => {
  return (
    <div className="absolute inset-x-0 bottom-0 h-[18%] pointer-events-none z-10 overflow-hidden select-none">
      {/* 
        1. SHIMMERING RIVER WAVE RIPPLES:
        Soft luminous blue-cyan wave lines that gently drift and shimmer
      */}
      <svg
        viewBox="0 0 1000 120"
        className={`w-full h-full opacity-60 animate-river-shimmer ${
          isSpinning ? '[animation-duration:2.5s]' : '[animation-duration:4.5s]'
        }`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="foamGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="25%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#bae6fd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Wave Line 1: Main river flow */}
        <path
          d="M 0,65 Q 150,52 300,68 T 600,62 T 900,70 T 1000,65"
          fill="none"
          stroke="url(#waveGlow)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Wave Line 2: Boat bottom wake curve */}
        <path
          d="M 80,82 Q 250,96 450,94 T 800,88 T 960,80"
          fill="none"
          stroke="url(#foamGlow)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Wave Line 3: Fine light glimmers */}
        <path
          d="M 220,102 Q 350,110 500,105 T 750,108 T 920,100"
          fill="none"
          stroke="url(#waveGlow)"
          strokeWidth="1.8"
          strokeDasharray="12 18"
        />
      </svg>

      {/* 
        2. SUNSET WATER HIGHLIGHTS:
        Golden and cyan glimmer flecks reflecting on the water surface
      */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute left-[35%] bottom-[25%] w-12 h-1 rounded-full bg-amber-300 blur-[1px] animate-pulse" />
        <div className="absolute left-[58%] bottom-[40%] w-16 h-1 rounded-full bg-yellow-200 blur-[1px] animate-pulse [animation-delay:0.8s]" />
        <div className="absolute left-[78%] bottom-[20%] w-10 h-0.5 rounded-full bg-cyan-200 blur-[1px] animate-pulse [animation-delay:1.4s]" />
      </div>
    </div>
  );
};
