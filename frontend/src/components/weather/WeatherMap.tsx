import React, { useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';
import { config } from '../../config';

interface Marker {
  lat: number;
  lng: number;
  title?: string;
}

interface WeatherMapProps {
  latitude: number;
  longitude: number;
  markers?: Marker[];
  zoom?: number;
}

declare global {
  interface Window {
    google: any;
  }
}

const WeatherMap: React.FC<WeatherMapProps> = ({
  latitude,
  longitude,
  markers = [],
  zoom = 10
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${config.routeApiKey}&libraries=places,visualization`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        script.onload = initializeMap;
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      const mapOptions: google.maps.MapOptions = {
        center: { lat: latitude, lng: longitude },
        zoom,
        styles: getMapStyles(),
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
      };

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

      // Add weather layer
      const weatherLayer = new window.google.maps.weather.WeatherLayer({
        temperatureUnits: window.google.maps.weather.TemperatureUnit.CELSIUS,
        windSpeedUnits: window.google.maps.weather.WindSpeedUnit.METERS_PER_SECOND
      });
      weatherLayer.setMap(mapInstanceRef.current);

      // Add cloud layer
      const cloudLayer = new window.google.maps.weather.CloudLayer();
      cloudLayer.setMap(mapInstanceRef.current);

      // Add markers
      markers.forEach(marker => {
        const mapMarker = new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: mapInstanceRef.current,
          title: marker.title,
          animation: window.google.maps.Animation.DROP
        });

        if (marker.title) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: marker.title
          });

          mapMarker.addListener('click', () => {
            infoWindow.open(mapInstanceRef.current, mapMarker);
          });
        }

        markersRef.current.push(mapMarker);
      });
    };

    loadGoogleMaps();

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [latitude, longitude, markers, zoom]);

  const getMapStyles = () => {
    const isDark = theme.palette.mode === 'dark';

    return isDark ? [
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }]
      }
    ] : [];
  };

  return (
    <Box
      ref={mapRef}
      sx={{
        width: '100%',
        height: '400px',
        borderRadius: 1,
        overflow: 'hidden'
      }}
    />
  );
};

export default WeatherMap;
