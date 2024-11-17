import axios from 'axios';
import { config } from '../../config';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  precipitation: number;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  precipitation: number;
}

export interface WeatherAlert {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  startTime: string;
  endTime: string;
}

class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = config.weatherApiKey;
    this.baseUrl = config.weatherApiBaseUrl;
  }

  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const response = await axios.get(`${this.baseUrl}/current`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      return this.transformWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw new Error('Failed to fetch current weather data');
    }
  }

  async getForecast(latitude: number, longitude: number, days: number = 7): Promise<WeatherForecast[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
          cnt: days
        }
      });

      return this.transformForecastData(response.data);
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw new Error('Failed to fetch weather forecast data');
    }
  }

  async getWeatherAlerts(latitude: number, longitude: number): Promise<WeatherAlert[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/alerts`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey
        }
      });

      return this.transformAlertData(response.data);
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      throw new Error('Failed to fetch weather alerts');
    }
  }

  private transformWeatherData(data: any): WeatherData {
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      precipitation: data.rain?.['1h'] || 0,
      forecast: []
    };
  }

  private transformForecastData(data: any): WeatherForecast[] {
    return data.list.map((item: any) => ({
      date: item.dt_txt,
      temperature: {
        min: item.main.temp_min,
        max: item.main.temp_max
      },
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      precipitation: item.rain?.['3h'] || 0
    }));
  }

  private transformAlertData(data: any): WeatherAlert[] {
    return data.alerts?.map((alert: any) => ({
      type: alert.event,
      severity: this.getSeverityLevel(alert.severity),
      description: alert.description,
      startTime: new Date(alert.start * 1000).toISOString(),
      endTime: new Date(alert.end * 1000).toISOString()
    })) || [];
  }

  private getSeverityLevel(level: number): 'low' | 'medium' | 'high' {
    if (level <= 1) return 'low';
    if (level <= 2) return 'medium';
    return 'high';
  }
}

export const weatherService = new WeatherService();
export default weatherService;
