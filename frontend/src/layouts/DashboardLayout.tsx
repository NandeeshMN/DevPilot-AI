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
  Menu, 
  X,
  LucideIcon
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

/**
 * Standard layout wrapper for authenticated workspace views.
 * Renders navigation options at the top for desktop, and in a sliding drawer for mobile.
 */
export default function DashboardLayout({ children, activeTab, setActiveTab, onLogout }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Chat', icon: MessageSquareCode },
    { id: 'explain', label: 'Explain Code', icon: BookOpen },
    { id: 'debug', label: 'Debug', icon: Bug },
    { id: 'generate', label: 'Generate', icon: Code2 },
    { id: 'readme', label: 'README', icon: FileText },
    { id: 'sql', label: 'SQL Assistant', icon: Database },
    { id: 'settings', label: 'Profile', icon: User },
  ];

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      {/* Desktop Top Navbar Header */}
      <header className="desktop-navbar">
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--brand-gradient)',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Terminal size={17} color="#fff" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--color-text-main)' }}>
            DevPilot AI
          </span>
        </div>

        {/* Navigation Horizontal Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '18px', overflowX: 'auto', flexGrow: 1, margin: '0 36px', scrollbarWidth: 'none' }}>
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
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isActive ? 'rgba(79, 140, 255, 0.1)' : 'transparent',
                  color: isActive ? '#00F2FE' : 'var(--color-text-muted)',
                  fontSize: '14.5px',
                  fontWeight: isActive ? '600' : '400',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  borderBottom: isActive ? '2px solid #00F2FE' : '2px solid transparent',
                  borderRadius: '6px 6px 0 0'
                }}
              >
                <Icon size={16} color={isActive ? '#00F2FE' : 'var(--color-text-muted)'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout Action */}
        <button
          onClick={() => setShowConfirm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            background: 'rgba(239, 68, 68, 0.06)',
            color: '#EF4444',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
        >
          <LogOut size={16} />
          Log Out
        </button>
      </header>

      {/* Mobile Top Header (Only visible on mobile) */}
      <div className="mobile-header">
        <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(true)}>
          <Menu size={22} color="var(--color-text-main)" />
        </button>
        <span style={{ fontSize: '16px', fontWeight: '800', background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          DevPilot AI
        </span>
        <div style={{ width: '22px' }}></div>
      </div>

      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Mobile Drawer Sidebar Navigation */}
      <div className={`sidebar-container ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-close-container">
          <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(false)}>
            <X size={22} color="var(--color-text-main)" />
          </button>
        </div>
        <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'calc(100% - 44px)', padding: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
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

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileOpen(false);
                    }}
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

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
            <button
              onClick={() => {
                setIsMobileOpen(false);
                setShowConfirm(true);
              }}
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
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        </aside>
      </div>

      {/* Main Frame Wrapper */}
      <div className="main-wrapper" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
        <main className="content-body" style={{ flexGrow: 1, overflowY: 'auto' }}>
          {activeTab !== 'chat' && activeTab !== 'dashboard' && activeTab !== 'settings' && (
            <div 
              className="glass"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 20px',
                borderRadius: '10px',
                marginBottom: '24px',
                borderLeft: '4px solid #F59E0B',
                background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.04) 0%, rgba(26, 35, 51, 0.3) 100%)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                animation: 'devpilotFadeInDown 0.3s ease-out',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '120px',
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.06) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />
              
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                borderRadius: '6px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: '#FBBF24',
                fontSize: '14px'
              }}>
                🚧
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#FBBF24', letterSpacing: '0.2px' }}>
                  This feature is currently under development
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                  We are refining this tool to bring you an optimized experience. Thank you for your patience!
                </span>
              </div>

              <style>{`
                @keyframes devpilotFadeInDown {
                  from { opacity: 0; transform: translateY(-10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </div>
          )}
          {children}
        </main>
      </div>


      {/* Confirmation Modal */}
      {showConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(4, 7, 17, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div className="glass-card" style={{
            maxWidth: '380px',
            width: '100%',
            padding: '28px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #090E1A 0%, #0F172A 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'var(--color-text-main)' }}>
              Terminate Session?
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
              Are you sure you want to end your active developer session link?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowConfirm(false)}
                className="btn btn-secondary" 
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button 
                onClick={onLogout}
                className="btn btn-primary" 
                style={{ flex: 1, justifyContent: 'center', background: '#EF4444', borderColor: '#EF4444' }}
              >
                End Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
