import React from 'react';

interface TeacherRowingAnimationProps {
  isSpinning: boolean;
  selectedStudentActive: boolean;
}

export const TeacherRowingAnimation: React.FC<TeacherRowingAnimationProps> = ({
  isSpinning,
  selectedStudentActive,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
      {/* 
        1. TEACHER BODY & SHOULDERS SWAY OVERLAY:
        Positioned over Thầy Trầm Thanh Tuấn (X: ~10% to 24%, Y: ~32% to 68%)
      */}
      <div
        className={`absolute pointer-events-none transition-transform ${
          isSpinning ? 'animate-teacher-sway [animation-duration:1.9s]' : 'animate-teacher-sway'
        }`}
        style={{
          left: '11%',
          top: '32%',
          width: '13%',
          height: '38%',
        }}
      >
        {/* Subtle breathing light shimmer on teacher's blue checkered shirt during spin */}
        {isSpinning && (
          <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-md animate-pulse" />
        )}
      </div>

      {/* 
        2. DYNAMIC OAR SWING & STROKE OVERLAY:
        Pivots around teacher's hands (X: ~12% to 23%, Y: ~35% to 94%)
      */}
      <div
        className={`absolute pointer-events-none ${
          isSpinning ? 'animate-oar-rowing [animation-duration:1.9s]' : 'animate-oar-rowing'
        }`}
        style={{
          left: '10.5%',
          top: '34%',
          width: '13%',
          height: '60%',
        }}
      >
        {/* Subtle glowing reflection along the wooden oar shaft */}
        <svg
          viewBox="0 0 100 200"
          className="w-full h-full overflow-visible opacity-70"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="oarShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="waterSpray" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Golden highlight along the oar angle */}
          <line
            x1="8"
            y1="10"
            x2="88"
            y2="190"
            stroke="url(#oarShine)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity={isSpinning ? '0.85' : '0.45'}
          />

          {/* Paddle blade water slice glimmer */}
          <path
            d="M 80,175 Q 92,192 88,198 Q 78,198 75,182 Z"
            fill="url(#oarShine)"
            opacity={isSpinning ? '0.75' : '0.4'}
          />
        </svg>
      </div>

      {/* 
        3. WATER SPLASH & FOAM RIPPLES AT OAR TIP:
        Located at X: ~21.5%, Y: ~91% where the wooden paddle enters the river
      */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '21.6%',
          top: '91.2%',
          transform: 'translate(-50%, -50%)',
          width: '7%',
          height: '5%',
        }}
      >
        {/* Expanding Ring 1 */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-cyan-200/80 animate-water-splash ${
            isSpinning ? '[animation-duration:1.9s]' : '[animation-duration:2.8s]'
          }`}
          style={{ transformOrigin: 'center' }}
        />

        {/* Expanding Ring 2 (delayed phase) */}
        <div
          className={`absolute inset-0 rounded-full border border-white/70 animate-water-splash ${
            isSpinning
              ? '[animation-duration:1.9s] [animation-delay:0.7s]'
              : '[animation-duration:2.8s] [animation-delay:1.1s]'
          }`}
          style={{ transformOrigin: 'center' }}
        />

        {/* Water Foam Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-1.5 sm:w-4 sm:h-2 rounded-full bg-white/75 blur-[1px] animate-pulse" />

        {/* Water Spray Droplets */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
          <div
            className={`w-1 h-1 rounded-full bg-cyan-100 shadow-sm animate-ping ${
              isSpinning ? '[animation-duration:0.9s]' : '[animation-duration:1.8s]'
            }`}
          />
          <div
            className={`w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-ping ${
              isSpinning ? '[animation-duration:1.1s] [animation-delay:0.3s]' : '[animation-duration:2.1s] [animation-delay:0.5s]'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
