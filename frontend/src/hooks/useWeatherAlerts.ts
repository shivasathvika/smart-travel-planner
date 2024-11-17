import { useState, useEffect, useCallback } from 'react';
import weatherAlertApi, { WeatherAlert } from '../services/api/weatherAlertApi';
import { PlaceOption } from '../services/api/placesApi';

interface UseWeatherAlertsProps {
  places: PlaceOption[];
  tripId?: string;
  enabled?: boolean;
}

interface UseWeatherAlertsReturn {
  alerts: WeatherAlert[];
  loading: boolean;
  error: string | null;
  dismissAlert: (alertId: string) => void;
  subscribeToAlerts: () => Promise<void>;
  unsubscribeFromAlerts: () => Promise<void>;
  refreshAlerts: () => Promise<void>;
}

const useWeatherAlerts = ({
  places,
  tripId,
  enabled = true,
}: UseWeatherAlertsProps): UseWeatherAlertsReturn => {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    if (!enabled || !places.length) return;

    setLoading(true);
    setError(null);

    try {
      const fetchedAlerts = await weatherAlertApi.getTripAlerts(places);
      
      // Sort alerts by severity (extreme -> severe -> moderate -> minor)
      const sortedAlerts = [...fetchedAlerts].sort((a, b) => {
        const severityOrder = {
          extreme: 0,
          severe: 1,
          moderate: 2,
          minor: 3,
        };
        return (
          severityOrder[a.severity] - severityOrder[b.severity] ||
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      });

      setAlerts(sortedAlerts);
    } catch (err) {
      setError('Failed to fetch weather alerts');
      console.error('Error fetching weather alerts:', err);
    } finally {
      setLoading(false);
    }
  }, [places, enabled]);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.filter((alert) => alert.id !== alertId)
    );
  }, []);

  const subscribeToAlerts = useCallback(async () => {
    if (!tripId) return;

    try {
      await weatherAlertApi.subscribeToAlerts(tripId);
    } catch (err) {
      console.error('Error subscribing to alerts:', err);
      throw err;
    }
  }, [tripId]);

  const unsubscribeFromAlerts = useCallback(async () => {
    if (!tripId) return;

    try {
      await weatherAlertApi.unsubscribeFromAlerts(tripId);
    } catch (err) {
      console.error('Error unsubscribing from alerts:', err);
      throw err;
    }
  }, [tripId]);

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchAlerts();

    // Refresh alerts every 30 minutes
    const intervalId = setInterval(fetchAlerts, 30 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchAlerts]);

  return {
    alerts,
    loading,
    error,
    dismissAlert,
    subscribeToAlerts,
    unsubscribeFromAlerts,
    refreshAlerts: fetchAlerts,
  };
};

export default useWeatherAlerts;
