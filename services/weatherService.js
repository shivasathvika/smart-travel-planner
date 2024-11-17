import fetch from 'node-fetch';
import logger from '../config/logger.js';

class WeatherService {
    constructor() {
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    async getWeatherForecast(city) {
        try {
            const response = await fetch(
                `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.statusText}`);
            }

            const data = await response.json();
            return this.processWeatherData(data);
        } catch (error) {
            logger.error('Error fetching weather data:', error);
            throw new Error('Failed to fetch weather data');
        }
    }

    processWeatherData(data) {
        const dailyForecasts = {};
        
        // Group forecasts by day
        data.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000).toLocaleDateString();
            
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    date,
                    temp: {
                        max: forecast.main.temp_max,
                        min: forecast.main.temp_max
                    },
                    weather: forecast.weather[0].main,
                    description: forecast.weather[0].description,
                    precipitation: forecast.pop * 100 // Probability of precipitation in percentage
                };
            } else {
                // Update min/max temperatures
                dailyForecasts[date].temp.max = Math.max(
                    dailyForecasts[date].temp.max,
                    forecast.main.temp_max
                );
                dailyForecasts[date].temp.min = Math.min(
                    dailyForecasts[date].temp.min,
                    forecast.main.temp_min
                );
            }
        });

        return Object.values(dailyForecasts);
    }
}

export default new WeatherService();
