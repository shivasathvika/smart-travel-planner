import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  DirectionsWalk as WalkIcon,
  DirectionsTransit as TransitIcon,
  DirectionsBike as BikeIcon,
  Schedule as ScheduleIcon,
  Route as RouteIcon,
} from '@mui/icons-material';

interface RouteDetailsProps {
  distance: string;
  duration: string;
  travelMode: 'driving' | 'walking' | 'transit' | 'bicycling';
  places: Array<{
    name: string;
    address: string;
  }>;
}

const RouteDetails: React.FC<RouteDetailsProps> = ({
  distance,
  duration,
  travelMode,
  places,
}) => {
  const getTravelModeIcon = () => {
    switch (travelMode) {
      case 'driving':
        return <CarIcon />;
      case 'walking':
        return <WalkIcon />;
      case 'transit':
        return <TransitIcon />;
      case 'bicycling':
        return <BikeIcon />;
      default:
        return <CarIcon />;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Route Details
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Box display="flex" alignItems="center" gap={1}>
            {getTravelModeIcon()}
            <Typography
              variant="body1"
              sx={{ textTransform: 'capitalize' }}
            >
              {travelMode}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box display="flex" alignItems="center" gap={1}>
            <RouteIcon />
            <Typography variant="body1">{distance}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box display="flex" alignItems="center" gap={1}>
            <ScheduleIcon />
            <Typography variant="body1">{duration}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" gutterBottom>
        Stops
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {places.map((place, index) => (
          <Box key={place.name}>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={index + 1}
                color={index === 0 ? 'success' : index === places.length - 1 ? 'error' : 'primary'}
                size="small"
              />
              <Box>
                <Typography variant="body1">{place.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {place.address}
                </Typography>
              </Box>
            </Box>
            {index < places.length - 1 && (
              <Box
                sx={{
                  ml: 2,
                  mt: 1,
                  mb: 1,
                  borderLeft: '2px dashed',
                  borderColor: 'divider',
                  height: '20px',
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default RouteDetails;
