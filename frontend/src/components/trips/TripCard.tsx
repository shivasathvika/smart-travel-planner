import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Place as PlaceIcon,
  CalendarToday as CalendarIcon,
  DirectionsCar as CarIcon,
  DirectionsWalk as WalkIcon,
  DirectionsTransit as TransitIcon,
  DirectionsBike as BikeIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import TagList from '../tags/TagList';

interface Place {
  id: string;
  name: string;
  address: string;
}

interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  places: Place[];
  tags: {
    id: string;
    name: string;
    color: string;
  }[];
  travelMode: 'driving' | 'walking' | 'transit' | 'bicycling';
  weather?: {
    temperature: number;
    description: string;
  };
}

interface TripCardProps {
  trip: Trip;
  onEdit?: (trip: Trip) => void;
  onDelete?: (tripId: string) => void;
  onShare?: (tripId: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  onEdit,
  onDelete,
  onShare,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getTravelModeIcon = () => {
    switch (trip.travelMode) {
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
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="h2" gutterBottom>
            {trip.title}
          </Typography>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            aria-label="trip options"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                onEdit && onEdit(trip);
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                onShare && onShare(trip.id);
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Share</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                onDelete && onDelete(trip.id);
                handleMenuClose();
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Box>

        <TagList tags={trip.tags} size="small" />

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mt: 1, mb: 2 }}
        >
          {trip.description}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <CalendarIcon color="action" fontSize="small" />
          <Typography variant="body2" color="textSecondary">
            {format(new Date(trip.startDate), 'MMM d, yyyy')} -{' '}
            {format(new Date(trip.endDate), 'MMM d, yyyy')}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          {getTravelModeIcon()}
          <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
            {trip.travelMode}
          </Typography>
        </Box>

        {trip.weather && (
          <Box bgcolor="grey.100" p={1} borderRadius={1} mb={2}>
            <Typography variant="body2">
              {trip.weather.temperature}°C - {trip.weather.description}
            </Typography>
          </Box>
        )}

        <Typography variant="subtitle2" gutterBottom>
          Places to Visit
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {trip.places.map((place) => (
            <Chip
              key={place.id}
              icon={<PlaceIcon />}
              label={place.name}
              size="small"
              variant="outlined"
            />
          ))}
          {trip.places.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No places added yet
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => onEdit && onEdit(trip)}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TripCard;
