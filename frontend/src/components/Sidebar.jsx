import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  FileText, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar({ currentTab, setCurrentTab, onOpenSettings }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chatbot', label: 'Mock Interview', icon: MessageSquare },
    { id: 'quiz', label: 'Skill Quiz', icon: BookOpen },
    { id: 'resume', label: 'Resume Analyzer', icon: FileText }
  ];

  return (
    <aside className="w-64 h-full bg-[#0a0a0f] border-r border-white/5 flex flex-col justify-between p-4 shrink-0">
      {/* Brand Header */}
      <div>
        <div className="flex items-center gap-2.5 px-2 py-4 mb-6 select-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white font-display tracking-tight flex items-center gap-1.5">
              Prep<span className="text-purple-400">AI</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">
              INTERVIEW ENGINE
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600/15 text-purple-300 border border-purple-500/20 shadow-inner'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Actions */}
      <div className="space-y-3">
        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <Settings className="w-4.5 h-4.5 text-slate-400" />
          <span>Developer Settings</span>
        </button>

        {/* User Card */}
        {user && (
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="overflow-hidden min-w-0 pr-2">
              <h4 className="font-semibold text-xs text-white truncate">{user.username}</h4>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
