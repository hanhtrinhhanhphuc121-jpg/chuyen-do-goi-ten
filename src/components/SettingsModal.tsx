import React from 'react';
import { X, Settings, Volume2, Type, Gauge, Timer, Sparkles, Check, Download } from 'lucide-react';
import { GameSettings, SpinSpeed, FontSize } from '../types/game';
import { getAssetUrl } from '../utils/assets';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  const update = (partial: Partial<GameSettings>) => {
    onUpdateSettings({ ...settings, ...partial });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-sky-950 via-slate-900 to-sky-950 rounded-3xl border-2 border-amber-400/50 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-sky-900 to-emerald-900 border-b border-amber-400/30 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Thiết Lập Trò Chơi</h2>
              <p className="text-xs text-emerald-200/80">Tùy chỉnh tốc độ, âm thanh & hiển thị máy chiếu</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Cỡ chữ tên học sinh (Font size) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Type className="w-4 h-4" />
              <span>Cỡ chữ tên học sinh (Phù hợp máy chiếu)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'normal', label: 'Chuẩn' },
                  { id: 'large', label: 'Lớn (Mặc định)' },
                  { id: 'huge', label: 'Cực lớn (Máy chiếu)' },
                ] as { id: FontSize; label: string }[]
              ).map((item) => (
                <button
                  key={item.id}
                  onClick={() => update({ fontSize: item.id })}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    settings.fontSize === item.id
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tốc độ gọi tên (Spin Speed) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Gauge className="w-4 h-4" />
              <span>Tốc độ cuộn tên học sinh</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'slow', label: 'Chậm rãi' },
                  { id: 'medium', label: 'Vừa phải' },
                  { id: 'fast', label: 'Nhanh & Kịch tính' },
                ] as { id: SpinSpeed; label: string }[]
              ).map((item) => (
                <button
                  key={item.id}
                  onClick={() => update({ spinSpeed: item.id })}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    settings.spinSpeed === item.id
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Âm thanh & Âm lượng */}
          <div className="space-y-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Âm thanh trò chơi</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => update({ soundEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {settings.soundEnabled && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Âm lượng</span>
                  <span className="font-bold text-amber-300">
                    {Math.round(settings.soundVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={(e) => update({ soundVolume: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Tự động dừng (Auto-stop timer) */}
          <div className="space-y-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white">Tự động dừng sau vài giây</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoStop}
                  onChange={(e) => update({ autoStop: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
              </label>
            </div>

            {settings.autoStop && (
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-300">Thời gian quay:</span>
                <div className="flex items-center gap-1.5">
                  {[3, 4, 6, 8].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => update({ autoStopSeconds: sec })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                        settings.autoStopSeconds === sec
                          ? 'bg-sky-500 text-slate-950 border-sky-300'
                          : 'bg-white/5 text-slate-300 border-white/10'
                      }`}
                    >
                      {sec} giây
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pháo hoa chúc mừng (Confetti) */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold text-white">Hiệu ứng pháo hoa chúc mừng</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.confettiEnabled}
                onChange={(e) => update({ confettiEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Tải mã nguồn trọn gói ZIP */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-sky-500/15 border border-amber-400/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Gói ứng dụng hoàn chỉnh (.ZIP)</span>
                <span className="text-[10px] sm:text-[11px] text-emerald-200/90">Bao gồm mã nguồn, ảnh mới & bản chạy ngoại tuyến</span>
              </div>
            </div>
            <a
              href={getAssetUrl('/chuyen-do-goi-ten.zip')}
              download="chuyen-do-goi-ten.zip"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95 shrink-0"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Tải ZIP</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-900 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow"
          >
            <Check className="w-4 h-4" />
            <span>Lưu & Đóng</span>
          </button>
        </div>
      </div>
    </div>
  );
};
