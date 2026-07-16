import { request } from './api';
import { ChatResponse } from '../types/chat';

/**
 * Service directing conversation message posts to backend chat endpoints.
 */
class ChatService {
  async sendMessage(message: string): Promise<ChatResponse> {
    return request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }
}

export const chatService = new ChatService();
export default chatService;
