import React from 'react';
import './styles/globals.css';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';

export default function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <AppRoutes />
      </ChatProvider>
    </ThemeProvider>
  );
}
