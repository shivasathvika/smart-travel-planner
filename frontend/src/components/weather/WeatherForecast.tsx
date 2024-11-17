import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
  IconButton,
  Alert,
  Divider,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { weatherApi, WeatherData } from '../../services/api/weatherApi';
import { format } from 'date-fns';

interface WeatherForecastProps {
  location: string;
  days?: number;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({
  location,
  days = 5,
}) => {
  const [forecast, setForecast] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await weatherApi.getForecast(location, days);
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setForecast(response.data);
      }
    } catch (err) {
      setError('Failed to fetch weather forecast');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchForecast();
    }
  }, [location, days]);

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
          <IconButton color="inherit" size="small" onClick={fetchForecast}>
            <RefreshIcon />
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
  }

  if (!forecast || !forecast.forecast) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2">
            {days}-Day Forecast for {forecast.location}
          </Typography>
          <IconButton onClick={fetchForecast} size="small">
            <RefreshIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          {forecast.forecast.map((day, index) => (
            <React.Fragment key={day.date}>
              <Grid item xs={12}>
                {index > 0 && <Divider sx={{ my: 2 }} />}
                <Box>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {index === 0
                      ? 'Today'
                      : index === 1
                      ? 'Tomorrow'
                      : format(new Date(day.date), 'EEEE, MMM d')}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography color="textSecondary" variant="body2">
                        Temperature
                      </Typography>
                      <Typography>
                        {day.temperature.min}°C - {day.temperature.max}°C
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography color="textSecondary" variant="body2">
                        Conditions
                      </Typography>
                      <Typography>{day.description}</Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography color="textSecondary" variant="body2">
                        Precipitation
                      </Typography>
                      <Typography>{day.precipitation}%</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
