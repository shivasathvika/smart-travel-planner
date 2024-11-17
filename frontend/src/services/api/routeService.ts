import axios from 'axios';
import { config } from '../../config';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
}

export interface RoutePoint {
  location: Location;
  arrivalTime?: string;
  departureTime?: string;
  stayDuration?: number;
}

export interface RouteSegment {
  startLocation: Location;
  endLocation: Location;
  distance: number;
  duration: number;
  polyline: string;
  instructions: string[];
  travelMode: 'driving' | 'walking' | 'bicycling' | 'transit';
}

export interface Route {
  segments: RouteSegment[];
  totalDistance: number;
  totalDuration: number;
  waypoints: RoutePoint[];
  overview: {
    bounds: {
      northeast: Location;
      southwest: Location;
    };
    polyline: string;
  };
}

export interface RouteOptions {
  travelMode?: 'driving' | 'walking' | 'bicycling' | 'transit';
  alternatives?: boolean;
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  departureTime?: Date;
  trafficModel?: 'best_guess' | 'pessimistic' | 'optimistic';
}

class RouteService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = config.routeApiKey;
    this.baseUrl = config.routeApiBaseUrl;
  }

  async getRoute(
    origin: Location,
    destination: Location,
    waypoints: Location[] = [],
    options: RouteOptions = {}
  ): Promise<Route> {
    try {
      const response = await axios.get(`${this.baseUrl}/directions`, {
        params: {
          origin: `${origin.latitude},${origin.longitude}`,
          destination: `${destination.latitude},${destination.longitude}`,
          waypoints: waypoints.map(wp => `${wp.latitude},${wp.longitude}`).join('|'),
          mode: options.travelMode || 'driving',
          alternatives: options.alternatives || false,
          avoid: this.buildAvoidString(options),
          departure_time: options.departureTime?.getTime() || 'now',
          traffic_model: options.trafficModel || 'best_guess',
          key: this.apiKey
        }
      });

      return this.transformRouteData(response.data);
    } catch (error) {
      console.error('Error fetching route:', error);
      throw new Error('Failed to fetch route data');
    }
  }

  async getPlaceDetails(placeId: string): Promise<Location> {
    try {
      const response = await axios.get(`${this.baseUrl}/place/details`, {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,geometry',
          key: this.apiKey
        }
      });

      return this.transformPlaceData(response.data);
    } catch (error) {
      console.error('Error fetching place details:', error);
      throw new Error('Failed to fetch place details');
    }
  }

  async searchPlaces(query: string, location?: Location, radius?: number): Promise<Location[]> {
    try {
      const params: any = {
        query,
        key: this.apiKey
      };

      if (location) {
        params.location = `${location.latitude},${location.longitude}`;
        params.radius = radius || 5000;
      }

      const response = await axios.get(`${this.baseUrl}/place/textsearch`, { params });
      return this.transformPlacesSearchData(response.data);
    } catch (error) {
      console.error('Error searching places:', error);
      throw new Error('Failed to search places');
    }
  }

  private buildAvoidString(options: RouteOptions): string {
    const avoidItems: string[] = [];
    if (options.avoidTolls) avoidItems.push('tolls');
    if (options.avoidHighways) avoidItems.push('highways');
    return avoidItems.join('|');
  }

  private transformRouteData(data: any): Route {
    const route = data.routes[0];
    const legs = route.legs;

    const segments: RouteSegment[] = legs.map((leg: any) => ({
      startLocation: {
        latitude: leg.start_location.lat,
        longitude: leg.start_location.lng,
        address: leg.start_address
      },
      endLocation: {
        latitude: leg.end_location.lat,
        longitude: leg.end_location.lng,
        address: leg.end_address
      },
      distance: leg.distance.value,
      duration: leg.duration.value,
      polyline: leg.steps.map((step: any) => step.polyline.points).join(''),
      instructions: leg.steps.map((step: any) => step.html_instructions),
      travelMode: leg.steps[0].travel_mode.toLowerCase()
    }));

    return {
      segments,
      totalDistance: segments.reduce((total, segment) => total + segment.distance, 0),
      totalDuration: segments.reduce((total, segment) => total + segment.duration, 0),
      waypoints: this.extractWaypoints(legs),
      overview: {
        bounds: {
          northeast: {
            latitude: route.bounds.northeast.lat,
            longitude: route.bounds.northeast.lng
          },
          southwest: {
            latitude: route.bounds.southwest.lat,
            longitude: route.bounds.southwest.lng
          }
        },
        polyline: route.overview_polyline.points
      }
    };
  }

  private transformPlaceData(data: any): Location {
    const place = data.result;
    return {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      address: place.formatted_address,
      name: place.name
    };
  }

  private transformPlacesSearchData(data: any): Location[] {
    return data.results.map((place: any) => ({
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      address: place.formatted_address,
      name: place.name
    }));
  }

  private extractWaypoints(legs: any[]): RoutePoint[] {
    return legs.map((leg: any) => ({
      location: {
        latitude: leg.start_location.lat,
        longitude: leg.start_location.lng,
        address: leg.start_address
      },
      arrivalTime: leg.arrival_time?.text,
      departureTime: leg.departure_time?.text,
      stayDuration: 0
    }));
  }
}

export const routeService = new RouteService();
export default routeService;
