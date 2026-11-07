import React, { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Square,
  SkipForward,
  RotateCcw,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  X,
  Clock,
} from 'lucide-react';
import { Student, StudentPosition } from '../types/game';
import { KnowledgeBoatScene } from './KnowledgeBoatScene';

interface BoatTheaterModeProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  selectedStudent: Student | null;
  spinningStudent?: Student | null;
  displayName: string;
  isSpinning: boolean;
  countdown?: number;
  noRepeat: boolean;
  onToggleNoRepeat: () => void;
  onStart: () => void;
  onStop?: () => void;
  onNext: () => void;
  onResetRound: () => void;
  allCalled: boolean;
  remainingCount: number;
  totalStudents: number;
  calledStudentIds: Set<string>;
  teacherName: string;
  schoolName?: string;
  className?: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  positions?: Record<string, StudentPosition>;
}

export const BoatTheaterMode: React.FC<BoatTheaterModeProps> = ({
  isOpen,
  onClose,
  students,
  selectedStudent,
  spinningStudent,
  displayName,
  isSpinning,
  countdown = 5.0,
  noRepeat,
  onToggleNoRepeat,
  onStart,
  onStop,
  onNext,
  onResetRound,
  allCalled,
  remainingCount,
  totalStudents,
  calledStudentIds,
  teacherName,
  schoolName,
  className,
  soundEnabled,
  onToggleSound,
  positions,
}) => {
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  // Sync browser fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      setIsBrowserFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Request browser fullscreen when opening theater mode (safe on iOS where requestFullscreen is undefined)
  useEffect(() => {
    if (isOpen) {
      try {
        const doc = document as any;
        const docEl = document.documentElement as any;
        const fsEl = doc.fullscreenElement || doc.webkitFullscreenElement;
        if (!fsEl) {
          if (docEl.requestFullscreen) {
            docEl.requestFullscreen().catch(() => {});
          } else if (docEl.webkitRequestFullscreen) {
            docEl.webkitRequestFullscreen();
          }
        }
      } catch (e) {
        // Safe on iOS
      }
    }
  }, [isOpen]);

  // Safe exit handler that restores window state and exits fullscreen
  const handleExitTheater = useCallback(async () => {
    try {
      const doc = document as any;
      const fsEl = doc.fullscreenElement || doc.webkitFullscreenElement;
      if (fsEl) {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen().catch(() => {});
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        }
      }
    } catch {
      // safe fallback
    }
    onClose();
  }, [onClose]);

  // Toggle browser fullscreen manually (safe on all mobile browsers)
  const handleToggleFullscreen = async () => {
    try {
      const doc = document as any;
      const docEl = document.documentElement as any;
      const fsEl = doc.fullscreenElement || doc.webkitFullscreenElement;
      if (!fsEl) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        }
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen().catch(() => {});
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        }
      }
    } catch {
      // safe fallback
    }
  };

  // Keyboard shortcut: Escape exits theater mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleExitTheater();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleExitTheater]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen max-w-screen max-h-screen bg-slate-950 flex flex-col justify-between overflow-hidden select-none">
      {/* 
        1. TOP FLOATING CONTROL BAR:
        - Class info on left
        - Sound toggle, real Fullscreen toggle, and Exit button on right
        - Stays strictly at top, never covered by student notification
      */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-5 z-40 flex items-center justify-between pointer-events-none">
        {/* Left: Class Badge */}
        <div className="bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-400/50 text-white text-xs sm:text-sm font-bold shadow-xl pointer-events-auto flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-amber-300 tracking-wide font-black">TRÌNH CHIẾU CON THUYỀN</span>
          <span className="text-white/40 hidden sm:inline">•</span>
          <span className="text-emerald-200 hidden sm:inline">{schoolName || 'Long Hiệp'}</span>
          <span className="text-amber-200 font-extrabold">({className || '12.2'})</span>
        </div>

        {/* Right: Sound, Fullscreen & Exit Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-full border shadow-xl transition cursor-pointer backdrop-blur-md ${
              soundEnabled
                ? 'bg-emerald-600/40 border-emerald-400/50 text-emerald-200 hover:bg-emerald-600/60'
                : 'bg-red-500/30 border-red-400/40 text-red-300 hover:bg-red-500/50'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Browser Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-amber-400/40 text-amber-300 shadow-xl backdrop-blur-md transition cursor-pointer"
            title={isBrowserFullscreen ? 'Thu nhỏ cửa sổ' : 'Toàn màn hình trình chiếu thực tế'}
          >
            {isBrowserFullscreen ? (
              <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Exit Theater Mode Button (Always interactive and reachable) */}
          <button
            onClick={handleExitTheater}
            className="px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm shadow-2xl border border-red-300/60 backdrop-blur-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Thoát chế độ trình chiếu (Phím Esc)"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Thoát Trình Chiếu</span>
            <span className="sm:hidden">Thoát</span>
          </button>
        </div>
      </div>

      {/* 
        2. 100% FULL STAGE BOAT SCENE:
        Fills 100% width, no black borders, blurred backdrop matching colors, 16:9 strictly maintained
      */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <KnowledgeBoatScene
          students={students}
          selectedStudent={selectedStudent}
          spinningStudent={spinningStudent}
          isSpinning={isSpinning}
          calledStudentIds={calledStudentIds}
          teacherName={teacherName}
          schoolName={schoolName}
          className={className}
          isTheaterMode={true}
          positions={positions}
        />
      </div>

      {/* 
        3. FLOATING ACTION DOCK AT BOTTOM:
        - Contains GỌI TÊN (5s), Next, and No-Repeat buttons
        - Locked when spinning with countdown
      */}
      <div className="absolute bottom-3 sm:bottom-4 inset-x-0 z-40 flex flex-col items-center pointer-events-none px-2 sm:px-4">
        {/* When collapsed: Sleek small floating pill to reopen dock */}
        {dockCollapsed ? (
          <button
            onClick={() => setDockCollapsed(false)}
            className="pointer-events-auto px-4 py-2 rounded-full bg-slate-950/90 hover:bg-slate-900 text-amber-300 font-extrabold text-xs sm:text-sm shadow-[0_8px_25px_rgba(0,0,0,0.8)] border-2 border-amber-400/60 backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95 animate-fadeIn"
            title="Mở thanh điều khiển"
          >
            <ChevronUp className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>BẢNG ĐIỀU KHIỂN</span>
          </button>
        ) : (
          /* When expanded: Full floating dock with all controls */
          <div className="pointer-events-auto bg-slate-950/95 backdrop-blur-xl border-2 border-amber-400/60 shadow-[0_15px_45px_rgba(0,0,0,0.85)] rounded-2xl sm:rounded-3xl px-3 sm:px-5 py-2.5 max-w-4xl w-[96%] sm:w-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-4 transition-all animate-fadeIn">
            {/* Left: Calling Status & Current Name */}
            <div className="flex items-center gap-2.5 min-w-[160px] sm:min-w-[220px] shrink-0">
              <div className="text-left">
                <div className="text-[10px] sm:text-[11px] font-bold text-amber-300/80 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>
                    {isSpinning
                      ? `Đang chọn ngẫu nhiên (${countdown.toFixed(1)}s):`
                      : selectedStudent
                      ? 'Học sinh được gọi:'
                      : 'Trạng thái:'}
                  </span>
                </div>
                <div className="text-sm sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100 truncate max-w-[200px] sm:max-w-[260px]">
                  {selectedStudent
                    ? selectedStudent.name
                    : isSpinning
                    ? displayName
                    : 'Sẵn sàng gọi tên'}
                </div>
              </div>
            </div>

            {/* Center: Action Buttons (GỌI TÊN, Gọi tiếp, Không lặp, Đặt lại) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Nút GỌI TÊN / KHÓA KHI ĐANG QUAY */}
              {!isSpinning ? (
                <button
                  onClick={onStart}
                  disabled={allCalled}
                  className={`px-4 sm:px-6 py-2 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm tracking-wider text-white shadow-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 border-2 shrink-0 ${
                    allCalled
                      ? 'bg-slate-700 border-slate-600 opacity-50 cursor-not-allowed'
                      : 'bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-400 border-emerald-300 shadow-emerald-600/40'
                  }`}
                  title="Bắt đầu gọi tên học sinh ngẫu nhiên (tự động 5 giây)"
                >
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                  <span>GỌI TÊN</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-white/20 border border-white/30 text-white ml-0.5">
                    5s
                  </span>
                </button>
              ) : (
                <button
                  disabled={true}
                  className="px-4 sm:px-6 py-2 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm tracking-wider text-amber-200 shadow-xl border-2 border-amber-400/80 bg-slate-900/95 cursor-not-allowed flex items-center gap-1.5 shrink-0 animate-pulse select-none"
                  title="Hệ thống đang tự động quay và chốt sau đúng 5 giây..."
                >
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-spin" />
                  <span>ĐANG CHỌN... ({countdown.toFixed(1)}s)</span>
                </button>
              )}

              {/* Nút GỌI TIẾP */}
              <button
                onClick={onNext}
                disabled={isSpinning || allCalled}
                className={`px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 border-2 shrink-0 ${
                  isSpinning || allCalled
                    ? 'bg-slate-700/60 border-slate-600 opacity-40 cursor-not-allowed'
                    : 'bg-gradient-to-b from-sky-500 to-blue-700 border-sky-300 shadow-sky-600/30'
                }`}
                title="Gọi học sinh tiếp theo"
              >
                <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>GỌI TIẾP</span>
              </button>

              {/* Nút KHÔNG LẶP */}
              <button
                onClick={onToggleNoRepeat}
                disabled={isSpinning}
                className={`px-3 sm:px-3.5 py-2 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 border-2 shrink-0 ${
                  noRepeat
                    ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 border-yellow-200 shadow-amber-400/30 font-black'
                    : 'bg-slate-800 text-slate-300 border-slate-600'
                }`}
                title={noRepeat ? 'Đang bật Không lặp lại' : 'Đang cho phép lặp lại'}
              >
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                    noRepeat
                      ? 'bg-slate-950 border-amber-200 text-amber-300'
                      : 'bg-slate-900 border-slate-500'
                  }`}
                >
                  {noRepeat && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>KHÔNG LẶP</span>
              </button>

              {/* Nút Đặt lại lượt */}
              <button
                onClick={onResetRound}
                disabled={isSpinning}
                className="p-2 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 hover:text-white transition cursor-pointer shrink-0"
                title="Đặt lại lượt gọi"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Right: Remaining Count & Collapse Button */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="text-right text-xs hidden md:block">
                <span className="text-slate-400">Còn: </span>
                <b className="text-amber-300 text-sm font-black">{remainingCount}</b>
                <span className="text-slate-400">/{totalStudents} em</span>
              </div>

              {/* Collapse button */}
              <button
                onClick={() => setDockCollapsed(true)}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-600 transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
                title="Thu gọn bảng điều khiển để ngắm toàn cảnh con thuyền"
              >
                <ChevronDown className="w-4 h-4" />
                <span className="hidden lg:inline">Thu gọn</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
