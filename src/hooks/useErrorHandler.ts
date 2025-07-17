import { getErrorMessage } from "@/lib/error";
import { useCallback, useState } from "react";

export interface ErrorState {
  error: string | null;
  isRetrying: boolean;
  retryCount: number;
  lastErrorTime: number | null;
}

export function useErrorHandler(maxRetries = 3, retryDelay = 1000) {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isRetrying: false,
    retryCount: 0,
    lastErrorTime: null,
  });

  const handleError = useCallback((error: unknown) => {
    const errorMessage = getErrorMessage(error);
    setErrorState((prev) => ({
      ...prev,
      error: errorMessage,
      isRetrying: false,
      lastErrorTime: Date.now(),
    }));
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isRetrying: false,
      retryCount: 0,
      lastErrorTime: null,
    });
  }, []);

  const retry = useCallback(
    async (operation: () => Promise<void>) => {
      if (errorState.retryCount >= maxRetries) {
        return;
      }

      setErrorState((prev) => ({
        ...prev,
        isRetrying: true,
        retryCount: prev.retryCount + 1,
      }));

      try {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        await operation();
        clearError();
      } catch (error) {
        handleError(error);
      }
    },
    [errorState.retryCount, maxRetries, retryDelay, clearError, handleError]
  );

  const canRetry = errorState.retryCount < maxRetries;

  return {
    error: errorState.error,
    isRetrying: errorState.isRetrying,
    retryCount: errorState.retryCount,
    canRetry,
    handleError,
    clearError,
    retry,
  };
}
