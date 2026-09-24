import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Check, X, Timer, AlertTriangle, Brain, Shield } from 'lucide-react';

// ── Reality Check Simulator ──────────────────────────────────────────────────

const STANDARD_CODE = `function processData(arr) {
  return arr
    .filter(x => x > 0)
    .map(x => x * 2)
    .sort((a, b) => a - b);
}`;

const COGNITRACE_CODE = `function memoizedCallback(dep) {
  return useCallback(() => {
    // Line 14: callback captures dep
    processQueue(dep);
  }, [dep]);
}`;

function RealityCheckSimulator() {
  const [activeTab, setActiveTab] = useState('standard'); // 'standard' | 'cognitrace'
  const [vivaPhase, setVivaPhase] = useState('idle'); // idle | asking | answered
  const [countdown, setCountdown] = useState(60);
  const [studentAnswer, setStudentAnswer] = useState('');
  const timerRef = useRef(null);

  const startViva = () => {
    setVivaPhase('asking');
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          setVivaPhase('answered');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const submitAnswer = () => {
    clearInterval(timerRef.current);
    setVivaPhase('answered');
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setVivaPhase('idle');
    setCountdown(60);
    setStudentAnswer('');
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const circumference = 2 * Math.PI * 22;
  const strokeDash = circumference - (countdown / 60) * circumference;

  return (
    <div className="mt-14 mb-4 max-w-4xl mx-auto" id="how-it-works">
      {/* Tab switcher */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => { setActiveTab('standard'); reset(); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${activeTab === 'standard'
              ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
              : 'text-white/40 hover:text-white/70 border border-white/[0.06] hover:border-white/15'
            }`}
        >
          <X size={14} /> Standard LMS
        </button>
        <div className="w-8 h-px bg-white/10" />
        <button
          onClick={() => { setActiveTab('cognitrace'); reset(); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${activeTab === 'cognitrace'
              ? 'bg-[#00F0FF]/10 border border-[#00F0FF]/25 text-[#00F0FF]'
              : 'text-white/40 hover:text-white/70 border border-white/[0.06] hover:border-white/15'
            }`}
        >
          <Shield size={14} /> CogniTrace Engine
        </button>
      </div>

      {/* Simulator card */}
      <div className="card-glass overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          <span className="ml-3 text-xs font-mono text-white/25">
            {activeTab === 'standard' ? 'standard-lms.assessment.run' : 'cognitrace.viva.engine.v1'}
          </span>
        </div>

        {/* ── STANDARD LMS VIEW ── */}
        {activeTab === 'standard' && (
          <div className="p-6 grid md:grid-cols-2 gap-6">
            {/* Code box */}
            <div>
              <p className="section-label mb-3">Submitted Code</p>
              <div className="bg-black/40 rounded-lg border border-white/[0.06] p-4 font-mono text-xs text-white/70 leading-relaxed">
                <div className="text-white/25 mb-2 text-[10px] select-none">1  // Copied from ChatGPT response</div>
                {STANDARD_CODE.split('\n').map((line, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-white/20 w-4 select-none">{i + 2}</span>
                    <span className="text-emerald-300/80">{line}</span>
                  </div>
                ))}
              </div>

              {/* Paste detection banner */}
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-md
                              bg-amber-500/8 border border-amber-500/15">
                <AlertTriangle size={13} className="text-amber-400 shrink-0" />
                <span className="text-xs font-mono text-amber-400/80">
                  Telemetry: 1 paste event · 0ms IKI · 0 backspaces
                </span>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col gap-4">
              <p className="section-label">Assessment Output</p>
              <div className="space-y-2">
                {['Test 1: Positive values filtered', 'Test 2: Values doubled', 'Test 3: Output sorted'].map((t, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-md
                                          bg-emerald-500/8 border border-emerald-500/15">
                    <Check size={13} className="text-emerald-400 shrink-0" />
                    <span className="text-xs text-white/70">{t}</span>
                    <span className="ml-auto text-xs font-mono text-emerald-400">PASS</span>
                  </div>
                ))}
              </div>

              {/* "Passed" callout */}
              <div className="mt-auto rounded-lg border border-emerald-500/20 bg-emerald-500/8 p-4 text-center">
                <div className="text-2xl font-black text-emerald-400">100%</div>
                <div className="text-sm text-white/50 mt-0.5">All Tests Passed</div>
                <div className="mt-3 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/20
                                text-xs font-mono text-rose-400 inline-block">
                  ⚠ 0% Verified Cognitive Retention
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── COGNITRACE VIEW ── */}
        {activeTab === 'cognitrace' && (
          <div className="p-6 grid md:grid-cols-2 gap-6">
            {/* Code with highlighted anchor line */}
            <div>
              <p className="section-label mb-3">Code Under Examination</p>
              <div className="bg-black/40 rounded-lg border border-white/[0.06] p-4 font-mono text-xs leading-relaxed overflow-hidden">
                {COGNITRACE_CODE.split('\n').map((line, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 rounded px-1 transition-all duration-300
                      ${i === 2 /* line 14 comment */ ? 'bg-[#00F0FF]/8 border-l-2 border-[#00F0FF]/60 -mx-1 px-2' : ''}`}
                  >
                    <span className="text-white/20 w-5 select-none">{i + 12}</span>
                    <span className={i === 2 ? 'text-[#00F0FF]/90' : 'text-purple-300/70'}>{line}</span>
                  </div>
                ))}
              </div>

              {/* AST analysis pill */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: 'useCallback', status: 'detected' },
                  { label: '[dep] array', status: 'anchor' },
                  { label: 'memoization', status: 'target' },
                ].map(({ label, status }) => (
                  <div key={label} className="px-2 py-1.5 rounded-md bg-[#101522] border border-[#6366F1]/20 text-center">
                    <div className="text-[9px] font-mono text-[#6366F1]/60 uppercase mb-0.5">{status}</div>
                    <div className="text-[10px] font-mono text-white/60">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Viva modal simulation */}
            <div>
              <p className="section-label mb-3">Socratic Defense Protocol</p>

              {vivaPhase === 'idle' && (
                <div className="flex flex-col h-full items-center justify-center gap-4 py-8">
                  <div className="p-3 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20">
                    <Brain size={24} className="text-[#6366F1]" />
                  </div>
                  <p className="text-sm text-white/50 text-center max-w-[200px]">
                    Suspicious submission detected. Initiate Socratic interrogation?
                  </p>
                  <button onClick={startViva} className="btn-primary text-sm px-5 py-2">
                    <Zap size={14} /> Begin Viva
                  </button>
                </div>
              )}

              {vivaPhase === 'asking' && (
                <div className="space-y-4">
                  {/* Countdown ring */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 shrink-0">
                      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 50 50">
                        <circle cx="25" cy="25" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                        <circle
                          cx="25" cy="25" r="22" fill="none"
                          stroke={countdown > 20 ? '#00F0FF' : countdown > 10 ? '#F59E0B' : '#EF4444'}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDash}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <span className={`absolute inset-0 flex items-center justify-center text-sm font-mono font-bold
                        ${countdown > 20 ? 'text-[#00F0FF]' : countdown > 10 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {countdown}
                      </span>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-white/30 mb-1">QUESTION 1 OF 3 · DIFFICULTY: HARD</div>
                      <div className="text-xs font-mono text-[#00F0FF]/60">↳ Anchor: Line 14</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#6366F1]/8 border border-[#6366F1]/20">
                    <p className="text-sm text-white/85 leading-relaxed">
                      "Why did you pass an <span className="text-[#00F0FF] font-mono">unmemoized callback</span> into this{' '}
                      <span className="text-[#00F0FF] font-mono">[dep]</span> dependency array?
                      What referential equality problem does this create on every render?"
                    </p>
                  </div>

                  <textarea
                    value={studentAnswer}
                    onChange={e => setStudentAnswer(e.target.value)}
                    placeholder="Type your defense... (60 seconds)"
                    className="input-field h-20 resize-none text-xs font-mono"
                  />

                  <button
                    onClick={submitAnswer}
                    className="w-full btn-primary justify-center text-sm py-2.5"
                  >
                    Submit Defense
                  </button>
                </div>
              )}

              {vivaPhase === 'answered' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#101522] border border-white/[0.06]">
                    <div className="text-[10px] font-mono text-white/30 mb-1">STUDENT RESPONSE</div>
                    <p className="text-xs text-white/50 italic">
                      {studentAnswer || '(No response — timer expired)'}
                    </p>
                  </div>

                  {/* Score breakdown */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Test Score', value: '100%', color: 'text-emerald-400' },
                      { label: 'Viva Score', value: studentAnswer.length > 30 ? '72%' : '12%',
                        color: studentAnswer.length > 30 ? 'text-amber-400' : 'text-rose-400' },
                      { label: 'MCI', value: studentAnswer.length > 30 ? '67' : '22',
                        color: studentAnswer.length > 30 ? 'text-amber-400' : 'text-rose-400' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="p-2.5 rounded-md bg-[#101522] border border-white/[0.06] text-center">
                        <div className={`text-lg font-bold font-mono ${color}`}>{value}</div>
                        <div className="text-[9px] text-white/30 mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>

                  <div className={`px-3 py-2 rounded-md border text-xs font-mono
                    ${studentAnswer.length > 30
                      ? 'bg-amber-500/8 border-amber-500/20 text-amber-400'
                      : 'bg-rose-500/8 border-rose-500/20 text-rose-400'
                    }`}>
                    {studentAnswer.length > 30
                      ? '⚡ Partial Understanding — Remediation assigned for Closures'
                      : '🚨 Likely AI-Assisted — Flagged for Teacher Review'}
                  </div>

                  <button onClick={reset} className="w-full btn-ghost text-xs py-2">Reset Simulation</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center
                        pt-24 pb-16 px-4 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 grid-bg opacity-100" />
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                      bg-[#6366F1]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center z-10">
        {/* System pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full
                        bg-[#101522]/80 border border-white/[0.08] backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
          <span className="text-xs font-mono text-white/50">
            System v1.0 — Eliminating AI-Assisted Assessment Fraud
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08]
                       tracking-tight mb-6 text-balance">
          Education That Validates{' '}
          <span className="gradient-text">Understanding</span>,
          <br />
          Not Just Completion.
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-10 text-balance">
          Traditional LMSs reward students who copy code from ChatGPT into multiple-choice quizzes.
          CogniTrace uses{' '}
          <span className="text-white/80 font-medium">AST syntax tree analysis</span>,{' '}
          <span className="text-white/80 font-medium">concept dependency graphs</span>, and{' '}
          <span className="text-white/80 font-medium">real-time Socratic vivas</span>{' '}
          to authenticate true cognitive comprehension.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <a href="#how-it-works" className="btn-primary text-sm px-6 py-3">
            <Brain size={15} />
            Experience Socratic Viva
          </a>
          <a href="#dag" className="btn-ghost text-sm px-6 py-3">
            Explore Knowledge DAG
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Social proof micro line */}
        <p className="text-xs font-mono text-white/20">
          Built on pure MERN · AST · BKT · Socratic Defense · Zero placeholders
        </p>

        {/* Reality Check Simulator */}
        <RealityCheckSimulator />
      </div>
    </section>
  );
}
