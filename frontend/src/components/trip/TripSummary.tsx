import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Place as PlaceIcon,
  Label as TagIcon,
  Share as ShareIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import { Trip, tripService } from '../../services/api/tripService';
import { format } from 'date-fns';

interface TripSummaryProps {
  trip: Trip;
}

export const TripSummary: React.FC<TripSummaryProps> = ({ trip }) => {
  const handleShare = async () => {
    try {
      await tripService.shareTrip(trip.id, {
        sharedWith: '', // This would typically be filled with a selected user's email
        permissions: ['view'],
      });
    } catch (error) {
      console.error('Error sharing trip:', error);
    }
  };

  const handleExport = async (format: 'pdf' | 'ics' | 'json') => {
    try {
      const blob = await tripService.exportTrip(trip.id, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${trip.title}_${format}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting trip:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Trip Summary
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {trip.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {trip.description}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ mr: 1 }} />
                    <Typography>
                      {format(new Date(trip.startDate), 'PP')} -{' '}
                      {format(new Date(trip.endDate), 'PP')}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimeIcon sx={{ mr: 1 }} />
                    <Typography>
                      {trip.stops.length} stops • {trip.route?.duration} total
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              {trip.tags?.map((tag) => (
                <Chip
                  key={tag}
                  icon={<TagIcon />}
                  label={tag}
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Itinerary
            </Typography>

            <List>
              {trip.stops.map((stop, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <PlaceIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={stop.location.name}
                      secondary={
                        <>
                          {format(new Date(stop.arrivalDate), 'PPp')} -{' '}
                          {format(new Date(stop.departureDate), 'PPp')}
                          {stop.notes && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 1 }}
                            >
                              {stop.notes}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < trip.stops.length - 1 && <Divider variant="inset" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                fullWidth
              >
                Share Trip
              </Button>

              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('pdf')}
                fullWidth
              >
                Export as PDF
              </Button>

              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('ics')}
                fullWidth
              >
                Export to Calendar
              </Button>

              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('json')}
                fullWidth
              >
                Export as JSON
              </Button>
            </Box>
          </Paper>

          {trip.route && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Route Details
              </Typography>

              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Total Distance"
                    secondary={trip.route.distance}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Total Duration"
                    secondary={trip.route.duration}
                  />
                </ListItem>
                {/* Add more route details as needed */}
              </List>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TripSummary;
