import axios from 'axios';
import { config } from '../../config';
import { Location, Route } from './routeService';
import { WeatherForecast } from './weatherService';

export interface TripStop {
  location: Location;
  arrivalDate: string;
  departureDate: string;
  notes?: string;
  weatherForecast?: WeatherForecast;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  stops: TripStop[];
  route?: Route;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  sharedWith?: string[];
  tags?: string[];
}

export interface CreateTripDTO {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  stops: Omit<TripStop, 'weatherForecast'>[];
}

export interface UpdateTripDTO {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  stops?: Omit<TripStop, 'weatherForecast'>[];
  status?: Trip['status'];
  sharedWith?: string[];
  tags?: string[];
}

export interface TripOptimizationOptions {
  prioritizeWeather: boolean;
  avoidBadWeather: boolean;
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  maxDrivingHoursPerDay?: number;
  includeRestStops?: boolean;
  avoidHighTraffic?: boolean;
}

export interface TripStats {
  totalDistance: number;
  totalDuration: number;
  weatherRisk: 'low' | 'medium' | 'high';
  estimatedCost: number;
  restStops: Location[];
  weatherSummary: {
    goodWeatherDays: number;
    badWeatherDays: number;
    weatherRisks: string[];
  };
}

export interface TripShare {
  tripId: string;
  sharedBy: string;
  sharedWith: string;
  permissions: ('view' | 'edit' | 'admin')[];
  sharedAt: string;
  expiresAt?: string;
}

class TripService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = `${config.apiBaseUrl}/trips`;
  }

  async getAllTrips(): Promise<Trip[]> {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching trips:', error);
      throw new Error('Failed to fetch trips');
    }
  }

  async getTripById(tripId: string): Promise<Trip> {
    try {
      const response = await axios.get(`${this.baseUrl}/${tripId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching trip ${tripId}:`, error);
      throw new Error('Failed to fetch trip details');
    }
  }

  async createTrip(tripData: CreateTripDTO): Promise<Trip> {
    try {
      const response = await axios.post(this.baseUrl, tripData);
      return response.data;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw new Error('Failed to create trip');
    }
  }

  async updateTrip(tripId: string, updates: UpdateTripDTO): Promise<Trip> {
    try {
      const response = await axios.patch(`${this.baseUrl}/${tripId}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error updating trip ${tripId}:`, error);
      throw new Error('Failed to update trip');
    }
  }

  async deleteTrip(tripId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${tripId}`);
    } catch (error) {
      console.error(`Error deleting trip ${tripId}:`, error);
      throw new Error('Failed to delete trip');
    }
  }

  async shareTrip(tripId: string, userIds: string[]): Promise<Trip> {
    try {
      const response = await axios.post(`${this.baseUrl}/${tripId}/share`, { userIds });
      return response.data;
    } catch (error) {
      console.error(`Error sharing trip ${tripId}:`, error);
      throw new Error('Failed to share trip');
    }
  }

  async getUpcomingTrips(): Promise<Trip[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/upcoming`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming trips:', error);
      throw new Error('Failed to fetch upcoming trips');
    }
  }

  async getTripsByDateRange(startDate: string, endDate: string): Promise<Trip[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/range`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trips by date range:', error);
      throw new Error('Failed to fetch trips by date range');
    }
  }

  async getTripsByTag(tag: string): Promise<Trip[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/tag/${tag}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching trips with tag ${tag}:`, error);
      throw new Error('Failed to fetch trips by tag');
    }
  }

  async addTripStop(tripId: string, stop: Omit<TripStop, 'weatherForecast'>): Promise<Trip> {
    try {
      const response = await axios.post(`${this.baseUrl}/${tripId}/stops`, stop);
      return response.data;
    } catch (error) {
      console.error(`Error adding stop to trip ${tripId}:`, error);
      throw new Error('Failed to add trip stop');
    }
  }

  async updateTripStop(
    tripId: string,
    stopIndex: number,
    updates: Partial<Omit<TripStop, 'weatherForecast'>>
  ): Promise<Trip> {
    try {
      const response = await axios.patch(
        `${this.baseUrl}/${tripId}/stops/${stopIndex}`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating stop in trip ${tripId}:`, error);
      throw new Error('Failed to update trip stop');
    }
  }

  async removeTripStop(tripId: string, stopIndex: number): Promise<Trip> {
    try {
      const response = await axios.delete(
        `${this.baseUrl}/${tripId}/stops/${stopIndex}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error removing stop from trip ${tripId}:`, error);
      throw new Error('Failed to remove trip stop');
    }
  }

  async optimizeTrip(tripId: string, options: TripOptimizationOptions): Promise<Trip> {
    try {
      const response = await axios.post(`${this.baseUrl}/${tripId}/optimize`, options);
      return response.data;
    } catch (error) {
      console.error(`Error optimizing trip ${tripId}:`, error);
      throw new Error('Failed to optimize trip');
    }
  }

  async getTripStats(tripId: string): Promise<TripStats> {
    try {
      const response = await axios.get(`${this.baseUrl}/${tripId}/stats`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching trip stats ${tripId}:`, error);
      throw new Error('Failed to fetch trip statistics');
    }
  }

  async shareTrip(tripId: string, shareData: Omit<TripShare, 'tripId' | 'sharedAt'>): Promise<TripShare> {
    try {
      const response = await axios.post(`${this.baseUrl}/${tripId}/share`, shareData);
      return response.data;
    } catch (error) {
      console.error(`Error sharing trip ${tripId}:`, error);
      throw new Error('Failed to share trip');
    }
  }

  async updateTripShare(tripId: string, shareId: string, updates: Partial<TripShare>): Promise<TripShare> {
    try {
      const response = await axios.patch(`${this.baseUrl}/${tripId}/share/${shareId}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error updating trip share ${shareId}:`, error);
      throw new Error('Failed to update trip share');
    }
  }

  async removeTripShare(tripId: string, shareId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${tripId}/share/${shareId}`);
    } catch (error) {
      console.error(`Error removing trip share ${shareId}:`, error);
      throw new Error('Failed to remove trip share');
    }
  }

  async suggestAccommodations(tripId: string, stopIndex: number): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/${tripId}/stops/${stopIndex}/accommodations`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching accommodations for trip ${tripId}:`, error);
      throw new Error('Failed to fetch accommodation suggestions');
    }
  }

  async addTripToFavorites(tripId: string): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/${tripId}/favorite`);
    } catch (error) {
      console.error(`Error adding trip ${tripId} to favorites:`, error);
      throw new Error('Failed to add trip to favorites');
    }
  }

  async removeTripFromFavorites(tripId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${tripId}/favorite`);
    } catch (error) {
      console.error(`Error removing trip ${tripId} from favorites:`, error);
      throw new Error('Failed to remove trip from favorites');
    }
  }

  async duplicateTrip(tripId: string, newStartDate?: string): Promise<Trip> {
    try {
      const response = await axios.post(`${this.baseUrl}/${tripId}/duplicate`, { newStartDate });
      return response.data;
    } catch (error) {
      console.error(`Error duplicating trip ${tripId}:`, error);
      throw new Error('Failed to duplicate trip');
    }
  }

  async exportTrip(tripId: string, format: 'pdf' | 'ics' | 'json'): Promise<Blob> {
    try {
      const response = await axios.get(`${this.baseUrl}/${tripId}/export/${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error exporting trip ${tripId}:`, error);
      throw new Error('Failed to export trip');
    }
  }
}

export const tripService = new TripService();
export default tripService;
