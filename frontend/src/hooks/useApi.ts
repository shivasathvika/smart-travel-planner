import { useCallback } from 'react';
import useLoading from './useLoading';
import useError from './useError';
import cacheService from '../services/cache/cacheService';
import offlineService from '../services/offline/offlineService';
import analyticsService from '../services/analytics/analyticsService';
import { useSnackbar } from 'notistack';

interface ApiOptions {
  cacheKey?: string;
  cacheTTL?: number;
  offlineKey?: string;
  analyticsAction?: string;
  successMessage?: string;
  errorMessage?: string;
}

interface UseApiReturn<T> {
  execute: (...args: any[]) => Promise<T>;
  isLoading: boolean;
  error: Error | null;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: ApiOptions = {}
): UseApiReturn<T> {
  const { isLoading, withLoading } = useLoading();
  const { error, handleError, clearError } = useError();
  const { enqueueSnackbar } = useSnackbar();

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      try {
        clearError();

        // Check cache first if cacheKey is provided
        if (options.cacheKey) {
          const cachedData = cacheService.get<T>(options.cacheKey);
          if (cachedData) {
            return cachedData;
          }
        }

        // If offline, queue the request for later
        if (offlineService.isOffline()) {
          if (options.offlineKey) {
            await offlineService.queueSync({
              action: 'create',
              endpoint: options.offlineKey,
              data: args,
            });

            enqueueSnackbar('Changes will be saved when you\'re back online', {
              variant: 'warning',
            });

            // Return cached data if available
            const offlineData = await offlineService.getOfflineData(options.offlineKey);
            if (offlineData) {
              return offlineData.data;
            }
          }

          throw new Error('You are offline. Please try again when you have an internet connection.');
        }

        // Execute the API call
        const result = await withLoading(apiFunction(...args));

        // Cache the result if cacheKey is provided
        if (options.cacheKey) {
          cacheService.set(options.cacheKey, result, options.cacheTTL);
        }

        // Store in offline storage if offlineKey is provided
        if (options.offlineKey) {
          await offlineService.saveOfflineData(options.offlineKey, result);
        }

        // Track the action in analytics
        if (options.analyticsAction) {
          analyticsService.trackEvent('api', options.analyticsAction);
        }

        // Show success message if provided
        if (options.successMessage) {
          enqueueSnackbar(options.successMessage, {
            variant: 'success',
          });
        }

        return result;
      } catch (error) {
        const errorMessage = options.errorMessage || 'An error occurred. Please try again.';
        handleError(error, errorMessage);
        throw error;
      }
    },
    [
      apiFunction,
      options,
      withLoading,
      clearError,
      handleError,
      enqueueSnackbar,
    ]
  );

  return {
    execute,
    isLoading,
    error,
  };
}

export default useApi;
