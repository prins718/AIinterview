import React, { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api.js';
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Timer,
  ChevronRight,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizPage() {
  // Config
  const [category, setCategory] = useState('JavaScript');
  const [difficulty, setDifficulty] = useState('Medium');
  const [inQuiz, setInQuiz] = useState(false);
  const [quizId, setQuizId] = useState(null);

  // Quiz Engine
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: selectedIndex }
  const [loading, setLoading] = useState(false);
  
  // Ref to track latest selected answers, avoiding stale closures in timers
  const selectedAnswersRef = useRef({});
  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  // Timer States
  const [timeLeft, setTimeLeft] = useState(45); // 45 seconds per question
  const timerRef = useRef(null);

  // Completed State
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // Start question timer
  useEffect(() => {
    if (inQuiz && questions.length > 0) {
      setTimeLeft(45);
      
      if (timerRef.current) clearInterval(timerRef.current);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoAdvance(); // Time out auto advanced
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, inQuiz, questions]);

  const handleAutoAdvance = () => {
    // Save selection as -1 (unanswered) if none selected
    const currentQ = questions[currentIndex];
    if (selectedAnswersRef.current[currentQ._id] === undefined) {
      setSelectedAnswers(prev => ({ ...prev, [currentQ._id]: -1 }));
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Trigger auto submit
      handleSubmitQuiz();
    }
  };

  const handleStartQuiz = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResults(null);
    setSelectedAnswers({});
    setCurrentIndex(0);

    try {
      const data = await api.post('/api/quiz/generate', {
        category,
        difficulty
      });

      setQuizId(data.quizId);
      setQuestions(data.questions || []);
      setInQuiz(true);
    } catch (err) {
      setError(err.message || 'Error generating quiz. Please check settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optionIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setLoading(true);
    setError('');

    // Form answers array: [ { questionId, selectedAnswer } ]
    const formattedAnswers = questions.map(q => ({
      questionId: q._id,
      selectedAnswer: selectedAnswers[q._id] !== undefined ? selectedAnswers[q._id] : -1
    }));

    try {
      const data = await api.post(`/api/quiz/${quizId}/submit`, {
        answers: formattedAnswers
      });

      setQuestions(data.quiz.questions);
      setResults(data);
      setInQuiz(false);

      // satisfying success confetti!
      if (data.score >= 70) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setError(err.message || 'Error submitting quiz answers.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInQuiz(false);
    setQuizId(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setResults(null);
    setError('');
  };

  return (
    <div className="p-8 h-full flex flex-col justify-between overflow-hidden relative">
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ERROR HEADER BANNER */}
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 shrink-0 z-10">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. QUIZ GENERATION PARAMETERS */}
      {!inQuiz && !results && (
        <div className="max-w-2xl mx-auto w-full my-auto space-y-6 animate-fade-in z-10">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white font-display">Technical Assessment Chamber</h2>
            <p className="text-sm text-slate-400">Generate dynamically tailored quizzes to benchmark your core skills.</p>
          </div>

          <form onSubmit={handleStartQuiz} className="glass-panel rounded-2xl border border-white/10 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Technology Track</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#111119] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                >
                  <option value="JavaScript">JavaScript & ES6 Paradigms</option>
                  <option value="React">React.js & Core Web APIs</option>
                  <option value="System Design">System Design & Distributed Architectures</option>
                  <option value="NodeJS">Node.js + Async Engines</option>
                  <option value="SQL">SQL Queries & DB Indexing</option>
                  <option value="DSA">Data Structures & Algorithms (DSA)</option>
                  <option value="Python">Python & AI/ML Fundamentals</option>
                  <option value="DevOps">DevOps, Docker & AWS Cloud</option>
                  <option value="Security">Cybersecurity & OWASP Top 10</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Assessment Tier</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-[#111119] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                >
                  <option value="Easy">Easy (Conceptual Basics)</option>
                  <option value="Medium">Medium (Standard Developer Interview)</option>
                  <option value="Hard">Hard (Senior Level / Complex Edge Cases)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-600/20 hover:shadow-purple-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Assessment Task</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* 2. ACTIVE INTERACTIVE QUIZ CARD */}
      {inQuiz && questions.length > 0 && (
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-between overflow-hidden glass-panel rounded-2xl border border-white/5 relative z-10 my-auto max-h-[80vh]">
          {/* Header Panel */}
          <div className="px-6 py-4 border-b border-white/5 bg-[#12121c]/40 backdrop-blur-md flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-display leading-tight">{category} Assessment</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Complexity: {difficulty} &bull; Question {currentIndex + 1} of {questions.length}</p>
            </div>

            {/* Countdown timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              timeLeft < 15 
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' 
                : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
            }`}>
              <Timer className={`w-3.5 h-3.5 ${timeLeft < 15 ? 'animate-pulse text-rose-400' : 'text-purple-400'}`} />
              <span>{timeLeft}s left</span>
            </div>
          </div>

          {/* Question & Options Scroll area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 w-9 h-9 shrink-0 flex items-center justify-center border border-purple-500/20">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base text-white leading-relaxed pt-0.5">
                {questions[currentIndex].question}
              </h4>
            </div>

            {/* Options list */}
            <div className="space-y-3">
              {questions[currentIndex].options.map((opt, idx) => {
                const isSelected = selectedAnswers[questions[currentIndex]._id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(questions[currentIndex]._id, idx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-purple-600/15 border-purple-500 text-purple-200 shadow-inner'
                        : 'bg-[#13131c]/70 border-white/5 text-slate-300 hover:text-white hover:border-white/10 hover:bg-[#181826]'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected ? 'bg-purple-500 text-white' : 'bg-white/5 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Footer console */}
          <div className="p-4 border-t border-white/5 bg-[#0a0a0f]/80 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 py-2.5 px-4 bg-rose-500/5 hover:bg-rose-500/10 rounded-xl border border-rose-500/20 transition-colors cursor-pointer"
            >
              Cancel Quiz
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={selectedAnswers[questions[currentIndex]._id] === undefined}
                className="py-2.5 px-5 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={selectedAnswers[questions[currentIndex]._id] === undefined || loading}
                className="py-2.5 px-6 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-purple-600/15"
              >
                {loading ? (
                  <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Scorecard</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. COMPLETED SCORECARD REPORT */}
      {results && !inQuiz && (
        <div className="max-w-2xl mx-auto w-full overflow-y-auto space-y-6 animate-fade-in z-10 max-h-[85vh] pr-2">
          {/* Header score card */}
          <div className="glass-panel rounded-2xl border border-white/10 p-6 text-center space-y-3 relative overflow-hidden">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto border ${
              results.score >= 70 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white font-display">Assessment Finished!</h2>
              <p className="text-xs text-slate-400 mt-0.5">Your skill check has been compiled and saved to history logs.</p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
              <div className="bg-[#13131c] border border-white/5 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Percentile Grade</span>
                <span className={`text-3xl font-extrabold font-display mt-1 block ${results.score >= 70 ? 'text-emerald-400' : 'text-purple-400'}`}>
                  {results.score}%
                </span>
              </div>
              <div className="bg-[#13131c] border border-white/5 p-4 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Correct Answers</span>
                <span className="text-3xl font-extrabold text-slate-200 font-display mt-1 block">
                  {results.correctAnswers} / {results.totalQuestions}
                </span>
              </div>
            </div>
          </div>

          {/* Deep Explanations List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest font-display">Detailed Solution Keys</h3>
            
            {questions.map((q, qIdx) => {
              const isCorrect = q.selectedAnswer === q.correctAnswer;
              return (
                <div key={q._id} className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
                  <div className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-semibold text-sm text-white leading-relaxed">
                        {qIdx + 1}. {q.question}
                      </h4>
                    </div>
                  </div>

                  {/* Render Options inside feedback */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isUserSelection = q.selectedAnswer === oIdx;
                      const isCorrectSelection = q.correctAnswer === oIdx;
                      
                      let optionStyle = 'bg-white/5 border border-white/5 text-slate-400';
                      if (isCorrectSelection) {
                        optionStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium';
                      } else if (isUserSelection) {
                        optionStyle = 'bg-rose-500/10 border-rose-500/30 text-rose-300 font-medium';
                      }

                      return (
                        <div key={oIdx} className={`p-3 rounded-lg flex items-center gap-2 ${optionStyle}`}>
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCorrectSelection 
                              ? 'bg-emerald-500 text-white' 
                              : isUserSelection 
                                ? 'bg-rose-500 text-white' 
                                : 'bg-white/5 text-slate-500'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Conceptual Explanation Box */}
                  <div className="p-3.5 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-1">
                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block font-display">Tutor Insight</span>
                    <p className="text-xs leading-relaxed text-slate-300">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reset Quiz Controls */}
          <button
            onClick={handleReset}
            className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-600/15"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start New Assessment Track</span>
          </button>
        </div>
      )}
    </div>
  );
}
