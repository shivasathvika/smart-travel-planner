import { apiClient } from './apiClient';

interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  places: Array<{
    id: string;
    name: string;
  }>;
  travelMode: 'driving' | 'walking' | 'transit' | 'bicycling';
  weather?: {
    temperature: number;
    description: string;
  };
}

interface TripCreateData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  places: Array<{
    id: string;
    name: string;
  }>;
  travelMode: 'driving' | 'walking' | 'transit' | 'bicycling';
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const tripApi = {
  getUserTrips: async (): Promise<ApiResponse<Trip[]>> => {
    try {
      const response = await apiClient.get('/trips');
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Failed to fetch trips',
      };
    }
  },

  getTrip: async (tripId: string): Promise<ApiResponse<Trip>> => {
    try {
      const response = await apiClient.get(`/trips/${tripId}`);
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Failed to fetch trip',
      };
    }
  },

  createTrip: async (tripData: TripCreateData): Promise<ApiResponse<Trip>> => {
    try {
      const response = await apiClient.post('/trips', tripData);
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Failed to create trip',
      };
    }
  },

  updateTrip: async (
    tripId: string,
    tripData: Partial<TripCreateData>
  ): Promise<ApiResponse<Trip>> => {
    try {
      const response = await apiClient.put(`/trips/${tripId}`, tripData);
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Failed to update trip',
      };
    }
  },

  deleteTrip: async (tripId: string): Promise<ApiResponse<void>> => {
    try {
      await apiClient.delete(`/trips/${tripId}`);
      return {};
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Failed to delete trip',
      };
    }
  },

  shareTrip: async (
    tripId: string,
    email: string
  ): Promise<ApiResponse<void>> => {
    try {
      await apiClient.post(`/trips/${tripId}/share`, { email });
      return {};
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Failed to share trip',
      };
    }
  },

  updateTripWeather: async (tripId: string): Promise<ApiResponse<Trip>> => {
    try {
      const response = await apiClient.post(`/trips/${tripId}/weather`);
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.response?.data?.message || 'Failed to update weather',
      };
    }
  },
};

export type { Trip, TripCreateData, ApiResponse };
