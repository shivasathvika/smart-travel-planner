import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  WiThermometer,
  WiHumidity,
  WiStrongWind,
  WiRaindrop
} from 'weather-icons-react';
import { usePreferences } from '../../hooks/usePreferences';

interface WeatherCardProps {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  precipitation: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  humidity,
  windSpeed,
  description,
  icon,
  precipitation
}) => {
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
    <Card>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Weather Icon and Temperature */}
          <Grid item xs={12} sm={6} container alignItems="center" justifyContent="center">
            <Box
              component="img"
              src={getWeatherIconUrl(icon)}
              alt={description}
              sx={{ width: 100, height: 100 }}
            />
            <Typography variant="h2" component="div" sx={{ ml: 2 }}>
              {formatTemperature(temperature)}
            </Typography>
          </Grid>

          {/* Weather Description */}
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h5"
              component="div"
              sx={{ textTransform: 'capitalize', mb: 2 }}
            >
              {description}
            </Typography>

            {/* Weather Details */}
            <Grid container spacing={2}>
              {/* Humidity */}
              <Grid item xs={6}>
                <Tooltip title="Humidity">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WiHumidity
                      size={24}
                      color={theme.palette.primary.main}
                    />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {humidity}%
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>

              {/* Wind Speed */}
              <Grid item xs={6}>
                <Tooltip title="Wind Speed">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WiStrongWind
                      size={24}
                      color={theme.palette.primary.main}
                    />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {windSpeed} m/s
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>

              {/* Precipitation */}
              <Grid item xs={6}>
                <Tooltip title="Precipitation">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WiRaindrop
                      size={24}
                      color={theme.palette.primary.main}
                    />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {precipitation} mm
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>

              {/* Feels Like */}
              <Grid item xs={6}>
                <Tooltip title="Feels Like">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WiThermometer
                      size={24}
                      color={theme.palette.primary.main}
                    />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {formatTemperature(temperature)}
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
