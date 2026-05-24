import client from './client';
import type { Task, TaskInput } from '../types';

/**
 * Task API service.
 * Each function returns typed data (or throws a normalized ApiError).
 * An optional AbortSignal can be passed for cancellation.
 *
 * Endpoints (JSON Server):
 *   GET    /tasks            -> list
 *   GET    /tasks/:id        -> detail
 *   POST   /tasks            -> create
 *   PATCH  /tasks/:id        -> update
 *   DELETE /tasks/:id        -> delete
 */

export async function fetchTasks(signal?: AbortSignal): Promise<Task[]> {
  // _sort/_order ask JSON Server to return newest first.
  const res = await client.get<Task[]>('/tasks', {
    params: { _sort: 'createdAt', _order: 'desc' },
    signal,
  });
  return res.data;
}

export async function fetchTaskById(id: string, signal?: AbortSignal): Promise<Task> {
  const res = await client.get<Task>(`/tasks/${id}`, { signal });
  return res.data;
}

export async function createTask(payload: TaskInput, signal?: AbortSignal): Promise<Task> {
  const body = { ...payload, createdAt: new Date().toISOString() };
  const res = await client.post<Task>('/tasks', body, { signal });
  return res.data;
}

export async function updateTask(
  id: string,
  payload: Partial<TaskInput>,
  signal?: AbortSignal
): Promise<Task> {
  const res = await client.patch<Task>(`/tasks/${id}`, payload, { signal });
  return res.data;
}

export async function deleteTask(id: string, signal?: AbortSignal): Promise<string> {
  await client.delete(`/tasks/${id}`, { signal });
  return id;
}
