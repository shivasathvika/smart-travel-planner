import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Trip, TripOptimizationOptions, tripService } from '../../services/api/tripService';
import { WeatherMap } from '../weather/WeatherMap';
import { WeatherForecastList } from '../weather/WeatherForecastList';
import { WeatherAlertsList } from '../weather/WeatherAlertsList';
import { TripStopForm } from './TripStopForm';
import { TripDetailsForm } from './TripDetailsForm';
import { TripOptimizationForm } from './TripOptimizationForm';
import { TripSummary } from './TripSummary';

const steps = ['Trip Details', 'Add Stops', 'Weather Check', 'Optimize', 'Review'];

interface TripPlannerProps {
  existingTripId?: string;
  onTripSaved?: (trip: Trip) => void;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({ existingTripId, onTripSaved }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trip, setTrip] = useState<Partial<Trip>>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    stops: [],
  });
  const [optimizationOptions, setOptimizationOptions] = useState<TripOptimizationOptions>({
    prioritizeWeather: true,
    avoidBadWeather: true,
    preferredTimeOfDay: 'morning',
    maxDrivingHoursPerDay: 8,
    includeRestStops: true,
    avoidHighTraffic: true,
  });

  useEffect(() => {
    if (existingTripId) {
      loadExistingTrip(existingTripId);
    }
  }, [existingTripId]);

  const loadExistingTrip = async (tripId: string) => {
    try {
      setLoading(true);
      const loadedTrip = await tripService.getTripById(tripId);
      setTrip(loadedTrip);
    } catch (err) {
      setError('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      await saveTrip();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const saveTrip = async () => {
    try {
      setLoading(true);
      setError(null);

      let savedTrip: Trip;
      if (existingTripId) {
        savedTrip = await tripService.updateTrip(existingTripId, trip);
      } else {
        savedTrip = await tripService.createTrip(trip as any);
      }

      // Optimize the trip if requested
      if (optimizationOptions.prioritizeWeather || optimizationOptions.avoidBadWeather) {
        savedTrip = await tripService.optimizeTrip(savedTrip.id, optimizationOptions);
      }

      onTripSaved?.(savedTrip);
    } catch (err) {
      setError('Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <TripDetailsForm
            trip={trip}
            onChange={(updates) => setTrip((prev) => ({ ...prev, ...updates }))}
          />
        );
      case 1:
        return (
          <TripStopForm
            stops={trip.stops || []}
            onChange={(stops) => setTrip((prev) => ({ ...prev, stops }))}
          />
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <WeatherMap
                latitude={trip.stops?.[0]?.location.latitude || 0}
                longitude={trip.stops?.[0]?.location.longitude || 0}
                markers={trip.stops?.map((stop) => ({
                  lat: stop.location.latitude,
                  lng: stop.location.longitude,
                  title: stop.location.name,
                }))}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <WeatherForecastList
                forecasts={trip.stops?.map((stop) => stop.weatherForecast).filter(Boolean) || []}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <WeatherAlertsList
                alerts={trip.stops?.flatMap((stop) => stop.weatherForecast?.alerts || []) || []}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <TripOptimizationForm
            options={optimizationOptions}
            onChange={setOptimizationOptions}
          />
        );
      case 4:
        return <TripSummary trip={trip as Trip} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, mb: 4 }}>{renderStepContent()}</Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          {activeStep === steps.length - 1 ? 'Save Trip' : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
};

export default TripPlanner;
