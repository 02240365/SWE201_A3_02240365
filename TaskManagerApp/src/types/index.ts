/** Allowed task statuses. Kept as a union so the compiler enforces valid values. */
export type TaskStatus = 'todo' | 'in-progress' | 'done';

/** Primary entity. */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  categoryId: string;
  createdAt: string; // ISO date string
}

/** Secondary entity (a Task belongs to one Category). */
export interface Category {
  id: string;
  name: string;
}

/** Authenticated user object returned by the auth service. */
export interface User {
  id: string;
  email: string;
  name: string;
}

/** What the auth API returns on success. */
export interface AuthData {
  token: string;
  user: User;
}

/** Credentials submitted from the login/signup form. */
export interface Credentials {
  email: string;
  password: string;
}

/** List filter held in global state. */
export interface Filter {
  status: TaskStatus | 'all';
  query: string;
}

/** Normalized error shape produced by the API client. */
export type ApiErrorType = 'validation' | 'server' | 'network' | 'timeout' | 'cancel';

export interface ApiError {
  type: ApiErrorType;
  message: string;
  status?: number;
}

/** Payload used when creating/updating a task (no id/createdAt). */
export interface TaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  categoryId: string;
}
