const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status?: number;
}

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  try {
    const data = await response.json();
    if (!response.ok) {
      return {
        error: data.message || 'An error occurred',
        status: response.status
      };
    }
    return { data, status: response.status };
  } catch (error) {
    return {
      error: 'Failed to parse server response',
      status: response.status
    };
  }
};

const handleApiError = (error: any): ApiResponse<any> => {
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    return {
      error: 'Unable to connect to the server. Please check your internet connection or try again later.',
      status: 0
    };
  }
  return {
    error: error.message || 'An unexpected error occurred',
    status: 500
  };
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Auth API calls
export const authApi = {
  signUp: async (email: string, password: string, name: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          full_name: name
        }),
      });

      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  signIn: async (email: string, password: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  requestPasswordReset: async (email: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getProfile: async (): Promise<ApiResponse<any>> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          error: 'No authentication token found',
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateProfile: async (updates: { name?: string; email?: string }): Promise<ApiResponse<any>> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          error: 'No authentication token found',
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<any>> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          error: 'No authentication token found',
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Trip API calls
export const tripApi = {
  createTrip: async (tripData: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trips`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(tripData),
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getUserTrips: async (page: number = 1, limit: number = 10): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/trips?page=${page}&limit=${limit}`,
        {
          headers: getAuthHeaders(),
        }
      );
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getTripById: async (tripId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  updateTrip: async (tripId: string, tripData: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(tripData),
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  deleteTrip: async (tripId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  shareTrip: async (tripId: string, userEmail: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/share`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userEmail }),
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getTripComments: async (tripId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/comments`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  addTripComment: async (tripId: string, comment: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trips/${tripId}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ comment }),
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Weather API calls
export const weatherApi = {
  getWeather: async (location: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/weather?location=${encodeURIComponent(location)}`,
        {
          headers: getAuthHeaders(),
        }
      );
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getWeatherForecast: async (location: string, days: number = 7): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/weather/forecast?location=${encodeURIComponent(location)}&days=${days}`,
        {
          headers: getAuthHeaders(),
        }
      );
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getHistoricalWeather: async (location: string, date: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/weather/historical?location=${encodeURIComponent(location)}&date=${date}`,
        {
          headers: getAuthHeaders(),
        }
      );
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// ChatGPT API calls
export const chatGptApi = {
  getTravelAdvice: async (prompt: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatgpt/travel-advice`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ prompt }),
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getDestinationSuggestions: async (preferences: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatgpt/destinations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(preferences),
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },

  getItinerarySuggestions: async (tripDetails: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatgpt/itinerary`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(tripDetails),
      });
      return handleResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export const api = {
  auth: authApi,
  trips: tripApi,
  weather: weatherApi,
  chatGpt: chatGptApi,
};
