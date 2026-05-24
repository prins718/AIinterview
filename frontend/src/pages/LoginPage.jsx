import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Sparkles, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, signup } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!username.trim()) {
          throw new Error('Username is required.');
        }
        await signup(username, email, password);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during submission.');
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-[#07070a] relative px-4 overflow-hidden">
      {/* Decorative Blur Ambient Glow Circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-md z-10 animate-fade-in">
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-purple-600/30 mb-4 scale-100 hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
            Welcome to Prep<span className="text-purple-400">AI</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xs">
            {isLogin 
              ? 'Accelerate your career trajectory with simulated mock tech interviews.' 
              : 'Construct your account to unlock professional AI coaching insights.'
            }
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="glass-panel rounded-2xl border border-white/10 p-8 shadow-2xl relative">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username field for registration */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  User Handle
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-[#111119] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#111119] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Secure Key / Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111119] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-600/20 hover:shadow-purple-500/30 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Establish Session' : 'Register Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Session State */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <button
              onClick={handleToggle}
              className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors cursor-pointer"
            >
              {isLogin 
                ? "First time preparing? Create an account" 
                : "Already established? Sign in to your dashboard"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
