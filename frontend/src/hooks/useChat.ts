import { useChatContext } from '../context/ChatContext';

/**
 * Access hook exposing chat histories and triggers.
 */
export const useChat = () => {
  const { messages, setMessages, loading, error, sendMessage } = useChatContext();
  return { messages, setMessages, loading, error, sendMessage };
};
export default useChat;
