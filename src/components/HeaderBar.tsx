import React from 'react';
import {
  Users,
  Settings,
  History,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Presentation,
  GraduationCap,
  Tv,
  Crosshair,
} from 'lucide-react';
import { ClassRoom } from '../types/game';
import { soundEffects } from '../utils/soundEffects';

interface HeaderBarProps {
  currentClass: ClassRoom;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isProjectorMode: boolean;
  onToggleProjectorMode: () => void;
  onOpenClassManage: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenBoatTheater: () => void;
  onOpenPositionModal: () => void;
  calledCount: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentClass,
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
  isProjectorMode,
  onToggleProjectorMode,
  onOpenClassManage,
  onOpenHistory,
  onOpenSettings,
  onOpenBoatTheater,
  onOpenPositionModal,
  calledCount,
}) => {
  return (
    <header className="relative z-30 w-full px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-sky-950/85 via-emerald-950/80 to-sky-950/85 backdrop-blur-md border-b border-amber-400/30 text-white shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Left: Branding & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-sky-950 flex items-center justify-center overflow-hidden">
              <span className="text-2xl" role="img" aria-label="boat">🛶</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-red-600 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-amber-300 shadow">
              VN
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                CHUYẾN ĐÒ GỌI TÊN
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-emerald-200/90 flex items-center gap-1.5">
              <span>TRÒ CHƠI GỌI TÊN HỌC SINH NGẪU NHIÊN</span>
              <span className="hidden md:inline text-amber-300/70">• Chuyến Đò Tri Thức</span>
            </p>
          </div>
        </div>

        {/* Center: School & Class info badge */}
        {!isProjectorMode && (
          <div className="flex items-center bg-white/10 hover:bg-white/15 transition-all border border-amber-300/30 rounded-2xl px-3 py-1.5 shadow-inner backdrop-blur-sm">
            <div className="flex items-center space-x-2.5 text-xs sm:text-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-extrabold text-white text-sm sm:text-base tracking-wide">
                    {currentClass.name}
                  </span>
                  <span className="text-[10px] font-bold bg-amber-400/25 text-amber-200 px-1.5 py-0.5 rounded-md border border-amber-400/40">
                    {currentClass.students.length} HS
                  </span>
                  {currentClass.schoolName && (
                    <span className="hidden lg:inline text-[11px] font-medium text-emerald-200/90 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                      {currentClass.schoolName}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-amber-200 font-semibold flex items-center gap-1.5">
                  <span>{currentClass.teacherName || 'Chưa đặt tên giáo viên'}</span>
                  {currentClass.schoolName && (
                    <span className="lg:hidden text-[10px] text-slate-300">
                      • {currentClass.schoolName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenClassManage();
              }}
              className="ml-3 px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 rounded-lg shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1 border border-amber-300"
              title="Quản lý lớp học và danh sách học sinh"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quản lý lớp</span>
            </button>
          </div>
        )}

        {/* Right: Quick action toolbar */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Nút TRÌNH CHIẾU CON THUYỀN (Toàn Màn Hình Máy Chiếu) */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenBoatTheater();
            }}
            className="px-3 py-1.5 rounded-xl font-black text-xs bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 border-2 border-yellow-100 shadow-lg shadow-amber-500/20 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition cursor-pointer shrink-0"
            title="Mở chế độ Trình Chiếu Con Thuyền (Toàn màn hình máy chiếu, phóng to 100%)"
          >
            <Tv className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span className="hidden sm:inline">TRÌNH CHIẾU CON THUYỀN</span>
            <span className="sm:hidden font-extrabold">TRÌNH CHIẾU</span>
          </button>

          {/* Nút GÁN VỊ TRÍ HỌC SINH TRÊN CON THUYỀN */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenPositionModal();
            }}
            className="px-2.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/50 text-cyan-200 hover:text-white shadow-md transition active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0"
            title="Gán và tinh chỉnh vị trí hào quang phát sáng của 41 học sinh trên ảnh con thuyền"
          >
            <Crosshair className="w-4 h-4 text-cyan-300 stroke-[2.5]" />
            <span className="hidden md:inline">Gán vị trí</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundEffects.playClick();
            }}
            className={`p-2 rounded-xl transition cursor-pointer border ${
              soundEnabled
                ? 'bg-emerald-600/30 border-emerald-400/40 text-emerald-200 hover:bg-emerald-600/40'
                : 'bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* History Button */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenHistory();
            }}
            className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition active:scale-95 cursor-pointer"
            title="Lịch sử gọi tên"
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
            {calledCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white shadow">
                {calledCount}
              </span>
            )}
          </button>

          {/* Projector / Minimalist mode */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onToggleProjectorMode();
            }}
            className={`p-2 rounded-xl border transition active:scale-95 cursor-pointer ${
              isProjectorMode
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-lg shadow-amber-400/40'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
            }`}
            title={isProjectorMode ? 'Thoát chế độ máy chiếu (hiện đầy đủ)' : 'Bật chế độ máy chiếu (giao diện tối giản)'}
          >
            <Presentation className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onToggleFullscreen();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition active:scale-95 cursor-pointer hidden sm:block"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình máy chiếu'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              soundEffects.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition active:scale-95 cursor-pointer"
            title="Thiết lập trò chơi"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
