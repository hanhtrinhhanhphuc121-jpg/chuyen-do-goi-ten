import React from 'react';
import { Sparkles } from 'lucide-react';
import { Student, StudentPosition, StudentAnimationState } from '../../types/game';

interface Student2DCharacterProps {
  student: Student;
  position: StudentPosition;
  animState: StudentAnimationState;
  isSelected: boolean;
  onClick?: () => void;
}

/**
 * 2D Interactive Highlight & Animation Component for a single student on the boat.
 * ARCHITECTURAL RULE (Strictly Enforced):
 * - Does NOT render duplicate cartoon body sprites over the authentic painting.
 * - In IDLE state: Renders NOTHING (keeps the high-resolution artwork 100% pristine).
 * - In SELECTED state: Renders soft golden aura, articulated waving arm, and floating nameplate above head.
 */
export const Student2DCharacter: React.FC<Student2DCharacterProps> = ({
  student,
  position,
  animState,
  isSelected,
  onClick,
}) => {
  const isFemale = student.gender === 'female';
  const radius = position.radius || 4.2;

  const isSelectedState = animState === 'SELECTED';
  const isSpeakingState = animState === 'SPEAKING';
  const isActive = isSelected || isSelectedState || isSpeakingState;

  // If not selected, render nothing to prevent ANY character duplication over the background image
  if (!isActive) {
    return null;
  }

  // Calculate dynamic scale factor based on perspective row (back row smaller, front row larger)
  // Back row Y is ~24% (scale ~0.82), Front row Y is ~58% (scale ~1.15)
  const perspectiveScale = Math.max(0.78, Math.min(1.2, 0.75 + (position.y / 100) * 0.7));

  return (
    <div
      onClick={onClick}
      className="absolute transition-all duration-300 pointer-events-auto select-none z-35 animate-student-bounce"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        width: `${radius * 6.5 * perspectiveScale}px`,
        height: `${radius * 7.5 * perspectiveScale}px`,
      }}
    >
      {/* 
        Articulated waving hand gesture for selected student:
        Joyfully waves hand celebrating being called
      */}
      <div
        className="absolute -right-3 -top-2 pointer-events-none z-45 animate-hand-wave select-none"
        style={{ transformOrigin: 'bottom left' }}
      >
        <span className="text-xl sm:text-2xl filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]">
          👋
        </span>
      </div>
      {/* 
        1. GOLDEN AURA & CELEBRATION AROUND THE SELECTED STUDENT
        Soft, warm golden halo and breathing glow that hugs the character naturally
      */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        {/* Expanding subtle ripple wave */}
        <div
          className="absolute rounded-full border-2 border-amber-300/80 animate-ripple-wave"
          style={{
            width: `${radius * 18 * perspectiveScale}px`,
            height: `${radius * 18 * perspectiveScale}px`,
          }}
        />

        {/* Golden Breathing Halo */}
        <div
          className="absolute rounded-full animate-aura-breathe"
          style={{
            width: `${radius * 14 * perspectiveScale}px`,
            height: `${radius * 14 * perspectiveScale}px`,
            background:
              'radial-gradient(circle, rgba(251, 191, 36, 0.75) 0%, rgba(245, 158, 11, 0.4) 50%, rgba(245, 158, 11, 0) 80%)',
            boxShadow:
              '0 0 35px 10px rgba(251, 191, 36, 0.8), 0 0 65px 18px rgba(245, 158, 11, 0.45)',
          }}
        />

        {/* Rotating subtle dashed ring */}
        <svg
          className="absolute animate-halo-rotate"
          style={{
            width: `${radius * 15 * perspectiveScale}px`,
            height: `${radius * 15 * perspectiveScale}px`,
          }}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#fef08a"
            strokeWidth="2.2"
            strokeDasharray="8 6"
            opacity="0.85"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.4"
            strokeDasharray="4 8"
            opacity="0.7"
          />
        </svg>

        {/* Twinkling Stars in 4 Corners */}
        <div
          className="absolute -top-7 -left-5 text-amber-200 text-sm font-black animate-star-twinkle drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]"
          style={{ animationDelay: '0s' }}
        >
          ✦
        </div>
        <div
          className="absolute -top-8 right-1 text-yellow-300 text-xs font-black animate-star-twinkle drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]"
          style={{ animationDelay: '0.4s' }}
        >
          ★
        </div>
        <div
          className="absolute top-5 -left-6 text-amber-100 text-xs font-black animate-star-twinkle drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]"
          style={{ animationDelay: '0.8s' }}
        >
          ✦
        </div>
        <div
          className="absolute top-6 right-2 text-yellow-400 text-[10px] font-black animate-star-twinkle drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]"
          style={{ animationDelay: '1.2s' }}
        >
          ★
        </div>
      </div>



      {/* 
        3. FLOATING GOLDEN NAMEPLATE:
        Pinned strictly ABOVE the student's head (at top: -45px), never covering their face.
      */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto animate-winner-celebrate z-50"
        style={{
          top: `-${(radius * 3.8 + 22) * perspectiveScale}px`,
        }}
      >
        <div className="relative px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-[0_8px_25px_rgba(0,0,0,0.85),0_0_20px_rgba(251,191,36,0.8)] border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-900 fill-current shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="tracking-wide">{student.name}</span>
          <span className="text-[10px] font-extrabold bg-slate-950/20 px-1.5 py-0.5 rounded-md text-slate-900">
            {isFemale ? 'Nữ' : 'Nam'}
          </span>
          {isSpeakingState && (
            <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
              <span>Phát biểu</span>
            </span>
          )}

          {/* Downward indicator triangle pointing directly to the student's head */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-amber-400 drop-shadow" />
        </div>
      </div>
    </div>
  );
};
