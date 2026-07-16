import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Standard Layout wrapper for authorization pages (Login, Register, Forgot Password).
 * Holds standard dark background and floating blue/purple neon highlights.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0B1120',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px'
    }}>
      {/* Background Glows */}
      <div className="glow-bg glow-blue"></div>
      <div className="glow-bg glow-purple"></div>
      
      {children}
    </div>
  );
}
