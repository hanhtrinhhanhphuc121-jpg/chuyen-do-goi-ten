import React from 'react';
import { Student, StudentPosition } from '../types/game';
import { Teacher2DCharacter } from './animation/Teacher2DCharacter';
import { BoatStudentLayer } from './animation/BoatStudentLayer';
import { WaterWaveRipples } from './WaterWaveRipples';
import { DEFAULT_STUDENT_POSITIONS } from '../data/studentPositions';
import { getAssetUrl, BOAT_ARTWORK_URL } from '../utils/assets';

interface KnowledgeBoatSceneProps {
  students: Student[];
  selectedStudent: Student | null;
  spinningStudent?: Student | null;
  isSpinning: boolean;
  calledStudentIds: Set<string>;
  teacherName: string;
  schoolName?: string;
  className?: string;
  isTheaterMode?: boolean;
  positions?: Record<string, StudentPosition>;
}

export const KnowledgeBoatScene: React.FC<KnowledgeBoatSceneProps> = ({
  students,
  selectedStudent,
  spinningStudent,
  isSpinning,
  teacherName,
  schoolName,
  className,
  isTheaterMode = false,
  positions = DEFAULT_STUDENT_POSITIONS,
}) => {

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${
        isTheaterMode
          ? 'bg-slate-950'
          : 'rounded-2xl border-2 border-amber-400/50 shadow-2xl bg-slate-950'
      }`}
    >
      {/* 
        Full-bleed blurred artwork background:
        Eliminates dark/black gaps on any screen aspect ratio (16:10, 4:3, ultrawide).
        Uses high opacity and saturation matched to the painting's natural bamboo greens and river blues.
      */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none scale-105"
        style={{
          backgroundImage: `url(${BOAT_ARTWORK_URL})`,
          filter: 'blur(30px) saturate(1.25) brightness(0.85)',
          opacity: 0.9,
        }}
      />

      {/* 
        Foreground 16:9 Artwork Stage:
        Strictly preserves 16:9 aspect ratio, zero stretching or distortion, zero clipping of teacher or students.
        Contains the animated boat with professional 2D rigged teacher and 41 students.
      */}
      <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
        <div className="relative aspect-[16/9] max-w-full max-h-full w-full h-full flex items-center justify-center animate-boat-gentle-bob">
          <img
            src={BOAT_ARTWORK_URL}
            onError={(e) => {
              // Fallback to static public path if needed
              e.currentTarget.src = getAssetUrl('/assets/aistudio/image_650fee66.png');
            }}
            alt="Chuyến Đò Tri Thức - Thầy Trầm Thanh Tuấn và 41 học sinh Lớp 12.2 Trường THCS và THPT Long Hiệp"
            className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
            style={{ aspectRatio: '16/9' }}
          />

          {/* Sóng nước & ánh phản chiếu trên mặt sông */}
          <WaterWaveRipples isSpinning={isSpinning} />

          {/* 
            1. CHUYỂN ĐỘNG THẦY GIÁO 2D CHUYÊN NGHIỆP:
            - Chèo thuyền liên tục với nhịp tự nhiên
            - Hai tay điều khiển một mái chèo duy nhất
            - Mắt chớp tự nhiên, thân người và vai nghiêng nhẹ theo nhịp chèo
            - Khi gọi trúng tên học sinh: tạm dừng chèo, quay sang giơ tay đón chào "Thầy mời em phát biểu!"
          */}
          <Teacher2DCharacter
            isSpinning={isSpinning}
            isStudentSelected={!!selectedStudent}
            selectedStudentName={selectedStudent?.name}
          />

          {/* 
            2. HỆ THỐNG 41 HỌC SINH 2D ĐỘC LẬP (22 NỮ, 19 NAM):
            - Ngồi hoàn toàn trong lòng thuyền theo 4 hàng phối cảnh gần-xa
            - Chớp mắt tự nhiên so le ngẫu nhiên
            - Khi được gọi tên: Hào quang vàng, cánh tay giơ lên vẫy tay 2-3 nhịp thật sự, miệng vui vẻ, cử động môi phát biểu, bảng tên nổi phía trên
            - Các học sinh còn lại giảm nổi bật nhẹ nhưng vẫn nhìn rõ
          */}
          <BoatStudentLayer
            students={students}
            positions={positions}
            selectedStudent={selectedStudent}
            spinningStudent={spinningStudent}
            isSpinning={isSpinning}
          />

          {/* Ambient spin shimmer overlay */}
          {isSpinning && (
            <div className="absolute inset-0 bg-sky-400/15 mix-blend-overlay pointer-events-none animate-pulse rounded-lg" />
          )}



          {/* BOTTOM BADGE: School & Class info (Only shown in standard dashboard view, not in theater mode) */}
          {!isTheaterMode && (
            <div className="absolute bottom-2 left-3 sm:left-4 z-20 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40 text-white text-[10px] sm:text-xs shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-emerald-200">
                {schoolName || 'Trường THCS và THPT Long Hiệp'}
              </span>
              <span className="text-amber-300/60">•</span>
              <span className="text-amber-300 font-extrabold">{className || 'Lớp 12.2'}</span>
              <span className="text-slate-400 hidden sm:inline">(41 Học sinh)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
