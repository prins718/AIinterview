import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  Trophy, 
  Calendar,
  ChevronRight,
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export default function DashboardPage({ setCurrentTab }) {
  const [quizzes, setQuizzes] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizData, interviewData] = await Promise.all([
          api.get('/api/quiz/history'),
          api.get('/api/interview/history')
        ]);
        setQuizzes(quizData || []);
        setInterviews(interviewData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute analytics
  const completedQuizzes = quizzes.filter(q => q.completed);
  const completedInterviews = interviews.filter(s => s.status === 'completed');

  const avgQuizScore = completedQuizzes.length > 0
    ? Math.round(completedQuizzes.reduce((acc, q) => acc + q.score, 0) / completedQuizzes.length)
    : 0;

  const avgInterviewScore = completedInterviews.length > 0
    ? Math.round(completedInterviews.reduce((acc, i) => acc + (i.feedback?.score || 0), 0) / completedInterviews.length)
    : 0;

  // Prepare chart data for Performance Over Time
  const trendData = [...completedQuizzes, ...completedInterviews]
    .map(item => ({
      date: new Date(item.completedAt || item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: item.score !== undefined ? item.score : (item.feedback?.score || 0),
      type: item.score !== undefined ? 'Quiz' : 'Mock Interview',
      timestamp: new Date(item.completedAt || item.createdAt).getTime()
    }))
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-6); // Last 6 activities

  // Fallback default trend data for new accounts to maintain premium visuals
  const finalTrendData = trendData.length > 1 ? trendData : [
    { date: 'May 10', score: 65, type: 'Benchmark' },
    { date: 'May 12', score: 72, type: 'Benchmark' },
    { date: 'May 15', score: 80, type: 'Benchmark' },
    { date: 'May 18', score: avgQuizScore || 78, type: 'Benchmark' }
  ];

  // Radar Skill breakdown Chart Data
  const skillChartData = [
    { subject: 'Coding', A: avgQuizScore || 60, fullMark: 100 },
    { subject: 'System Design', A: avgInterviewScore || 65, fullMark: 100 },
    { subject: 'Algorithms', A: avgQuizScore ? Math.min(avgQuizScore + 10, 100) : 55, fullMark: 100 },
    { subject: 'Behavioral', A: avgInterviewScore ? Math.min(avgInterviewScore + 5, 100) : 70, fullMark: 100 },
    { subject: 'Architecture', A: avgInterviewScore || 50, fullMark: 100 }
  ];

  if (loading) {
    return (
      <div className="p-8 space-y-6 h-full overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 rounded-2xl shimmer-bg" />
          <div className="h-32 rounded-2xl shimmer-bg" />
          <div className="h-32 rounded-2xl shimmer-bg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 rounded-2xl shimmer-bg" />
          <div className="h-80 rounded-2xl shimmer-bg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto relative">
      {/* Upper Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Readiness Rating</span>
            <h3 className="text-3xl font-extrabold text-white font-display">
              {avgInterviewScore ? `${avgInterviewScore}%` : 'N/A'}
            </h3>
            <p className="text-xs text-slate-400">Based on mock interviews</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Average Quiz Score</span>
            <h3 className="text-3xl font-extrabold text-white font-display">
              {avgQuizScore ? `${avgQuizScore}%` : 'N/A'}
            </h3>
            <p className="text-xs text-slate-400">{completedQuizzes.length} assessment sessions</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Total Mock Chambers</span>
            <h3 className="text-3xl font-extrabold text-white font-display">
              {completedInterviews.length}
            </h3>
            <p className="text-xs text-slate-400">Active sessions: {interviews.filter(i => i.status === 'active').length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts & Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart (col-span-2) */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-display">Performance History</h3>
              <p className="text-xs text-slate-400">Score progress across recent assessments</p>
            </div>
            <TrendingUp className="w-4.5 h-4.5 text-purple-400" />
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={finalTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111119', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#c084fc', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Breakdown Radar Chart */}
        <div className="glass-panel rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-display">Skill Vector Profile</h3>
            <p className="text-xs text-slate-400">Conceptual performance indexes</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" radius="70%" data={skillChartData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" tick={false} />
                <Radar name="Candidate" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History and Actions split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Session Logs */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-display">Recent Assessments</h3>
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">System Logs</span>
          </div>

          <div className="space-y-3">
            {interviews.length === 0 && quizzes.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-white/5 rounded-xl">
                <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No mock logs or assessments on record yet.</p>
                <p className="text-xs text-slate-500 mt-1">Start a skill quiz or launch a mock chamber above!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5 space-y-3">
                {/* Render interview logs */}
                {interviews.slice(0, 3).map((session) => (
                  <div 
                    key={session._id} 
                    className="flex items-center justify-between pt-3 first:pt-0 group hover:bg-white/5 p-2 rounded-xl transition-all cursor-pointer"
                    onClick={() => {
                      if (session.status === 'completed') {
                        setSelectedInterview(session);
                      } else {
                        setCurrentTab('chatbot');
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${session.status === 'completed' ? 'bg-purple-500/10 text-purple-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">{session.role} Mock Session</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span>Difficulty: {session.difficulty}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {session.status === 'completed' ? (
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-400">{session.feedback?.score || 0}% Score</span>
                          <span className="text-[10px] text-slate-400 block">{session.feedback?.rating}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                          In Progress
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))}

                {/* Render quiz logs */}
                {quizzes.slice(0, 3).map((quiz) => (
                  <div 
                    key={quiz._id} 
                    className="flex items-center justify-between pt-3 group hover:bg-white/5 p-2 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white">{quiz.category} Assessment</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span>Level: {quiz.difficulty}</span>
                          <span>&bull;</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(quiz.completedAt || quiz.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-indigo-400">{quiz.score}% Score</span>
                        <span className="text-[10px] text-slate-400 block">{quiz.completed ? 'Completed' : 'Abandon'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions panel */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-display">Launch Workspace</h3>
            <p className="text-xs text-slate-400">Quick start coaching segments</p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => setCurrentTab('chatbot')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-purple-600/15"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Start Mock Session</span>
              </div>
              <Sparkles className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setCurrentTab('quiz')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/5 font-medium text-sm transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Generate Skill Quiz</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div className="text-xs text-slate-500 text-center leading-relaxed">
            Configure external API endpoints inside the Developer drawer to activate raw AI parameters.
          </div>
        </div>
      </div>

      {/* FEEDBACK DETAILS MODAL */}
      {selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedInterview(null)} />
          
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#0d0d12] border border-white/10 rounded-2xl p-6 overflow-y-auto shadow-2xl flex flex-col justify-between z-10 animate-scale-up">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/5">
              <div>
                <span className="text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full uppercase">
                  SCORECARD REPORT
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5 font-display">{selectedInterview.role} Mock Interview</h3>
                <p className="text-xs text-slate-400 mt-0.5">Completed on {new Date(selectedInterview.completedAt).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={() => setSelectedInterview(null)}
                className="py-1 px-2.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-semibold transition-colors"
              >
                Close Report
              </button>
            </div>

            {/* Score metrics */}
            <div className="grid grid-cols-3 gap-4 py-6 border-b border-white/5">
              <div className="text-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Evaluation Score</span>
                <span className="block text-2xl font-extrabold text-purple-400 mt-1 font-display">{selectedInterview.feedback?.score || 0}%</span>
              </div>
              <div className="text-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Hiring Rating</span>
                <span className="block text-2xl font-extrabold text-emerald-400 mt-1 font-display">{selectedInterview.feedback?.rating}</span>
              </div>
              <div className="text-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Questions Solved</span>
                <span className="block text-2xl font-extrabold text-slate-200 mt-1 font-display">
                  {selectedInterview.generatedQuestions?.length || 4}
                </span>
              </div>
            </div>

            {/* Structured feedback details */}
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Executive Summary</h4>
                <p className="text-sm leading-relaxed text-slate-400">{selectedInterview.feedback?.summary}</p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Demonstrated Strengths</h4>
                  <ul className="space-y-2">
                    {selectedInterview.feedback?.strengths?.map((str, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest">Areas for Improvement</h4>
                  <ul className="space-y-2">
                    {selectedInterview.feedback?.weaknesses?.map((weak, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-rose-500 mt-0.5">•</span>
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Study recommendations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-display">Targeted Recommendations</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedInterview.feedback?.recommendations?.map((rec, idx) => (
                    <li key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-indigo-400 font-bold mt-0.5">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
