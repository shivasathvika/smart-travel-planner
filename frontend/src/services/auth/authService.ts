import { apiClient } from '../api/apiClient';

export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark';
    temperatureUnit: 'celsius' | 'fahrenheit';
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private user: User | null = null;

  private constructor() {
    // Initialize from localStorage
    this.token = localStorage.getItem(TOKEN_KEY);
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // Set token in API client
    if (this.token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await apiClient.post<{ token: string; user: User }>(
        '/auth/login',
        credentials
      );
      this.setSession(response.data.token, response.data.user);
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      const response = await apiClient.post<{ token: string; user: User }>(
        '/auth/register',
        data
      );
      this.setSession(response.data.token, response.data.user);
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearSession();
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<{ user: User }>('/auth/profile', data);
      this.setUser(response.data.user);
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  }

  async refreshToken(): Promise<void> {
    try {
      const response = await apiClient.post<{ token: string }>('/auth/refresh');
      this.setToken(response.data.token);
    } catch (error) {
      this.clearSession();
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  getUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  private setSession(token: string, user: User): void {
    this.setToken(token);
    this.setUser(user);
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem(TOKEN_KEY, token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  private setUser(user: User): void {
    this.user = user;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private clearSession(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

export default AuthService.getInstance();
