import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/trips/TripCard';
import { tripApi } from '../services/api';

interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  places: Array<{
    id: string;
    name: string;
  }>;
  travelMode: 'driving' | 'walking' | 'transit' | 'bicycling';
  weather?: {
    temperature: number;
    description: string;
  };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [tripToShare, setTripToShare] = useState<string | null>(null);

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tripApi.getUserTrips();
      if (response.error) {
        setError(response.error);
      } else {
        setTrips(response.data);
      }
    } catch (err) {
      setError('Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCreateTrip = () => {
    navigate('/trips/new');
  };

  const handleEditTrip = (trip: Trip) => {
    navigate(`/trips/${trip.id}`);
  };

  const handleDeleteClick = (tripId: string) => {
    setTripToDelete(tripId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tripToDelete) return;

    try {
      const response = await tripApi.deleteTrip(tripToDelete);
      if (response.error) {
        setError(response.error);
      } else {
        setTrips((prevTrips) =>
          prevTrips.filter((trip) => trip.id !== tripToDelete)
        );
      }
    } catch (err) {
      setError('Failed to delete trip');
    } finally {
      setDeleteDialogOpen(false);
      setTripToDelete(null);
    }
  };

  const handleShareClick = (tripId: string) => {
    setTripToShare(tripId);
    setShareDialogOpen(true);
  };

  const handleShareConfirm = async () => {
    if (!tripToShare || !shareEmail) return;

    try {
      const response = await tripApi.shareTrip(tripToShare, shareEmail);
      if (response.error) {
        setError(response.error);
      } else {
        // Show success message or notification
      }
    } catch (err) {
      setError('Failed to share trip');
    } finally {
      setShareDialogOpen(false);
      setTripToShare(null);
      setShareEmail('');
    }
  };

  const filteredTrips = trips.filter((trip) =>
    trip.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          My Trips
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateTrip}
        >
          Create New Trip
        </Button>
      </Box>

      <Box mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search trips..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : filteredTrips.length > 0 ? (
        <Grid container spacing={3}>
          {filteredTrips.map((trip) => (
            <Grid item xs={12} sm={6} md={4} key={trip.id}>
              <TripCard
                trip={trip}
                onEdit={handleEditTrip}
                onDelete={handleDeleteClick}
                onShare={handleShareClick}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="200px"
        >
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No trips found
          </Typography>
          <Typography color="textSecondary">
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Click the button above to create your first trip'}
          </Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Trip</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this trip? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Trip Dialog */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
      >
        <DialogTitle>Share Trip</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the email address of the person you want to share this trip with.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleShareConfirm}
            color="primary"
            startIcon={<ShareIcon />}
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
