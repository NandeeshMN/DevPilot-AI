import api from './api';
import { ChatResponse } from '../types/chat';
import { 
  ExplainResponse, 
  DebugResponse, 
  GenerateResponse, 
  SqlResponse, 
  ReadmeResponse, 
  TipResponse 
} from '../types/api';

/**
 * Service class directing assistant workflow operations to backend AI/chat endpoints using Axios.
 */
class AIService {
  /**
   * Submits prompt to Gemini conversation thread.
   * @param {string} message - User prompt
   * @param {string} [conversationId] - Optional conversation identifier
   * @returns {Promise<ChatResponse>}
   */
  async chat(message: string, conversationId?: string): Promise<ChatResponse> {
    const response = await api.post<ChatResponse>('/ai/chat', { message, conversationId });
    return response.data;
  }

  async explainCode(code: string, language: string): Promise<ExplainResponse> {
    const response = await api.post<ExplainResponse>('/explain', { code, language });
    return response.data;
  }

  async debugCode(code: string, error: string): Promise<DebugResponse> {
    const response = await api.post<DebugResponse>('/debug', { code, error });
    return response.data;
  }

  async generateCode(prompt: string, language: string, framework: string): Promise<GenerateResponse> {
    const response = await api.post<GenerateResponse>('/generate', { prompt, language, framework });
    return response.data;
  }

  async sqlAssistant(query: string): Promise<SqlResponse> {
    const response = await api.post<SqlResponse>('/sql', { query });
    return response.data;
  }

  async readmeGenerator(name: string, description: string, installation: string, features: string): Promise<ReadmeResponse> {
    const response = await api.post<ReadmeResponse>('/readme', { name, description, installation, features });
    return response.data;
  }

  async getTip(): Promise<TipResponse> {
    const response = await api.get<TipResponse>('/tip');
    return response.data;
  }
}

export const aiService = new AIService();
export default aiService;
