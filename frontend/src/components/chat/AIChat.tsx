import React, { useState, useEffect, useRef } from 'react';
import { 
  Paperclip, 
  Mic, 
  Send, 
  Plus, 
  Pin,
  PinOff,
  MessageSquare, 
  Copy, 
  Check, 
  Bot,
  Trash,
  MoreHorizontal
} from 'lucide-react';
import useChat from '../../hooks/useChat';
import { useAuthContext } from '../../context/AuthContext';
import aiService from '../../services/aiService';

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
  const [provider, setProvider] = useState<string>("gemini");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showMobileHistory, setShowMobileHistory] = useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);
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

    const fetchConversationsList = async () => {
      try {
        setLoadingConvs(true);
        const res = await aiService.getConversations();
        if (res && res.conversations) {
          setConversations(res.conversations);
        }
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
      const res = await aiService.getConversationMessages(convId);
      if (res && res.messages) {
        const mapped = res.messages.map((m: any) => ({
          sender: m.role === 'assistant' ? 'assistant' : 'user',
          text: m.content,
          timestamp: m.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setMessages(mapped);
        setConversationId(convId);
      }
    } catch (err) {
      console.error("Error loading conversation:", err);
    }
  };

  // Delete a historical conversation chat thread
  const handleDeleteConversation = (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setConfirmTarget(convId);
  };

  const doDeleteConversation = async () => {
    if (!confirmTarget) return;
    const convId = confirmTarget;
    setConfirmTarget(null);
    try {
      await aiService.deleteConversation(convId);
      setConversations(prev => prev.filter(c => c.id !== convId));
      if (conversationId === convId) {
        resetChat();
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  const handlePinConversation = async (e: React.MouseEvent, convId: string) => {
    e.stopPropagation();
    setOpenMenuId(null);

    // Optimistic update — move immediately in the UI
    const prevConversations = conversations;
    const target = conversations.find(c => c.id === convId);
    if (!target) return;
    const newPinned = !target.isPinned;
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, isPinned: newPinned } : c
    ));

    try {
      await aiService.togglePinConversation(convId);
    } catch (err) {
      // Revert on failure
      setConversations(prevConversations);
      console.error("Error pinning conversation:", err);
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
    await sendMessage(textToSend, provider);
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
    <div className="animate-fade-in chat-layout-grid">
      
      {/* Left Chat Sidebar (Pinned & Pinned List) */}
      <div className="glass-card chat-history-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', height: '100%', overflowY: 'auto' }}>
        <button 
          onClick={resetChat}
          className="btn btn-primary" 
          style={{ width: '100%', gap: '8px', fontSize: '13px' }}
        >
          <Plus size={16} /> New Chat
        </button>

        {/* Pinned Chats */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-dark)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Pin size={10} /> Pinned Chats
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {conversations.filter(c => c.isPinned).length === 0 ? (
              <div style={{ fontSize: '11px', color: 'var(--color-text-dark)', padding: '6px 0', textAlign: 'center' }}>
                No pinned chats.
              </div>
            ) : conversations.filter(c => c.isPinned).map((c) => (
              <ConversationItem
                key={c.id}
                c={c}
                conversationId={conversationId}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                handleSelectConversation={handleSelectConversation}
                handlePinConversation={handlePinConversation}
                handleDeleteConversation={handleDeleteConversation}
              />
            ))}
          </div>
        </div>

        {/* Recent Chats */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-dark)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
            Recent Chats
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {loadingConvs ? (
              <div style={{ fontSize: '11px', color: 'var(--color-text-dark)', padding: '10px 0', textAlign: 'center' }}>
                Syncing threads...
              </div>
            ) : conversations.filter(c => !c.isPinned).length > 0 ? (
              conversations.filter(c => !c.isPinned).map((c) => (
                <ConversationItem
                  key={c.id}
                  c={c}
                  conversationId={conversationId}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                  handleSelectConversation={handleSelectConversation}
                  handlePinConversation={handlePinConversation}
                  handleDeleteConversation={handleDeleteConversation}
                />
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
        
        {/* Chat Area Header (Useful for mobile actions) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#0D1322',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00F2FE', boxShadow: '0 0 8px #00F2FE' }}></div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)' }}>
              Core Intelligence Link
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="mobile-history-toggle"
              onClick={() => setShowMobileHistory(!showMobileHistory)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--color-text-main)',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11.5px',
                cursor: 'pointer'
              }}
            >
              History
            </button>
            <button
              onClick={resetChat}
              className="btn btn-primary"
              style={{ padding: '6px 12px', fontSize: '11.5px', borderRadius: '6px', boxShadow: 'none' }}
            >
              New Chat
            </button>
          </div>
        </div>

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
                  {/* If this is the last assistant message and it's empty, show typing dots */}
                  {msg.sender === 'assistant' && !msg.text && idx === messages.length - 1 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '2px 0' }}>
                      <div style={{ width: '7px', height: '7px', background: '#4F8CFF', borderRadius: '50%', animation: 'dotBounce 1.2s ease-in-out infinite', animationDelay: '0s' }} />
                      <div style={{ width: '7px', height: '7px', background: '#8B5CF6', borderRadius: '50%', animation: 'dotBounce 1.2s ease-in-out infinite', animationDelay: '0.2s' }} />
                      <div style={{ width: '7px', height: '7px', background: '#EC4899', borderRadius: '50%', animation: 'dotBounce 1.2s ease-in-out infinite', animationDelay: '0.4s' }} />
                      <style>{`
                        @keyframes dotBounce {
                          0%, 80%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
                          40%           { transform: translateY(-7px) scale(1.2); opacity: 1; }
                        }
                      `}</style>
                    </div>
                  ) : (
                    <div>{renderMarkdown(msg.text)}</div>
                  )}

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
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
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
                  <option value="gemini">Gemini Flash</option>
                  <option value="groq">Groq Llama</option>
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
            DevPilot AI may produce inaccurate information about people, places, or facts.
          </div>
        </div>
      </div>

      {/* Mobile History Drawer overlay */}
      {showMobileHistory && (
        <div 
          className="mobile-history-drawer-overlay" 
          onClick={() => setShowMobileHistory(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(4, 7, 17, 0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{
              width: '280px',
              height: '100%',
              background: '#080D1A',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-text-main)' }}>Chat History</span>
              <button 
                onClick={() => setShowMobileHistory(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>
            
            {/* Reuse the chat list content */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-dark)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Pin size={10} /> Pinned Chats
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                {conversations.filter(c => c.isPinned).length === 0 ? (
                  <div style={{ fontSize: '11px', color: 'var(--color-text-dark)', padding: '6px 0', textAlign: 'center' }}>
                    No pinned chats.
                  </div>
                ) : conversations.filter(c => c.isPinned).map((c) => (
                  <ConversationItem
                    key={c.id}
                    c={c}
                    conversationId={conversationId}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    handleSelectConversation={(id) => { handleSelectConversation(id); setShowMobileHistory(false); }}
                    handlePinConversation={handlePinConversation}
                    handleDeleteConversation={handleDeleteConversation}
                  />
                ))}
              </div>

              <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-text-dark)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                Recent Chats
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {loadingConvs ? (
                  <div style={{ fontSize: '11px', color: 'var(--color-text-dark)', padding: '10px 0', textAlign: 'center' }}>
                    Syncing threads...
                  </div>
                ) : conversations.filter(c => !c.isPinned).length > 0 ? (
                  conversations.filter(c => !c.isPinned).map((c) => (
                    <ConversationItem
                      key={c.id}
                      c={c}
                      conversationId={conversationId}
                      openMenuId={openMenuId}
                      setOpenMenuId={setOpenMenuId}
                      handleSelectConversation={(id) => { handleSelectConversation(id); setShowMobileHistory(false); }}
                      handlePinConversation={handlePinConversation}
                      handleDeleteConversation={handleDeleteConversation}
                    />
                  ))
                ) : (
                  <div style={{ fontSize: '11px', color: 'var(--color-text-dark)', padding: '10px 0', textAlign: 'center' }}>
                    No conversations yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom delete confirmation dialog */}
      <ConfirmDialog
        open={!!confirmTarget}
        onConfirm={doDeleteConversation}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}

/**
 * Custom in-app confirmation dialog replacing browser window.confirm().
 */
function ConfirmDialog({ open, onConfirm, onCancel }: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.15s ease'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #141B2D 0%, #1a2440 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '32px 28px 24px',
          width: '100%',
          maxWidth: '360px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,68,68,0.15)',
          animation: 'slideUp 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        {/* Icon */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Trash size={22} color="#F87171" />
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '17px', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '6px' }}>
            Delete Chat Thread?
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
            This action cannot be undone. The conversation and all its messages will be permanently removed.
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '4px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--color-text-muted)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--color-text-main)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 14px rgba(239,68,68,0.35)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(239,68,68,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(239,68,68,0.35)'; }}
          >
            Delete
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/**
 * Reusable conversation list item with a "..." context menu for Pin and Delete actions.
 */
function ConversationItem({ c, conversationId, openMenuId, setOpenMenuId, handleSelectConversation, handlePinConversation, handleDeleteConversation }: {
  c: any;
  conversationId: string | null;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  handleSelectConversation: (id: string) => void;
  handlePinConversation: (e: React.MouseEvent, id: string) => void;
  handleDeleteConversation: (e: React.MouseEvent, id: string) => void;
}) {
  const isOpen = openMenuId === c.id;

  return (
    <div
      style={{ position: 'relative' }}
      onClick={() => handleSelectConversation(c.id)}
    >
      <div
        className="glass"
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          cursor: 'pointer',
          color: conversationId === c.id ? '#00F2FE' : 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          borderLeft: conversationId === c.id ? '2px solid #00F2FE' : 'none',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flexGrow: 1 }}>
          {c.isPinned ? <Pin size={11} style={{ flexShrink: 0, color: '#00F2FE' }} /> : <MessageSquare size={12} style={{ flexShrink: 0 }} />}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {c.title || "AI Assistant Chat"}
          </span>
        </div>

        {/* ... menu trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenuId(isOpen ? null : c.id);
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            flexShrink: 0,
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-main)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            marginTop: '4px',
            background: '#141B2D',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            zIndex: 9999,
            minWidth: '140px',
            overflow: 'hidden'
          }}
        >
          <button
            onClick={(e) => handlePinConversation(e, c.id)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-main)',
              padding: '9px 14px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,242,254,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {c.isPinned ? <PinOff size={13} /> : <Pin size={13} />}
            {c.isPinned ? 'Unpin Chat' : 'Pin Chat'}
          </button>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 10px' }} />

          <button
            onClick={(e) => handleDeleteConversation(e, c.id)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#F87171',
              padding: '9px 14px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Trash size={13} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Renders a fenced code block with language badge and copy button.
 */
function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ borderRadius: '10px', overflow: 'hidden', margin: '10px 0', border: '1px solid rgba(255,255,255,0.1)' }}>
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#0D1322', padding: '7px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57', display: 'inline-block' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E', display: 'inline-block' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28CA41', display: 'inline-block' }} />
          <span style={{ marginLeft: '6px', fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'lowercase' }}>
            {lang}
          </span>
        </div>
        <button
          onClick={copy}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: copied ? '#10B981' : 'var(--color-text-muted)',
            fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px',
            transition: 'color 0.2s ease'
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {/* Code body */}
      <div style={{ background: '#080D1A', padding: '14px 16px', overflowX: 'auto' }}>
        <pre style={{
          margin: 0, fontFamily: 'var(--font-mono)', fontSize: '12.5px',
          color: '#E5E7EB', lineHeight: '1.7', whiteSpace: 'pre'
        }}>
          {code}
        </pre>
      </div>
    </div>
  );
}

/**
 * Custom lightweight helper parsing raw AI text to justified paragraphs, bullet points and bold lines.
 */
const renderMarkdown = (text: string) => {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let copiedBlockIdx: number | null = null;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // ── Fenced code block ────────────────────────────────────────────────────
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim() || 'code';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const code = codeLines.join('\n');
      const blockIdx = elements.length;

      elements.push(
        <CodeBlock key={blockIdx} lang={lang} code={code} />
      );
      continue;
    }

    // ── Empty line ────────────────────────────────────────────────────────────
    if (!trimmed) {
      elements.push(<div key={i} style={{ height: '6px' }} />);
      i++; continue;
    }

    // ── Horizontal rule ───────────────────────────────────────────────────────
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      elements.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '12px 0' }} />);
      i++; continue;
    }

    // ── Headers ───────────────────────────────────────────────────────────────
    if (trimmed.startsWith('### ')) {
      elements.push(<h4 key={i} style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-text-main)', marginTop: '12px', marginBottom: '6px' }}>{parseInlineMarkdown(trimmed.slice(4))}</h4>);
      i++; continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(<h3 key={i} style={{ fontSize: '17px', fontWeight: '800', color: 'var(--color-text-main)', marginTop: '16px', marginBottom: '8px' }}>{parseInlineMarkdown(trimmed.slice(3))}</h3>);
      i++; continue;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(<h2 key={i} style={{ fontSize: '19px', fontWeight: '800', color: 'var(--color-text-main)', marginTop: '20px', marginBottom: '10px' }}>{parseInlineMarkdown(trimmed.slice(2))}</h2>);
      i++; continue;
    }

    // ── Blockquote ────────────────────────────────────────────────────────────
    if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={i} style={{ borderLeft: '3px solid #8B5CF6', paddingLeft: '12px', marginLeft: 0, color: 'var(--color-text-muted)', fontStyle: 'italic', margin: '8px 0' }}>
          {parseInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
      i++; continue;
    }

    // ── Task list items ───────────────────────────────────────────────────────
    if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('* [ ] ')) {
      elements.push(
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0', paddingLeft: '8px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1.5px solid var(--color-text-dark)', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{parseInlineMarkdown(trimmed.slice(6))}</span>
        </div>
      );
      i++; continue;
    }
    if (/^[-*] \[[x~]\] /.test(trimmed)) {
      const isProgress = trimmed.includes('[~]');
      elements.push(
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0', paddingLeft: '8px' }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '3px', border: `1.5px solid ${isProgress ? '#4F8CFF' : '#10B981'}`, background: isProgress ? 'rgba(79,140,255,0.2)' : 'rgba(16,185,129,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', color: isProgress ? '#4F8CFF' : '#10B981', flexShrink: 0 }}>
            {isProgress ? '~' : '✓'}
          </span>
          <span style={{ color: isProgress ? 'var(--color-text-muted)' : 'var(--color-text-dark)', textDecoration: isProgress ? 'none' : 'line-through', fontSize: '13px' }}>
            {parseInlineMarkdown(trimmed.slice(6))}
          </span>
        </div>
      );
      i++; continue;
    }

    // ── Unordered list ────────────────────────────────────────────────────────
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={i} style={{ display: 'flex', gap: '8px', margin: '3px 0', paddingLeft: '8px' }}>
          <span style={{ color: '#4F8CFF', flexShrink: 0, marginTop: '1px' }}>•</span>
          <span style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{parseInlineMarkdown(trimmed.slice(2))}</span>
        </div>
      );
      i++; continue;
    }

    // ── Ordered list ──────────────────────────────────────────────────────────
    const olMatch = trimmed.match(/^(\d+)\.\s(.*)/);
    if (olMatch) {
      elements.push(
        <div key={i} style={{ display: 'flex', gap: '8px', margin: '3px 0', paddingLeft: '8px' }}>
          <span style={{ color: '#4F8CFF', flexShrink: 0, minWidth: '18px' }}>{olMatch[1]}.</span>
          <span style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{parseInlineMarkdown(olMatch[2])}</span>
        </div>
      );
      i++; continue;
    }

    // ── Default paragraph ─────────────────────────────────────────────────────
    elements.push(
      <p key={i} style={{ margin: '5px 0', color: 'var(--color-text-muted)', lineHeight: '1.65', textAlign: 'justify' }}>
        {parseInlineMarkdown(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
};


/**
 * Custom inline parsing utility supporting bold strings, italic segments, and inline monospace code blocks.
 */
const parseInlineMarkdown = (text: string) => {
  // Regex to split by bold (**), italics (*), or inline code (`)
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);

  return parts.map((part, idx) => {
    // Bold
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} style={{ color: 'var(--color-text-main)', fontWeight: '700' }}>
          {part.substring(2, part.length - 2)}
        </strong>
      );
    }
    // Italic
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={idx} style={{ color: 'var(--color-text-main)', fontStyle: 'italic' }}>
          {part.substring(1, part.length - 1)}
        </em>
      );
    }
    // Inline code
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} style={{ 
          background: 'rgba(255, 255, 255, 0.06)', 
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2px 6px', 
          borderRadius: '4px', 
          fontSize: '12px', 
          fontFamily: 'var(--font-mono)',
          color: '#E5E7EB'
        }}>
          {part.substring(1, part.length - 1)}
        </code>
      );
    }
    // Regular text
    return part;
  });
};
