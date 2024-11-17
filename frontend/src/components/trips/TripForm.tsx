import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tripApi } from '../../services/api';
import PlacesAutocomplete from '../places/PlacesAutocomplete';
import MapContainer from '../maps/MapContainer';
import { PlaceOption } from '../../services/api/placesApi';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { isAfter, isBefore, format } from 'date-fns';
import TagSelector, { Tag } from '../tags/TagSelector';

interface TripFormProps {
  onSubmit?: (tripData: any) => void;
  initialData?: any;
}

interface TripFormData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  places: PlaceOption[];
  travelMode: string;
  tags: Tag[];
}

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: yup
    .string()
    .max(500, 'Description must be at most 500 characters'),
  startDate: yup
    .date()
    .required('Start date is required')
    .min(new Date(), 'Start date must be in the future'),
  endDate: yup
    .date()
    .required('End date is required')
    .min(yup.ref('startDate'), 'End date must be after start date'),
  places: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required(),
        address: yup.string().required(),
        coordinates: yup.object().shape({
          lat: yup.number().required(),
          lng: yup.number().required(),
        }),
      })
    )
    .min(1, 'At least one place is required'),
  travelMode: yup
    .string()
    .required('Travel mode is required')
    .oneOf(['DRIVING', 'WALKING', 'TRANSIT', 'BICYCLING'], 'Invalid travel mode'),
  tags: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        name: yup.string().required(),
        color: yup.string(),
      })
    )
    .min(1, 'At least one tag is required'),
});

const initialValues: TripFormData = {
  title: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
  places: [],
  travelMode: 'DRIVING',
  tags: [],
};

const TripForm: React.FC<TripFormProps> = ({ onSubmit, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      startDate: initialData?.startDate || new Date(),
      endDate: initialData?.endDate || new Date(),
      places: initialData?.places || [],
      travelMode: initialData?.travelMode || 'DRIVING',
      tags: initialData?.tags || [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);

      try {
        const response = await tripApi.createTrip(values);
        if (response.error) {
          setError(response.error);
        } else if (onSubmit) {
          onSubmit(response.data);
        }
      } catch (err) {
        setError('Failed to save trip');
      } finally {
        setLoading(false);
      }
    },
  });

  const handlePlaceSelect = (place: PlaceOption | null) => {
    if (place) {
      formik.setFieldValue('places', [...formik.values.places, place]);
    }
  };

  const handleRemovePlace = (placeId: string) => {
    formik.setFieldValue(
      'places',
      formik.values.places.filter((place: PlaceOption) => place.id !== placeId)
    );
  };

  return (
    <Card>
      <CardContent>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Trip Details
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Trip Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description && Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formik.values.startDate}
                  onChange={(date) => formik.setFieldValue('startDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error:
                        formik.touched.startDate &&
                        Boolean(formik.errors.startDate),
                      helperText:
                        formik.touched.startDate && formik.errors.startDate,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formik.values.endDate}
                  onChange={(date) => formik.setFieldValue('endDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error:
                        formik.touched.endDate && Boolean(formik.errors.endDate),
                      helperText:
                        formik.touched.endDate && formik.errors.endDate,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Travel Mode</InputLabel>
                <Select
                  value={formik.values.travelMode}
                  onChange={(e) =>
                    formik.setFieldValue('travelMode', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  name="travelMode"
                  label="Travel Mode"
                  error={
                    formik.touched.travelMode && Boolean(formik.errors.travelMode)
                  }
                >
                  <MenuItem value="DRIVING">Driving</MenuItem>
                  <MenuItem value="TRANSIT">Public Transit</MenuItem>
                  <MenuItem value="WALKING">Walking</MenuItem>
                  <MenuItem value="BICYCLING">Bicycling</MenuItem>
                </Select>
                {formik.touched.travelMode && formik.errors.travelMode && (
                  <Typography variant="caption" color="error">
                    {formik.errors.travelMode}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TagSelector
                selectedTags={formik.values.tags}
                onChange={(newTags) => formik.setFieldValue('tags', newTags)}
                error={
                  formik.touched.tags && formik.errors.tags
                    ? 'At least one tag is required'
                    : undefined
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Places to Visit
              </Typography>
              <PlacesAutocomplete
                onPlaceSelect={handlePlaceSelect}
                label="Add Places"
                placeholder="Search for cities, attractions, or addresses"
              />
              {formik.touched.places && formik.errors.places && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {formik.errors.places}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {formik.values.places.map((place: PlaceOption) => (
                  <Chip
                    key={place.id}
                    label={place.name}
                    onDelete={() => handleRemovePlace(place.id)}
                  />
                ))}
                {formik.values.places.length === 0 && (
                  <Typography color="textSecondary">
                    No places added yet. Use the search above to add places to your trip.
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 3 }}>
                <MapContainer
                  places={formik.values.places}
                  travelMode={formik.values.travelMode.toLowerCase() as 'driving' | 'walking' | 'transit' | 'bicycling'}
                />
              </Box>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading || !formik.isValid}
              >
                {loading ? 'Saving...' : initialData ? 'Update Trip' : 'Create Trip'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TripForm;
