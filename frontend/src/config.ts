interface Config {
  apiBaseUrl: string;
  weatherApiKey: string;
  weatherApiBaseUrl: string;
  routeApiKey: string;
  routeApiBaseUrl: string;
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
  };
  cache: {
    defaultTTL: number;
    maxSize: number;
  };
  analytics: {
    enabled: boolean;
    trackingId: string;
  };
}

const development: Config = {
  apiBaseUrl: 'http://localhost:3001/api',
  weatherApiKey: process.env.REACT_APP_WEATHER_API_KEY || '',
  weatherApiBaseUrl: 'https://api.openweathermap.org/data/2.5',
  routeApiKey: process.env.REACT_APP_ROUTE_API_KEY || '',
  routeApiBaseUrl: 'https://maps.googleapis.com/maps/api',
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token'
  },
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 100 // maximum number of items to cache
  },
  analytics: {
    enabled: false,
    trackingId: process.env.REACT_APP_ANALYTICS_ID || ''
  }
};

const production: Config = {
  apiBaseUrl: process.env.REACT_APP_API_URL || 'https://api.smarttravelplanner.com',
  weatherApiKey: process.env.REACT_APP_WEATHER_API_KEY || '',
  weatherApiBaseUrl: 'https://api.openweathermap.org/data/2.5',
  routeApiKey: process.env.REACT_APP_ROUTE_API_KEY || '',
  routeApiBaseUrl: 'https://maps.googleapis.com/maps/api',
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token'
  },
  cache: {
    defaultTTL: 15 * 60 * 1000, // 15 minutes
    maxSize: 200 // maximum number of items to cache
  },
  analytics: {
    enabled: true,
    trackingId: process.env.REACT_APP_ANALYTICS_ID || ''
  }
};

const test: Config = {
  apiBaseUrl: 'http://localhost:3001/api',
  weatherApiKey: 'test_weather_api_key',
  weatherApiBaseUrl: 'http://localhost:3002/weather',
  routeApiKey: 'test_route_api_key',
  routeApiBaseUrl: 'http://localhost:3003/route',
  auth: {
    tokenKey: 'test_auth_token',
    refreshTokenKey: 'test_refresh_token'
  },
  cache: {
    defaultTTL: 1000, // 1 second
    maxSize: 10
  },
  analytics: {
    enabled: false,
    trackingId: 'test_tracking_id'
  }
};

const env = process.env.REACT_APP_ENV || 'development';
const configs = {
  development,
  production,
  test
};

export const config = configs[env as keyof typeof configs];
