import type { TaskStatus } from '../types';

/**
 * Centralized design tokens so colors/spacing stay consistent across screens.
 * A restrained palette: a single indigo accent on a soft neutral background.
 */
export const theme = {
  colors: {
    primary: '#4f46e5',
    primaryDark: '#4338ca',
    primarySoft: '#eef2ff',
    background: '#f8fafc',
    surface: '#ffffff',
    border: '#e5e7eb',
    text: '#111827',
    textMuted: '#6b7280',
    danger: '#dc2626',
    dangerSoft: '#fef2f2',
    success: '#16a34a',
    warning: '#d97706',
    // Status colors for task badges.
    statusTodo: '#6b7280',
    statusInProgress: '#d97706',
    statusDone: '#16a34a',
  },
  spacing: (n: number): number => n * 8,
  radius: 12,
} as const;

export interface StatusMeta {
  label: string;
  color: string;
  /** Ionicons name used by StatusBadge / pickers. */
  icon: string;
}

/** Map a status value to a display label, color, and Ionicons name. */
export function statusMeta(status: TaskStatus): StatusMeta {
  switch (status) {
    case 'in-progress':
      return { label: 'In Progress', color: theme.colors.statusInProgress, icon: 'time-outline' };
    case 'done':
      return { label: 'Done', color: theme.colors.statusDone, icon: 'checkmark-circle' };
    case 'todo':
    default:
      return { label: 'To Do', color: theme.colors.statusTodo, icon: 'ellipse-outline' };
  }
}
