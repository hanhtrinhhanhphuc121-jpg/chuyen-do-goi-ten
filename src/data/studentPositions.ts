import { StudentPosition } from '../types/game';

export const STORAGE_KEY_POSITIONS = 'chuyen_do_student_positions_lh_12_2_v4';

/**
 * DEFAULT COORDINATES FOR 41 STUDENTS OF CLASS 12.2 ON THE BOAT ARTWORK (image_650fee66.png)
 * Image Aspect Ratio: 16:9 (100% width, 100% height)
 * - 22 Female students in front rows (Áo dài tím nhạt / trắng)
 * - 19 Male students in middle & back rows (Áo sơ mi tím nhạt / trắng)
 * - Teacher (Thầy Trầm Thanh Tuấn) is on the left holding the oar (x: 14.2%, y: 44.5%)
 */
export const DEFAULT_STUDENT_POSITIONS: Record<string, StudentPosition> = {
  // === HÀNG 1 NỮ (11 Nữ hàng trước áo dài - Từ trái sang phải) ===
  'lh-5': { x: 23.5, y: 56.8, radius: 4.5 }, // Thạch Thị Kim Chi (nữ cạnh thầy, hoa trắng trên tóc, tay tựa má)
  'lh-6': { x: 29.8, y: 52.8, radius: 4.5 }, // Huỳnh Thị Ngọc Diễm (nữ tóc thắt bím, tựa má)
  'lh-7': { x: 35.8, y: 56.8, radius: 4.5 }, // Thạch Kim Thị Diễm (nữ cười duyên, ôm má)
  'lh-11': { x: 43.5, y: 57.2, radius: 4.5 }, // Thạch Thị Thanh Hà (nữ tựa cằm cười tươi)
  'lh-10': { x: 51.5, y: 55.8, radius: 4.5 }, // Lâm Ngọc Hà (nữ chính diện tạo hình trái tim)
  'lh-15': { x: 58.8, y: 56.5, radius: 4.5 }, // Thạch Thị Xuân Hoa (nữ tựa má cười tươi)
  'lh-14': { x: 66.2, y: 56.8, radius: 4.5 }, // Trầm Thị Ngọc Hân (nữ đeo kính tròn tri thức, tựa má)
  'lh-21': { x: 73.5, y: 56.8, radius: 4.5 }, // Thạch Thị Thiên Lý (nữ tóc dài dịu dàng, tựa má)
  'lh-23': { x: 80.5, y: 56.8, radius: 4.5 }, // Nguyễn Thị Quỳnh Ngân (nữ hoa cài tóc, cười rạng rỡ)
  'lh-24': { x: 86.8, y: 54.8, radius: 4.5 }, // Trầm Thị Cẩm Nguyên (nữ tựa cằm mạn phải)
  'lh-25': { x: 92.8, y: 56.0, radius: 4.5 }, // Trần Ngọc Thảo Nhân (nữ ngoài cùng mạn phải thuyền)

  // === HÀNG 2 NỮ (11 Nữ hàng giữa áo dài - Từ trái sang phải) ===
  'lh-27': { x: 20.2, y: 44.5, radius: 4.2 }, // Sơn Thị Hiếu Phương (nữ hoa trắng trên tóc bên trái)
  'lh-29': { x: 26.5, y: 44.5, radius: 4.2 }, // Nguyễn Lư Mai Thanh (nữ kính cận bên trái)
  'lh-31': { x: 34.0, y: 43.8, radius: 4.2 }, // Dương Phương Thuỳ (nữ tóc dài cười ấm áp)
  'lh-32': { x: 42.0, y: 44.0, radius: 4.2 }, // Ngô Thị Thanh Thuý (nữ thắt bím dịu dàng)
  'lh-36': { x: 49.5, y: 43.5, radius: 4.2 }, // Thạch Thị Thanh Trúc (nữ giơ tay chữ V chiến thắng)
  'lh-33': { x: 56.8, y: 43.5, radius: 4.2 }, // Nguyễn Lý Mỹ Tiên (nữ đeo kính tri thức)
  'lh-34': { x: 64.0, y: 43.8, radius: 4.2 }, // Kim Thị Ngọc Trăm (nữ tóc dài bồng bềnh)
  'lh-35': { x: 71.0, y: 43.8, radius: 4.2 }, // Nguyễn Thanh Trúc (nữ nụ cười tươi tắn)
  'lh-39': { x: 78.5, y: 43.8, radius: 4.2 }, // Trương Kim Ngọc Tươi (nữ nụ cười hiền hậu)
  'lh-40': { x: 85.5, y: 43.2, radius: 4.2 }, // Nhan Thiên Xuân (nữ tóc dài mạn phải)
  'lh-41': { x: 91.5, y: 43.2, radius: 4.2 }, // Ngô Hải Yến (nữ ngoài cùng hàng 2)

  // === HÀNG 3 NAM (11 Nam hàng giữa áo sơ mi - Từ trái sang phải) ===
  'lh-2': { x: 16.5, y: 33.5, radius: 4.0 }, // Châu Văn Bảo (nam ngoài cùng bên trái hàng 3)
  'lh-3': { x: 22.2, y: 33.5, radius: 4.0 }, // Kim Trần Gia Bảo (nam cười tươi bên trái)
  'lh-4': { x: 30.0, y: 33.0, radius: 4.0 }, // Sơn Kim Bảo (nam đeo kính bên trái)
  'lh-8': { x: 37.5, y: 32.8, radius: 4.0 }, // Trần Hoàng Thiện Duy (nam đeo kính tròn)
  'lh-9': { x: 44.8, y: 32.5, radius: 4.0 }, // Phạm Huỳnh Phương Đông (nam nụ cười ấm áp)
  'lh-12': { x: 52.2, y: 32.5, radius: 4.0 }, // Thạch Huỳnh Hai (nam chính diện)
  'lh-13': { x: 59.8, y: 32.5, radius: 4.0 }, // Trần Phú Hào (nam tóc gợn sóng)
  'lh-16': { x: 68.0, y: 32.5, radius: 4.0 }, // Võ Quốc Huy (nam lông mày rậm)
  'lh-17': { x: 75.2, y: 32.5, radius: 4.0 }, // Thạch Đức Kiên (nam nụ cười tự tin)
  'lh-18': { x: 82.8, y: 32.5, radius: 4.0 }, // Liêu Tuấn Kiệt (nam hàng giữa bên phải)
  'lh-38': { x: 94.8, y: 38.0, radius: 4.0 }, // Thạch Trịnh Anh Tuấn (nam ngoài cùng mạn phải hàng 3)

  // === HÀNG 4 NAM (8 Nam hàng sau cùng chân trời - Từ trái sang phải) ===
  'lh-19': { x: 33.8, y: 24.5, radius: 3.8 }, // Sơn Ngọc Lâm (nam đeo kính hàng sau bên trái)
  'lh-20': { x: 41.5, y: 24.0, radius: 3.8 }, // Thạch Minh Lợi (nam nụ cười tươi)
  'lh-22': { x: 48.8, y: 23.8, radius: 3.8 }, // Kiến Gia Mẫn (nam vóc dáng cao)
  'lh-26': { x: 55.8, y: 23.8, radius: 3.8 }, // Thạch Phol (nam hàng sau trung tâm)
  'lh-28': { x: 63.5, y: 22.8, radius: 3.8 }, // Thạch Nhật Tâm (nam khuôn mặt rạng rỡ)
  'lh-30': { x: 71.0, y: 22.8, radius: 3.8 }, // Thạch Ngọc Thanh (nam ánh mắt sáng)
  'lh-37': { x: 78.5, y: 22.8, radius: 3.8 }, // Thạch Minh Tuấn (nam cười tươi)
  'lh-1': { x: 86.5, y: 22.8, radius: 3.8 }, // Kiên Bình An (nam giơ ngón tay cái Thumbs Up)
};

/**
 * Retrieve saved student positions or fallback to defaults
 */
export function getStoredStudentPositions(): Record<string, StudentPosition> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POSITIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults so any missing students are still covered
      return { ...DEFAULT_STUDENT_POSITIONS, ...parsed };
    }
  } catch (err) {
    console.warn('Could not read student positions from localStorage', err);
  }
  return DEFAULT_STUDENT_POSITIONS;
}

/**
 * Persist student positions to localStorage
 */
export function saveStoredStudentPositions(positions: Record<string, StudentPosition>): void {
  try {
    localStorage.setItem(STORAGE_KEY_POSITIONS, JSON.stringify(positions));
  } catch (err) {
    console.warn('Could not save student positions to localStorage', err);
  }
}

/**
 * Reset student positions to default mapping
 */
export function resetStoredStudentPositions(): Record<string, StudentPosition> {
  try {
    localStorage.removeItem(STORAGE_KEY_POSITIONS);
  } catch (err) {
    console.warn('Could not reset student positions', err);
  }
  return DEFAULT_STUDENT_POSITIONS;
}
