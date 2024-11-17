import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import analyticsService from '../services/analytics/analyticsService';

interface UseErrorReturn {
  error: Error | null;
  setError: (error: Error | null) => void;
  handleError: (error: unknown, context?: string) => void;
  clearError: () => void;
  withErrorHandling: <T>(promise: Promise<T>, context?: string) => Promise<T>;
}

export const useError = (): UseErrorReturn => {
  const [error, setError] = useState<Error | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleError = useCallback((error: unknown, context?: string) => {
    const errorObject = error instanceof Error ? error : new Error(String(error));
    setError(errorObject);

    // Log the error to analytics
    analyticsService.trackError(errorObject, context);

    // Show error notification
    enqueueSnackbar(errorObject.message, {
      variant: 'error',
      autoHideDuration: 5000,
      preventDuplicate: true,
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error occurred:', {
        error: errorObject,
        context,
        stack: errorObject.stack,
      });
    }
  }, [enqueueSnackbar]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const withErrorHandling = useCallback(async <T>(
    promise: Promise<T>,
    context?: string
  ): Promise<T> => {
    try {
      const result = await promise;
      return result;
    } catch (error) {
      handleError(error, context);
      throw error;
    }
  }, [handleError]);

  return {
    error,
    setError,
    handleError,
    clearError,
    withErrorHandling,
  };
};

export default useError;
