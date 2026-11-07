/**
 * Safe localStorage wrapper that gracefully falls back to memoryCache if localStorage
 * is blocked, restricted, or throws SecurityError in iOS Safari Private Browsing or in-app WebViews (Zalo/FB).
 */
const memoryCache: Record<string, string> = {};

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      // Safe fallback
    }
    return memoryCache[key] ?? null;
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      // Fallback to in-memory
    }
    memoryCache[key] = value;
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {}
    delete memoryCache[key];
  },

  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {}
    for (const k in memoryCache) {
      delete memoryCache[k];
    }
  },
};
