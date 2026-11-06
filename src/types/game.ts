export interface StudentPosition {
  x: number; // 0 to 100% across image width
  y: number; // 0 to 100% across image height
  radius?: number; // 0 to 100% glow radius, defaults ~4.2%
}

export type StudentAnimationState = 'IDLE' | 'SELECTED' | 'SPEAKING' | 'RETURN';
export type TeacherAnimationState = 'ROWING' | 'INVITING' | 'CELEBRATING';

export interface Student {
  id: string;
  name: string;
  gender?: 'male' | 'female';
  avatarIndex: number; // 0 to 19 for the 20 student avatars
  characterIndex: number; // 0 to 9 for the 10 seated student sprites
  note?: string;
  calledCount: number;
  lastCalledAt?: string;
  x?: number; // X position on boat (0-100%)
  y?: number; // Y position on boat (0-100%)
  radius?: number; // Glow radius on boat (0-100%)
}

export interface ClassRoom {
  id: string;
  name: string;
  schoolName?: string;
  teacherName: string;
  subject?: string;
  students: Student[];
}

export interface CallHistoryItem {
  id: string;
  classId: string;
  className: string;
  studentId: string;
  studentName: string;
  calledAt: string;
  roundNumber: number;
}

export type SpinSpeed = 'slow' | 'medium' | 'fast';
export type FontSize = 'normal' | 'large' | 'huge';

export interface GameSettings {
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  spinSpeed: SpinSpeed;
  fontSize: FontSize;
  autoStop: boolean;
  autoStopSeconds: number; // e.g., 3, 5, 8
  confettiEnabled: boolean;
  compactProjectorMode: boolean;
}
