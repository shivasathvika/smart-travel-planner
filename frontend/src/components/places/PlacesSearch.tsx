import React, { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';

interface Place {
  id: string;
  name: string;
  address: string;
  rating: number;
  type: string;
}

interface PlacesSearchProps {
  onPlaceSelect?: (place: Place) => void;
}

const PlacesSearch: React.FC<PlacesSearchProps> = ({ onPlaceSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // TODO: Implement API call to search places
      // const response = await placesApi.search(searchQuery);
      // setPlaces(response.data);
      
      // Temporary mock data
      setPlaces([
        {
          id: '1',
          name: 'Sample Place 1',
          address: '123 Main St',
          rating: 4.5,
          type: 'Restaurant'
        },
        {
          id: '2',
          name: 'Sample Place 2',
          address: '456 Oak Ave',
          rating: 4.0,
          type: 'Tourist Attraction'
        }
      ]);
    } catch (err) {
      setError('Failed to search places');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceSelect = (place: Place) => {
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box component="form" onSubmit={handleSearch} mb={3}>
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <TextField
                fullWidth
                label="Search places"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}

        <List>
          {places.map((place) => (
            <ListItem key={place.id} divider>
              <ListItemText
                primary={place.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textSecondary">
                      {place.address}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Rating: {place.rating} • {place.type}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handlePlaceSelect(place)}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {places.length === 0 && !loading && (
          <Typography color="textSecondary" align="center">
            No places found. Try searching for a location.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PlacesSearch;
