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
  const [tip, setTip] = useState<string>("Use AbortController to cleanly cancel outstanding API requests in React useEffect hooks.");

  // Fetch AI Tip of the Day from Express backend
  useEffect(() => {
    fetch('http://localhost:5000/api/tip')
      .then(res => res.json())
      .then(data => {
        if (data.tip) setTip(data.tip);
      })
      .catch(() => console.log("Backend not running or offline: using static fallback tip."));
  }, []);

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
            Neural link established. Your last session optimized the JWT middleware schemas. All compilers online and ready for commands.
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

        {/* Stats Grid Removed */}

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
            "Utilize the @context hook to bridge local workspace files. This ensures high-fidelity architectural alignment across the codebase."
          </p>
          <div style={{ marginTop: '12px', fontSize: '10px', color: 'var(--color-text-dark)' }}>
            42 Devs synced this hook today
          </div>
        </div>

        {/* Quote of the day */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '3px solid #8B5CF6' }}>
          <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '8px' }}>
            "Code is for humans to read, and only incidentally for machines to execute."
          </p>
          <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: '700' }}>— Harold Abelson</span>
        </div>

        {/* Live Active Stream Timeline */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--color-text-main)' }}>
            <Activity size={16} color="#10B981" />
            <span style={{ fontSize: '13px', fontWeight: '700' }}>Active Streams</span>
          </div>
          
          <div className="timeline">
            <div className="timeline-item">
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)' }}>React Auth Protocol</div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-dark)', marginTop: '2px' }}>Updated 2 hours ago • Firebase Node</div>
            </div>
            <div className="timeline-item">
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-dark)', marginTop: '2px' }}>Trace Fix Applied</div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-dark)', marginTop: '2px' }}>Resolved race condition in state loader • 5h ago</div>
            </div>
            <div className="timeline-item">
              <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-main)' }}>Docker Configuration</div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-dark)', marginTop: '2px' }}>Synthesized multi-stage YAML file • Yesterday</div>
            </div>
          </div>
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
