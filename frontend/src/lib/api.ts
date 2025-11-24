// lib/api.ts
import { CreateAppointmentDto, UpdateAppointmentDto } from '@/types/appointment';
import type { LoginDto, RegisterDto, AuthResponse, LoggedUser } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  constructor(private baseUrl: string) {}

  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify(data),
      });

      console.log('Register response status:', response.status);

      if (!response.ok) {
        let errorMessage = `Registration failed: ${response.status} ${response.statusText}`;
        
        try {
          const errorText = await response.text();
          console.log('Raw error response:', errorText);
          
          if (errorText) {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          }
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
        }
        
        throw new Error(errorMessage);
      }

      const result: AuthResponse = await response.json();
      
      if (result.access_token) {
        this.setToken(result.access_token);
      } else if (result.token) {
        this.setToken(result.token);
      }
      
      return result;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify(data),
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result: AuthResponse = await response.json();
      
      // Support both 'access_token' and 'token' fields
      if (result.access_token) {
        this.setToken(result.access_token);
        console.log('✅ Access token stored');
      } else if (result.token) {
        this.setToken(result.token);
        console.log('✅ Token stored');
      } else {
        console.warn('⚠️ No token found in login response');
      }
      
      return result;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<LoggedUser> {
    try {
      const token = this.getToken();
      console.log('🔑 Token for current user request:', token ? 'Present' : 'Missing');

      const response = await fetch(`${this.baseUrl}/auth/curr`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      console.log('Current user response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.log('🔐 Unauthorized - removing token');
          this.removeToken();
        }
        throw new Error(`Failed to get current user: ${response.status}`);
      }

      const userData = await response.json();
      console.log('✅ Current user data:', userData);
      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  logout(): void {
    console.log('🚪 Logging out - removing token');
    this.removeToken();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const isAuth = !!token;
    console.log('🔐 Authentication check:', isAuth ? 'Authenticated' : 'Not authenticated');
    return isAuth;
  }

  // Méthodes pour les rendez-vous
  async getAppointments(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/appointments`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(`Failed to get appointments: ${response.status}`);
    }

    return await response.json();
  }

  async getPatientAppointments(patientId: string): Promise<any> {
    console.log('🔍 Fetching appointments for patient:', patientId);
    console.log('🔑 Token:', this.getToken() ? 'Present' : 'Missing');

    const response = await fetch(`${this.baseUrl}/appointments/patient/${patientId}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    console.log('Appointments response status:', response.status);

    if (!response.ok) {
      if (response.status === 401) {
        console.log('🔐 Unauthorized - redirecting to login');
        this.logout();
        window.location.href = '/login';
      }
      throw new Error(`Failed to get patient appointments: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Appointments data received:', data);
    return data;
  }

  async createAppointment(data: CreateAppointmentDto): Promise<any> {
    const response = await fetch(`${this.baseUrl}/appointments`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create appointment: ${response.status}`);
    }

    return await response.json();
  }

  async updateAppointment(id: string, data: UpdateAppointmentDto): Promise<any> {
    const response = await fetch(`${this.baseUrl}/appointments/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update appointment: ${response.status}`);
    }

    return await response.json();
  }

  async cancelAppointment(id: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/appointments/${id}/cancel`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel appointment: ${response.status}`);
    }

    return await response.json();
  }

  async deleteAppointment(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/appointments/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete appointment: ${response.status}`);
    }
  }

  // Méthode générique pour les appels API
  async apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      ...this.getHeaders(true),
      ...options.headers,
    };

    console.log('🌐 API Call:', options.method || 'GET', url);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      if (response.status === 401) {
        console.log('🔐 Unauthorized - logging out');
        this.logout();
        window.location.href = '/login';
      }
      
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Ignore JSON parsing errors
      }
      
      throw new Error(errorMessage);
    }

    // Pour les réponses DELETE qui n'ont pas de contenu
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null;
    }

    return await response.json();
  }
}

export const apiClient = new ApiClient(API_URL);
export default apiClient;