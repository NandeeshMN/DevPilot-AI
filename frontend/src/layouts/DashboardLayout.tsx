import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import TopNav from '../components/navbar/TopNav';
import { Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

/**
 * Standard layout wrapper for authenticated workspace views.
 * Binds Sidebar, top navbar header, and active panel components together.
 */
export default function DashboardLayout({ children, activeTab, setActiveTab, onLogout }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="app-container">
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

      {/* Sidebar Drawer Backdrop Overlay */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar Navigation Container */}
      <div className={`sidebar-container ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-close-container">
          <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(false)}>
            <X size={22} color="var(--color-text-main)" />
          </button>
        </div>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsMobileOpen(false);
          }} 
          onLogout={onLogout} 
        />
      </div>

      {/* Main Frame */}
      <div className="main-wrapper">
        {/* Top Header */}
        <TopNav activeTab={activeTab} />

        {/* Workspace Body */}
        <main className="content-body">
          {children}
        </main>
      </div>
    </div>
  );
}
