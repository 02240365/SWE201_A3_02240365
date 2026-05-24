import { useCallback, useState } from 'react';
import { useAppDispatch, useAuthState } from '../state/store';
import { saveAuth, clearAuth } from '../state/persistence';
import { setAuthToken } from '../api/client';
import * as authApi from '../api/auth';
import type { AuthData, Credentials, ApiError, User } from '../types';

interface UseAuthResult {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: Credentials) => Promise<boolean>;
  signup: (credentials: Credentials) => Promise<boolean>;
  logout: () => Promise<void>;
}

/**
 * Custom hook encapsulating all authentication logic.
 * Components call login/signup/logout without knowing about the store,
 * the API, persistence, or token injection — those are wired up here.
 */
export function useAuth(): UseAuthResult {
  const auth = useAuthState();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = useCallback(
    async (data: AuthData) => {
      setAuthToken(data.token); // inject token into axios for future requests
      dispatch({ type: 'SET_AUTH', payload: data });
      await saveAuth(data); // persist so the user stays logged in
    },
    [dispatch]
  );

  const login = useCallback(
    async (credentials: Credentials): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const data = await authApi.signIn(credentials);
        await handleSuccess(data);
        return true;
      } catch (e) {
        setError((e as ApiError).message || 'Login failed.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleSuccess]
  );

  const signup = useCallback(
    async (credentials: Credentials): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const data = await authApi.signUp(credentials);
        await handleSuccess(data);
        return true;
      } catch (e) {
        setError((e as ApiError).message || 'Sign up failed.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleSuccess]
  );

  const logout = useCallback(async (): Promise<void> => {
    setAuthToken(null);
    dispatch({ type: 'CLEAR_AUTH' });
    await clearAuth();
  }, [dispatch]);

  return {
    user: auth ? auth.user : null,
    token: auth ? auth.token : null,
    isAuthenticated: !!auth,
    loading,
    error,
    login,
    signup,
    logout,
  };
}
