import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { Student, StudentPosition } from '../types/game';

interface StudentGlowOverlayProps {
  selectedStudent: Student | null;
  isSpinning: boolean;
  positions: Record<string, StudentPosition>;
  allStudents?: Student[];
  isCalibrating?: boolean;
  activeCalibratingId?: string | null;
  onSelectCalibratingStudent?: (studentId: string) => void;
  onArtworkClick?: (xPercent: number, yPercent: number) => void;
  showAllPins?: boolean;
}

export const StudentGlowOverlay: React.FC<StudentGlowOverlayProps> = ({
  selectedStudent,
  isSpinning,
  positions,
  allStudents = [],
  isCalibrating = false,
  activeCalibratingId = null,
  onSelectCalibratingStudent,
  onArtworkClick,
  showAllPins = false,
}) => {
  // Full celebratory intensity state (first ~5.5s), then eases into gentle ambient glow
  const [isFullCelebration, setIsFullCelebration] = useState(false);

  useEffect(() => {
    if (selectedStudent && !isSpinning) {
      setIsFullCelebration(true);
      const timer = window.setTimeout(() => {
        setIsFullCelebration(false);
      }, 5500);
      return () => clearTimeout(timer);
    } else {
      setIsFullCelebration(false);
    }
  }, [selectedStudent, isSpinning]);

  // Handle artwork click in calibration mode
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCalibrating || !onArtworkClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onArtworkClick(parseFloat(x.toFixed(1)), parseFloat(y.toFixed(1)));
  };

  // Current active student position
  const activeStudentPos = selectedStudent ? positions[selectedStudent.id] : null;
  const activeCalibratingPos = activeCalibratingId ? positions[activeCalibratingId] : null;

  return (
    <div
      onClick={handleContainerClick}
      className={`absolute inset-0 z-20 overflow-visible select-none ${
        isCalibrating ? 'cursor-crosshair' : 'pointer-events-none'
      }`}
    >
      {/* 
        1. SPOTLIGHT DIMMING MASK:
        Gently dims other students and the background while keeping the selected student brilliantly illuminated
      */}
      {selectedStudent && activeStudentPos && !isSpinning && (
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out ${
            isFullCelebration ? 'opacity-100' : 'opacity-40'
          }`}
          style={{
            background: `radial-gradient(circle at ${activeStudentPos.x}% ${activeStudentPos.y}%, transparent 0%, transparent ${
              (activeStudentPos.radius || 4.2) * 1.5
            }%, rgba(10, 18, 30, 0.48) ${(activeStudentPos.radius || 4.2) * 3.6}%)`,
          }}
        />
      )}

      {/* 
        2. GLOWING GOLDEN AURA & CELEBRATION AROUND THE SELECTED STUDENT:
      */}
      {selectedStudent && activeStudentPos && !isSpinning && (
        <div
          className="absolute pointer-events-none transition-all duration-500 z-30"
          style={{
            left: `${activeStudentPos.x}%`,
            top: `${activeStudentPos.y}%`,
          }}
        >
          {/* Expanding ripple wave */}
          {isFullCelebration && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-300 animate-ripple-wave pointer-events-none"
              style={{
                width: `${(activeStudentPos.radius || 4.2) * 26}px`,
                height: `${(activeStudentPos.radius || 4.2) * 26}px`,
              }}
            />
          )}

          {/* Golden Aura Body (Breathing Pulse) */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-aura-breathe pointer-events-none"
            style={{
              width: `${(activeStudentPos.radius || 4.2) * 20}px`,
              height: `${(activeStudentPos.radius || 4.2) * 20}px`,
              background:
                'radial-gradient(circle, rgba(251, 191, 36, 0.85) 0%, rgba(245, 158, 11, 0.45) 50%, rgba(245, 158, 11, 0) 80%)',
              boxShadow:
                '0 0 35px 10px rgba(251, 191, 36, 0.85), 0 0 70px 20px rgba(245, 158, 11, 0.5)',
            }}
          />

          {/* Rotating dashed halo ring */}
          <svg
            className="absolute -translate-x-1/2 -translate-y-1/2 animate-halo-rotate pointer-events-none"
            style={{
              width: `${(activeStudentPos.radius || 4.2) * 22}px`,
              height: `${(activeStudentPos.radius || 4.2) * 22}px`,
            }}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#fef08a"
              strokeWidth="2.5"
              strokeDasharray="8 6"
              opacity="0.9"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              opacity="0.75"
            />
          </svg>

          {/* Pulsing inner core */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/40 blur-[3px] pointer-events-none"
            style={{
              width: `${(activeStudentPos.radius || 4.2) * 12}px`,
              height: `${(activeStudentPos.radius || 4.2) * 12}px`,
            }}
          />

          {/* Animated Twinkling Stars (Ngôi sao lấp lánh) */}
          {isFullCelebration && (
            <>
              {/* Star Top-Left */}
              <div
                className="absolute text-amber-200 text-lg sm:text-xl font-black animate-star-twinkle pointer-events-none drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                style={{ top: '-38px', left: '-36px', animationDelay: '0s' }}
              >
                ✦
              </div>

              {/* Star Top-Right */}
              <div
                className="absolute text-yellow-300 text-sm sm:text-base font-black animate-star-twinkle pointer-events-none drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                style={{ top: '-42px', left: '26px', animationDelay: '0.4s' }}
              >
                ★
              </div>

              {/* Star Bottom-Left */}
              <div
                className="absolute text-amber-100 text-base sm:text-lg font-black animate-star-twinkle pointer-events-none drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                style={{ top: '22px', left: '-38px', animationDelay: '0.8s' }}
              >
                ✦
              </div>

              {/* Star Bottom-Right */}
              <div
                className="absolute text-yellow-400 text-xs sm:text-sm font-black animate-star-twinkle pointer-events-none drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                style={{ top: '26px', left: '28px', animationDelay: '1.2s' }}
              >
                ★
              </div>

              {/* Sparkle badge Center-Top */}
              <div
                className="absolute -top-12 left-0 -translate-x-1/2 animate-bounce pointer-events-none"
                style={{ animationDuration: '1.6s' }}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 fill-current drop-shadow-[0_0_10px_rgba(251,191,36,1)]" />
              </div>

            </>
          )}

          {/* 
            3. FLOATING GOLDEN NAMEPLATE:
            Positioned directly above the student's head
          */}
          <div
            className="absolute -translate-x-1/2 bottom-full mb-3 flex flex-col items-center pointer-events-auto animate-winner-celebrate z-40"
            style={{
              marginBottom: `${(activeStudentPos.radius || 4.2) * 1.1 + 8}px`,
            }}
          >
            <div className="relative px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-[0_8px_25px_rgba(0,0,0,0.85),0_0_20px_rgba(251,191,36,0.8)] border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-900 fill-current shrink-0" />
              <span className="tracking-wide">{selectedStudent.name}</span>
              <span className="text-[10px] font-extrabold bg-slate-950/20 px-1.5 py-0.5 rounded-md text-slate-900">
                {selectedStudent.gender === 'female' ? 'Nữ' : 'Nam'}
              </span>

              {/* Downward indicator triangle pointing to the student's head */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-amber-400 drop-shadow" />
            </div>
          </div>
        </div>
      )}

      {/* 
        4. CALIBRATION MODE OVERLAYS:
        When teacher is mapping student positions on the boat
      */}
      {isCalibrating && (
        <>
          {/* Show all 41 pins if requested */}
          {showAllPins &&
            allStudents.map((st) => {
              const pos = positions[st.id];
              if (!pos) return null;
              const isCurrent = st.id === activeCalibratingId;
              return (
                <div
                  key={st.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectCalibratingStudent) onSelectCalibratingStudent(st.id);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-transform hover:scale-125 z-30 ${
                    isCurrent ? 'scale-125 z-40' : 'opacity-80'
                  }`}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  title={`${st.name} (X: ${pos.x}%, Y: ${pos.y}%)`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] shadow-lg border-2 ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-400/50 animate-pulse'
                        : st.gender === 'female'
                        ? 'bg-rose-500 text-white border-white'
                        : 'bg-sky-500 text-white border-white'
                    }`}
                  >
                    {st.name.split(' ').pop()?.[0] || '•'}
                  </div>
                </div>
              );
            })}

          {/* Active calibrating target crosshair */}
          {activeCalibratingPos && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40"
              style={{
                left: `${activeCalibratingPos.x}%`,
                top: `${activeCalibratingPos.y}%`,
              }}
            >
              {/* Target circle representing aura size */}
              <div
                className="rounded-full border-2 border-dashed border-cyan-400 bg-cyan-400/15 animate-spin"
                style={{
                  width: `${(activeCalibratingPos.radius || 4.2) * 20}px`,
                  height: `${(activeCalibratingPos.radius || 4.2) * 20}px`,
                  animationDuration: '8s',
                }}
              />

              {/* Crosshair lines */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-cyan-400 -translate-y-1/2 shadow" />
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-cyan-400 -translate-x-1/2 shadow" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-300 border-2 border-white shadow-lg animate-ping" />

              {/* Coordinate tooltip */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-950/90 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-400/50 whitespace-nowrap shadow-xl">
                X: {activeCalibratingPos.x}% • Y: {activeCalibratingPos.y}% (R: {activeCalibratingPos.radius || 4.2}%)
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
