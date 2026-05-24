import React, { useState } from 'react';
import { api } from '../utils/api.js';
import { 
  Sparkles, 
  FileText, 
  UploadCloud, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Briefcase, 
  ShieldCheck, 
  BrainCircuit,
  HelpCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';

export default function ResumePage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Results
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError('');
    setSuccess(false);

    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain') {
        setFile(selectedFile);
      } else {
        setFile(null);
        setError('Invalid file type. Only PDF and TXT files are accepted.');
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || loading) return;

    setLoading(true);
    setError('');
    setSuccess(false);
    setAnalysis(null);

    try {
      const data = await api.upload('/api/resume/analyze', file);
      setAnalysis(data.analysis);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error processing your resume upload.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysis(null);
    setSuccess(false);
    setError('');
  };

  return (
    <div className="p-8 h-full flex flex-col justify-between overflow-hidden relative">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ERROR HEADER BANNER */}
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 shrink-0 z-10 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. UPLOAD ZONE SCREEN */}
      {!analysis && (
        <div className="max-w-2xl mx-auto w-full my-auto space-y-6 animate-fade-in z-10">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
              <UploadCloud className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-white font-display">Resume AI Parser Center</h2>
            <p className="text-sm text-slate-400">Upload your industry profile to extract skills and pre-generate targeted questions.</p>
          </div>

          <form onSubmit={handleUpload} className="glass-panel rounded-2xl border border-white/10 p-8 space-y-6 text-center">
            
            {/* Dotted drag and drop zone */}
            <div className="border-2 border-dashed border-white/10 hover:border-purple-500/35 rounded-xl p-8 transition-colors relative cursor-pointer group bg-[#111119]/50">
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center mx-auto group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-all">
                  <FileText className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    {file ? file.name : 'Click to select or drag file here'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Acceptable types: PDF, Plain Text (Max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!file || loading}
              className="w-full py-4 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-600/20 hover:shadow-purple-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute Profile Extraction</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* 2. RECRUITER ANALYSIS DASHBOARD PANEL */}
      {analysis && (
        <div className="max-w-3xl mx-auto w-full overflow-y-auto space-y-6 animate-fade-in z-10 max-h-[85vh] pr-2">
          
          {/* Header Panel */}
          <div className="glass-panel rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-br from-purple-950/10 to-[#0e0e16]">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-white font-display leading-tight">{analysis.candidateName}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Estimated Primary Segment: {analysis.inferredRole}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleReset}
              className="text-xs py-2 px-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/5 transition-all cursor-pointer"
            >
              Clear Analysis
            </button>
          </div>

          {/* Details split */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left: Skills list (col-span-1) */}
            <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4 md:col-span-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-display flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <span>Extracted Skills</span>
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {analysis.skills?.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/5 px-2.5 py-1 rounded-lg hover:border-purple-500/35 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Strengths & Optimizations (col-span-2) */}
            <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-5 md:col-span-2">
              {/* Strengths */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-display flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Identified Strengths</span>
                </h3>
                <ul className="space-y-2 text-xs leading-relaxed text-slate-300">
                  {analysis.strengths?.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Optimizations */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest font-display flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Resume Recommendations</span>
                </h3>
                <ul className="space-y-2 text-xs leading-relaxed text-slate-300">
                  {analysis.optimizations?.map((opt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{opt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Deep: Generated targeted mock questions */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest font-display">Resume-Tailored Questions</h3>
            <p className="text-xs text-slate-500">We compiled these specific conceptual prompts based on your parsed work achievements.</p>
            
            <div className="space-y-3">
              {analysis.customQuestions?.map((q, idx) => (
                <div key={idx} className="glass-panel rounded-2xl p-4.5 border border-white/5 flex items-start gap-3.5 bg-[#111119]/30">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 w-8.5 h-8.5 shrink-0 flex items-center justify-center border border-purple-500/20 mt-0.5">
                    <QuestionIcon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-purple-200 uppercase tracking-wider block">Question {idx + 1}</h4>
                    <p className="text-sm leading-relaxed text-slate-300 mt-1">{q}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
