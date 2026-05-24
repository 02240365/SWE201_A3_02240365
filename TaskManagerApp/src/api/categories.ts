import client from './client';
import type { Category } from '../types';

/**
 * Category API service (secondary entity).
 * Categories are referenced by tasks via categoryId.
 *
 *   GET /categories -> list of categories
 */
export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const res = await client.get<Category[]>('/categories', { signal });
  return res.data;
}
