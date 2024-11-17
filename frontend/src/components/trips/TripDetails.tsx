import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import WeatherAlerts from '../weather/WeatherAlerts';
import WeatherDisplay from '../weather/WeatherDisplay';
import WeatherForecast from '../weather/WeatherForecast';
import MapContainer from '../maps/MapContainer';
import TagList from '../tags/TagList';
import useWeatherAlerts from '../../hooks/useWeatherAlerts';
import { Tag } from '../tags/TagSelector';

interface TripDetailsProps {
  trip: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    places: Array<{
      name: string;
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    }>;
    tags: Tag[];
    travelMode: 'driving' | 'walking' | 'transit' | 'bicycling';
    weather?: {
      temperature: number;
      description: string;
    };
  };
  onEdit?: () => void;
  onShare?: () => void;
}

const TripDetails: React.FC<TripDetailsProps> = ({
  trip,
  onEdit,
  onShare,
}) => {
  const {
    alerts,
    loading: alertsLoading,
    error: alertsError,
    dismissAlert,
    subscribeToAlerts,
  } = useWeatherAlerts({
    places: trip.places,
    tripId: trip.id,
  });

  return (
    <Box>
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  {trip.title}
                </Typography>
                <TagList tags={trip.tags} size="medium" />
              </Box>
              <Box>
                {onEdit && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={onEdit}
                    sx={{ mr: 1 }}
                  >
                    Edit Trip
                  </Button>
                )}
                {onShare && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onShare}
                  >
                    Share Trip
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" paragraph>
              {trip.description}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Trip Dates
            </Typography>
            <Typography variant="body1" paragraph>
              {format(new Date(trip.startDate), 'MMMM d, yyyy')} -{' '}
              {format(new Date(trip.endDate), 'MMMM d, yyyy')}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Weather Alerts Section */}
          <Grid item xs={12}>
            {alertsLoading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
              </Box>
            ) : alertsError ? (
              <Typography color="error">{alertsError}</Typography>
            ) : (
              <WeatherAlerts
                alerts={alerts}
                onDismiss={dismissAlert}
                onSubscribe={subscribeToAlerts}
              />
            )}
          </Grid>

          {/* Map Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Trip Route
            </Typography>
            <MapContainer
              places={trip.places}
              travelMode={trip.travelMode}
            />
          </Grid>

          {/* Weather Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Weather Forecast
            </Typography>
            <Grid container spacing={2}>
              {trip.places.map((place) => (
                <Grid item xs={12} md={6} key={place.name}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {place.name}
                    </Typography>
                    <WeatherDisplay
                      coordinates={place.coordinates}
                      showDetails
                    />
                    <Box mt={2}>
                      <WeatherForecast
                        coordinates={place.coordinates}
                        startDate={new Date(trip.startDate)}
                        endDate={new Date(trip.endDate)}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TripDetails;
