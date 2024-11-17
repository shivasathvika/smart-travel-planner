import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, CircularProgress, Alert } from '@mui/material';
import { Loader } from '@googlemaps/js-api-loader';
import { tripApi } from '../../services/api';
import { PlaceOption } from '../../services/api/placesApi';

interface TripMapProps {
  places: PlaceOption[];
  travelMode?: google.maps.TravelMode;
  onRouteChange?: (route: {
    distance: string;
    duration: string;
    waypoints: google.maps.DirectionsWaypoint[];
  }) => void;
}

const TripMap: React.FC<TripMapProps> = ({
  places,
  travelMode = google.maps.TravelMode.DRIVING,
  onRouteChange,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['places'],
        });

        await loader.load();
        
        if (!mapRef.current) return;

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 2,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        const directionsServiceInstance = new google.maps.DirectionsService();
        const directionsRendererInstance = new google.maps.DirectionsRenderer({
          map: mapInstance,
          suppressMarkers: false,
        });

        setMap(mapInstance);
        setDirectionsService(directionsServiceInstance);
        setDirectionsRenderer(directionsRendererInstance);
        setLoading(false);
      } catch (err) {
        setError('Failed to load Google Maps');
        setLoading(false);
      }
    };

    initMap();
  }, []);

  // Update route when places or travel mode changes
  useEffect(() => {
    if (!map || !directionsService || !directionsRenderer || places.length < 2) {
      return;
    }

    const calculateRoute = async () => {
      try {
        const waypoints = places.slice(1, -1).map(place => ({
          location: { lat: place.coordinates.lat, lng: place.coordinates.lng },
          stopover: true,
        }));

        const request: google.maps.DirectionsRequest = {
          origin: { 
            lat: places[0].coordinates.lat, 
            lng: places[0].coordinates.lng 
          },
          destination: { 
            lat: places[places.length - 1].coordinates.lat, 
            lng: places[places.length - 1].coordinates.lng 
          },
          waypoints,
          travelMode,
          optimizeWaypoints: true,
        };

        const result = await directionsService.route(request);
        directionsRenderer.setDirections(result);

        if (onRouteChange && result.routes[0]) {
          const route = result.routes[0];
          const leg = route.legs[0];
          onRouteChange({
            distance: leg.distance?.text || '',
            duration: leg.duration?.text || '',
            waypoints: route.waypoint_order.map(index => waypoints[index]),
          });
        }
      } catch (err) {
        setError('Failed to calculate route');
      }
    };

    calculateRoute();
  }, [places, travelMode, map, directionsService, directionsRenderer, onRouteChange]);

  // Update markers when only one place is selected
  useEffect(() => {
    if (!map || places.length !== 1 || !places[0].coordinates) {
      return;
    }

    const { lat, lng } = places[0].coordinates;
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      title: places[0].name,
    });

    map.setCenter({ lat, lng });
    map.setZoom(13);

    return () => {
      marker.setMap(null);
    };
  }, [places, map]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        height: '400px', 
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        ref={mapRef}
        sx={{
          height: '100%',
          width: '100%',
        }}
      />
    </Paper>
  );
};

export default TripMap;
