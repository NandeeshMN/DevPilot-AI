import React, { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  Code, 
  Bug, 
  FileText, 
  Database, 
  Cpu, 
  Lightbulb, 
  Activity,
  LucideIcon
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { db } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import api from '../../services/api';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  setPreloadedPrompt: (prompt: string) => void;
}

interface ToolItem {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
}

export default function Dashboard({ setActiveTab, setPreloadedPrompt }: DashboardProps) {
  const { user } = useAuthContext();
  const [tip, setTip] = useState<string>("Use AbortController to cleanly cancel outstanding API requests in React useEffect hooks.");
  
  // Dashboard Metrics & Live Activities
  const [stats, setStats] = useState({
    workspaces: 0,
    conversations: 0,
    requestsToday: 0,
    savedSnippets: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch AI Tip of the Day from Express backend
  useEffect(() => {
    api.get<{ tip: string }>('/tip')
      .then(res => {
        if (res.data.tip) setTip(res.data.tip);
      })
      .catch(() => console.log("Backend offline: using default static tip."));
  }, []);

  // Fetch Dashboard Stats & Stream Log Activities from Firestore
  useEffect(() => {
    if (!user?.email) return;

    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true);
        const email = user.email.toLowerCase();

        // 1. Fetch Conversations from new 'chats' collection and old fallback path
        const uniqueChats = new Map<string, any>();
        let requestsTodayCount = 0;

        try {
          const chatsRef = collection(db, 'chats');
          const qChats = query(chatsRef, where('userId', '==', email));
          const chatsSnap = await getDocs(qChats);

          for (const dDoc of chatsSnap.docs) {
            const data = dDoc.data();
            const chatId = dDoc.id;

            // Fetch subcollection messages to count today's requests
            try {
              const msgsRef = collection(db, 'chats', chatId, 'messages');
              const msgsSnap = await getDocs(msgsRef);
              
              const startOfToday = new Date();
              startOfToday.setHours(0, 0, 0, 0);

              msgsSnap.forEach(mDoc => {
                const mData = mDoc.data();
                if (mData.role === 'user') {
                  const timestamp = mData.timestamp?.toDate ? mData.timestamp.toDate() : null;
                  if (!timestamp || timestamp >= startOfToday) {
                    requestsTodayCount++;
                  }
                }
              });
            } catch (errMsgs) {
              console.warn("Failed fetching messages for dashboard count:", errMsgs);
            }

            uniqueChats.set(chatId, {
              id: chatId,
              title: data.title || "AI Assistant Chat",
              updatedAt: data.updatedAt || data.createdAt || new Date().toISOString(),
              model: data.model || "gemini-3.5-flash"
            });
          }
        } catch (errChats) {
          console.warn("Failed loading from new chats:", errChats);
        }

        try {
          const oldRef = collection(db, 'users', email, 'conversations');
          const oldSnap = await getDocs(oldRef);

          oldSnap.forEach(dDoc => {
            if (!uniqueChats.has(dDoc.id)) {
              const data = dDoc.data();
              const messages = data.messages || [];
              
              const startOfToday = new Date();
              startOfToday.setHours(0, 0, 0, 0);

              messages.forEach((m: any) => {
                if (m.role === 'user') {
                  const timestamp = m.timestamp?.toDate 
                    ? m.timestamp.toDate() 
                    : (m.timestamp ? new Date(m.timestamp) : null);
                  if (!timestamp || timestamp >= startOfToday) {
                    requestsTodayCount++;
                  }
                }
              });

              uniqueChats.set(dDoc.id, {
                id: dDoc.id,
                title: data.title || "AI Assistant Chat",
                updatedAt: data.updatedAt || data.createdAt || new Date().toISOString(),
                model: data.model || "gemini-3.5-flash"
              });
            }
          });
        } catch (errOld) {
          console.warn("Failed loading from old conversations:", errOld);
        }

        const conversationsCount = uniqueChats.size;
        const activitiesList = Array.from(uniqueChats.values());
        
        // Sort activities chronologically by updatedAt desc
        activitiesList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        // 2. Fetch Workspaces count (with collections safety)
        let workspacesCount = 0;
        try {
          const workspacesRef = collection(db, 'users', email, 'workspaces');
          const workspacesSnap = await getDocs(workspacesRef);
          workspacesCount = workspacesSnap.size;
        } catch {
          // Silent catch if workspaces collection is empty/missing
        }

        // 3. Fetch Saved Snippets count
        let snippetsCount = 0;
        try {
          const snippetsRef = collection(db, 'users', email, 'snippets');
          const snippetsSnap = await getDocs(snippetsRef);
          snippetsCount = snippetsSnap.size;
        } catch {
          // Silent catch if snippets collection is empty/missing
        }

        setStats({
          workspaces: workspacesCount,
          conversations: conversationsCount,
          requestsToday: requestsTodayCount,
          savedSnippets: snippetsCount
        });

        setRecentActivities(activitiesList.slice(0, 3));
      } catch (err) {
        console.error("Failed loading dashboard metrics from Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, [user]);

  const tools: ToolItem[] = [
    { id: 'chat', title: 'AI Chat', desc: 'Direct sync with Core Intelligence.', icon: MessageSquare, color: '#06B6D4' },
    { id: 'explain', title: 'Logic Decode', desc: 'Deconstruct complex programming arrays.', icon: Code, color: '#3B82F6' },
    { id: 'debug', title: 'Trace Fix', desc: 'Identify and neutralize compiler errors.', icon: Bug, color: '#EF4444' },
    { id: 'generate', title: 'Synthesis', desc: 'Neural code snippet structure.', icon: Code, color: '#A78BFA' },
    { id: 'readme', title: 'Doc-Gen', desc: 'Professional markdown project logs.', icon: FileText, color: '#10B981' },
    { id: 'sql', title: 'Query Matrix', desc: 'Optimize data retrieval pipelines.', icon: Database, color: '#F59E0B' }
  ];

  const suggestedPrompts: string[] = [
    "Can you write a React custom hook for handling infinite scroll with Intersection Observer?",
    "Explain the time complexity of QuickSort vs MergeSort.",
    "Write an Express middleware to handle JWT authorization.",
    "Analyze this error: TypeError: Cannot read properties of undefined (reading 'map')"
  ];

  const handlePromptClick = (prompt: string) => {
    setPreloadedPrompt(prompt);
    setActiveTab('chat');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '3fr 1.2fr', gap: '24px' }}>
      {/* Left Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Welcome Hero Card */}
        <div className="glass-card" style={{
          padding: '32px',
          background: 'linear-gradient(135deg, rgba(26, 35, 51, 0.6) 0%, rgba(139, 92, 246, 0.08) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'var(--brand-gradient)' }}></div>
          <div style={{ position: 'absolute', top: '10px', right: '15px', color: 'rgba(255, 255, 255, 0.03)', pointerEvents: 'none' }}>
            <Cpu size={120} />
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: 'var(--color-text-main)' }}>
            System Online 👋
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6', maxWidth: '580px', marginBottom: '24px' }}>
            Neural link established. Access artificial intelligence code boards, explain logical complexities, resolve compilation trace errors, and manage software projects.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setActiveTab('chat')} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              Initialize Chat
            </button>
            <button onClick={() => setActiveTab('generate')} className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              Code Synthesis
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: '600' }}>Active Workspaces</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#06B6D4' }}>{stats.workspaces}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: '600' }}>AI Conversations</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#8B5CF6' }}>{stats.conversations}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: '600' }}>AI Requests Today</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#EF4444' }}>{stats.requestsToday}</div>
          </div>
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '6px', fontWeight: '600' }}>Saved Snippets</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#10B981' }}>{stats.savedSnippets}</div>
          </div>
        </div>

        {/* Quick Tools Grid */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text-main)', letterSpacing: '0.5px' }}>Grid Tools</h3>
            <span style={{ fontSize: '11px', color: '#00F2FE', cursor: 'pointer', fontWeight: '600' }}>EXPAND ALL</span>
          </div>
          <div className="dashboard-grid">
            {tools.map((t, idx) => {
              const Icon = t.icon;
              return (
                <div 
                  key={idx} 
                  className="glass-card tool-card" 
                  onClick={() => setActiveTab(t.id)}
                  style={{ padding: '20px' }}
                >
                  <div style={{
                    color: t.color,
                    marginBottom: '16px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <Icon size={16} />
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '6px', color: 'var(--color-text-main)' }}>{t.title}</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggested Prompts */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '14px' }}>Suggested Prompts</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {suggestedPrompts.map((p, idx) => (
              <button 
                key={idx} 
                className="prompt-chip" 
                onClick={() => handlePromptClick(p)}
                style={{ border: '1px solid rgba(255, 255, 255, 0.08)', outline: 'none' }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Node Directive */}
        <div className="glass-card" style={{ padding: '20px', background: 'rgba(26, 35, 51, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#00F2FE' }}>
            <Lightbulb size={16} />
            <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>Node Directive</span>
          </div>
          <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: '1.6', fontStyle: 'italic' }}>
            "Bridge custom workspace files using active AI modules. This ensures high-fidelity architectural alignment across code boards."
          </p>
          <div style={{ marginTop: '12px', fontSize: '10px', color: 'var(--color-text-dark)' }}>
            System ready for integration
          </div>
        </div>

        {/* Quote of the day */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '3px solid #8B5CF6' }}>
          <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '8px' }}>
            "Simplicity is the soul of efficiency."
          </p>
          <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: '700' }}>— Austin Freeman</span>
        </div>

        {/* Live Active Stream Timeline */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--color-text-main)' }}>
            <Activity size={16} color="#10B981" />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Active Streams</span>
          </div>
          
          {loading ? (
            <div style={{ fontSize: '11px', color: 'var(--color-text-dark)', padding: '10px 0', textAlign: 'center' }}>
              Loading activities...
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="timeline">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="timeline-item" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('chat')}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-text-dark)', marginTop: '2px' }}>
                    Updated {new Date(act.updatedAt).toLocaleDateString()} • {act.model}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 10px', color: 'var(--color-text-dark)' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📭</div>
              <div style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--color-text-muted)' }}>No recent activity.</div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-dark)', marginTop: '4px' }}>Start your first AI conversation.</div>
            </div>
          )}
        </div>

        {/* AI Tip of the Day */}
        <div className="glass-card" style={{
          padding: '20px', 
          background: 'linear-gradient(135deg, rgba(79, 140, 255, 0.05) 0%, rgba(26, 35, 51, 0.4) 100%)',
          border: '1px solid rgba(79, 140, 255, 0.15)'
        }}>
          <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#4F8CFF', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
            Tip of the Day
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            {tip}
          </p>
        </div>

      </div>
    </div>
  );
}
