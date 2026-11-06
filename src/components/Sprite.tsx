import React from 'react';
import { SPRITE_SHEET_ASSET_URL } from '../utils/assets';

export interface SpriteBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const SPRITE_SHEET_URL = SPRITE_SHEET_ASSET_URL;

export const SPRITE_MAP: Record<string, SpriteBox> = {
  // Teacher Poses
  'teacher-standing': { x: 20, y: 5, w: 170, h: 340 },
  'teacher-rowing': { x: 130, y: 5, w: 255, h: 335 },
  'teacher-pointing': { x: 290, y: 5, w: 135, h: 340 },
  'teacher-welcoming': { x: 415, y: 5, w: 165, h: 340 },

  // Teacher Faces
  'teacher-face-smile': { x: 790, y: 15, w: 125, h: 140 },
  'teacher-face-laugh': { x: 925, y: 15, w: 125, h: 140 },
  'teacher-face-surprised': { x: 1060, y: 15, w: 120, h: 140 },
  'teacher-face-wink': { x: 1195, y: 15, w: 120, h: 140 },
  'oar': { x: 1310, y: 10, w: 130, h: 340 },

  // Boat and River
  'boat': { x: 45, y: 720, w: 710, h: 150 },
  'rope': { x: 760, y: 735, w: 130, h: 110 },
  'ribbon-red': { x: 895, y: 730, w: 105, h: 115 },
  'wave': { x: 1000, y: 720, w: 420, h: 120 },

  // Scenery & Vietnamese Heritage
  'school': { x: 1195, y: 910, w: 240, h: 110 },
  'phuong-vi': { x: 905, y: 915, w: 140, h: 105 },
  'coconut': { x: 670, y: 920, w: 115, h: 100 },
  'banana': { x: 785, y: 920, w: 120, h: 100 },
  'stilt-house': { x: 1050, y: 920, w: 130, h: 100 },
  'bamboo': { x: 540, y: 925, w: 130, h: 95 },
  'shrubs-yellow': { x: 330, y: 925, w: 200, h: 90 },
  'flower-pergola': { x: 10, y: 925, w: 320, h: 90 },
  'lotus': { x: 15, y: 865, w: 120, h: 65 },
  'lotus-leaf': { x: 275, y: 865, w: 220, h: 65 },
  'clouds': { x: 640, y: 865, w: 450, h: 65 },
  'stars': { x: 1180, y: 865, w: 250, h: 65 },
  'banner-ribbon': { x: 995, y: 1025, w: 265, h: 55 },

  // Seated Student Characters (0 to 9)
  'student-char-0': { x: 0, y: 350, w: 165, h: 170 },
  'student-char-1': { x: 165, y: 350, w: 135, h: 170 },
  'student-char-2': { x: 300, y: 350, w: 135, h: 170 },
  'student-char-3': { x: 435, y: 350, w: 135, h: 170 },
  'student-char-4': { x: 570, y: 350, w: 140, h: 170 },
  'student-char-5': { x: 710, y: 350, w: 150, h: 170 },
  'student-char-6': { x: 860, y: 350, w: 130, h: 170 },
  'student-char-7': { x: 990, y: 350, w: 130, h: 170 },
  'student-char-8': { x: 1120, y: 350, w: 150, h: 170 },
  'student-char-9': { x: 1270, y: 350, w: 165, h: 170 },

  // Student Avatars (0 to 19)
  'avatar-0': { x: 10, y: 520, w: 135, h: 95 },
  'avatar-1': { x: 155, y: 520, w: 125, h: 95 },
  'avatar-2': { x: 290, y: 520, w: 135, h: 95 },
  'avatar-3': { x: 435, y: 520, w: 120, h: 95 },
  'avatar-4': { x: 565, y: 520, w: 130, h: 95 },
  'avatar-5': { x: 705, y: 520, w: 120, h: 95 },
  'avatar-6': { x: 840, y: 520, w: 130, h: 95 },
  'avatar-7': { x: 975, y: 520, w: 130, h: 95 },
  'avatar-8': { x: 1115, y: 520, w: 120, h: 95 },
  'avatar-9': { x: 1250, y: 520, w: 145, h: 95 },
  'avatar-10': { x: 10, y: 615, w: 145, h: 100 },
  'avatar-11': { x: 165, y: 615, w: 125, h: 100 },
  'avatar-12': { x: 295, y: 615, w: 135, h: 100 },
  'avatar-13': { x: 435, y: 615, w: 130, h: 100 },
  'avatar-14': { x: 570, y: 615, w: 130, h: 100 },
  'avatar-15': { x: 710, y: 615, w: 120, h: 100 },
  'avatar-16': { x: 845, y: 615, w: 130, h: 100 },
  'avatar-17': { x: 980, y: 615, w: 130, h: 100 },
  'avatar-18': { x: 1120, y: 615, w: 120, h: 100 },
  'avatar-19': { x: 1255, y: 615, w: 145, h: 100 },
};

interface SpriteProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  flipX?: boolean;
}

export const Sprite: React.FC<SpriteProps> = ({
  name,
  className = '',
  style = {},
  alt = '',
  flipX = false,
}) => {
  const box = SPRITE_MAP[name] || SPRITE_MAP['teacher-standing'];
  const { x, y, w, h } = box;

  return (
    <svg
      viewBox={`${x} ${y} ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      className={`select-none pointer-events-none ${className}`}
      style={{
        ...style,
        transform: `${style.transform || ''} ${flipX ? 'scaleX(-1)' : ''}`.trim(),
      }}
      aria-label={alt || name}
    >
      <image href={SPRITE_SHEET_URL} width="1448" height="1086" />
    </svg>
  );
};
