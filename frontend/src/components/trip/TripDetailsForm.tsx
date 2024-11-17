import React from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  Chip,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Trip } from '../../services/api/tripService';
import { format } from 'date-fns';

interface TripDetailsFormProps {
  trip: Partial<Trip>;
  onChange: (updates: Partial<Trip>) => void;
}

const commonTags = [
  'Family',
  'Business',
  'Adventure',
  'Relaxation',
  'Beach',
  'Mountain',
  'City',
  'Road Trip',
  'Weekend Getaway',
  'International',
];

export const TripDetailsForm: React.FC<TripDetailsFormProps> = ({ trip, onChange }) => {
  const handleDateChange = (field: 'startDate' | 'endDate') => (date: Date | null) => {
    if (date) {
      onChange({ [field]: format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Trip Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Trip Title"
            value={trip.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
            required
            helperText="Give your trip a memorable name"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={trip.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            multiline
            rows={3}
            helperText="Add any notes or details about your trip"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Start Date"
            value={trip.startDate ? new Date(trip.startDate) : null}
            onChange={handleDateChange('startDate')}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
              },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <DatePicker
            label="End Date"
            value={trip.endDate ? new Date(trip.endDate) : null}
            onChange={handleDateChange('endDate')}
            minDate={trip.startDate ? new Date(trip.startDate) : undefined}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Autocomplete
            multiple
            freeSolo
            options={commonTags}
            value={trip.tags || []}
            onChange={(_, newValue) => onChange({ tags: newValue })}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Tags"
                placeholder="Add tags"
                helperText="Add tags to categorize your trip"
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TripDetailsForm;
