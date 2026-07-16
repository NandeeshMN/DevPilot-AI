/**
 * Safely writes a value to LocalStorage.
 */
export const setItem = (key: string, value: any): void => {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('LocalStorage setItem Error:', error);
  }
};

/**
 * Safely reads a value from LocalStorage.
 */
export const getItem = <T = string>(key: string): T | null => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  } catch (error) {
    console.error('LocalStorage getItem Error:', error);
    return null;
  }
};

/**
 * Deletes a key from LocalStorage.
 */
export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('LocalStorage removeItem Error:', error);
  }
};
