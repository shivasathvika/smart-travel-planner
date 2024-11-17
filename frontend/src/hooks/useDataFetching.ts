import { useState, useEffect, useCallback } from 'react';
import useLoading from './useLoading';
import useError from './useError';
import cacheService from '../services/cache/cacheService';
import offlineService from '../services/offline/offlineService';

interface FetchOptions {
  cacheKey?: string;
  cacheTTL?: number;
  forceRefresh?: boolean;
  offlineKey?: string;
}

interface UseDataFetchingReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDataFetching<T>(
  fetchFn: () => Promise<T>,
  options: FetchOptions = {}
): UseDataFetchingReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const { isLoading, withLoading } = useLoading();
  const { error, handleError, clearError } = useError();

  const fetchData = useCallback(async (forceRefresh: boolean = false) => {
    try {
      clearError();

      // Check cache first if cacheKey is provided and not forcing refresh
      if (options.cacheKey && !forceRefresh) {
        const cachedData = cacheService.get<T>(options.cacheKey);
        if (cachedData) {
          setData(cachedData);
          return;
        }
      }

      // If offline and offlineKey provided, try to get from offline storage
      if (offlineService.isOffline() && options.offlineKey) {
        const offlineData = await offlineService.getOfflineData(options.offlineKey);
        if (offlineData) {
          setData(offlineData.data);
          return;
        }
      }

      // Fetch fresh data
      const result = await withLoading(fetchFn());
      setData(result);

      // Cache the result if cacheKey is provided
      if (options.cacheKey) {
        cacheService.set(options.cacheKey, result, options.cacheTTL);
      }

      // Store in offline storage if offlineKey is provided
      if (options.offlineKey) {
        await offlineService.saveOfflineData(options.offlineKey, result);
      }
    } catch (error) {
      handleError(error, 'Error fetching data');
    }
  }, [fetchFn, options, withLoading, handleError, clearError]);

  useEffect(() => {
    fetchData(options.forceRefresh);
  }, [fetchData, options.forceRefresh]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

export default useDataFetching;
