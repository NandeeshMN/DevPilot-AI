import React, { useState, useEffect, useRef } from 'react';
import { 
  Paperclip, 
  Mic, 
  Send, 
  Plus, 
  Pin, 
  MessageSquare, 
  Copy, 
  Check, 
  Bot 
} from 'lucide-react';
import useChat from '../../hooks/useChat';
import { useAuthContext } from '../../context/AuthContext';
import { db } from '../../firebase/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

interface AIChatProps {
  preloadedPrompt: string;
  clearPreloadedPrompt: () => void;
}

export default function AIChat({ preloadedPrompt, clearPreloadedPrompt }: AIChatProps) {
  const { user } = useAuthContext();
  const { 
    messages, 
    loading, 
    sendMessage, 
    resetChat, 
    conversationId, 
    setConversationId, 
    setMessages 
  } = useChat();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loadingConvs, setLoadingConvs] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [engine, setEngine] = useState<string>("DevPilot Ultra");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Fetch user conversations on load and update on message changes
  useEffect(() => {
    if (!user?.email) return;
    const email = user.email.toLowerCase();

    const fetchConversationsList = async () => {
      try {
        setLoadingConvs(true);
        const convsRef = collection(db, 'users', email, 'conversations');
        const q = query(convsRef, orderBy('updatedAt', 'desc'));
        const snap = await getDocs(q);
        const list: any[] = [];
        snap.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setConversations(list);
      } catch (err) {
        console.error("Error fetching conversations list:", err);
      } finally {
        setLoadingConvs(false);
      }
    };

    fetchConversationsList();
  }, [user, messages, conversationId]);

  // Load a historical conversation chat thread
  const handleSelectConversation = async (convId: string) => {
    if (!user?.email || loading) return;
    try {
      const email = user.email.toLowerCase();
      const docRef = doc(db, 'users', email, 'conversations', convId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const firestoreMessages = data.messages || [];
        
        // Map Firestore messages to UIChatMessage format
        const mapped = firestoreMessages.map((m: any) => ({
          sender: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
          text: m.content,
          timestamp: m.timestamp?.toDate ? m.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        
        setMessages(mapped);
        setConversationId(convId);
      }
    } catch (err) {
      console.error("Error loading conversation:", err);
    }
  };

  // Handle preloaded prompt from Dashboard
  useEffect(() => {
    if (preloadedPrompt) {
      setInputText(preloadedPrompt);
      clearPreloadedPrompt();
      // Auto trigger send after a small delay
      const t = setTimeout(() => {
        handleSendMessage(preloadedPrompt);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [preloadedPrompt]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : inputText;
    if (!textToSend.trim() || loading) return;

    setInputText("");
    await sendMessage(textToSend);
  };

  const handleCopyCode = (codeText: string, idx: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePromptClick = (prompt: string) => {
    setInputText(prompt);
    handleSendMessage(prompt);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', height: 'calc(100vh - 120px)' }}>
      
      {/* Left Chat Sidebar (Pinned & Pinned List) */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', height: '100%', overflowY: 'auto' }}>
        <button 
          onClick={resetChat}
          className="btn btn-primary" 
          style={{ width: '100%', gap: '8px', fontSize: '13px' }}
        >
          <Plus size={16} /> New Chat
        </button>

        <div>
          <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-dark)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Pin size={10} /> Pinned Chats
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-dark)', padding: '6px 0', textAlign: 'center' }}>
              No pinned chats.
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-dark)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
            Recent Chats
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {loadingConvs ? (
              <div style={{ fontSize: '11px', color: 'var(--color-text-dark)', padding: '10px 0', textAlign: 'center' }}>
                Syncing threads...
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => handleSelectConversation(c.id)}
                  className="glass" 
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    fontSize: '12px', 
                    cursor: 'pointer', 
                    color: conversationId === c.id ? '#00F2FE' : 'var(--color-text-muted)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    borderLeft: conversationId === c.id ? '2px solid #00F2FE' : 'none'
                  }}
                >
                  <MessageSquare size={12} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.title || "AI Assistant Chat"}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '11px', color: 'var(--color-text-dark)', padding: '10px 0', textAlign: 'center' }}>
                No conversations yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* Messages Stream */}
        <div style={{ flexGrow: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                gap: '12px',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
              }}
            >
              {/* Avatar Icon */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: msg.sender === 'user' ? '#8B5CF6' : 'var(--button-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {msg.sender === 'user' ? (
                  user?.photoURL ? (
                    <img src={user.photoURL} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#fff' }}>
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )
                ) : (
                  <Bot size={16} color="#fff" />
                )}
              </div>

              {/* Message Content Bubble */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-main)' }}>
                    {msg.sender === 'user' ? (user?.fullName || 'User') : 'DevPilot Core'}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-dark)' }}>{msg.timestamp}</span>
                </div>

                <div className="glass" style={{
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '13.5px',
                  lineHeight: '1.6',
                  color: 'var(--color-text-main)',
                  border: msg.sender === 'user' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: msg.sender === 'user' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(255, 255, 255, 0.01)'
                }}>
                  <div>{msg.text}</div>

                  {/* Render Code Block if available */}
                  {msg.code && (
                    <div style={{ marginTop: '16px' }}>
                      <div className="monaco-editor-mock">
                        <div className="monaco-header">
                          <div className="monaco-dots">
                            <span className="monaco-dot red"></span>
                            <span className="monaco-dot yellow"></span>
                            <span className="monaco-dot green"></span>
                          </div>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>source_code</span>
                          <button 
                            onClick={() => handleCopyCode(msg.code!, idx)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: copiedId === idx ? '#10B981' : 'var(--color-text-muted)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px'
                            }}
                          >
                            {copiedId === idx ? <Check size={12} /> : <span style={{ display: 'inline-flex', alignItems: 'center' }}><Copy size={12} /></span>}
                            {copiedId === idx ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <div className="monaco-body" style={{ padding: '12px' }}>
                          <pre style={{
                            margin: 0,
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12.5px',
                            color: '#E5E7EB',
                            overflowX: 'auto',
                            width: '100%'
                          }}>
                            {msg.code}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Follow up suggestions */}
                {msg.suggestedFollowUp && msg.suggestedFollowUp.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                    {msg.suggestedFollowUp.map((fu, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => handlePromptClick(fu)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          padding: '6px 12px',
                          borderRadius: '16px',
                          fontSize: '11px',
                          color: '#4F8CFF',
                          cursor: 'pointer',
                          outline: 'none',
                          transition: '0.2s'
                        }}
                        onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(79, 140, 255, 0.1)'}
                        onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.02)'}
                      >
                        {fu}
                      </button>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--button-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={16} color="#fff" />
              </div>
              <div className="glass" style={{ padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', background: '#4F8CFF', borderRadius: '50%', animation: 'pulse 1s infinite alternate' }}></div>
                <div style={{ width: '6px', height: '6px', background: '#8B5CF6', borderRadius: '50%', animation: 'pulse 1s infinite alternate 0.2s' }}></div>
                <div style={{ width: '6px', height: '6px', background: '#EC4899', borderRadius: '50%', animation: 'pulse 1s infinite alternate 0.4s' }}></div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>DevPilot is writing code...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Controls Bar */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: '#0D1322' }}>
          
          <div style={{
            background: '#080D1A',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <textarea
              placeholder="Ask anything about programming (e.g. 'Can you explain React portals?')..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--color-text-main)',
                fontSize: '13.5px',
                fontFamily: 'var(--font-sans)',
                resize: 'none',
                minHeight: '60px'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }} title="Attach Files">
                  <Paperclip size={16} />
                </button>
                <button style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }} title="Voice Input">
                  <Mic size={16} />
                </button>
                
                {/* Engine Select Dropdown */}
                <select
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  style={{
                    background: '#0D1322',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    color: 'var(--color-text-muted)',
                    fontSize: '11px',
                    padding: '4px 8px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option>GPT-4 Turbo</option>
                  <option>Claude 3.5 Sonnet</option>
                  <option>DevPilot Ultra</option>
                </select>
              </div>

              <button 
                onClick={() => handleSendMessage()}
                className="btn btn-primary" 
                style={{ padding: '6px 16px', fontSize: '12px', borderRadius: '6px' }}
              >
                <Send size={12} /> Send
              </button>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--color-text-dark)', marginTop: '8px' }}>
            DevPilot AI may produce inaccurate information about people, places, or facts. Cyber-Core v2.4.0
          </div>
        </div>

      </div>
    </div>
  );
}
