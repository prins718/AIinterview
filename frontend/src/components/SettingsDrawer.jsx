import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, HelpCircle } from 'lucide-react';
import { getGeminiKey, setGeminiKey } from '../utils/api.js';

export default function SettingsDrawer({ isOpen, onClose }) {
  const [key, setKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setKey(getGeminiKey());
  }, [isOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    setGeminiKey(key.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-md h-full bg-[#0d0d12]/95 border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-lg transform transition-transform duration-300 translate-x-0">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Developer Settings</h3>
                <p className="text-xs text-slate-400">Configure custom integrations</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="mt-8 space-y-6">
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 text-slate-300 text-sm space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero-Server Security</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Providing your Gemini API Key directly allows the platform to use the model without local file config limits. Your key is stored 100% locally in your browser's private storage and is never saved permanently on our servers.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-[#161622] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Leave blank to automatically utilize our built-in offline simulation mode.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSaved}
                className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                  isSaved
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 hover:shadow-purple-500/30'
                }`}
              >
                {isSaved ? 'Key Configured Successfully!' : 'Save Credentials'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/5 text-center text-xs text-slate-500">
          PrepAI v1.0.0 &bull; Secure Client Sandboxing
        </div>
      </div>
    </div>
  );
}
