import api from './api';
import { User } from '../types/user';

/**
 * Service directing profile requests to backend user endpoints using Axios.
 */
class UserService {
  async getProfile(): Promise<{ success: boolean; user: User }> {
    const response = await api.get<{ success: boolean; user: User }>('/users/profile');
    return response.data;
  }

  async updateProfile(fullName: string, bio: string, photoURL: string): Promise<{ success: boolean; user: User }> {
    const response = await api.put<{ success: boolean; user: User }>('/users/profile', { fullName, bio, photoURL });
    return response.data;
  }
}

export const userService = new UserService();
export default userService;
