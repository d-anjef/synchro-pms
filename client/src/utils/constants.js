export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  COMPLETED: 'completed',
};

export const TASK_STATUS_LABELS = {
  todo: 'To-do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  completed: 'Completed',
};

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const PROJECT_STATUS = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  PROJECT_MANAGER: 'project_manager',
  TEAM_MEMBER: 'team_member',
  CLIENT: 'client',
};

export const ROLE_LABELS = {
  admin: 'Admin',
  project_manager: 'Project Manager',
  team_member: 'Team Member',
  client: 'Client',
};