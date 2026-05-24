import type { AuthData, Credentials, ApiError } from '../types';

/**
 * Auth service.
 *
 * For this assignment we use a DUMMY token-based auth flow (no real server
 * verification) so the app is easy to run anywhere. It simulates a network
 * call and returns a fake JWT-like token plus the user object.
 *
 * Swapping in a real endpoint later only requires changing the body of these
 * two functions — the rest of the app talks to them through useAuth.
 */

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeFakeToken(email: string): string {
  // Not a real JWT — just an opaque string good enough for demo purposes.
  // We avoid btoa() since it is not available in React Native by default.
  const encoded = email.replace(/[^a-zA-Z0-9]/g, '');
  const random = Math.random().toString(36).slice(2);
  return `dummy.${encoded}.${random}`;
}

export async function signIn({ email, password }: Credentials): Promise<AuthData> {
  await delay(700);
  if (!email || !password) {
    const err: ApiError = { type: 'validation', message: 'Email and password are required.' };
    throw err;
  }
  if (password.length < 4) {
    const err: ApiError = { type: 'validation', message: 'Invalid credentials.' };
    throw err;
  }
  return {
    token: makeFakeToken(email),
    user: { id: 'u1', email, name: email.split('@')[0] },
  };
}

export async function signUp({ email, password }: Credentials): Promise<AuthData> {
  await delay(700);
  if (!email || !password) {
    const err: ApiError = { type: 'validation', message: 'Email and password are required.' };
    throw err;
  }
  return {
    token: makeFakeToken(email),
    user: { id: 'u1', email, name: email.split('@')[0] },
  };
}
