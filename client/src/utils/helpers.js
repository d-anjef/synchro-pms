export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getAvatarColor = (name = '') => {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
    '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4',
    '#3b82f6', '#a855f7',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const truncate = (str = '', length = 50) =>
  str.length > length ? `${str.slice(0, length)}...` : str;

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const classNames = (...args) =>
  args.filter(Boolean).join(' ');