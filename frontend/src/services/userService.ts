import { request } from './api';
import { User } from '../types/user';

/**
 * Service directing profile requests to backend user endpoints.
 */
class UserService {
  async getProfile(): Promise<{ success: boolean; user: User }> {
    return request<{ success: boolean; user: User }>('/users/profile', {
      method: 'GET'
    });
  }
}

export const userService = new UserService();
export default userService;
