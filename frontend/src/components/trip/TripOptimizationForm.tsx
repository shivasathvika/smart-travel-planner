import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Grid,
  Paper,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  WbSunny as MorningIcon,
  WbTwilight as AfternoonIcon,
  Brightness2 as EveningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { TripOptimizationOptions } from '../../services/api/tripService';

interface TripOptimizationFormProps {
  options: TripOptimizationOptions;
  onChange: (options: TripOptimizationOptions) => void;
}

export const TripOptimizationForm: React.FC<TripOptimizationFormProps> = ({
  options,
  onChange,
}) => {
  const handleChange = (field: keyof TripOptimizationOptions) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...options,
      [field]: event.target.checked,
    });
  };

  const handleTimeOfDayChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...options,
      preferredTimeOfDay: event.target.value as 'morning' | 'afternoon' | 'evening',
    });
  };

  const handleDrivingHoursChange = (_: Event, value: number | number[]) => {
    onChange({
      ...options,
      maxDrivingHoursPerDay: value as number,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Trip Optimization
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Weather Preferences
            </Typography>

            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.prioritizeWeather}
                    onChange={handleChange('prioritizeWeather')}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>Prioritize Good Weather</span>
                    <Tooltip title="Adjust route and schedule to maximize good weather conditions">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.avoidBadWeather}
                    onChange={handleChange('avoidBadWeather')}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>Avoid Bad Weather</span>
                    <Tooltip title="Route around severe weather conditions when possible">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Driving Preferences
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.includeRestStops}
                    onChange={handleChange('includeRestStops')}
                  />
                }
                label="Include Rest Stops"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={options.avoidHighTraffic}
                    onChange={handleChange('avoidHighTraffic')}
                  />
                }
                label="Avoid High Traffic"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Maximum Driving Hours per Day</Typography>
              <Slider
                value={options.maxDrivingHoursPerDay}
                onChange={handleDrivingHoursChange}
                min={4}
                max={12}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Preferred Time of Day for Travel</FormLabel>
              <RadioGroup
                row
                value={options.preferredTimeOfDay}
                onChange={handleTimeOfDayChange}
              >
                <FormControlLabel
                  value="morning"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MorningIcon sx={{ mr: 1 }} />
                      Morning
                    </Box>
                  }
                />
                <FormControlLabel
                  value="afternoon"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AfternoonIcon sx={{ mr: 1 }} />
                      Afternoon
                    </Box>
                  }
                />
                <FormControlLabel
                  value="evening"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EveningIcon sx={{ mr: 1 }} />
                      Evening
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TripOptimizationForm;
