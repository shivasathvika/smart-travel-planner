import React from 'react';
import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import { WeatherData, WeatherForecast, WeatherAlert } from '../../services/api/weatherService';
import WeatherCard from './WeatherCard';
import WeatherForecastList from './WeatherForecastList';
import WeatherAlertsList from './WeatherAlertsList';
import WeatherMap from './WeatherMap';
import useDataFetching from '../../hooks/useDataFetching';
import weatherService from '../../services/api/weatherService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

interface WeatherDashboardProps {
  latitude: number;
  longitude: number;
  locationName?: string;
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  latitude,
  longitude,
  locationName
}) => {
  const theme = useTheme();

  const { data: currentWeather, isLoading: isLoadingCurrent, error: currentError } = 
    useDataFetching<WeatherData>(
      () => weatherService.getCurrentWeather(latitude, longitude),
      {
        cacheKey: `weather_${latitude}_${longitude}`,
        cacheTTL: 5 * 60 * 1000 // 5 minutes
      }
    );

  const { data: forecast, isLoading: isLoadingForecast, error: forecastError } = 
    useDataFetching<WeatherForecast[]>(
      () => weatherService.getForecast(latitude, longitude),
      {
        cacheKey: `forecast_${latitude}_${longitude}`,
        cacheTTL: 30 * 60 * 1000 // 30 minutes
      }
    );

  const { data: alerts, isLoading: isLoadingAlerts, error: alertsError } = 
    useDataFetching<WeatherAlert[]>(
      () => weatherService.getWeatherAlerts(latitude, longitude),
      {
        cacheKey: `alerts_${latitude}_${longitude}`,
        cacheTTL: 15 * 60 * 1000 // 15 minutes
      }
    );

  if (isLoadingCurrent || isLoadingForecast || isLoadingAlerts) {
    return <LoadingSpinner />;
  }

  if (currentError || forecastError || alertsError) {
    return (
      <ErrorMessage 
        message="Failed to load weather data. Please try again later."
        error={currentError || forecastError || alertsError}
      />
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Location Title */}
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Weather for {locationName || `${latitude}, ${longitude}`}
          </Typography>
        </Grid>

        {/* Current Weather */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            {currentWeather && (
              <WeatherCard
                temperature={currentWeather.temperature}
                humidity={currentWeather.humidity}
                windSpeed={currentWeather.windSpeed}
                description={currentWeather.description}
                icon={currentWeather.icon}
                precipitation={currentWeather.precipitation}
              />
            )}
          </Paper>
        </Grid>

        {/* Weather Map */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <WeatherMap
              latitude={latitude}
              longitude={longitude}
              markers={[{ lat: latitude, lng: longitude, title: locationName }]}
            />
          </Paper>
        </Grid>

        {/* Weather Alerts */}
        {alerts && alerts.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <WeatherAlertsList alerts={alerts} />
            </Paper>
          </Grid>
        )}

        {/* Weather Forecast */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            {forecast && <WeatherForecastList forecasts={forecast} />}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WeatherDashboard;
