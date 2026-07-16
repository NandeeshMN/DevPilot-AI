import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquareCode, 
  BookOpen, 
  Bug, 
  Code2, 
  FileText, 
  Database, 
  GraduationCap, 
  User, 
  LogOut,
  Terminal,
  LucideIcon
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Workspace Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Chat', icon: MessageSquareCode },
    { id: 'explain', label: 'Explain Code', icon: BookOpen },
    { id: 'debug', label: 'Debug Assistant', icon: Bug },
    { id: 'generate', label: 'Generate Code', icon: Code2 },
    { id: 'readme', label: 'README Generator', icon: FileText },
    { id: 'sql', label: 'SQL Assistant', icon: Database },
    { id: 'dsa', label: 'DSA Helper', icon: GraduationCap },
    { id: 'settings', label: 'Profile', icon: User },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Logo */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{
            background: 'var(--brand-gradient)',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Terminal size={15} color="#fff" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-main)' }}>
            DevPilot AI
          </span>
        </div>
        <div style={{ 
          fontSize: '10px', 
          fontWeight: '700', 
          letterSpacing: '1.5px', 
          color: '#00F2FE', 
          marginBottom: '28px',
          textTransform: 'uppercase',
          paddingLeft: '38px'
        }}>
          Cyber-Core OS
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'rgba(79, 140, 255, 0.1)' : 'transparent',
                  color: isActive ? '#00F2FE' : 'var(--color-text-muted)',
                  fontSize: '13.5px',
                  fontWeight: isActive ? '600' : '400',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '3px solid #00F2FE' : '3px solid transparent',
                  paddingLeft: isActive ? '11px' : '14px'
                }}
              >
                <Icon size={16} color={isActive ? '#00F2FE' : 'var(--color-text-muted)'} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout Button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
        <button 
          onClick={() => setShowConfirm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: 'none',
            background: 'rgba(239, 68, 68, 0.04)',
            color: '#EF4444',
            fontSize: '13.5px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.04)'}
        >
          <LogOut size={16} />
          Log Out
        </button>

        {/* Confirmation Modal Overlay */}
        {showConfirm && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(4, 7, 17, 0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div className="glass-card" style={{
              padding: '24px 32px',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <LogOut size={22} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--color-text-main)' }}>
                Confirm Logout
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
                Are you sure you want to log out of your secure DevPilot workspace session?
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setShowConfirm(false)} 
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    background: 'rgba(255,255,255,0.02)',
                    color: 'var(--color-text-main)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: '0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowConfirm(false);
                    onLogout();
                  }} 
                  style={{ 
                    flex: 1, 
                    padding: '10px', 
                    borderRadius: '8px',
                    fontSize: '13px', 
                    background: '#EF4444', 
                    color: '#fff',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                    transition: '0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.filter = 'none'}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
