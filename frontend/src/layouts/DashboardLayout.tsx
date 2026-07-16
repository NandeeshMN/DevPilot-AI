import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import TopNav from '../components/navbar/TopNav';

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
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />

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
