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
