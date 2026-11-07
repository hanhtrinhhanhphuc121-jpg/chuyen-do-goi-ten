import React, { useState, useId } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  Trash2,
  Download,
  Sparkles,
  AlertCircle,
  Copy,
  RotateCcw,
  Check,
  UserPlus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClassRoom, Student } from '../types/game';
import { soundEffects } from '../utils/soundEffects';

interface UpdateStudentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassRoom[];
  currentClassId: string;
  onSelectClass: (classId: string) => void;
  onUpdateStudentList: (
    classId: string,
    newStudents: Student[],
    replaceMode: boolean,
    resetHistory: boolean
  ) => void;
}

// Sample 40 Vietnamese high school students for quick test
const SAMPLE_STUDENTS_TEXT = `1. Nguyễn Hoàng Kim Chi (Nữ)
2. Trần Ngọc Thanh Thảo (Nữ)
3. Lê Minh Tuấn (Nam)
4. Huỳnh Đức Trí (Nam)
5. Phạm Thị Ngọc Hân (Nữ)
6. Võ Minh Khang (Nam)
7. Đỗ Phương Thuỳ (Nữ)
8. Bùi Gia Huy (Nam)
9. Dương Khánh Linh (Nữ)
10. Ngô Quốc Bảo (Nam)
11. Trương Mỹ Duyên (Nữ)
12. Đặng Đình Phúc (Nam)
13. Lý Thanh Trúc (Nữ)
14. Phan Văn Hưng (Nam)
15. Hồ Thị Bích Ngọc (Nữ)
16. Vũ Hữu Nghĩa (Nam)
17. Mai Thuỳ Trang (Nữ)
18. Đoàn Quang Minh (Nam)
19. Trịnh Ánh Dương (Nữ)
20. Cao Việt Anh (Nam)
21. Đinh Hải Yến (Nữ)
22. Lâm Gia Thịnh (Nam)
23. Tạ Diệu Huyền (Nữ)
24. Nguyễn Nhật Nam (Nam)
25. Tiêu Hồng Nhung (Nữ)
26. Quách Tiến Đạt (Nam)
27. Chung Nhã Uyên (Nữ)
28. Lưu Vĩnh Phát (Nam)
29. Diệp Cẩm Tú (Nữ)
30. Thái Khắc Tiệp (Nam)
31. La Kim Ngân (Nữ)
32. Khổng Trọng Tấn (Nam)
33. Thiều Mai Phương (Nữ)
34. Khưu Vĩnh Thuận (Nam)
35. Tô Kiều Oanh (Nữ)
36. Hà Hữu Thành (Nam)
37. Nhan Thị Cẩm Vân (Nữ)
38. Sử Hạo Nhiên (Nam)
39. Giang Bích Thuỷ (Nữ)
40. Trầm Thanh Tuấn (Nam)`;

export const UpdateStudentListModal: React.FC<UpdateStudentListModalProps> = ({
  isOpen,
  onClose,
  classes,
  currentClassId,
  onSelectClass,
  onUpdateStudentList,
}) => {
  const [selectedClassId, setSelectedClassId] = useState(currentClassId);
  const [inputTab, setInputTab] = useState<'paste' | 'file'>('paste');
  const [rawText, setRawText] = useState('');
  const [replaceMode, setReplaceMode] = useState(true); // true = Thay thế toàn bộ; false = Thêm tiếp
  const [resetHistory, setResetHistory] = useState(true); // Đặt lại vòng quay
  const [parsedStudents, setParsedStudents] = useState<Array<{ name: string; gender: 'female' | 'male' }>>([]);
  const [dragOver, setDragOver] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputId = useId();

  // Sync selectedClassId when currentClassId prop updates
  React.useEffect(() => {
    setSelectedClassId(currentClassId);
  }, [currentClassId, isOpen]);

  // Target class
  const targetClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Smart parser function: handles Excel copy-paste (Tabs), CSV, bullet points, leading numbers, gender annotations
  const parseRawText = (text: string) => {
    if (!text.trim()) {
      setParsedStudents([]);
      return;
    }

    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const results: Array<{ name: string; gender: 'female' | 'male' }> = [];

    // Header keywords to ignore
    const headerKeywords = [
      'stt',
      'họ và tên',
      'họ tên',
      'họ tên học sinh',
      'tên học sinh',
      'danh sách học sinh',
      'giới tính',
      'ngày sinh',
      'lớp',
      'nữ',
      'nam',
      'ghi chú',
      'sbd',
    ];

    for (let rawLine of lines) {
      // Split by tab if copied from Excel or comma if CSV
      let segments: string[] = [];
      if (rawLine.includes('\t')) {
        segments = rawLine.split('\t').map((s) => s.trim()).filter(Boolean);
      } else if (rawLine.includes(',')) {
        segments = rawLine.split(',').map((s) => s.trim()).filter(Boolean);
      } else {
        segments = [rawLine];
      }

      // Check if entire row is just header
      const lowerFull = rawLine.toLowerCase();
      if (
        segments.length <= 4 &&
        segments.every((seg) => headerKeywords.includes(seg.toLowerCase()))
      ) {
        continue;
      }

      // Determine gender
      let gender: 'female' | 'male' = 'male';
      const femaleKeywords = ['nữ', 'female', 'f', 'gái'];
      const maleKeywords = ['nam', 'male', 'm', 'trai'];

      const hasFemaleWord = femaleKeywords.some((kw) =>
        lowerFull.match(new RegExp(`\\b${kw}\\b|\\(${kw}\\)`, 'i'))
      );
      const hasMaleWord = maleKeywords.some((kw) =>
        lowerFull.match(new RegExp(`\\b${kw}\\b|\\(${kw}\\)`, 'i'))
      );

      if (hasFemaleWord && !hasMaleWord) {
        gender = 'female';
      } else if (hasMaleWord && !hasFemaleWord) {
        gender = 'male';
      } else {
        // Fallback gender heuristic based on common Vietnamese female middle names
        if (
          lowerFull.includes('thị') ||
          lowerFull.includes('ngọc') ||
          lowerFull.includes('mỹ') ||
          lowerFull.includes('kim') ||
          lowerFull.includes('thuỳ') ||
          lowerFull.includes('thuý') ||
          lowerFull.includes('hương') ||
          lowerFull.includes('trúc') ||
          lowerFull.includes('diễm') ||
          lowerFull.includes('hân') ||
          lowerFull.includes('phương') ||
          lowerFull.includes('trang') ||
          lowerFull.includes('vy') ||
          lowerFull.includes('ngân') ||
          lowerFull.includes('tươi') ||
          lowerFull.includes('chi') ||
          lowerFull.includes('hoa') ||
          lowerFull.includes('hà')
        ) {
          gender = 'female';
        }
      }

      // Extract student name
      let candidateName = '';
      if (segments.length >= 2) {
        // Excel column format: often [STT, Họ và tên, Giới tính] or [Họ đệm, Tên]
        // Check if segment 0 is just a number (STT)
        if (/^\d+$/.test(segments[0])) {
          // Check if there are separate surname and firstname columns (e.g. "Nguyễn Văn" \t "An")
          if (segments.length >= 3 && !femaleKeywords.includes(segments[2].toLowerCase()) && !maleKeywords.includes(segments[2].toLowerCase()) && !/^\d+$/.test(segments[2])) {
            // Might be STT \t Họ đệm \t Tên
            candidateName = `${segments[1]} ${segments[2]}`.trim();
          } else {
            candidateName = segments[1];
          }
        } else {
          // First segment is not a number, maybe [Họ và tên, Giới tính]
          candidateName = segments[0];
        }
      } else {
        candidateName = rawLine;
      }

      // Clean leading index numbers, bullets, brackets, etc.
      // E.g. "1. Nguyễn Văn A", "01 - Nguyễn Văn A", "[1] Nguyễn Văn A", "1/ Nguyễn Văn A"
      candidateName = candidateName
        .replace(/^\d+[\s\.\-\)\/\]\:]+/, '')
        .replace(/^(stt|hs|em|bạn)\s*\d*[\:\.\-\s]*/i, '')
        .trim();

      // Clean trailing gender tags like "(Nam)", "(Nữ)", "- Nam", "- Nữ"
      candidateName = candidateName
        .replace(/\s*[\(\[\-]?\s*(nam|nữ|male|female|m|f)\s*[\)\]]?\s*$/i, '')
        .trim();

      // Skip invalid or too short names
      if (!candidateName || candidateName.length < 2 || /^\d+$/.test(candidateName)) {
        continue;
      }

      // Title case format: "nguyễn văn a" -> "Nguyễn Văn A"
      candidateName = candidateName
        .toLowerCase()
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      results.push({
        name: candidateName,
        gender,
      });
    }

    setParsedStudents(results);
  };

  // Re-parse when rawText changes
  React.useEffect(() => {
    parseRawText(rawText);
  }, [rawText]);

  if (!isOpen || !targetClass) return null;

  // Handle file upload (.txt, .csv, .tsv)
  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || '';
      setRawText(content);
      setInputTab('paste'); // Switch to preview tab so user sees parsed names
    };
    reader.readAsText(file, 'utf-8');
  };

  // Handle template download (.csv)
  const handleDownloadTemplate = () => {
    const csvContent =
      '\uFEFFSTT,Họ và tên,Giới tính\n1,Nguyễn Văn An,Nam\n2,Trần Thị Bích,Nữ\n3,Lê Hoàng Nam,Nam\n4,Huỳnh Ngọc Diễm,Nữ\n5,Phạm Minh Tuấn,Nam';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mau_danh_sach_hoc_sinh.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle pasting sample list
  const handleLoadSample = () => {
    soundEffects.playClick();
    setRawText(SAMPLE_STUDENTS_TEXT);
  };

  // Toggle gender of a parsed student
  const handleToggleStudentGender = (idx: number) => {
    setParsedStudents((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, gender: s.gender === 'female' ? 'male' : 'female' } : s))
    );
  };

  // Delete a student from preview
  const handleDeleteParsedStudent = (idx: number) => {
    setParsedStudents((prev) => prev.filter((_, i) => i !== idx));
  };

  // Edit student name in preview
  const handleEditParsedStudentName = (idx: number, newName: string) => {
    setParsedStudents((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, name: newName } : s))
    );
  };

  // Execute update
  const handleConfirmUpdate = () => {
    if (parsedStudents.length === 0) return;

    soundEffects.playWinnerFanfare();

    // Convert parsed list into full Student objects
    const newStudents: Student[] = parsedStudents.map((item, idx) => ({
      id: `hs-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      name: item.name.trim(),
      gender: item.gender,
      avatarIndex: idx % 20,
      characterIndex: idx % 10,
      calledCount: 0,
    }));

    // Trigger update in parent App state
    onUpdateStudentList(selectedClassId, newStudents, replaceMode, resetHistory);

    // Confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24', '#ffffff'],
      });
    } catch {}

    setSuccessMessage(
      `Đã cập nhật thành công ${newStudents.length} học sinh cho ${targetClass.name}!`
    );

    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1200);
  };

  const femaleCount = parsedStudents.filter((s) => s.gender === 'female').length;
  const maleCount = parsedStudents.filter((s) => s.gender === 'male').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-sky-950 via-slate-900 to-sky-950 rounded-3xl border-2 border-amber-400/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_35px_rgba(251,191,36,0.25)] overflow-hidden flex flex-col max-h-[92vh] text-white">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-r from-sky-900 via-emerald-950 to-sky-900 border-b border-amber-400/30 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center text-slate-950 shrink-0">
              <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-amber-400">
                  CẬP NHẬT DANH SÁCH HỌC SINH MỚI
                </h2>
                <span className="hidden sm:inline text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/40">
                  TỰ ĐỘNG BÓC TÁCH
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-200/85">
                Nhập danh sách nhanh từ Excel, vnEdu, SMAS, Google Sheets hoặc tệp văn bản
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Banner Alert */}
        {successMessage && (
          <div className="px-4 py-2.5 bg-emerald-600/90 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-inner animate-pulse shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Class Selection & Quick Stats Bar */}
        <div className="px-4 py-2.5 sm:px-6 bg-slate-900/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-300">Lớp áp dụng:</span>
            <div className="flex items-center gap-1.5">
              {classes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedClassId(c.id);
                    onSelectClass(c.id);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    c.id === selectedClassId
                      ? 'bg-amber-500 text-slate-950 shadow-md border border-amber-300'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] opacity-75">({c.students.length} HS)</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-300 flex items-center gap-2">
            <span className="text-slate-400">Hiện tại:</span>
            <span className="font-extrabold text-amber-300">{targetClass.students.length} học sinh</span>
          </div>
        </div>

        {/* Modal Body: Left = Input (Paste/Upload), Right = Live Preview */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 min-h-0">
          {/* CỘT TRÁI (7/12): KHU VỰC NHẬP DANH SÁCH */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            {/* Input method tabs */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setInputTab('paste')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    inputTab === 'paste'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Dán danh sách (Copy & Paste)</span>
                </button>

                <button
                  onClick={() => setInputTab('file')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    inputTab === 'file'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Tải tệp (.csv / .txt)</span>
                </button>
              </div>

              {/* Sample template button */}
              <button
                onClick={handleLoadSample}
                className="text-[11px] font-semibold text-amber-300 hover:text-yellow-200 flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 rounded-lg border border-amber-400/30 transition cursor-pointer"
                title="Dán thử danh sách 40 học sinh mẫu để thử nghiệm nhanh"
              >
                <Sparkles className="w-3 h-3 text-yellow-300" />
                <span className="hidden sm:inline">Dán danh sách mẫu</span>
                <span className="sm:hidden">Mẫu</span>
              </button>
            </div>

            {/* TAB 1: PASTE TEXT */}
            {inputTab === 'paste' && (
              <div className="flex-1 flex flex-col space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-amber-300">
                    Dán họ tên học sinh vào ô bên dưới (mỗi em một dòng):
                  </span>
                  {rawText && (
                    <button
                      onClick={() => setRawText('')}
                      className="text-[11px] text-red-300 hover:text-red-200 flex items-center gap-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  )}
                </div>

                <div className="relative flex-1 min-h-[160px] sm:min-h-[220px]">
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder={`Cách 1: Copy cột tên học sinh từ Excel / Google Sheets rồi dán vào đây.\nCách 2: Gõ hoặc dán danh sách theo định dạng:\n1. Nguyễn Văn An (Nam)\n2. Trần Thị Bích (Nữ)\n3. Lê Hoàng Nam...`}
                    className="w-full h-full p-3 text-xs sm:text-sm bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-2xl text-slate-100 font-mono placeholder-slate-600 focus:outline-none resize-none shadow-inner"
                  />
                </div>

                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <p className="flex items-center gap-1 text-emerald-300">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Tự động loại bỏ số thứ tự ("1.", "01 -", "STT 1",...) và tiêu đề cột.</span>
                  </p>
                  <p className="flex items-center gap-1 text-slate-400">
                    <span>Hỗ trợ ghi chú giới tính: "(Nam)", "(Nữ)", hoặc phân cách Tab từ Excel.</span>
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: UPLOAD FILE */}
            {inputTab === 'file' && (
              <div className="flex-1 flex flex-col space-y-3">
                <label
                  htmlFor={fileInputId}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-3 transition cursor-pointer ${
                    dragOver
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-slate-700 bg-slate-950/60 hover:border-amber-400/60'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      Nhấn vào đây để chọn tệp hoặc kéo thả tệp vào
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Hỗ trợ định dạng .csv, .txt, .tsv (xuất từ Excel, vnEdu, SMAS)
                    </p>
                  </div>
                  <span className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow cursor-pointer">
                    Chọn tệp từ máy
                  </span>
                  <input
                    id={fileInputId}
                    type="file"
                    accept=".csv,.txt,.tsv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                  />
                </label>

                {/* Download template */}
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-200">Chưa có tệp danh sách mẫu?</span>
                    <p className="text-[11px] text-slate-400">Tải tệp CSV mẫu chuẩn để điền họ tên học sinh</p>
                  </div>
                  <button
                    onClick={handleDownloadTemplate}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 flex items-center gap-1 font-bold transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải tệp mẫu</span>
                  </button>
                </div>
              </div>
            )}

            {/* CHẾ ĐỘ CẬP NHẬT: Thay thế hay Thêm tiếp */}
            <div className="p-3 sm:p-3.5 bg-slate-950/90 rounded-2xl border border-amber-400/30 space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Chế độ cập nhật danh sách:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Option 1: Thay thế toàn bộ */}
                <label
                  onClick={() => setReplaceMode(true)}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                    replaceMode
                      ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="updateMode"
                    checked={replaceMode}
                    onChange={() => setReplaceMode(true)}
                    className="mt-0.5 text-emerald-500 focus:ring-emerald-400"
                  />
                  <div>
                    <div className="font-bold text-emerald-300">Thay thế toàn bộ danh sách</div>
                    <div className="text-[11px] text-slate-300 opacity-80">
                      Xóa danh sách cũ và nạp mới toàn bộ {parsedStudents.length} học sinh
                    </div>
                  </div>
                </label>

                {/* Option 2: Thêm tiếp */}
                <label
                  onClick={() => setReplaceMode(false)}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                    !replaceMode
                      ? 'bg-sky-950/60 border-sky-400 text-white shadow-sm'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="updateMode"
                    checked={!replaceMode}
                    onChange={() => setReplaceMode(false)}
                    className="mt-0.5 text-sky-500 focus:ring-sky-400"
                  />
                  <div>
                    <div className="font-bold text-sky-300">Thêm nối tiếp vào lớp</div>
                    <div className="text-[11px] text-slate-300 opacity-80">
                      Giữ {targetClass.students.length} em hiện có và thêm {parsedStudents.length} em mới
                    </div>
                  </div>
                </label>
              </div>

              {/* Reset History Checkbox */}
              <label className="flex items-center gap-2 pt-1 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={resetHistory}
                  onChange={(e) => setResetHistory(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-400"
                />
                <span>Đặt lại lượt gọi tên và lịch sử để bắt đầu vòng quay mới tinh</span>
              </label>
            </div>
          </div>

          {/* CỘT PHẢI (5/12): XEM TRƯỚC DANH SÁCH (LIVE PREVIEW) */}
          <div className="lg:col-span-5 flex flex-col space-y-2 bg-slate-950/80 rounded-2xl border border-white/10 p-3 sm:p-3.5">
            {/* Header Preview */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Xem trước ({parsedStudents.length} học sinh)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-400/30 font-bold">
                  {femaleCount} Nữ
                </span>
                <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold">
                  {maleCount} Nam
                </span>
              </div>
            </div>

            {/* List Table */}
            <div className="flex-1 overflow-y-auto max-h-[300px] sm:max-h-[360px] divide-y divide-white/5 pr-1">
              {parsedStudents.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center p-4 text-slate-500 space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-600 stroke-1" />
                  <p className="text-xs">
                    Chưa có học sinh nào được nhận diện.
                    <br />
                    Hãy dán danh sách hoặc bấm <b>"Dán danh sách mẫu"</b> ở bên trái!
                  </p>
                </div>
              ) : (
                parsedStudents.map((student, idx) => (
                  <div
                    key={idx}
                    className="py-1.5 px-2 flex items-center justify-between hover:bg-white/5 transition rounded-lg group text-xs"
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0 mr-2">
                      <span className="font-mono text-slate-500 text-[11px] w-5 shrink-0">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) => handleEditParsedStudentName(idx, e.target.value)}
                        className="bg-transparent hover:bg-slate-800 focus:bg-slate-900 px-1.5 py-0.5 rounded text-white font-medium focus:outline-none focus:border-amber-400 border border-transparent w-full truncate"
                        title="Nhấn để chỉnh sửa họ tên nếu cần"
                      />
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {/* Gender toggle pill */}
                      <button
                        onClick={() => handleToggleStudentGender(idx)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black cursor-pointer transition ${
                          student.gender === 'female'
                            ? 'bg-pink-500/25 text-pink-300 border border-pink-400/40 hover:bg-pink-500/40'
                            : 'bg-sky-500/25 text-sky-300 border border-sky-400/40 hover:bg-sky-500/40'
                        }`}
                        title="Bấm để đổi giới tính Nam/Nữ"
                      >
                        {student.gender === 'female' ? 'Nữ' : 'Nam'}
                      </button>

                      {/* Delete item button */}
                      <button
                        onClick={() => handleDeleteParsedStudent(idx)}
                        className="p-1 text-slate-500 hover:text-red-400 opacity-60 group-hover:opacity-100 transition cursor-pointer"
                        title="Xóa học sinh này khỏi danh sách xem trước"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Summary in Preview Footer */}
            {parsedStudents.length > 0 && (
              <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Con thuyền tự động phân bổ đều vị trí</span>
                <span className="font-bold text-amber-300">
                  {replaceMode ? `Mới: ${parsedStudents.length} HS` : `Tổng: ${targetClass.students.length + parsedStudents.length} HS`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 sm:px-6 bg-slate-900 border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tự động lưu an toàn vào bộ nhớ trình duyệt</span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold transition active:scale-95 cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              onClick={handleConfirmUpdate}
              disabled={parsedStudents.length === 0}
              className={`px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm tracking-wide transition shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 border ${
                parsedStudents.length === 0
                  ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white border-emerald-300 shadow-emerald-600/30'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>
                XÁC NHẬN CẬP NHẬT {parsedStudents.length > 0 ? `(${parsedStudents.length} HS)` : ''}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
