import { useChatContext } from '../context/ChatContext';

/**
 * Access hook exposing chat histories, conversation thread identifiers, and triggers.
 */
export const useChat = () => {
  const { 
    messages, 
    setMessages, 
    loading, 
    error, 
    sendMessage, 
    conversationId, 
    setConversationId,
    resetChat 
  } = useChatContext();
  
  return { 
    messages, 
    setMessages, 
    loading, 
    error, 
    sendMessage, 
    conversationId, 
    setConversationId,
    resetChat 
  };
};
export default useChat;
