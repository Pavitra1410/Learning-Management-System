import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X, Check, ArrowRight, Cpu, GitBranch, Brain,
  Activity, BarChart3, Shield, Zap, BookOpen,
  AlertTriangle, TrendingUp, Network, Database, ChevronRight
} from 'lucide-react';

// ── Problem section ──────────────────────────────────────────────────────────
const PROBLEMS = [
  {
    icon: AlertTriangle,
    title: 'Tutorial Hell is a Fake Learning Loop',
    desc: 'Students complete 40-hour video courses and emerge unable to write a single function from scratch. Passive consumption masquerades as education.',
  },
  {
    icon: Brain,
    title: 'AI Has Broken Traditional Assessment',
    desc: 'ChatGPT produces correct, well-commented code for any LeetCode problem in seconds. Every standard coding test is now a test of copy-paste dexterity.',
  },
  {
    icon: BarChart3,
    title: 'Scores Are Disconnected from Understanding',
    desc: 'A 100% pass rate on unit tests says nothing about why the code works — or whether the student would survive a 60-second verbal defense of their solution.',
  },
];

// ── Comparison table ─────────────────────────────────────────────────────────
const COMPARISON = [
  {
    dimension: 'Assessment Method',
    standard: 'Multiple-choice & static unit tests',
    cognitrace: 'AST structural validation + Socratic viva',
  },
  {
    dimension: 'AI Resistance',
    standard: 'None — ChatGPT aces every test',
    cognitrace: 'Socratic defense cannot be spoofed in real-time',
  },
  {
    dimension: 'Knowledge Tracking',
    standard: 'Binary: pass / fail',
    cognitrace: 'Bayesian probability per concept (p_know: 0–1)',
  },
  {
    dimension: 'Prerequisite Awareness',
    standard: 'Linear curriculum, no back-tracing',
    cognitrace: '$graphLookup traces root-cause prerequisite gaps',
  },
  {
    dimension: 'Fraud Detection',
    standard: 'Plagiarism tools (easily bypassed)',
    cognitrace: 'IKI telemetry + paste event interception',
  },
  {
    dimension: 'Memory Decay',
    standard: 'Not modelled',
    cognitrace: 'Ebbinghaus decay — mastery degrades without review',
  },
  {
    dimension: 'Teacher Intelligence',
    standard: 'Grade averages and completion rates',
    cognitrace: '4-quadrant Illusion of Competence scatter matrix',
  },
];

// ── Pillars ──────────────────────────────────────────────────────────────────
const PILLARS = [
  {
    icon: Shield,
    label: 'Cognitive Defense',
    color: 'text-[#00F0FF]',
    borderColor: 'border-[#00F0FF]/20',
    bg: 'bg-[#00F0FF]/[0.04]',
    title: 'The Socratic Viva Gateway',
    points: [
      'AI generates code-specific questions targeting anchor lines',
      '60-second timed response — no copy-paste escape',
      'Zero-escape modal: tab close forfeits the question',
      'Answers scored against structured JSON rubrics',
      'Multi-Dimensional Comprehension Index (MCI) computed',
    ],
    tech: ['Groq SDK', 'Llama-3.3-70B', 'JSON Schema Validation'],
  },
  {
    icon: GitBranch,
    label: 'Graph Dependency Tracing',
    color: 'text-[#6366F1]',
    borderColor: 'border-[#6366F1]/20',
    bg: 'bg-[#6366F1]/[0.04]',
    title: 'Concept DAG Back-Tracer',
    points: [
      'Directed Acyclic Graph of 20 JS concept nodes',
      'Failure triggers $graphLookup upstream traversal',
      "Kahn's topological sort identifies root prerequisites",
      'Remediation challenges injected into student queue',
      'React Flow renders live mastery with p_know color rings',
    ],
    tech: ['MongoDB $graphLookup', '@xyflow/react', 'Dagre Layout'],
  },
  {
    icon: TrendingUp,
    label: 'Metacognitive Calibration',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    bg: 'bg-amber-500/[0.04]',
    title: 'Bayesian Knowledge Tracing',
    points: [
      'BKT forward pass: P(L_t | obs) per concept per student',
      'Ebbinghaus decay: mastery halves without reinforcement',
      'Stability factor: stronger mastery decays more slowly',
      'Learning twin updated after every viva session',
      'Longitudinal MCI history exposed in teacher dashboard',
    ],
    tech: ['BKT Algorithm', 'Ebbinghaus Decay', 'MongoDB Atlas'],
  },
];

// ── Tech stack badges ─────────────────────────────────────────────────────────
const STACK_ITEMS = [
  { label: 'React.js', sublabel: 'Client Tier', color: '#61DAFB', icon: '⚛' },
  { label: 'Tailwind CSS', sublabel: 'Design System', color: '#06B6D4', icon: '🎨' },
  { label: 'Node.js', sublabel: 'Runtime', color: '#8CC84B', icon: '⬡' },
  { label: 'Express.js', sublabel: 'API Gateway', color: '#FFFFFF', icon: '⚡' },
  { label: 'MongoDB Atlas', sublabel: 'Persistence', color: '#00ED64', icon: '🌿' },
  { label: '@babel/parser', sublabel: 'AST Engine', color: '#F9DC3E', icon: 'Β' },
  { label: 'isolated-vm', sublabel: 'Sandbox', color: '#FF6B6B', icon: '🔒' },
  { label: 'Groq SDK', sublabel: 'AI Engine', color: '#FF6B00', icon: '🤖' },
];

export default function AboutPage() {
  const [activeComparison, setActiveComparison] = useState(null);
  const [activePillar, setActivePillar] = useState(0);

  return (
    <div className="bg-[#0A0D14] min-h-screen pt-20">

      {/* ── Hero ── */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="terminal-pill mb-8 mx-auto w-fit">
            <BookOpen size={11} />
            The Cognitive Manifesto
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white
                         leading-[1.08] tracking-tight mb-6 text-balance">
            The Flawed Industrial LMS Model
            <br />
            <span className="gradient-text">Versus Reality</span>
          </h1>
          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            We built CogniTrace because we refused to accept that "course completion" equals
            "understanding". This is our technical manifesto.
          </p>
        </div>
      </section>

      {/* ── Problem Section ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="section-label text-center">The Problem We Refuse To Ignore</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-12">
            Modern EdTech is Built on{' '}
            <span className="text-rose-400">Three Dangerous Fictions</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {PROBLEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-glass p-6 hover:border-rose-500/20 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-rose-500/8 border border-rose-500/15
                                flex items-center justify-center mb-4 text-rose-400
                                group-hover:bg-rose-500/12 transition-colors">
                  <Icon size={18} />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="section-label text-center">Architectural Breakdown</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-4">
            Standard LMS vs. CogniTrace Engine
          </h2>
          <p className="text-sm text-white/40 text-center mb-12 max-w-xl mx-auto">
            Hover each row to compare systems. Every cell reflects a concrete engineering decision.
          </p>

          <div className="card-glass overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-3 bg-white/[0.02] border-b border-white/[0.06]">
              <div className="p-4 text-xs font-mono text-white/25 uppercase tracking-wider">Dimension</div>
              <div className="p-4 border-l border-white/[0.06] flex items-center gap-2">
                <X size={13} className="text-rose-400" />
                <span className="text-xs font-mono text-rose-400/70">Standard LMS</span>
              </div>
              <div className="p-4 border-l border-white/[0.06] flex items-center gap-2">
                <Check size={13} className="text-[#00F0FF]" />
                <span className="text-xs font-mono text-[#00F0FF]/70">CogniTrace Engine</span>
              </div>
            </div>

            {/* Table rows */}
            {COMPARISON.map((row, i) => (
              <div
                key={i}
                onClick={() => setActiveComparison(activeComparison === i ? null : i)}
                className={`grid grid-cols-3 border-b border-white/[0.04] cursor-pointer
                           transition-all duration-200
                           ${activeComparison === i ? 'bg-[#00F0FF]/[0.02]' : 'hover:bg-white/[0.02]'}`}
              >
                <div className="p-4 text-xs font-semibold text-white/70">{row.dimension}</div>
                <div className="p-4 border-l border-white/[0.04] text-xs text-rose-300/60 flex items-start gap-2">
                  <X size={11} className="text-rose-500/40 shrink-0 mt-0.5" />
                  {row.standard}
                </div>
                <div className="p-4 border-l border-white/[0.04] text-xs text-emerald-300/70 flex items-start gap-2">
                  <Check size={11} className="text-emerald-500/60 shrink-0 mt-0.5" />
                  {row.cognitrace}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Pillars ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="section-label text-center">Core Architectural Pillars</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-12">
            Three Systems Working{' '}
            <span className="gradient-text">In Concert</span>
          </h2>

          <div className="grid lg:grid-cols-3 gap-4 mb-4">
            {PILLARS.map(({ icon: Icon, label, color, borderColor }, i) => (
              <button
                key={label}
                onClick={() => setActivePillar(i)}
                className={`p-4 rounded-xl border text-left transition-all duration-200
                  ${activePillar === i
                    ? `bg-white/[0.04] ${borderColor} shadow-card`
                    : 'border-white/[0.06] hover:border-white/15 bg-transparent'
                  }`}
              >
                <div className={`flex items-center gap-2 mb-1 ${color}`}>
                  <Icon size={15} />
                  <span className="text-xs font-mono">{label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active pillar detail */}
          {PILLARS.map((pillar, i) => i === activePillar && (
            <div key={pillar.label}
              className={`card-glass p-6 lg:p-8 border ${pillar.borderColor} animate-fade-in`}>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className={`flex items-center gap-2 ${pillar.color} mb-4`}>
                    <pillar.icon size={18} />
                    <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {pillar.points.map((point, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <ChevronRight size={13} className={`${pillar.color} shrink-0 mt-0.5`} />
                        <span className="text-sm text-white/60">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-mono text-white/25 uppercase tracking-wider mb-4">
                    Implementation Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pillar.tech.map(t => (
                      <span key={t} className={`terminal-pill border ${pillar.borderColor} ${pillar.color}`}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Mini formula or diagram */}
                  {i === 2 && (
                    <div className="mt-6 p-4 rounded-lg bg-black/40 border border-white/[0.06] font-mono text-xs">
                      <div className="text-white/30 mb-2 text-[10px] uppercase tracking-wider">BKT Formula</div>
                      <div className="text-amber-300/80 space-y-1.5">
                        <div>P(L_t | correct) = P(correct|L) × P(L_t)</div>
                        <div className="text-white/20">{'                  '} ─────────────────</div>
                        <div>{'                  '} P(correct)</div>
                        <div className="mt-2">P(L_t+1) = P(L_t|obs) + (1 – P(L_t|obs)) × P(T)</div>
                        <div className="mt-2 text-white/30">R(t) = P(L) × e^(-Δt / S_m)</div>
                      </div>
                    </div>
                  )}

                  {i === 0 && (
                    <div className="mt-6 p-4 rounded-lg bg-black/40 border border-white/[0.06] font-mono text-xs">
                      <div className="text-white/30 mb-2 text-[10px] uppercase tracking-wider">MCI Formula</div>
                      <div className="text-[#00F0FF]/70 space-y-1">
                        <div>MCI = (testScore × 0.40)</div>
                        <div>{'     '} + (vivaScore  × 0.50)</div>
                        <div>{'     '} – (pasteRisk  × 0.05)</div>
                        <div>{'     '} – (burstRisk  × 0.05)</div>
                        <div className="mt-1 text-white/30">MCI ∈ [0, 100]</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="section-label text-center">Built On Pure Engineering</p>
          <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-4">
            The Strict{' '}
            <span className="gradient-text">MERN Foundation</span>
          </h2>
          <p className="text-sm text-white/40 text-center mb-12 max-w-md mx-auto">
            No Python. No Go. No microservices. Every subsystem lives within the MERN boundary — by design, not by accident.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {STACK_ITEMS.map(({ label, sublabel, color, icon }) => (
              <div
                key={label}
                className="card-glass-hover p-4 flex flex-col items-center gap-2.5 text-center"
              >
                <span className="text-2xl">{icon}</span>
                <div>
                  <div className="text-sm font-bold text-white">{label}</div>
                  <div className="text-[10px] text-white/30 font-mono mt-0.5">{sublabel}</div>
                </div>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
                />
              </div>
            ))}
          </div>

          {/* Architecture note */}
          <div className="card-glass p-6 border border-[#6366F1]/15">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-[#6366F1]/10 text-[#6366F1] shrink-0">
                <Shield size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Architectural Constraint by Design</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  CogniTrace is constrained to pure MERN not because of tradition, but because
                  every capability — AST parsing, sandboxed execution, Bayesian tracing, and
                  LLM orchestration — can be delivered from a single Node.js runtime.
                  Adding Python microservices would introduce network latency on the critical
                  60-second viva path. Simplicity is a security feature.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            Ready to Verify What You Actually Know?
          </h2>
          <p className="text-base text-white/40 mb-8 leading-relaxed">
            Join students who care about real understanding — not certificate collection.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register" className="btn-primary px-8 py-3">
              <Zap size={15} />
              Launch the Lab
              <ArrowRight size={14} />
            </Link>
            <Link to="/" className="btn-ghost px-8 py-3">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}


