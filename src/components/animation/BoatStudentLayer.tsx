import React, { useState, useEffect } from 'react';
import { Student, StudentPosition, StudentAnimationState } from '../../types/game';
import { Student2DCharacter } from './Student2DCharacter';
import { DEFAULT_STUDENT_POSITIONS } from '../../data/studentPositions';

interface BoatStudentLayerProps {
  students: Student[];
  positions: Record<string, StudentPosition>;
  selectedStudent: Student | null;
  spinningStudent?: Student | null;
  isSpinning: boolean;
}

/**
 * Coordinates student interaction on the boat.
 * ARCHITECTURAL RULE:
 * - During 5s random calling: Illuminates candidate students on the boat in sync with the shuffling name.
 * - When stopped: Only the selected student is highlighted with golden celebration aura and waving hand.
 * - When no student is selected, this layer renders zero duplicate elements.
 */
export const BoatStudentLayer: React.FC<BoatStudentLayerProps> = ({
  students,
  positions,
  selectedStudent,
  spinningStudent,
  isSpinning,
}) => {
  const [animState, setAnimState] = useState<StudentAnimationState>('IDLE');

  useEffect(() => {
    if (selectedStudent && !isSpinning) {
      // 1. Immediately enter SELECTED state (Arm raise & waving hand)
      setAnimState('SELECTED');

      // 2. Transition to SPEAKING state after 2.8s
      const speakingTimer = window.setTimeout(() => {
        setAnimState('SPEAKING');
      }, 2800);

      // 3. Transition to RETURN state after 6.5s
      const returnTimer = window.setTimeout(() => {
        setAnimState('RETURN');
        setTimeout(() => {
          setAnimState('IDLE');
        }, 800);
      }, 6500);

      return () => {
        clearTimeout(speakingTimer);
        clearTimeout(returnTimer);
      };
    } else {
      setAnimState('IDLE');
    }
  }, [selectedStudent, isSpinning]);

  // Helper to resolve student position with fallback to standard boat slots
  const getStudentPos = (student: Student | null | undefined): StudentPosition | null => {
    if (!student) return null;
    if (positions[student.id]) return positions[student.id];

    // Fallback: map student by index in students array to one of the 41 predefined boat positions
    const defaultKeys = Object.keys(DEFAULT_STUDENT_POSITIONS);
    if (defaultKeys.length === 0) return null;
    const idx = students.findIndex((s) => s.id === student.id);
    const key = defaultKeys[(idx >= 0 ? idx : 0) % defaultKeys.length];
    return positions[key] || DEFAULT_STUDENT_POSITIONS[key] || null;
  };

  // Position of active student
  const activeStudentPos = getStudentPos(selectedStudent);
  const spinningStudentPos = isSpinning ? getStudentPos(spinningStudent) : null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-visible select-none">
      {/* 
        1. DYNAMIC ILLUMINATION DURING 5-SECOND SPIN:
        As each candidate student name flashes on the board, the matching character on the boat
        illuminates with a bright pulsing golden ring and mini name tag!
      */}
      {isSpinning && spinningStudent && spinningStudentPos && (
        <div
          key={`spinning-${spinningStudent.id}`}
          className="absolute pointer-events-none z-30 select-none transition-all duration-75"
          style={{
            left: `${spinningStudentPos.x}%`,
            top: `${spinningStudentPos.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Pulsing golden scan circle */}
          <div
            className="rounded-full border-2 border-yellow-300 bg-amber-400/35 shadow-[0_0_25px_10px_rgba(251,191,36,0.95)] animate-ping"
            style={{
              width: `${(spinningStudentPos.radius || 4.2) * 8}px`,
              height: `${(spinningStudentPos.radius || 4.2) * 8}px`,
              animationDuration: '0.4s',
            }}
          />
          {/* Center glowing focal point */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-amber-200/90 shadow-[0_0_15px_rgba(255,255,255,0.95)]"
            style={{
              width: `${(spinningStudentPos.radius || 4.2) * 4.2}px`,
              height: `${(spinningStudentPos.radius || 4.2) * 4.2}px`,
            }}
          />
          {/* Quick mini nameplate tracking the candidate on the boat */}
          <div
            className="absolute left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/95 text-amber-300 font-black text-[10px] sm:text-xs shadow-[0_4px_12px_rgba(0,0,0,0.85)] border border-amber-400 whitespace-nowrap"
            style={{
              top: `-${(spinningStudentPos.radius || 4.2) * 3.5 + 14}px`,
            }}
          >
            {spinningStudent.name}
          </div>
        </div>
      )}
      {/* 
        1. SPOTLIGHT FOCUS MASK:
        Gently dims surrounding students on the artwork to spotlight the selected student
      */}
      {selectedStudent && activeStudentPos && !isSpinning && (
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out z-15 ${
            animState === 'SELECTED' || animState === 'SPEAKING' ? 'opacity-100' : 'opacity-40'
          }`}
          style={{
            background: `radial-gradient(circle at ${activeStudentPos.x}% ${activeStudentPos.y}%, transparent 0%, transparent ${
              (activeStudentPos.radius || 4.2) * 1.6
            }%, rgba(10, 18, 30, 0.42) ${(activeStudentPos.radius || 4.2) * 3.6}%)`,
          }}
        />
      )}

      {/* 
        2. RENDER ONLY THE ACTIVE SELECTED STUDENT:
        Strictly prevents 41 duplicate characters across the boat.
      */}
      {selectedStudent && activeStudentPos && !isSpinning && (
        <Student2DCharacter
          key={selectedStudent.id}
          student={selectedStudent}
          position={activeStudentPos}
          animState={animState}
          isSelected={true}
        />
      )}
    </div>
  );
};
