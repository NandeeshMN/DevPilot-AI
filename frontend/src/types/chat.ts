export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

// API ChatResponse
export interface ChatResponse {
  success: boolean;
  conversationId: string;
  reply: string;
  createdAt: string;
  model: string;
}

// UI representation of message logs in panels
export interface UIChatMessage {
  sender: 'assistant' | 'user';
  timestamp: string;
  text: string;
  code?: string;
  suggestedFollowUp?: string[];
}
