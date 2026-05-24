import { useCallback, useEffect, useRef, useState, Dispatch, SetStateAction, DependencyList } from 'react';
import type { ApiError } from '../types';

interface UseFetchListResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setData: Dispatch<SetStateAction<T | null>>;
}

/**
 * Reusable, generic data-fetching hook.
 *
 * Handles the states every network screen needs: loading, error, data, and a
 * refetch() for retry / pull-to-refresh. It also cancels the in-flight request
 * on unmount (or before a refetch) using an AbortController, so we never call
 * setState on an unmounted screen.
 *
 * @param fetcher  (signal) => Promise<T>  — pass the AbortSignal through to axios
 * @param deps     dependency array that triggers an automatic refetch
 */
export function useFetchList<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList = []
): UseFetchListResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const run = useCallback(async () => {
    // Cancel any previous in-flight request first.
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const result = await fetcher(controller.signal);
      setData(result);
    } catch (e) {
      const apiError = e as ApiError;
      // Ignore deliberate cancellations.
      if (apiError && apiError.type === 'cancel') return;
      setError(apiError && apiError.message ? apiError.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [run]);

  return { data, loading, error, refetch: run, setData };
}
