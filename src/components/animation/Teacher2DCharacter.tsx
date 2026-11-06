import React from 'react';
import { Sparkles } from 'lucide-react';

interface Teacher2DCharacterProps {
  isSpinning: boolean;
  isStudentSelected: boolean;
  selectedStudentName?: string;
}

/**
 * 2D Interactive Teacher Overlay Component.
 * ARCHITECTURAL RULES (Strictly Enforced):
 * 1. Exactly ONE teacher on the boat: Thầy Trầm Thanh Tuấn in the master 16:9 illustration at helm (X: 17.2%, Y: 46.5%).
 * 2. Does NOT render a duplicate cartoon teacher body or detached floating limbs/oars.
 * 3. Dynamic water splash and ripples at the wooden oar blade tip in the river (X: 21.8%, Y: 92%).
 * 4. When a student is selected: Displays an inviting speech callout from the teacher at the helm:
 *    "Thầy mời em [Tên] phát biểu! ✨"
 * 5. Returns to serene state automatically when spinning or calling the next student.
 */
export const Teacher2DCharacter: React.FC<Teacher2DCharacterProps> = ({
  isSpinning,
  isStudentSelected,
  selectedStudentName,
}) => {
  const isInviting = isStudentSelected && !isSpinning && !!selectedStudentName;

  return (
    <>
      {/* 
        1. WATER SPLASH & RIPPLE PULSE AT TEACHER'S WOODEN OAR TIP (X: 20.5%, Y: 92.5%):
        Naturally animates the paddle stroke cutting through the river water without drawing fake limbs.
        Accelerates during spinning to build excitement.
        When a student is chosen, the teacher stops rowing (splash pauses & fades out).
      */}
      <div
        className={`absolute pointer-events-none z-15 select-none transition-opacity duration-500 ${
          isInviting ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
        }`}
        style={{
          left: '20.5%',
          top: '92.5%',
          transform: 'translate(-50%, -50%)',
          width: '64px',
          height: '32px',
        }}
      >
        <div
          className={`absolute inset-0 rounded-full border-2 border-cyan-200/80 animate-water-splash ${
            isSpinning ? '[animation-duration:1.6s]' : '[animation-duration:3.2s]'
          }`}
        />
        <div
          className={`absolute inset-0 rounded-full border border-white/70 animate-water-splash ${
            isSpinning
              ? '[animation-duration:1.6s] [animation-delay:0.5s]'
              : '[animation-duration:3.2s] [animation-delay:1.1s]'
          }`}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-1.5 rounded-full bg-white/90 blur-[0.5px] animate-pulse" />
      </div>

      {/* 
        2. TEACHER INVITATION GESTURE & SPEECH BALLOON:
        Positioned right above Thầy Trầm Thanh Tuấn at the helm (X: 14.2%, Y: 44.5%)
        Thầy dừng chèo thuyền, đưa tay mời học sinh được chọn phát biểu.
      */}
      {isInviting && (
        <div
          className="absolute pointer-events-auto z-40 select-none animate-winner-celebrate"
          style={{
            left: '14.2%',
            top: '28%',
            transform: 'translate(-50%, -100%)',
          }}
        >
          {/* Inviting Hand Gesture extending toward the boat */}
          <div className="absolute -right-7 top-1/2 -translate-y-1/2 animate-bounce z-50 pointer-events-none">
            <span className="text-xl sm:text-2xl filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.9)]">
              🫱
            </span>
          </div>

          <div className="relative px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-100 to-amber-50 text-slate-950 font-black text-xs sm:text-sm shadow-[0_10px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(251,191,36,0.6)] border-2 border-amber-500 whitespace-nowrap flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 fill-current shrink-0 animate-spin" style={{ animationDuration: '5s' }} />
            <span className="text-amber-900 font-extrabold">Thầy mời em</span>
            <strong className="text-amber-950 font-black underline decoration-amber-500 decoration-2">
              {selectedStudentName}
            </strong>
            <span className="text-amber-900 font-extrabold">phát biểu! ✨</span>

            {/* Downward tail pointing directly to Thầy Trầm Thanh Tuấn */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-5 border-x-transparent border-t-6 border-t-amber-500 drop-shadow" />
          </div>
        </div>
      )}
    </>
  );
};
