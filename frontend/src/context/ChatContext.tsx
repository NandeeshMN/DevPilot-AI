import React, { createContext, useContext, useState } from 'react';
import { UIChatMessage } from '../types/chat';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://devpilot-ai-ob2b.onrender.com/api';

interface ChatContextType {
  messages: UIChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<UIChatMessage[]>>;
  loading: boolean;
  error: string | null;
  sendMessage: (messageText: string, provider?: string) => Promise<void>;
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

/**
 * Context Provider wrapping active assistant prompt states and histories.
 * Uses Server-Sent Events (SSE) streaming for real-time word-by-word responses.
 */
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<UIChatMessage[]>([
    {
      sender: "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: "Hello! How can I help you today?"
    }
  ]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetChat = () => {
    setMessages([{
      sender: "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: "Hello! How can I help you today?"
    }]);
    setConversationId(null);
    setError(null);
    setLoading(false);
  };

  const sendMessage = async (messageText: string, provider?: string) => {
    if (!messageText.trim() || loading) return;

    setError(null);
    setLoading(true);

    // Add user message immediately
    const userMessage: UIChatMessage = {
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: messageText
    };
    setMessages(prev => [...prev, userMessage]);

    // Placeholder assistant message that we'll stream into
    const assistantPlaceholder: UIChatMessage = {
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: ''
    };
    setMessages(prev => [...prev, assistantPlaceholder]);
    const assistantIndex = messages.length + 1; // position after user msg

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: messageText,
          conversationId: conversationId || undefined,
          provider: provider || 'gemini'
        })
      });

      if (!response.ok || !response.body) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE lines
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? ''; // keep incomplete line in buffer

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (!payload) continue;

          try {
            const parsed = JSON.parse(payload);

            if (parsed.chunk) {
              accumulatedText += parsed.chunk;
              // Update the last message (assistant placeholder) in real time
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  text: accumulatedText
                };
                return updated;
              });
            }

            if (parsed.done && parsed.conversationId) {
              setConversationId(parsed.conversationId);
            }

            if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch (parseErr) {
            // Skip malformed SSE lines
          }
        }
      }
    } catch (err: any) {
      const errMsg = err.message || 'Failed to fetch response';
      setError(errMsg);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          text: `Error: ${errMsg}. Please verify that your backend server is running and your API key limits are not exceeded.`
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      setMessages,
      loading,
      error,
      sendMessage,
      conversationId,
      setConversationId,
      resetChat
    }}>
      {children}
    </ChatContext.Provider>
  );
}

/**
 * Hook to access active chat context operations.
 */
export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
export default ChatContext;
