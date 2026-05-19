import { format, formatDistanceToNow, isToday, isYesterday, isTomorrow } from 'date-fns';

export const formatDate = (date, pattern = 'MMM dd, yyyy') => {
  if (!date) return '';
  return format(new Date(date), pattern);
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatSmartDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isToday(d)) return `Today, ${format(d, 'h:mm a')}`;
  if (isYesterday(d)) return `Yesterday, ${format(d, 'h:mm a')}`;
  if (isTomorrow(d)) return `Tomorrow, ${format(d, 'h:mm a')}`;
  return format(d, 'MMM dd, yyyy');
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
};