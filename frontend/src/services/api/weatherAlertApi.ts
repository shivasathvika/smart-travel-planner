import { apiClient } from './apiClient';

export interface WeatherAlert {
  id: string;
  type: 'severe' | 'warning' | 'watch' | 'advisory';
  title: string;
  description: string;
  severity: 'extreme' | 'severe' | 'moderate' | 'minor';
  startTime: string;
  endTime: string;
  areas: string[];
  source: string;
}

export interface WeatherAlertResponse {
  alerts: WeatherAlert[];
  lastUpdated: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

const weatherAlertApi = {
  // Get weather alerts for a specific location
  getAlerts: async (coordinates: Coordinates): Promise<WeatherAlert[]> => {
    try {
      const response = await apiClient.get<WeatherAlertResponse>(
        `/weather/alerts`,
        {
          params: {
            lat: coordinates.lat,
            lng: coordinates.lng,
          },
        }
      );
      return response.data.alerts;
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return [];
    }
  },

  // Get weather alerts for multiple locations (trip route)
  getTripAlerts: async (places: { coordinates: Coordinates }[]): Promise<WeatherAlert[]> => {
    try {
      const response = await apiClient.post<WeatherAlertResponse>(
        `/weather/alerts/trip`,
        {
          locations: places.map(place => place.coordinates),
        }
      );
      return response.data.alerts;
    } catch (error) {
      console.error('Error fetching trip weather alerts:', error);
      return [];
    }
  },

  // Subscribe to weather alerts for a specific trip
  subscribeToAlerts: async (tripId: string): Promise<void> => {
    try {
      await apiClient.post(`/weather/alerts/subscribe/${tripId}`);
    } catch (error) {
      console.error('Error subscribing to weather alerts:', error);
      throw error;
    }
  },

  // Unsubscribe from weather alerts for a specific trip
  unsubscribeFromAlerts: async (tripId: string): Promise<void> => {
    try {
      await apiClient.delete(`/weather/alerts/subscribe/${tripId}`);
    } catch (error) {
      console.error('Error unsubscribing from weather alerts:', error);
      throw error;
    }
  },
};

export default weatherAlertApi;
