import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import analyticsService from '../services/analytics/analyticsService';
import offlineService from '../services/offline/offlineService';

export interface UserPreferences {
  theme: 'light' | 'dark';
  temperatureUnit: 'celsius' | 'fahrenheit';
  notifications: {
    email: boolean;
    push: boolean;
    weatherAlerts: boolean;
    tripReminders: boolean;
  };
  mapSettings: {
    defaultZoom: number;
    showTraffic: boolean;
    preferredTravelMode: 'driving' | 'walking' | 'bicycling' | 'transit';
  };
  displaySettings: {
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    listViewMode: 'compact' | 'detailed';
  };
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  temperatureUnit: 'celsius',
  notifications: {
    email: true,
    push: true,
    weatherAlerts: true,
    tripReminders: true,
  },
  mapSettings: {
    defaultZoom: 12,
    showTraffic: true,
    preferredTravelMode: 'driving',
  },
  displaySettings: {
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    listViewMode: 'detailed',
  },
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  // Load preferences from local storage on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedPreferences = await offlineService.getOfflineData('userPreferences');
        if (storedPreferences) {
          setPreferences(storedPreferences.data);
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Update a single preference
  const updatePreference = useCallback(async <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    try {
      const newPreferences = {
        ...preferences,
        [key]: value,
      };

      // Update state
      setPreferences(newPreferences);

      // Save to offline storage
      await offlineService.saveOfflineData('userPreferences', newPreferences);

      // Track the change
      analyticsService.trackEvent(
        'preferences',
        'update',
        `${String(key)}_${String(value)}`
      );

      enqueueSnackbar('Preferences updated successfully', {
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to update preference:', error);
      enqueueSnackbar('Failed to update preferences', {
        variant: 'error',
      });
    }
  }, [preferences, enqueueSnackbar]);

  // Update multiple preferences at once
  const updatePreferences = useCallback(async (
    updates: Partial<UserPreferences>
  ) => {
    try {
      const newPreferences = {
        ...preferences,
        ...updates,
      };

      // Update state
      setPreferences(newPreferences);

      // Save to offline storage
      await offlineService.saveOfflineData('userPreferences', newPreferences);

      // Track the change
      analyticsService.trackEvent(
        'preferences',
        'bulk_update',
        `${Object.keys(updates).join(',')}`
      );

      enqueueSnackbar('Preferences updated successfully', {
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to update preferences:', error);
      enqueueSnackbar('Failed to update preferences', {
        variant: 'error',
      });
    }
  }, [preferences, enqueueSnackbar]);

  // Reset preferences to defaults
  const resetPreferences = useCallback(async () => {
    try {
      // Update state
      setPreferences(defaultPreferences);

      // Save to offline storage
      await offlineService.saveOfflineData('userPreferences', defaultPreferences);

      // Track the reset
      analyticsService.trackEvent('preferences', 'reset');

      enqueueSnackbar('Preferences reset to defaults', {
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to reset preferences:', error);
      enqueueSnackbar('Failed to reset preferences', {
        variant: 'error',
      });
    }
  }, [enqueueSnackbar]);

  return {
    preferences,
    isLoading,
    updatePreference,
    updatePreferences,
    resetPreferences,
  };
}

export default usePreferences;
