"use client";

import { useState, useEffect, useCallback } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic data-fetching hook.
 *
 * @param fetchFn - An async function that returns data of type T.
 *                  Pass a stable reference (e.g. wrap in useCallback or define
 *                  at module level) to avoid infinite re-fetch loops.
 *
 * @example
 * const { data, loading, error } = useApi(getPublishedPrograms);
 */
export function useApi<T>(
  fetchFn: () => Promise<T>
): UseApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await fetchFn();
      setState({ data, loading: false, error: null });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setState({ data: null, loading: false, error: message });
    }
  }, [fetchFn]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
}
