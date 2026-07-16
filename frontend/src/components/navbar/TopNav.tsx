import React, { useState } from 'react';
import { Search, Bell, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface TopNavProps {
  activeTab: string;
}

export default function TopNav({ activeTab }: TopNavProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const pageNames: Record<string, string> = {
    dashboard: "Workspace Dashboard",
    chat: "AI Chat Console",
    explain: "Explain Code",
    debug: "Debug Assistant",
    generate: "Code Generator",
    readme: "README Generator",
    sql: "SQL Assistant",
    dsa: "DSA Helper",
    settings: "Profile Settings"
  };

  return (
    <header className="top-nav">
      {/* Current Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text-main)' }}>
          {pageNames[activeTab] || "DevPilot Workspace"}
        </h2>
        <span style={{
          background: 'rgba(16, 185, 129, 0.1)',
          color: '#10B981',
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: '500'
        }}>
          <CheckCircle2 size={10} /> Online
        </span>
      </div>

      {/* Global Command Search Bar */}
      <div style={{ position: 'relative', width: '380px' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dark)' }}>
          <Search size={14} />
        </span>
        <input
          type="text"
          placeholder="Search workspace, commands, history (Ctrl+K)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            background: '#0D1322',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '8px 12px 8px 36px',
            fontSize: '13px',
            color: 'var(--color-text-main)',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--color-primary-accent)'}
          onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 255, 255, 0.08)'}
        />
      </div>

      {/* Notifications & API Usage */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Core Latency / API Token Usage */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(79, 140, 255, 0.05)',
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px solid rgba(79, 140, 255, 0.1)',
          fontSize: '12px'
        }}>
          <Cpu size={14} color="#4F8CFF" />
          <span style={{ color: 'var(--color-text-muted)' }}>Core latency: </span>
          <span style={{ color: '#4F8CFF', fontWeight: '700' }}>14ms</span>
        </div>

        {/* Notifications Icon */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={18} color="var(--color-text-muted)" />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '6px',
            height: '6px',
            background: '#EF4444',
            borderRadius: '50%'
          }}></span>
        </div>

        {/* Upgrade Quick Link */}
        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '11px', gap: '4px', background: 'var(--brand-gradient)' }}>
          Pro v2.4 <ArrowUpRight size={12} />
        </button>
      </div>
    </header>
  );
}
