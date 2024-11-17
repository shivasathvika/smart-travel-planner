import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  CircularProgress, 
  Box,
  IconButton,
  Alert
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { weatherApi } from '../../services/api';

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

interface WeatherDisplayProps {
  location: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ location }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await weatherApi.getWeather(location);
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setWeather(response.data);
      }
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchWeather();
    }
  }, [location]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={fetchWeather}
          >
            <RefreshIcon />
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2">
            {weather.location}
          </Typography>
          <IconButton onClick={fetchWeather} size="small">
            <RefreshIcon />
          </IconButton>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography color="textSecondary" gutterBottom>
              Temperature
            </Typography>
            <Typography variant="h6">
              {weather.temperature}°C
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color="textSecondary" gutterBottom>
              Conditions
            </Typography>
            <Typography variant="h6">
              {weather.description}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color="textSecondary" gutterBottom>
              Humidity
            </Typography>
            <Typography variant="h6">
              {weather.humidity}%
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color="textSecondary" gutterBottom>
              Wind Speed
            </Typography>
            <Typography variant="h6">
              {weather.windSpeed} km/h
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherDisplay;
