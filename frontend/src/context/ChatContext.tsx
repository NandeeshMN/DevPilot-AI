import React, { createContext, useContext, useState } from 'react';
import { UIChatMessage } from '../types/chat';
import aiService from '../services/aiService';

interface ChatContextType {
  messages: UIChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<UIChatMessage[]>>;
  loading: boolean;
  error: string | null;
  sendMessage: (messageText: string) => Promise<void>;
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

/**
 * Context Provider wrapping active assistant prompt states and histories.
 */
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<UIChatMessage[]>([
    {
      sender: "assistant",
      timestamp: "10:42 AM",
      text: "Certainly! Here's a clean, reusable `useInfiniteScroll` hook. This implementation manages the observer lifecycle and ensures type safety.",
      code: `import { useEffect, useRef } from 'react';

export const useInfiniteScroll = (callback: () => void) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [callback]);

  return { elementRef };
};`
    }
  ]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetChat = () => {
    setMessages([{
      sender: "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: "Hello! How can I assist you with your software development today?"
    }]);
    setConversationId(null);
    setError(null);
    setLoading(false);
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;
    
    setError(null);
    setLoading(true);

    const userMessage: UIChatMessage = {
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: messageText
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Call backend API, passing conversationId if one has already been created
      const response = await aiService.chat(messageText, conversationId || undefined);
      
      // Save the returned conversationId for subsequent messages
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      const assistantMessage: UIChatMessage = {
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.reply
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message || 'Failed to fetch response';
      setError(errMsg);
      
      const errorMessage: UIChatMessage = {
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Error: ${errMsg}. Please verify that your backend server is running and your API key limits are not exceeded.`
      };
      setMessages(prev => [...prev, errorMessage]);
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
