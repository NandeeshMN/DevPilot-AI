/**
 * Formats a date string or timestamp into a localized short time string.
 */
export const formatTime = (dateValue: string | number | Date): string => {
  try {
    const date = new Date(dateValue);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};
