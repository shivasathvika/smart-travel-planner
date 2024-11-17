import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import TripMap from './TripMap';
import RouteDetails from './RouteDetails';
import { PlaceOption } from '../../services/api/placesApi';

interface MapContainerProps {
  places: PlaceOption[];
  travelMode: 'driving' | 'walking' | 'transit' | 'bicycling';
}

interface RouteInfo {
  distance: string;
  duration: string;
  waypoints: google.maps.DirectionsWaypoint[];
}

const MapContainer: React.FC<MapContainerProps> = ({ places, travelMode }) => {
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  const handleRouteChange = (route: RouteInfo) => {
    setRouteInfo(route);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <TripMap
          places={places}
          travelMode={travelMode as google.maps.TravelMode}
          onRouteChange={handleRouteChange}
        />
        {routeInfo && (
          <RouteDetails
            distance={routeInfo.distance}
            duration={routeInfo.duration}
            travelMode={travelMode}
            places={places.map(place => ({
              name: place.name,
              address: place.address,
            }))}
          />
        )}
      </Box>
    </Container>
  );
};

export default MapContainer;
