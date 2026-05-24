import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import SettingsDrawer from './components/SettingsDrawer.jsx';

// Pages
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ChatbotPage from './pages/ChatbotPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import ResumePage from './pages/ResumePage.jsx';

import { Sparkles } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] flex flex-col items-center justify-center space-y-4">
        {/* Loading Spinner */}
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin" />
          <Sparkles className="w-5 h-5 text-purple-400 absolute animate-pulse" />
        </div>
        <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase">
          Restoring Security Session
        </p>
      </div>
    );
  }

  // Not logged in -> Auth view
  if (!user) {
    return <LoginPage />;
  }

  // Logged in -> Standard Layout
  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardPage setCurrentTab={setCurrentTab} />;
      case 'chatbot':
        return <ChatbotPage />;
      case 'quiz':
        return <QuizPage />;
      case 'resume':
        return <ResumePage />;
      default:
        return <DashboardPage setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="h-screen w-screen flex bg-[#07070a] overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar currentTab={currentTab} />

        {/* Content canvas */}
        <main className="flex-1 overflow-hidden bg-[#07070a]">
          {renderTabContent()}
        </main>
      </div>

      {/* Developer API Configuration Drawer */}
      <SettingsDrawer 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
