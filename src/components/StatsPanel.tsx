import React from 'react';
import { Users, CheckCircle, Clock, Trophy, BarChart3, RotateCcw } from 'lucide-react';

interface StatsPanelProps {
  totalStudents: number;
  calledCount: number;
  remainingCount: number;
  currentRound: number;
  onResetRound: () => void;
  isProjectorMode?: boolean;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  totalStudents,
  calledCount,
  remainingCount,
  currentRound,
  onResetRound,
  isProjectorMode = false,
}) => {
  const progressPercent = totalStudents > 0 ? Math.round((calledCount / totalStudents) * 100) : 0;

  if (isProjectorMode) {
    // Compact strip for projector mode so it doesn't take up precious screen space
    return (
      <div className="flex items-center justify-center gap-4 bg-sky-950/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-400/30 text-white shadow-lg text-xs">
        <div>
          <span className="text-slate-400">Sĩ số:</span> <b className="text-amber-300">{totalStudents}</b>
        </div>
        <div className="h-4 w-px bg-white/20" />
        <div>
          <span className="text-slate-400">Đã gọi:</span> <b className="text-emerald-400">{calledCount}</b>
        </div>
        <div className="h-4 w-px bg-white/20" />
        <div>
          <span className="text-slate-400">Còn lại:</span> <b className="text-sky-300">{remainingCount}</b>
        </div>
        <div className="h-4 w-px bg-white/20" />
        <div>
          <span className="text-slate-400">Tiến độ:</span> <b className="text-yellow-300">{progressPercent}%</b>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-950/85 to-slate-950/90 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-amber-400/35 shadow-xl text-white flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-400/20">
        <div className="flex items-center space-x-1.5">
          <div className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-bold text-xs sm:text-sm tracking-wide text-amber-200">THỐNG KÊ LỚP HỌC</h2>
        </div>

        <button
          onClick={onResetRound}
          className="text-slate-400 hover:text-amber-300 text-[11px] flex items-center gap-1 transition px-2 py-0.5 hover:bg-white/10 rounded cursor-pointer"
          title="Đặt lại thống kê lượt này"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2">
        {/* Total Students */}
        <div className="bg-white/5 hover:bg-white/10 transition rounded-xl p-2 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-[10px] mb-0.5">
            <span>Tổng số</span>
            <Users className="w-3 h-3 text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">{totalStudents}</div>
          <div className="text-[9px] text-slate-400">Học sinh</div>
        </div>

        {/* Called Students */}
        <div className="bg-emerald-500/10 hover:bg-emerald-500/15 transition rounded-xl p-2 border border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-300 text-[10px] mb-0.5">
            <span>Đã gọi</span>
            <CheckCircle className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-300">{calledCount}</div>
          <div className="text-[9px] text-emerald-400/80">Lượt gọi</div>
        </div>

        {/* Remaining Students */}
        <div className="bg-amber-500/10 hover:bg-amber-500/15 transition rounded-xl p-2 border border-amber-500/30">
          <div className="flex items-center justify-between text-amber-300 text-[10px] mb-0.5">
            <span>Còn lại</span>
            <Clock className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300">{remainingCount}</div>
          <div className="text-[9px] text-amber-400/80">Chưa được gọi</div>
        </div>

        {/* Current Round */}
        <div className="bg-purple-500/10 hover:bg-purple-500/15 transition rounded-xl p-2 border border-purple-500/30">
          <div className="flex items-center justify-between text-purple-300 text-[10px] mb-0.5">
            <span>Vòng quay</span>
            <Trophy className="w-3 h-3 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-200">Vòng {currentRound}</div>
          <div className="text-[9px] text-purple-300/80">Lượt hiện tại</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 pt-1 border-t border-white/10">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300 font-medium">Tiến độ gọi tên</span>
          <span className="font-extrabold text-amber-300">{progressPercent}%</span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-900 border border-white/10 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-amber-500 transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="text-[10px] text-slate-400 text-center pt-0.5">
          {progressPercent === 100
            ? '🎉 Đã hoàn thành 100% học sinh trên đò!'
            : `Đã đi được ${calledCount}/${totalStudents} chặng đường tri thức`}
        </div>
      </div>
    </div>
  );
};
