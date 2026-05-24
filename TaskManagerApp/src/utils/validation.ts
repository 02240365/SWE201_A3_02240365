import type { Credentials, TaskInput } from '../types';

/**
 * Pure validation helpers used by forms.
 * Each returns an errors object: { field: message }.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuth(values: Credentials): Partial<Record<keyof Credentials, string>> {
  const errors: Partial<Record<keyof Credentials, string>> = {};
  if (!values.email || !values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 4) {
    errors.password = 'Password must be at least 4 characters.';
  }
  return errors;
}

export function validateTask(values: TaskInput): Partial<Record<keyof TaskInput, string>> {
  const errors: Partial<Record<keyof TaskInput, string>> = {};
  const title = (values.title || '').trim();
  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (title.length > 80) {
    errors.title = 'Title must be 80 characters or fewer.';
  }

  if (values.description && values.description.length > 500) {
    errors.description = 'Description must be 500 characters or fewer.';
  }

  if (!values.categoryId) {
    errors.categoryId = 'Please choose a category.';
  }
  return errors;
}
