import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  Divider
} from '@mui/material';
import { WeatherForecast } from '../../services/api/weatherService';
import { usePreferences } from '../../hooks/usePreferences';
import { format } from 'date-fns';
import {
  WiThermometer,
  WiHumidity,
  WiStrongWind,
  WiRaindrop
} from 'weather-icons-react';

interface WeatherForecastListProps {
  forecasts: WeatherForecast[];
}

const WeatherForecastList: React.FC<WeatherForecastListProps> = ({ forecasts }) => {
  const theme = useTheme();
  const { preferences } = usePreferences();

  const convertTemperature = (celsius: number): number => {
    if (preferences.temperatureUnit === 'fahrenheit') {
      return (celsius * 9) / 5 + 32;
    }
    return celsius;
  };

  const formatTemperature = (temp: number): string => {
    const converted = convertTemperature(temp);
    return `${Math.round(converted)}°${preferences.temperatureUnit === 'fahrenheit' ? 'F' : 'C'}`;
  };

  const getWeatherIconUrl = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        7-Day Forecast
      </Typography>
      <Grid container spacing={2}>
        {forecasts.map((forecast, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={forecast.date}>
            <Card>
              <CardContent>
                {/* Date */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ textAlign: 'center', fontWeight: 'bold' }}
                >
                  {format(new Date(forecast.date), 'EEE, MMM d')}
                </Typography>

                {/* Weather Icon and Description */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Box
                    component="img"
                    src={getWeatherIconUrl(forecast.icon)}
                    alt={forecast.description}
                    sx={{ width: 50, height: 50 }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ ml: 1, textTransform: 'capitalize' }}
                  >
                    {forecast.description}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Temperature Range */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    mb: 2
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption">High</Typography>
                    <Typography variant="body1">
                      {formatTemperature(forecast.temperature.max)}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption">Low</Typography>
                    <Typography variant="body1">
                      {formatTemperature(forecast.temperature.min)}
                    </Typography>
                  </Box>
                </Box>

                {/* Weather Details */}
                <Grid container spacing={1}>
                  {/* Humidity */}
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WiHumidity size={20} color={theme.palette.primary.main} />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {forecast.humidity}%
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Wind Speed */}
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WiStrongWind size={20} color={theme.palette.primary.main} />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {forecast.windSpeed} m/s
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Precipitation */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WiRaindrop size={20} color={theme.palette.primary.main} />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {forecast.precipitation} mm
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WeatherForecastList;
