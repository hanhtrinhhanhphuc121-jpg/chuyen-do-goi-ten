import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  Upload,
  Download,
  Users,
  GraduationCap,
  FileSpreadsheet,
  AlertCircle,
  Save,
} from 'lucide-react';
import { ClassRoom, Student } from '../types/game';
import { Sprite } from './Sprite';

interface ClassManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassRoom[];
  currentClassId: string;
  onSelectClass: (classId: string) => void;
  onUpdateClass: (updatedClass: ClassRoom) => void;
  onCreateClass: (newClass: ClassRoom) => void;
  onDeleteClass: (classId: string) => void;
  onImportBackup: (importedClasses: ClassRoom[]) => void;
}

export const ClassManageModal: React.FC<ClassManageModalProps> = ({
  isOpen,
  onClose,
  classes,
  currentClassId,
  onSelectClass,
  onUpdateClass,
  onCreateClass,
  onDeleteClass,
  onImportBackup,
}) => {
  const currentClass = classes.find((c) => c.id === currentClassId) || classes[0];

  // Local editable state for current class
  const [className, setClassName] = useState(currentClass?.name || '');
  const [schoolName, setSchoolName] = useState(currentClass?.schoolName || 'Trường THCS và THPT Long Hiệp');
  const [teacherName, setTeacherName] = useState(currentClass?.teacherName || '');
  const [subject, setSubject] = useState(currentClass?.subject || '');

  // Add student inputs
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'male' | 'female'>('female');

  // Bulk import mode
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');

  // Editing student inline
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingStudentName, setEditingStudentName] = useState('');

  // Search in roster
  const [searchRoster, setSearchRoster] = useState('');

  // Sync state when currentClass changes
  React.useEffect(() => {
    if (currentClass) {
      setClassName(currentClass.name);
      setSchoolName(currentClass.schoolName || 'Trường THCS và THPT Long Hiệp');
      setTeacherName(currentClass.teacherName);
      setSubject(currentClass.subject || '');
    }
  }, [currentClass?.id]);

  if (!isOpen || !currentClass) return null;

  // Handle saving class info
  const handleSaveClassInfo = () => {
    if (!className.trim()) return;
    onUpdateClass({
      ...currentClass,
      name: className.trim(),
      schoolName: schoolName.trim(),
      teacherName: teacherName.trim(),
      subject: subject.trim(),
    });
  };

  // Handle adding single student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newStudent: Student = {
      id: `hs-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: newStudentName.trim(),
      gender: newStudentGender,
      avatarIndex: Math.floor(Math.random() * 20),
      characterIndex: Math.floor(Math.random() * 10),
      calledCount: 0,
    };

    onUpdateClass({
      ...currentClass,
      students: [...currentClass.students, newStudent],
    });

    setNewStudentName('');
  };

  // Handle deleting student
  const handleDeleteStudent = (studentId: string) => {
    onUpdateClass({
      ...currentClass,
      students: currentClass.students.filter((s) => s.id !== studentId),
    });
  };

  // Handle inline edit
  const handleStartEdit = (student: Student) => {
    setEditingStudentId(student.id);
    setEditingStudentName(student.name);
  };

  const handleSaveEdit = (studentId: string) => {
    if (!editingStudentName.trim()) return;
    onUpdateClass({
      ...currentClass,
      students: currentClass.students.map((s) =>
        s.id === studentId ? { ...s, name: editingStudentName.trim() } : s
      ),
    });
    setEditingStudentId(null);
  };

  // Handle bulk import from Excel / Text
  const handleBulkImport = () => {
    if (!bulkText.trim()) return;

    // Split by newlines, clean numbers/bullets if any
    const lines = bulkText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    const importedStudents: Student[] = lines.map((line, idx) => {
      // Clean leading numbers like "1.", "1 -", "01."
      const cleanName = line.replace(/^\d+[\s\.\-\)\/]+/, '').trim();
      return {
        id: `hs-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        name: cleanName || line,
        gender: idx % 2 === 0 ? 'female' : 'male',
        avatarIndex: idx % 20,
        characterIndex: idx % 10,
        calledCount: 0,
      };
    });

    onUpdateClass({
      ...currentClass,
      students: [...currentClass.students, ...importedStudents],
    });

    setBulkText('');
    setShowBulkImport(false);
  };

  // Create new class
  const handleCreateNewClass = () => {
    const classNum = classes.length + 1;
    const newClass: ClassRoom = {
      id: `class-${Date.now()}`,
      name: `Lớp mới ${classNum}`,
      teacherName: teacherName || 'Thầy Cô Giáo',
      subject: 'Ngữ Văn',
      students: [],
    };
    onCreateClass(newClass);
    onSelectClass(newClass.id);
  };

  // Export classes JSON backup
  const handleExportBackup = () => {
    const dataStr = JSON.stringify(classes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chuyen-do-goi-ten-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import backup file
  const handleImportBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json) && json.length > 0 && json[0].students) {
          onImportBackup(json);
          alert('Đã khôi phục dữ liệu lớp học thành công!');
        } else {
          alert('Định dạng tệp không hợp lệ.');
        }
      } catch {
        alert('Lỗi đọc tệp sao lưu JSON.');
      }
    };
    reader.readAsText(file);
  };

  const filteredStudents = currentClass.students.filter((s) =>
    s.name.toLowerCase().includes(searchRoster.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-sky-950 via-slate-900 to-sky-950 rounded-3xl border-2 border-amber-400/50 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-sky-900 to-emerald-900 border-b border-amber-400/30 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Quản Lý Lớp Học & Danh Sách Học Sinh</h2>
              <p className="text-xs text-emerald-200/80">Lưu tự động, bảo toàn dữ liệu lớp học</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Class Selection Tabs & New Class Button */}
        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Chọn lớp:</span>
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectClass(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  c.id === currentClass.id
                    ? 'bg-amber-500 text-slate-950 shadow-md border border-amber-300'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <span>{c.name}</span>
                <span className="text-[10px] opacity-75">({c.students.length})</span>
              </button>
            ))}

            <button
              onClick={handleCreateNewClass}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 transition cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tạo lớp</span>
            </button>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={handleExportBackup}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs flex items-center gap-1 transition"
              title="Sao lưu toàn bộ dữ liệu ra máy tính"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sao lưu</span>
            </button>

            <label
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs flex items-center gap-1 transition cursor-pointer"
              title="Khôi phục dữ liệu từ tệp sao lưu"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Khôi phục</span>
              <input type="file" accept=".json" onChange={handleImportBackupFile} className="hidden" />
            </label>

            {classes.length > 1 && (
              <button
                onClick={() => {
                  if (window.confirm(`Thầy/Cô có chắc chắn muốn xóa lớp "${currentClass.name}" không?`)) {
                    onDeleteClass(currentClass.id);
                  }
                }}
                className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs transition"
                title="Xóa lớp học này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Class Settings Form (Class Name, Teacher Name, Subject) */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>Thông tin lớp học</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Trường học:</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  onBlur={handleSaveClassInfo}
                  placeholder="Ví dụ: Trường THCS và THPT Long Hiệp"
                  className="w-full px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Tên lớp:</label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  onBlur={handleSaveClassInfo}
                  placeholder="Ví dụ: Lớp 12.2"
                  className="w-full px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Tên Giáo viên:</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  onBlur={handleSaveClassInfo}
                  placeholder="Ví dụ: Thầy Trầm Thanh Tuấn"
                  className="w-full px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Môn học / Ghi chú:</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onBlur={handleSaveClassInfo}
                  placeholder="Ví dụ: Ngữ Văn 12"
                  className="w-full px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Student Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Add single student input */}
            <form onSubmit={handleAddStudent} className="flex items-center gap-1.5 flex-1 min-w-[260px]">
              <input
                type="text"
                placeholder="Nhập tên học sinh mới..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <select
                value={newStudentGender}
                onChange={(e) => setNewStudentGender(e.target.value as 'male' | 'female')}
                className="px-2 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
              >
                <option value="female">Nữ</option>
                <option value="male">Nam</option>
              </select>
              <button
                type="submit"
                className="px-3 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </form>

            {/* Quick Bulk Import Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBulkImport(!showBulkImport)}
                className="px-3 py-2 text-xs font-bold rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Nhập nhanh từ Excel/Word</span>
              </button>
            </div>
          </div>

          {/* Bulk Import Drawer */}
          {showBulkImport && (
            <div className="bg-slate-900 p-4 rounded-2xl border border-amber-400/40 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">
                  Dán danh sách học sinh (mỗi học sinh một dòng):
                </span>
                <span className="text-[11px] text-slate-400">
                  Hỗ trợ copy trực tiếp từ cột Excel, Google Sheets, danh sách Word
                </span>
              </div>
              <textarea
                rows={5}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="1. Nguyễn Văn An&#10;2. Trần Thị Bích&#10;3. Lê Hoàng Nam&#10;..."
                className="w-full p-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowBulkImport(false)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  onClick={handleBulkImport}
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 transition shadow cursor-pointer"
                >
                  Thêm vào lớp
                </button>
              </div>
            </div>
          )}

          {/* Student Roster Table */}
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900/80 border-b border-white/10 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Danh sách học sinh ({currentClass.students.length} em)</span>
              </span>

              <input
                type="text"
                value={searchRoster}
                onChange={(e) => setSearchRoster(e.target.value)}
                placeholder="Lọc tên học sinh..."
                className="px-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-44"
              />
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-white/5">
              {filteredStudents.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Chưa có học sinh nào trong lớp. Hãy nhập học sinh bằng ô trên!
                </div>
              ) : (
                filteredStudents.map((student, idx) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between px-4 py-2 hover:bg-white/5 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono text-slate-400 w-6">{idx + 1}.</span>
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                        <Sprite name={`avatar-${student.avatarIndex % 20}`} className="w-7 h-auto" />
                      </div>

                      {editingStudentId === student.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingStudentName}
                            onChange={(e) => setEditingStudentName(e.target.value)}
                            className="px-2 py-0.5 text-xs bg-slate-800 border border-amber-400 rounded text-white focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(student.id)}
                            className="p-1 bg-emerald-600 rounded text-white hover:bg-emerald-500"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-white">{student.name}</div>
                          <div className="text-[10px] text-slate-400">
                            Đã gọi: {student.calledCount} lần
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      {editingStudentId !== student.id && (
                        <button
                          onClick={() => handleStartEdit(student)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition"
                          title="Chỉnh sửa tên"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition"
                        title="Xóa học sinh này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-900 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dữ liệu lưu tự động trên trình duyệt</span>
          </div>

          <button
            onClick={() => {
              handleSaveClassInfo();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow"
          >
            <Save className="w-4 h-4" />
            <span>Hoàn Tất & Đóng</span>
          </button>
        </div>
      </div>
    </div>
  );
};
