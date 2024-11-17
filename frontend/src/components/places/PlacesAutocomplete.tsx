import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';
import debounce from 'lodash/debounce';
import { placesApi } from '../../services/api';

interface PlaceOption {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: PlaceOption | null) => void;
  label?: string;
  placeholder?: string;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  onPlaceSelect,
  label = 'Search Places',
  placeholder = 'Enter a location',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<PlaceOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaceSuggestions = async (query: string) => {
    if (!query) {
      setOptions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await placesApi.searchPlaces(query);
      if (response.error) {
        setError(response.error);
        setOptions([]);
      } else {
        setOptions(response.data || []);
      }
    } catch (err) {
      setError('Failed to fetch place suggestions');
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce the fetch function to avoid too many API calls
  const debouncedFetch = debounce(fetchPlaceSuggestions, 300);

  useEffect(() => {
    debouncedFetch(inputValue);
    return () => {
      debouncedFetch.cancel();
    };
  }, [inputValue]);

  return (
    <Autocomplete
      fullWidth
      filterOptions={(x) => x} // Disable built-in filtering as we use the API
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      loading={loading}
      noOptionsText={
        error || (inputValue ? 'No places found' : 'Start typing to search')
      }
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(_event, newValue) => {
        onPlaceSelect(newValue);
      }}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              p: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Box display="flex" alignItems="flex-start">
              <LocationIcon
                sx={{ color: 'text.secondary', mr: 2, mt: 0.5 }}
              />
              <Box>
                <Typography variant="body1">{option.name}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {option.address}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </li>
      )}
    />
  );
};

export default PlacesAutocomplete;
