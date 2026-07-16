import React, { useState } from 'react';

// Import Pages
import LandingPage from '../pages/Landing/LandingPage';
import Dashboard from '../components/dashboard/Dashboard';
import AIChat from '../components/chat/AIChat';
import CodeExplainer from '../components/code/CodeExplainer';
import Debugger from '../components/code/Debugger';
import CodeGenerator from '../components/code/CodeGenerator';
import ReadmeGenerator from '../components/code/ReadmeGenerator';
import SQLAssistant from '../components/code/SQLAssistant';
import Profile from '../pages/Profile/Profile';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';

// Layouts & Guard Context
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import { useAuthContext } from '../context/AuthContext';

import { Award } from 'lucide-react';

/**
 * Core Router mapping client views and workspace active panels.
 */
export default function AppRoutes() {
  const { isLoggedIn, authView, setAuthView, loginUser, logoutUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [preloadedPrompt, setPreloadedPrompt] = useState<string>("");

  // Render Page Content inside Workspace
  const renderWorkspaceContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} setPreloadedPrompt={setPreloadedPrompt} />;
      case 'chat':
        return <AIChat preloadedPrompt={preloadedPrompt} clearPreloadedPrompt={() => setPreloadedPrompt("")} />;
      case 'explain':
        return <CodeExplainer />;
      case 'debug':
        return <Debugger />;
      case 'generate':
        return <CodeGenerator />;
      case 'readme':
        return <ReadmeGenerator />;
      case 'sql':
        return <SQLAssistant />;
      case 'dsa':
        return (
          <div className="glass-card animate-fade-in" style={{ padding: '32px', textAlign: 'center', maxWidth: '640px', margin: '40px auto' }}>
            <Award size={48} color="#8B5CF6" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>DSA Helper Module</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              Welcome to the Data Structures and Algorithms visual guide workspace. Analyze time complexity parameters, optimize graph routes, and model complex systems using interactive trees.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'left', marginBottom: '24px' }}>
              <div className="glass" style={{ padding: '16px', borderRadius: '10px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '6px' }}>Graph Traversal</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Visualize BFS and DFS pathfinding search flows.</p>
              </div>
              <div className="glass" style={{ padding: '16px', borderRadius: '10px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '6px' }}>Sorting Optimizations</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Interactive partitioning simulations for Quicksort and Heapsort.</p>
              </div>
            </div>
            <button className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }} onClick={() => setActiveTab('chat')}>
              Ask DSA Questions in Chat
            </button>
          </div>
        );
      case 'settings':
        return <Profile />;
      default:
        return <Dashboard setActiveTab={setActiveTab} setPreloadedPrompt={setPreloadedPrompt} />;
    }
  };

  // Flow State Routing
  if (!isLoggedIn) {
    if (authView === 'login') {
      return (
        <AuthLayout>
          <Login 
            onLoginSuccess={(userData, token) => loginUser(userData, token)} 
            onNavigateToRegister={() => setAuthView('register')}
            onNavigateToForgot={() => setAuthView('forgot')}
            onBackToLanding={() => setAuthView('landing')}
          />
        </AuthLayout>
      );
    }

    if (authView === 'register') {
      return (
        <AuthLayout>
          <Register 
            onRegisterSuccess={() => setAuthView('login')}
            onNavigateToLogin={() => setAuthView('login')}
            onBackToLanding={() => setAuthView('landing')}
          />
        </AuthLayout>
      );
    }

    if (authView === 'forgot') {
      return (
        <AuthLayout>
          <ForgotPassword 
            onResetSuccess={() => setAuthView('login')}
            onBackToLogin={() => setAuthView('login')}
          />
        </AuthLayout>
      );
    }

    return <LandingPage onLoginTrigger={() => setAuthView('login')} />;
  }

  // Logged-in Workspace Dashboard
  return (
    <ProtectedRoute fallback={<LandingPage onLoginTrigger={() => setAuthView('login')} />}>
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logoutUser}>
        {renderWorkspaceContent()}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
