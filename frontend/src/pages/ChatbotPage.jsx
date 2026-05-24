import React, { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api.js';
import { 
  Sparkles, 
  MessageSquare, 
  Send, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  AlertCircle,
  Play,
  RotateCcw,
  CheckCircle,
  Trophy,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ChatbotPage() {
  // Configuration State
  const [role, setRole] = useState('Frontend Engineer');
  const [customRole, setCustomRole] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [interviewType, setInterviewType] = useState('General');
  const [inSession, setInSession] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Voice States
  const [isTTSActive, setIsTTSActive] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [voiceRecognitionSupported, setVoiceRecognitionSupported] = useState(false);
  
  // Feedback States
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');

  // Refs for scroll locking & Speech
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Speech Recognition support in browser
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceRecognitionSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingMsg]);

  // Handle TTS (Text to Speech) on new interviewer messages
  useEffect(() => {
    if (messages.length > 0 && isTTSActive) {
      const latestMsg = messages[messages.length - 1];
      if (latestMsg.sender === 'interviewer') {
        speakText(latestMsg.text);
      }
    }
  }, [messages, isTTSActive]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel previous utterances to avoid overlaps
      window.speechSynthesis.cancel();
      
      // Clean up markdown/extra stars before reading
      const cleanText = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95; // Slightly slower for distinct interviewer clarity
      
      // Attempt to find a standard female or male English voice if loaded
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en'));
      if (engVoice) {
        utterance.voice = engVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeechRecognition = () => {
    if (!voiceRecognitionSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingMsg(true);
    setFeedback(null);

    let finalRole = role;
    if (role === 'Custom') {
      if (!customRole.trim()) {
        setError('Please enter your custom target job title.');
        setLoadingMsg(false);
        return;
      }
      finalRole = customRole.trim();
    }

    try {
      const data = await api.post('/api/interview/start', {
        role: finalRole,
        difficulty,
        experienceLevel,
        interviewType
      });

      setSessionId(data.sessionId);
      setMessages(data.messages || []);
      setInSession(true);
      setCurrentQuestionIndex(0);
    } catch (err) {
      setError(err.message || 'Error starting interview session.');
    } finally {
      setLoadingMsg(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loadingMsg) return;

    // Stop speaking if interviewer is currently reading
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const textToSend = inputText;
    setInputText('');
    setLoadingMsg(true);
    setError('');

    // Pre-push user message in UI for instantaneous feeling
    setMessages(prev => [...prev, { sender: 'user', text: textToSend, timestamp: new Date() }]);

    try {
      const data = await api.post(`/api/interview/${sessionId}/message`, {
        text: textToSend
      });

      if (data.status === 'completed') {
        // Complete state - load feedback
        setMessages(data.messages);
        setFeedback(data.feedback);
        setInSession(false);
        // Fire confetti for satisfying finish!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        // Active state progress
        setMessages(data.messages);
        setCurrentQuestionIndex(data.currentQuestionIndex);
      }
    } catch (err) {
      setError(err.message || 'Error sending message.');
    } finally {
      setLoadingMsg(false);
    }
  };

  const handleResetSession = () => {
    setInSession(false);
    setSessionId(null);
    setMessages([]);
    setFeedback(null);
    setError('');
    setCurrentQuestionIndex(0);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="p-8 h-full flex flex-col justify-between overflow-hidden relative">
      {/* Absolute ambient circles */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ERROR HEADER BANNER */}
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 shrink-0 z-10">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. MOCK SETUP PANEL */}
      {!inSession && !feedback && (
        <div className="max-w-2xl mx-auto w-full my-auto space-y-6 animate-fade-in z-10">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
              <MessageSquare className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-white font-display">Initiate Interview Chamber</h2>
            <p className="text-sm text-slate-400">Configure parameters to customize the AI hiring recruiter agent.</p>
          </div>

          <form onSubmit={handleStartInterview} className="glass-panel rounded-2xl border border-white/10 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Job role dropdown list */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Target Job Title</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#111119] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                >
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="DevOps & Cloud">DevOps & Cloud Engineer</option>
                  <option value="Mobile Developer">Mobile Developer (iOS/Android)</option>
                  <option value="AI / ML Engineer">AI / Machine Learning Engineer</option>
                  <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                  <option value="Product Manager">Technical Product Manager</option>
                  <option value="System Architect">System Architect</option>
                  <option value="Custom">Custom Role...</option>
                </select>

                {/* Conditional custom role text input */}
                {role === 'Custom' && (
                  <div className="mt-3 animate-fade-in space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Custom Job Title</label>
                    <input
                      type="text"
                      required
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="e.g. Embedded Systems Developer, Engineering Manager..."
                      className="w-full bg-[#111119] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* Interview Focus Type */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Interview Focus Type</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full bg-[#111119] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                >
                  <option value="General">General Technical Role-Tailored Screen</option>
                  <option value="System Design">System Design & Distributed Architectures</option>
                  <option value="Behavioral">Behavioral (STAR Method & Leadership)</option>
                  <option value="Coding/Algorithms">Live Coding & Algorithmic Concepts</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Difficulty Index</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-[#111119] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="Easy">Easy (Conceptual Fundamentals)</option>
                  <option value="Medium">Medium (Standard Industry Bench)</option>
                  <option value="Hard">Hard (Deep Architectures & Stress)</option>
                </select>
              </div>

              {/* Experience Level */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Target Seniority</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-[#111119] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="Junior">Entry / Associate Level</option>
                  <option value="Mid-Level">Mid-Level Practitioner</option>
                  <option value="Senior">Senior / Principal Lead</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingMsg}
              className="w-full py-4 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-600/20 hover:shadow-purple-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loadingMsg ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Enter Interview Chamber</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* 2. ACTIVE INTERVIEW CHAT VIEW */}
      {inSession && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden glass-panel rounded-2xl border border-white/5 relative z-10">
          
          {/* Active Header Panel */}
          <div className="px-6 py-4 border-b border-white/5 bg-[#12121c]/40 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping" />
              <div>
                <h3 className="text-sm font-bold text-white font-display leading-tight">{role} Interview</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Focusing on {difficulty} complexity &bull; Question {currentQuestionIndex + 1} of 4</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* TTS Speech Trigger Toggle */}
              <button
                onClick={() => setIsTTSActive(!isTTSActive)}
                title={isTTSActive ? 'Disable TTS Voice Output' : 'Enable TTS Voice Output'}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isTTSActive 
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                    : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                {isTTSActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Reset Session button */}
              <button
                onClick={handleResetSession}
                className="text-xs flex items-center gap-1.5 py-2 px-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg border border-rose-500/25 transition-all cursor-pointer font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Abandon session</span>
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((msg, index) => {
              const isInterviewer = msg.sender === 'interviewer';
              return (
                <div 
                  key={index}
                  className={`flex ${isInterviewer ? 'justify-start' : 'justify-end'} animate-fade-in`}
                >
                  <div className={`max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed border ${
                    isInterviewer
                      ? 'bg-purple-500/5 text-purple-100 border-purple-500/10 rounded-tl-sm'
                      : 'bg-[#181825]/90 text-slate-100 border-white/5 rounded-tr-sm'
                  }`}>
                    {/* Render text, linebreaks */}
                    <p className="whitespace-pre-line font-sans">{msg.text}</p>
                    
                    {/* Speak Button for individual historical questions */}
                    {isInterviewer && (
                      <button 
                        onClick={() => speakText(msg.text)}
                        title="Replay Audio Read"
                        className="mt-2.5 flex items-center gap-1 text-[10px] text-purple-400 font-bold uppercase hover:text-purple-300 transition-colors"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Speak Text</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Simulated loading dots from interviewer */}
            {loadingMsg && messages[messages.length - 1]?.sender === 'user' && (
              <div className="flex justify-start">
                <div className="bg-purple-500/5 border border-purple-500/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form input console */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-[#0a0a0f]/80 flex items-center gap-3">
            {/* Input field */}
            <input
              type="text"
              required
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loadingMsg}
              placeholder={isListening ? 'Listening to voice...' : 'Type your detailed technical response here...'}
              className="flex-1 bg-[#12121c] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
            />

            {/* Speech-to-text voice microphone input button */}
            {voiceRecognitionSupported && (
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                title={isListening ? 'Stop Listening' : 'Use Voice Input (Speech-to-Text)'}
                className={`p-3 rounded-xl border transition-all cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10'
                }`}
              >
                {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
              </button>
            )}

            {/* Send Message Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || loadingMsg}
              className="p-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl transition-all cursor-pointer shrink-0 shadow-lg shadow-purple-600/15"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>
      )}

      {/* 3. EVALUATION SCORECARD DISPLAY */}
      {feedback && !inSession && (
        <div className="max-w-2xl mx-auto w-full overflow-y-auto space-y-6 animate-fade-in z-10 max-h-[85vh] pr-2">
          {/* Header score card */}
          <div className="glass-panel rounded-2xl border border-purple-500/25 p-6 bg-gradient-to-br from-purple-950/20 to-[#0e0e16] text-center space-y-3 relative overflow-hidden">
            <div className="w-14 h-14 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/20">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white font-display">Evaluation Summary Compiled!</h2>
              <p className="text-xs text-slate-400 mt-0.5">Your interactive technical assessment has been successfully logged.</p>
            </div>

            {/* Dual Score Cards */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
              <div className="bg-[#13131c] border border-white/5 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Performance Index</span>
                <span className="text-3xl font-extrabold text-purple-400 font-display mt-1 block">{feedback.score}%</span>
              </div>
              <div className="bg-[#13131c] border border-white/5 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Hiring Status</span>
                <span className="text-3xl font-extrabold text-emerald-400 font-display mt-1 block">{feedback.rating}</span>
              </div>
            </div>
          </div>

          {/* Deep Breakdown Report */}
          <div className="glass-panel rounded-2xl border border-white/10 p-6 space-y-6 bg-[#0c0c12]/80">
            {/* Summary */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-display">Recruiter Assessment</h4>
              <p className="text-sm leading-relaxed text-slate-300">{feedback.summary}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Key Strengths</h4>
                <ul className="space-y-2.5">
                  {feedback.strengths?.map((str, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-500 font-semibold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest">Areas for Improvement</h4>
                <ul className="space-y-2.5">
                  {feedback.weaknesses?.map((weak, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-rose-500 font-semibold">•</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-display">Actionable Study Plans</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feedback.recommendations?.map((rec, idx) => (
                  <div key={idx} className="p-3.5 bg-white/5 border border-white/5 rounded-xl text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                    <span className="text-indigo-400 font-bold mt-0.5">→</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reset Chamber Control */}
          <button
            onClick={handleResetSession}
            className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-600/15"
          >
            <span>Return to parameters config</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
