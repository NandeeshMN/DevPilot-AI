import api from './api';
import { AuthResponse } from '../types/auth';

/**
 * Service class directing authentication requests to backend API routes using Axios.
 */
class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  }

  async register(fullName: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', { fullName, email, password });
    return response.data;
  }

  async forgotPassword(email: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/forgot-password', { email });
    return response.data;
  }

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/verify-otp', { email, otp });
    return response.data;
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/reset-password', { email, otp, newPassword });
    return response.data;
  }
}

export const authService = new AuthService();
export default authService;
