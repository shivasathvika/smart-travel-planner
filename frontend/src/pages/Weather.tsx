import React, { useState } from 'react';
import '../styles/Weather.css';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

const Weather: React.FC = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!location) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <h1>Weather Forecast</h1>
      
      <div className="search-section">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          className="location-input"
        />
        <button 
          onClick={fetchWeather}
          disabled={loading}
          className="search-button"
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.location}</h2>
          <div className="weather-details">
            <div className="weather-item">
              <label>Temperature:</label>
              <span>{weatherData.temperature}°C</span>
            </div>
            <div className="weather-item">
              <label>Description:</label>
              <span>{weatherData.description}</span>
            </div>
            <div className="weather-item">
              <label>Humidity:</label>
              <span>{weatherData.humidity}%</span>
            </div>
            <div className="weather-item">
              <label>Wind Speed:</label>
              <span>{weatherData.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
