import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { HeaderBar } from './components/HeaderBar';
import { KnowledgeBoatScene } from './components/KnowledgeBoatScene';
import { CallBoard } from './components/CallBoard';
import { StatsPanel } from './components/StatsPanel';
import { HistoryModal } from './components/HistoryModal';
import { ClassManageModal } from './components/ClassManageModal';
import { SettingsModal } from './components/SettingsModal';
import { BoatTheaterMode } from './components/BoatTheaterMode';
import { StudentPositionModal } from './components/StudentPositionModal';
import { INITIAL_CLASSES, DEFAULT_SETTINGS } from './data/defaultData';
import { ClassRoom, Student, CallHistoryItem, GameSettings, StudentPosition } from './types/game';
import { soundEffects } from './utils/soundEffects';
import { getAssetUrl, BOAT_ARTWORK_URL } from './utils/assets';
import { safeStorage } from './utils/storage';
import {
  getStoredStudentPositions,
  saveStoredStudentPositions,
  resetStoredStudentPositions,
} from './data/studentPositions';

const STORAGE_KEYS = {
  CLASSES: 'chuyen_do_classes_lh_12_2_v1',
  CURRENT_CLASS_ID: 'chuyen_do_current_class_lh_12_2_v1',
  HISTORY: 'chuyen_do_history_lh_12_2_v1',
  SETTINGS: 'chuyen_do_settings_lh_12_2_v1',
  CALLED_IDS_PREFIX: 'chuyen_do_called_ids_class_',
  ROUND_PREFIX: 'chuyen_do_round_class_',
  NO_REPEAT: 'chuyen_do_no_repeat_lh_12_2_v1',
};

export default function App() {
  // Load persisted classes or fallback
  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.CLASSES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CLASSES;
  });

  // Current class ID
  const [currentClassId, setCurrentClassId] = useState<string>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.CURRENT_CLASS_ID);
      if (saved) return saved;
    } catch {
      // fallback
    }
    return INITIAL_CLASSES[0].id;
  });

  // Current active class
  const currentClass = useMemo(() => {
    return classes.find((c) => c.id === currentClassId) || classes[0] || INITIAL_CLASSES[0];
  }, [classes, currentClassId]);

  // Settings
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Call History
  const [history, setHistory] = useState<CallHistoryItem[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // No-repeat mode state
  const [noRepeat, setNoRepeat] = useState<boolean>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.NO_REPEAT);
      if (saved !== null) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return true; // default enabled
  });

  // Called student IDs for current class
  const [calledStudentIds, setCalledStudentIds] = useState<Set<string>>(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEYS.CALLED_IDS_PREFIX}${currentClassId}`);
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // fallback
    }
    return new Set<string>();
  });

  // Current round number for current class
  const [currentRound, setCurrentRound] = useState<number>(() => {
    try {
      const saved = safeStorage.getItem(`${STORAGE_KEYS.ROUND_PREFIX}${currentClassId}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return 1;
  });

  // Game UI state
  const [isSpinning, setIsSpinning] = useState(false);
  const [countdown, setCountdown] = useState<number>(5.0);
  const [displayName, setDisplayName] = useState<string>('SẴN SÀNG GỌI TÊN!');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [spinningStudent, setSpinningStudent] = useState<Student | null>(null);

  // Modals state
  const [showClassModal, setShowClassModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isProjectorMode, setIsProjectorMode] = useState(false);
  const [isBoatTheaterOpen, setIsBoatTheaterOpen] = useState(false);

  // Student 1-to-1 Positions on Boat Artwork
  const [studentPositions, setStudentPositions] = useState<Record<string, StudentPosition>>(() => {
    return getStoredStudentPositions();
  });

  // Spin & countdown timer references
  const spinAnimationTimerRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const spinStartTimeRef = useRef<number>(0);

  // Sync audio settings with soundEffects engine
  useEffect(() => {
    soundEffects.setEnabled(settings.soundEnabled);
    soundEffects.setVolume(settings.soundVolume);
  }, [settings.soundEnabled, settings.soundVolume]);

  // Persist classes
  useEffect(() => {
    try {
      safeStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    } catch {
      // fallback
    }
  }, [classes]);

  // Persist current class ID
  useEffect(() => {
    try {
      safeStorage.setItem(STORAGE_KEYS.CURRENT_CLASS_ID, currentClassId);
    } catch {
      // fallback
    }
  }, [currentClassId]);

  // Persist settings
  useEffect(() => {
    try {
      safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // fallback
    }
  }, [settings]);

  // Persist history
  useEffect(() => {
    try {
      safeStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch {
      // fallback
    }
  }, [history]);

  // Persist no-repeat
  useEffect(() => {
    try {
      safeStorage.setItem(STORAGE_KEYS.NO_REPEAT, JSON.stringify(noRepeat));
    } catch {
      // fallback
    }
  }, [noRepeat]);

  // Persist called students when changed
  useEffect(() => {
    try {
      safeStorage.setItem(
        `${STORAGE_KEYS.CALLED_IDS_PREFIX}${currentClass.id}`,
        JSON.stringify(Array.from(calledStudentIds))
      );
    } catch {
      // fallback
    }
  }, [calledStudentIds, currentClass.id]);

  // Persist current round
  useEffect(() => {
    try {
      safeStorage.setItem(
        `${STORAGE_KEYS.ROUND_PREFIX}${currentClass.id}`,
        JSON.stringify(currentRound)
      );
    } catch {
      // fallback
    }
  }, [currentRound, currentClass.id]);

  // When class changes, reload its called state
  const handleSelectClass = (newClassId: string) => {
    if (newClassId === currentClassId) return;

    // Stop ongoing spin if any
    if (isSpinning) {
      handleStop();
    }

    setCurrentClassId(newClassId);
    setSelectedStudent(null);
    setSpinningStudent(null);
    setCountdown(5.0);
    setDisplayName('SẴN SÀNG GỌI TÊN!');

    try {
      const savedCalled = safeStorage.getItem(`${STORAGE_KEYS.CALLED_IDS_PREFIX}${newClassId}`);
      if (savedCalled) {
        setCalledStudentIds(new Set(JSON.parse(savedCalled)));
      } else {
        setCalledStudentIds(new Set());
      }

      const savedRound = safeStorage.getItem(`${STORAGE_KEYS.ROUND_PREFIX}${newClassId}`);
      if (savedRound) {
        setCurrentRound(JSON.parse(savedRound));
      } else {
        setCurrentRound(1);
      }
    } catch {
      setCalledStudentIds(new Set());
      setCurrentRound(1);
    }
  };

  // Remaining eligible students for calling
  const eligibleStudents = useMemo(() => {
    if (!currentClass || !currentClass.students) return [];
    if (!noRepeat) return currentClass.students;
    return currentClass.students.filter((s) => !calledStudentIds.has(s.id));
  }, [currentClass, noRepeat, calledStudentIds]);

  const allCalled = noRepeat && currentClass.students.length > 0 && eligibleStudents.length === 0;

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (spinAnimationTimerRef.current) clearTimeout(spinAnimationTimerRef.current);
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
      soundEffects.stopSuspense();
    };
  }, []);

  const DURATION_MS = 5000;

  // FINALIZE SELECTION HELPER
  const finalizeSelection = (chosen: Student) => {
    if (spinAnimationTimerRef.current) {
      clearTimeout(spinAnimationTimerRef.current);
      spinAnimationTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    setIsSpinning(false);
    setCountdown(0.0);
    setSpinningStudent(null);
    setSelectedStudent(chosen);
    setDisplayName(chosen.name);

    soundEffects.stopSuspense();
    soundEffects.playWinnerFanfare();

    // Trigger celebratory confetti if enabled
    if (settings.confettiEnabled) {
      try {
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.55 },
          colors: ['#f59e0b', '#10b981', '#38bdf8', '#ef4444', '#fbbf24', '#ffffff'],
        });
      } catch {
        // safe
      }
    }

    // Mark as called
    setCalledStudentIds((prev) => {
      const next = new Set(prev);
      next.add(chosen.id);
      return next;
    });

    // Update calledCount on the student object in class
    setClasses((prevClasses) =>
      prevClasses.map((cls) => {
        if (cls.id !== currentClass.id) return cls;
        return {
          ...cls,
          students: cls.students.map((st) =>
            st.id === chosen.id
              ? {
                  ...st,
                  calledCount: (st.calledCount || 0) + 1,
                  lastCalledAt: new Date().toLocaleTimeString('vi-VN'),
                }
              : st
          ),
        };
      })
    );

    // Add to History
    const historyItem: CallHistoryItem = {
      id: `call-${Date.now()}`,
      classId: currentClass.id,
      className: currentClass.name,
      studentId: chosen.id,
      studentName: chosen.name,
      calledAt: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      roundNumber: currentRound,
    };

    setHistory((prev) => [historyItem, ...prev]);

    // Check if this was the last student in no-repeat
    if (noRepeat && eligibleStudents.length === 1 && eligibleStudents[0].id === chosen.id) {
      setTimeout(() => {
        soundEffects.playCompleteRound();
      }, 900);
    }
  };

  // START CALLING: AUTOMATIC 5-SECOND SELECTION ENGINE
  const handleStart = () => {
    if (isSpinning) return;
    if (currentClass.students.length === 0) {
      alert('Lớp học chưa có học sinh. Vui lòng vào "Quản lý lớp" để thêm học sinh.');
      return;
    }

    if (allCalled) {
      alert('Tất cả học sinh trong lớp đã được gọi trong lượt này! Vui lòng nhấn "Đặt Lại" để bắt đầu lượt mới.');
      return;
    }

    const candidates = eligibleStudents.length > 0 ? eligibleStudents : currentClass.students;
    if (candidates.length === 0) return;

    // Pre-select winning student with uniform probability
    const chosenWinner = candidates[Math.floor(Math.random() * candidates.length)];

    setSelectedStudent(null);
    setIsSpinning(true);
    setCountdown(5.0);

    soundEffects.playStart();
    soundEffects.startSuspense(5.0);

    const startTime = performance.now();
    spinStartTimeRef.current = startTime;

    // Real-time countdown timer loop (50ms interval)
    const updateCountdown = () => {
      const elapsed = performance.now() - startTime;
      const remainingSec = Math.max(0, (DURATION_MS - elapsed) / 1000);
      setCountdown(Number(remainingSec.toFixed(1)));
      if (elapsed < DURATION_MS) {
        countdownTimerRef.current = window.setTimeout(updateCountdown, 50);
      }
    };
    countdownTimerRef.current = window.setTimeout(updateCountdown, 50);

    // Decelerating shuffle loop
    let tickCount = 0;
    const pool = currentClass.students;

    const scheduleNextTick = () => {
      const elapsed = performance.now() - startTime;
      if (elapsed >= DURATION_MS) {
        // Exactly 5000ms: finalize selection on winner!
        finalizeSelection(chosenWinner);
        return;
      }

      // Pick a random student name to show during the shuffle
      const randomCandidate = pool[Math.floor(Math.random() * pool.length)];
      setDisplayName(randomCandidate.name);
      setSpinningStudent(randomCandidate);

      tickCount++;
      // Pitch adjustment: suspense ticks
      const progress = elapsed / DURATION_MS;
      const pitch = elapsed > 3000 ? Math.max(0.65, 1.0 - (progress - 0.6) * 0.7) : 1.0 + (tickCount % 2) * 0.15;
      soundEffects.playTick(pitch);

      // Deceleration: fast in first 3s (~45ms), slowing down in last 2s up to ~450ms
      let nextInterval: number;
      if (elapsed < 3000) {
        nextInterval = 45;
      } else {
        const slowRatio = (elapsed - 3000) / 2000; // 0 to 1
        nextInterval = 50 + Math.pow(slowRatio, 2.2) * 400;
      }

      // Clamp so we don't shoot past 5000ms
      if (elapsed + nextInterval >= DURATION_MS) {
        nextInterval = Math.max(15, DURATION_MS - elapsed);
      }

      spinAnimationTimerRef.current = window.setTimeout(scheduleNextTick, nextInterval);
    };

    scheduleNextTick();
  };

  // STOP CALLING (optional manual interrupt, if needed)
  const handleStop = () => {
    if (!isSpinning) return;
    const candidates = eligibleStudents.length > 0 ? eligibleStudents : currentClass.students;
    const fallback = candidates[Math.floor(Math.random() * candidates.length)];
    finalizeSelection(fallback);
  };

  // NEXT CALL (GỌI TIẾP)
  const handleNext = () => {
    if (isSpinning) return;
    if (allCalled) {
      alert('Tất cả học sinh trong lớp đã được gọi trong lượt này! Nhấn "Đặt Lại" để bắt đầu lượt mới.');
      return;
    }
    handleStart();
  };

  // RESET CURRENT ROUND
  const handleResetRound = () => {
    if (isSpinning) return;
    soundEffects.playClick();
    if (
      calledStudentIds.size > 0 &&
      !window.confirm('Thầy/Cô có muốn đặt lại lượt gọi hiện tại để tất cả học sinh có thể được gọi lại không?')
    ) {
      return;
    }

    setCalledStudentIds(new Set());
    setSelectedStudent(null);
    setSpinningStudent(null);
    setCountdown(5.0);
    setDisplayName('SẴN SÀNG GỌI TÊN!');
    setCurrentRound((prev) => prev + 1);
  };

  // TOGGLE NO REPEAT
  const handleToggleNoRepeat = () => {
    soundEffects.playClick();
    setNoRepeat((prev) => !prev);
  };

  // Listen to fullscreen changes safely (supporting Safari/iOS WebKit vendor prefixes)
  useEffect(() => {
    const handleFsChange = () => {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
        mozFullScreenElement?: Element;
      };
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  // FULLSCREEN TOGGLE (Safe for iOS Safari and mobile WebViews)
  const handleToggleFullscreen = () => {
    const doc = document as unknown as {
      fullscreenElement?: Element;
      webkitFullscreenElement?: Element;
      exitFullscreen?: () => Promise<void>;
      webkitExitFullscreen?: () => void;
    };
    const docEl = document.documentElement as unknown as {
      requestFullscreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => void;
    };

    const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement);

    if (!isFs) {
      if (typeof docEl.requestFullscreen === 'function') {
        docEl.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      } else if (typeof docEl.webkitRequestFullscreen === 'function') {
        try {
          docEl.webkitRequestFullscreen();
          setIsFullscreen(true);
        } catch {
          // silently handle webkit fullscreen refusal
        }
      }
    } else {
      if (typeof doc.exitFullscreen === 'function') {
        doc.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      } else if (typeof doc.webkitExitFullscreen === 'function') {
        try {
          doc.webkitExitFullscreen();
          setIsFullscreen(false);
        } catch {
          // silently handle webkit exit refusal
        }
      }
    }
  };

  // OPEN BOAT THEATER (Real Fullscreen Presentation)
  const handleOpenBoatTheater = () => {
    setIsBoatTheaterOpen(true);
    const doc = document as unknown as {
      fullscreenElement?: Element;
      webkitFullscreenElement?: Element;
    };
    const docEl = document.documentElement as unknown as {
      requestFullscreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => void;
    };
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      if (typeof docEl.requestFullscreen === 'function') {
        docEl.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      } else if (typeof docEl.webkitRequestFullscreen === 'function') {
        try {
          docEl.webkitRequestFullscreen();
          setIsFullscreen(true);
        } catch {}
      }
    }
  };

  // CLASS UPDATES
  const handleUpdateClass = (updatedClass: ClassRoom) => {
    setClasses((prev) => prev.map((c) => (c.id === updatedClass.id ? updatedClass : c)));
  };

  const handleCreateClass = (newClass: ClassRoom) => {
    setClasses((prev) => [...prev, newClass]);
  };

  const handleDeleteClass = (classIdToDelete: string) => {
    const remaining = classes.filter((c) => c.id !== classIdToDelete);
    if (remaining.length === 0) return;
    setClasses(remaining);
    setCurrentClassId(remaining[0].id);
  };

  const handleImportBackup = (importedClasses: ClassRoom[]) => {
    setClasses(importedClasses);
    if (importedClasses.length > 0) {
      setCurrentClassId(importedClasses[0].id);
    }
  };

  // CLEAR HISTORY
  const handleClearHistory = () => {
    setHistory([]);
  };

  // POSITION CALIBRATION
  const handleSaveStudentPositions = (newPositions: Record<string, StudentPosition>) => {
    setStudentPositions(newPositions);
    saveStoredStudentPositions(newPositions);
  };

  const handleResetStudentPositions = () => {
    const def = resetStoredStudentPositions();
    setStudentPositions(def);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 font-sans relative overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      {/* Atmospheric blurred ambient background using the 41-student artwork */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-20 filter blur-xl pointer-events-none -z-10 transform scale-105"
        style={{ backgroundImage: `url(${BOAT_ARTWORK_URL})` }}
      />
      <HeaderBar
        currentClass={currentClass}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() =>
          setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        isProjectorMode={isProjectorMode}
        onToggleProjectorMode={() => setIsProjectorMode((prev) => !prev)}
        onOpenClassManage={() => setShowClassModal(true)}
        onOpenHistory={() => setShowHistoryModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenBoatTheater={handleOpenBoatTheater}
        onOpenPositionModal={() => setShowPositionModal(true)}
        calledCount={calledStudentIds.size}
      />

      {/* Main Game Stage: Image occupies 100% width, ~70% height on desktop; fully responsive 16:9 on mobile */}
      <main className="flex-1 w-full px-2 sm:px-4 py-1.5 sm:py-2 flex flex-col justify-start lg:justify-between gap-2 sm:gap-2.5 lg:overflow-hidden max-w-7xl mx-auto">
        {/* 1. KHU VỰC HÌNH ẢNH: TỶ LỆ 16:9 CHUẨN XÁC, TỰ ĐỘNG THU PHÓNG KHÔNG MÉO NHÂN VẬT */}
        <div className="w-full shrink-0 aspect-[16/9] max-h-[38vh] sm:max-h-[46vh] lg:max-h-none lg:flex-[2.1] lg:min-h-0 relative flex items-center justify-center">
          <KnowledgeBoatScene
            students={currentClass.students}
            selectedStudent={selectedStudent}
            spinningStudent={spinningStudent}
            isSpinning={isSpinning}
            calledStudentIds={calledStudentIds}
            teacherName={currentClass.teacherName}
            schoolName={currentClass.schoolName}
            className={currentClass.name}
            positions={studentPositions}
          />
        </div>

        {/* 2. KHU VỰC ĐIỀU KHIỂN & BẢNG VÀNG: THUẬN TIỆN THAO TÁC CẢ TRÊN ĐIỆN THOẠI & MÁY TÍNH */}
        <div className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3 items-stretch lg:min-h-0">
          {/* Cột trái: Bảng gọi tên + Các nút điều khiển ngay dưới bảng gọi tên */}
          <div className={`${isProjectorMode ? 'lg:col-span-12' : 'lg:col-span-8'} flex flex-col justify-between min-h-0`}>
            <CallBoard
              displayName={displayName}
              selectedStudent={selectedStudent}
              isSpinning={isSpinning}
              countdown={countdown}
              noRepeat={noRepeat}
              onToggleNoRepeat={handleToggleNoRepeat}
              onStart={handleStart}
              onStop={handleStop}
              onNext={handleNext}
              onResetRound={handleResetRound}
              fontSize={settings.fontSize}
              allCalled={allCalled}
              remainingCount={eligibleStudents.length}
              totalStudents={currentClass.students.length}
            />
          </div>

          {/* Cột phải: Bảng thống kê */}
          {!isProjectorMode && (
            <div className="lg:col-span-4 flex flex-col justify-between min-h-0">
              <StatsPanel
                totalStudents={currentClass.students.length}
                calledCount={calledStudentIds.size}
                remainingCount={eligibleStudents.length}
                currentRound={currentRound}
                onResetRound={handleResetRound}
                isProjectorMode={false}
              />
            </div>
          )}
        </div>

        {/* Compact stats strip in projector mode if enabled */}
        {isProjectorMode && (
          <div className="flex justify-center -mt-1 shrink-0">
            <StatsPanel
              totalStudents={currentClass.students.length}
              calledCount={calledStudentIds.size}
              remainingCount={eligibleStudents.length}
              currentRound={currentRound}
              onResetRound={handleResetRound}
              isProjectorMode={true}
            />
          </div>
        )}
      </main>

      {/* FOOTER BẢN QUYỀN: Bản quyền: Trầm Thanh Tuấn - GV trường THCS và THPT Long Hiệp */}
      <footer className="text-center py-1.5 px-3 text-[11px] sm:text-xs text-amber-200/80 font-medium select-none border-t border-amber-400/25 bg-slate-950/80 backdrop-blur-sm shrink-0">
        Bản quyền: Trầm Thanh Tuấn - GV trường THCS và THPT Long Hiệp
      </footer>

      {/* Modals */}
      <ClassManageModal
        isOpen={showClassModal}
        onClose={() => setShowClassModal(false)}
        classes={classes}
        currentClassId={currentClass.id}
        onSelectClass={handleSelectClass}
        onUpdateClass={handleUpdateClass}
        onCreateClass={handleCreateClass}
        onDeleteClass={handleDeleteClass}
        onImportBackup={handleImportBackup}
      />

      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={history}
        onClearHistory={handleClearHistory}
        className={currentClass.name}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      {/* Chế độ TRÌNH CHIẾU CON THUYỀN (Toàn Màn Hình Máy Chiếu Phóng To 100%) */}
      <BoatTheaterMode
        isOpen={isBoatTheaterOpen}
        onClose={() => setIsBoatTheaterOpen(false)}
        students={currentClass.students}
        selectedStudent={selectedStudent}
        spinningStudent={spinningStudent}
        displayName={displayName}
        isSpinning={isSpinning}
        countdown={countdown}
        noRepeat={noRepeat}
        onToggleNoRepeat={handleToggleNoRepeat}
        onStart={handleStart}
        onStop={handleStop}
        onNext={handleNext}
        onResetRound={handleResetRound}
        allCalled={allCalled}
        remainingCount={eligibleStudents.length}
        totalStudents={currentClass.students.length}
        calledStudentIds={calledStudentIds}
        teacherName={currentClass.teacherName}
        schoolName={currentClass.schoolName}
        className={currentClass.name}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() =>
          setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        positions={studentPositions}
      />

      {/* Modal GÁN VỊ TRÍ HỌC SINH TRÊN THUYỀN */}
      <StudentPositionModal
        isOpen={showPositionModal}
        onClose={() => setShowPositionModal(false)}
        students={currentClass.students}
        positions={studentPositions}
        onSavePositions={handleSaveStudentPositions}
        onResetPositions={handleResetStudentPositions}
      />
    </div>
  );
}
