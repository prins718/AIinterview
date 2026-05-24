import React, { useState, useEffect } from 'react';
import { Sparkles, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getGeminiKey } from '../utils/api.js';

export default function Navbar({ currentTab }) {
  const { user } = useAuth();
  const [engineMode, setEngineMode] = useState('ambient');

  // React to updates on local key setting
  useEffect(() => {
    const checkKey = () => {
      const key = getGeminiKey();
      setEngineMode(key ? 'live' : 'ambient');
    };
    checkKey();
    
    // Add custom poll check to react to drawer changes
    const interval = setInterval(checkKey, 2000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Performance Control';
      case 'chatbot': return 'Interactive Interview Chamber';
      case 'quiz': return 'Technical Assessment Center';
      case 'resume': return 'Resume AI Optimizer';
      default: return 'Control Center';
    }
  };

  return (
    <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-[#0a0a0f]/50 backdrop-blur-md select-none shrink-0">
      {/* Active Tab Title */}
      <div>
        <h2 className="text-sm font-semibold tracking-wider text-slate-400 uppercase font-sans">
          {getPageTitle()}
        </h2>
      </div>

      {/* Engine Status Indicator & Welcome */}
      <div className="flex items-center gap-4">
        {/* Engine status indicator pill */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
          engineMode === 'live' 
            ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' 
            : 'bg-emerald-500/5 text-emerald-300 border-emerald-500/10'
        }`}>
          <Radio className={`w-3.5 h-3.5 ${engineMode === 'live' ? 'animate-pulse text-purple-400' : 'text-emerald-400'}`} />
          <span>{engineMode === 'live' ? 'Live Gemini Engine' : 'Adaptive Offline Engine'}</span>
        </div>

        {/* User Greet */}
        {user && (
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">SECURED PROFILE</span>
            <span className="text-xs text-slate-200 font-semibold">{user.username}</span>
          </div>
        )}
      </div>
    </header>
  );
}
