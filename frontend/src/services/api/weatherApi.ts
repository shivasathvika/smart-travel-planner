import { apiClient } from './apiClient';

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  location: string;
  forecast?: Array<{
    date: string;
    temperature: {
      min: number;
      max: number;
    };
    description: string;
    precipitation: number;
  }>;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const weatherApi = {
  getWeather: async (location: string): Promise<ApiResponse<WeatherData>> => {
    try {
      const response = await apiClient.get('/weather', {
        params: { location },
      });
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Failed to fetch weather data',
      };
    }
  },

  getForecast: async (location: string, days: number = 5): Promise<ApiResponse<WeatherData>> => {
    try {
      const response = await apiClient.get('/weather/forecast', {
        params: { location, days },
      });
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Failed to fetch weather forecast',
      };
    }
  },

  getWeatherByCoordinates: async (lat: number, lng: number): Promise<ApiResponse<WeatherData>> => {
    try {
      const response = await apiClient.get('/weather/coordinates', {
        params: { lat, lng },
      });
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Failed to fetch weather data',
      };
    }
  },
};

export type { WeatherData };
