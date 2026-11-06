import React, { useState } from 'react';
import {
  X,
  Crosshair,
  RotateCcw,
  Save,
  Sparkles,
  Search,
  Eye,
  Sliders,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { Student, StudentPosition } from '../types/game';
import { StudentGlowOverlay } from './StudentGlowOverlay';
import { DEFAULT_STUDENT_POSITIONS } from '../data/studentPositions';
import { getAssetUrl, BOAT_ARTWORK_URL } from '../utils/assets';

interface StudentPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  positions: Record<string, StudentPosition>;
  onSavePositions: (newPositions: Record<string, StudentPosition>) => void;
  onResetPositions: () => void;
}

export const StudentPositionModal: React.FC<StudentPositionModalProps> = ({
  isOpen,
  onClose,
  students,
  positions,
  onSavePositions,
  onResetPositions,
}) => {
  const [localPositions, setLocalPositions] = useState<Record<string, StudentPosition>>({
    ...positions,
  });
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || 'lh-1'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [previewGlow, setPreviewGlow] = useState(false);
  const [showAllPins, setShowAllPins] = useState(true);
  const [hasSaved, setHasSaved] = useState(false);

  // Sync local positions when modal opens or positions prop updates
  React.useEffect(() => {
    setLocalPositions({ ...positions });
  }, [positions, isOpen]);

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const currentPos: StudentPosition = localPositions[selectedStudentId] ||
    DEFAULT_STUDENT_POSITIONS[selectedStudentId] || { x: 50, y: 50, radius: 4.2 };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesQuery = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender =
      genderFilter === 'all' || s.gender === genderFilter;
    return matchesQuery && matchesGender;
  });

  // Handle clicking on artwork to place position
  const handleArtworkClick = (x: number, y: number) => {
    setLocalPositions((prev) => ({
      ...prev,
      [selectedStudentId]: {
        ...currentPos,
        x,
        y,
      },
    }));
    setHasSaved(false);
  };

  // Nudge position by delta
  const handleNudge = (dx: number, dy: number) => {
    const newX = parseFloat(Math.max(5, Math.min(95, currentPos.x + dx)).toFixed(1));
    const newY = parseFloat(Math.max(10, Math.min(90, currentPos.y + dy)).toFixed(1));
    setLocalPositions((prev) => ({
      ...prev,
      [selectedStudentId]: {
        ...currentPos,
        x: newX,
        y: newY,
      },
    }));
    setHasSaved(false);
  };

  // Adjust radius
  const handleRadiusChange = (newRadius: number) => {
    setLocalPositions((prev) => ({
      ...prev,
      [selectedStudentId]: {
        ...currentPos,
        radius: parseFloat(newRadius.toFixed(1)),
      },
    }));
    setHasSaved(false);
  };

  // Save changes
  const handleSave = () => {
    onSavePositions(localPositions);
    setHasSaved(true);
    setTimeout(() => setHasSaved(false), 2000);
  };

  // Reset to default coordinates
  const handleReset = () => {
    if (window.confirm('Khôi phục tọa độ mặc định chuẩn của 41 học sinh trên con thuyền?')) {
      onResetPositions();
      setLocalPositions({ ...DEFAULT_STUDENT_POSITIONS });
      setHasSaved(true);
      setTimeout(() => setHasSaved(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[900px] bg-gradient-to-b from-sky-950 via-slate-900 to-sky-950 rounded-3xl border-2 border-amber-400/60 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-sky-900 via-slate-900 to-emerald-900 border-b border-amber-400/30 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow">
              <Crosshair className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>GÁN VỊ TRÍ HỌC SINH TRÊN CON THUYỀN</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {students.length} Học Sinh
                </span>
              </h2>
              <p className="text-xs text-emerald-200/90">
                Nhấp vào mặt học sinh trên ảnh để gán tọa độ hào quang phát sáng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer active:scale-95 ${
                hasSaved
                  ? 'bg-emerald-500 text-slate-950 border border-emerald-300'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 border border-yellow-200'
              }`}
            >
              {hasSaved ? <Check className="w-4 h-4 stroke-[3]" /> : <Save className="w-4 h-4" />}
              <span>{hasSaved ? 'Đã Lưu!' : 'Lưu Vị Trí'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content: Split into Left Artwork Canvas & Right Student List/Controls */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden">
          {/* LEFT: 16:9 ARTWORK INTERACTIVE CALIBRATION CANVAS (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between min-h-0 bg-slate-950/80 rounded-2xl border border-amber-400/30 p-2 overflow-hidden">
            {/* Top Canvas Controls Bar */}
            <div className="flex items-center justify-between px-2 py-1 mb-1.5 text-xs text-amber-200/90 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                  Đang chọn:
                </span>
                <span className="font-black text-white text-sm bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/40">
                  {currentStudent.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  ({currentStudent.gender === 'female' ? 'Nữ' : 'Nam'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAllPins(!showAllPins)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                    showAllPins
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  {showAllPins ? 'Ẩn 41 Ghim' : 'Hiện 41 Ghim'}
                </button>

                <button
                  onClick={() => setPreviewGlow(!previewGlow)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                    previewGlow
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>{previewGlow ? 'Tắt xem trước' : 'Xem trước hào quang'}</span>
                </button>
              </div>
            </div>

            {/* ARTWORK STAGE: 16:9 CONTAINER MATCHING IMAGE BOUNDS */}
            <div className="flex-1 min-h-0 relative flex items-center justify-center overflow-hidden rounded-xl bg-slate-950">
              <div className="relative aspect-[16/9] max-w-full max-h-full w-full h-full flex items-center justify-center shadow-2xl">
                <img
                  src={BOAT_ARTWORK_URL}
                  onError={(e) => {
                    e.currentTarget.src = getAssetUrl('/assets/aistudio/image_650fee66.png');
                  }}
                  alt="Chuyến Đò Tri Thức - 41 Học sinh Lớp 12.2"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  style={{ aspectRatio: '16/9' }}
                />

                {/* OVERLAY WITH TARGET CROSSHAIR & GLOW PREVIEW */}
                <StudentGlowOverlay
                  selectedStudent={previewGlow ? currentStudent : null}
                  isSpinning={false}
                  positions={localPositions}
                  allStudents={students}
                  isCalibrating={!previewGlow}
                  activeCalibratingId={selectedStudentId}
                  onSelectCalibratingStudent={(id) => setSelectedStudentId(id)}
                  onArtworkClick={handleArtworkClick}
                  showAllPins={showAllPins}
                />
              </div>
            </div>

            {/* Bottom Help Tip */}
            <div className="mt-1.5 px-2 py-1 rounded-lg bg-sky-950/60 border border-sky-400/30 text-[11px] text-sky-200 flex items-center justify-between shrink-0">
              <span>
                💡 <b>Hướng dẫn:</b> Nhấp chuột trực tiếp lên khuôn mặt học sinh trên con thuyền để định vị nhanh.
              </span>
              <span className="font-mono text-cyan-300 font-bold">
                X: {currentPos.x}% • Y: {currentPos.y}% • R: {currentPos.radius || 4.2}%
              </span>
            </div>
          </div>

          {/* RIGHT: STUDENT SELECTOR & NUDGE CONTROLS (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between min-h-0 bg-slate-950/80 rounded-2xl border border-amber-400/30 p-3 overflow-hidden">
            {/* Student Search & Filters */}
            <div className="space-y-2 shrink-0 pb-2 border-b border-white/10">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm tên học sinh (41 em)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Gender Filter Buttons */}
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                <button
                  onClick={() => setGenderFilter('all')}
                  className={`py-1 rounded-lg font-bold transition cursor-pointer border ${
                    genderFilter === 'all'
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  Tất cả ({students.length})
                </button>
                <button
                  onClick={() => setGenderFilter('female')}
                  className={`py-1 rounded-lg font-bold transition cursor-pointer border ${
                    genderFilter === 'female'
                      ? 'bg-rose-500 text-white border-rose-300'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  Nữ (22)
                </button>
                <button
                  onClick={() => setGenderFilter('male')}
                  className={`py-1 rounded-lg font-bold transition cursor-pointer border ${
                    genderFilter === 'male'
                      ? 'bg-sky-500 text-white border-sky-300'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  Nam (19)
                </button>
              </div>
            </div>

            {/* Scrollable Student List */}
            <div className="flex-1 min-h-0 overflow-y-auto py-2 space-y-1 pr-1">
              {filteredStudents.map((st, idx) => {
                const pos = localPositions[st.id] || DEFAULT_STUDENT_POSITIONS[st.id];
                const isSelected = st.id === selectedStudentId;
                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      setSelectedStudentId(st.id);
                      setPreviewGlow(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left text-xs transition cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black border-white shadow-md'
                        : 'bg-slate-900/70 hover:bg-slate-800 text-slate-200 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isSelected
                            ? 'bg-slate-950 text-amber-300'
                            : st.gender === 'female'
                            ? 'bg-rose-500/30 text-rose-300'
                            : 'bg-sky-500/30 text-sky-300'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="truncate">{st.name}</span>
                    </div>

                    <div className="text-[10px] font-mono shrink-0 ml-1 opacity-80">
                      {pos ? `${pos.x}%, ${pos.y}%` : 'Chưa gán'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Precision Nudge & Radius Controls */}
            <div className="pt-2 border-t border-white/10 space-y-2.5 shrink-0 bg-slate-900/90 p-2.5 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" />
                  Tinh Chỉnh Vị Trí (Nudge)
                </span>
                <span className="font-mono text-[11px] text-cyan-300">
                  X: {currentPos.x}% | Y: {currentPos.y}%
                </span>
              </div>

              {/* Directional Pad */}
              <div className="flex items-center justify-center gap-1.5">
                <button
                  onClick={() => handleNudge(-0.5, 0)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition cursor-pointer"
                  title="Dịch sang trái (-0.5%)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => handleNudge(0, -0.5)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition cursor-pointer"
                    title="Dịch lên trên (-0.5%)"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleNudge(0, 0.5)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition cursor-pointer"
                    title="Dịch xuống dưới (+0.5%)"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleNudge(0.5, 0)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition cursor-pointer"
                  title="Dịch sang phải (+0.5%)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Glow Radius Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Kích thước vùng phát sáng (Bán kính)</span>
                  <span className="font-bold text-amber-300">{currentPos.radius || 4.2}%</span>
                </div>
                <input
                  type="range"
                  min="2.5"
                  max="7.0"
                  step="0.1"
                  value={currentPos.radius || 4.2}
                  onChange={(e) => handleRadiusChange(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Reset to Defaults button */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleReset}
                  className="text-[11px] text-slate-400 hover:text-red-300 flex items-center gap-1 transition cursor-pointer"
                  title="Khôi phục tọa độ 41 học sinh về mặc định ban đầu"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Khôi phục mặc định</span>
                </button>

                <button
                  onClick={handleSave}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu vị trí</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
