import { apiClient } from './apiClient';

interface PlaceOption {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const placesApi = {
  searchPlaces: async (query: string): Promise<ApiResponse<PlaceOption[]>> => {
    try {
      const response = await apiClient.get('/places/search', {
        params: { query },
      });
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Failed to search places',
      };
    }
  },

  getPlaceDetails: async (placeId: string): Promise<ApiResponse<PlaceOption>> => {
    try {
      const response = await apiClient.get(`/places/${placeId}`);
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Failed to get place details',
      };
    }
  },

  getPlaceWeather: async (placeId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get(`/places/${placeId}/weather`);
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Failed to get weather data',
      };
    }
  },
};

export type { PlaceOption };
