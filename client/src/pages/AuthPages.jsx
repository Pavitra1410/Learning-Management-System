import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, GitBranch, Globe2, Zap, ArrowRight,
  GraduationCap, Users, ShieldCheck, Brain,
  Check, AlertCircle
} from 'lucide-react';

// ── Animated left panel ──────────────────────────────────────────────────────
const TERMINAL_LOGS = [
  { ts: '07:14:02', msg: '[AUTH] Initializing Keystroke Telemetry...', color: 'text-[#00F0FF]/70' },
  { ts: '07:14:02', msg: '[DAG] Concept Nodes Loaded: 20', color: 'text-[#6366F1]/80' },
  { ts: '07:14:03', msg: '[BKT] Prior probabilities initialized', color: 'text-emerald-400/70' },
  { ts: '07:14:03', msg: '[AST] Babel parser armed — Forbidden: .sort()', color: 'text-amber-400/70' },
  { ts: '07:14:04', msg: '[VIVA] Socratic gateway: ARMED', color: 'text-emerald-400/70' },
  { ts: '07:14:04', msg: '[SYS] Session telemetry recording...', color: 'text-[#00F0FF]/50' },
  { ts: '07:14:05', msg: '✓ Ready. Awaiting cognitive verification.', color: 'text-white/50' },
];

const GRAPH_NODES = [
  { id: 'vars', label: 'Variables', x: 40, y: 55, level: 0, active: true },
  { id: 'funcs', label: 'Functions', x: 120, y: 35, level: 1, active: true },
  { id: 'scope', label: 'Scope', x: 200, y: 55, level: 2, active: true },
  { id: 'closures', label: 'Closures', x: 160, y: 120, level: 3, active: false },
  { id: 'promises', label: 'Promises', x: 80, y: 140, level: 3, active: false },
  { id: 'hooks', label: 'React Hooks', x: 200, y: 185, level: 4, active: false },
];
const GRAPH_EDGES = [
  ['vars', 'funcs'], ['funcs', 'scope'], ['scope', 'closures'],
  ['funcs', 'promises'], ['closures', 'hooks'],
];

function AuthLeftPanel({ mode }) {
  const [logIndex, setLogIndex] = useState(0);
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setLogIndex(i => Math.min(i + 1, TERMINAL_LOGS.length - 1)), 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveNode(i => (i + 1) % GRAPH_NODES.length), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-full flex flex-col justify-between p-8 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/15 via-transparent to-[#00F0FF]/8" />

      {/* Brand */}
      <div className="relative z-10">
        <Link to="/" className="flex items-center gap-3 mb-8 group w-fit">
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#00F0FF] opacity-25" />
            <div className="w-3 h-3 rounded-full bg-[#00F0FF] shadow-glow-cyan" />
          </div>
          <span className="font-bold text-white text-lg">
            Cogni<span className="gradient-text">Trace</span>
          </span>
        </Link>

        <h2 className="text-2xl font-black text-white mb-2">
          {mode === 'login' ? 'Welcome back.' : 'Begin your verification.'}
        </h2>
        <p className="text-sm text-white/40 leading-relaxed max-w-xs">
          {mode === 'login'
            ? 'Your cognitive twin resumes where you left off. Mastery states preserved.'
            : 'Your learning journey is tracked longitudinally. Not just by scores — by understanding.'
          }
        </p>
      </div>

      {/* Concept graph SVG */}
      <div className="relative z-10">
        <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-3">
          Concept DAG — Live State
        </p>
        <div className="bg-black/30 rounded-xl border border-white/[0.06] p-4 overflow-hidden">
          <svg viewBox="0 0 260 230" className="w-full">
            {GRAPH_EDGES.map(([from, to], i) => {
              const s = GRAPH_NODES.find(n => n.id === from);
              const t = GRAPH_NODES.find(n => n.id === to);
              return (
                <line key={i}
                  x1={s.x + 35} y1={s.y + 13}
                  x2={t.x + 35} y2={t.y + 13}
                  stroke={activeNode >= GRAPH_NODES.indexOf(t) ? '#6366F1' : 'rgba(255,255,255,0.06)'}
                  strokeWidth="1.5"
                  strokeDasharray={activeNode >= GRAPH_NODES.indexOf(t) ? 'none' : '4 3'}
                  className="transition-all duration-500"
                />
              );
            })}
            {GRAPH_NODES.map((node, i) => {
              const isActive = i <= activeNode;
              const isCurrent = i === activeNode;
              return (
                <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                  {isCurrent && (
                    <rect x="-2" y="-2" width="74" height="30" rx="8"
                      fill="rgba(0,240,255,0.05)"
                      stroke="rgba(0,240,255,0.3)"
                      strokeWidth="1"
                      className="animate-pulse-slow"
                    />
                  )}
                  <rect width="70" height="26" rx="6"
                    fill={isActive ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)'}
                    stroke={isActive ? (isCurrent ? '#00F0FF' : '#6366F1') : 'rgba(255,255,255,0.06)'}
                    strokeWidth={isCurrent ? 1.5 : 1}
                    className="transition-all duration-500"
                  />
                  <text x="35" y="17" textAnchor="middle" fontSize="8"
                    fill={isActive ? (isCurrent ? '#00F0FF' : '#A5B4FC') : 'rgba(255,255,255,0.25)'}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Terminal logs */}
      <div className="relative z-10">
        <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-2">
          System Initialization
        </p>
        <div className="bg-black/40 rounded-lg border border-white/[0.06] p-3 space-y-1 font-mono text-[10px] max-h-32 overflow-hidden">
          {TERMINAL_LOGS.slice(0, logIndex + 1).map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-white/20 shrink-0">{log.ts}</span>
              <span className={log.color}>{log.msg}</span>
            </div>
          ))}
          {logIndex < TERMINAL_LOGS.length - 1 && (
            <div className="flex gap-2">
              <span className="text-white/20">......</span>
              <span className="w-1.5 h-3 bg-[#00F0FF]/60 animate-blink" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Role Switcher ─────────────────────────────────────────────────────────────
const ROLES = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'teacher', label: 'Teacher', icon: Users },
  { id: 'reviewer', label: 'Reviewer', icon: ShieldCheck },
];

// ── Shared form ──────────────────────────────────────────────────────────────
function AuthForm({ mode }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isLogin = mode === 'login';

  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setErrors({});
    await new Promise(r => setTimeout(r, 1200)); // simulate API
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => navigate('/'), 800);
  };

  const renderField = (name, placeholder, type = 'text', Icon = null) => (
    <div key={name}>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25">
            <Icon size={14} />
          </div>
        )}
        <input
          type={name === 'password' ? (showPass ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={form[name]}
          onChange={e => {
            setForm(f => ({ ...f, [name]: e.target.value }));
            if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
          }}
          className={`input-field ${Icon ? 'pl-9' : ''} ${name === 'password' ? 'pr-10' : ''}
            ${errors[name] ? 'border-rose-500/50 focus:border-rose-500/70 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]' : ''}`}
        />
        {name === 'password' && (
          <button type="button" onClick={() => setShowPass(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {errors[name] && (
        <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
          <AlertCircle size={11} /> {errors[name]}
        </p>
      )}
    </div>
  );

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
          <Check size={28} className="text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1">
            {isLogin ? 'Session Restored' : 'Verification Active'}
          </h3>
          <p className="text-sm text-white/40">Redirecting to your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center p-8 lg:p-12">
      {/* Header */}
      <div className="mb-8">
        <p className="section-label">
          {isLogin ? 'Authentication' : 'Create Account'}
        </p>
        <h1 className="text-2xl font-black text-white mb-2">
          {isLogin ? 'Sign in to CogniTrace' : 'Start verifying your knowledge'}
        </h1>
        <p className="text-sm text-white/40">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link
            to={isLogin ? '/register' : '/login'}
            className="text-[#6366F1] hover:text-[#818CF8] font-medium transition-colors"
          >
            {isLogin ? 'Create one' : 'Sign in'}
          </Link>
        </p>
      </div>

      {/* Role switcher */}
      <div className="flex p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6">
        {ROLES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setRole(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
                        transition-all duration-200
                        ${role === id
                          ? 'bg-[#101522] text-white border border-white/10 shadow-card'
                          : 'text-white/35 hover:text-white/60'
                        }`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {/* Social auth */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: GitBranch, label: 'GitHub' },
          { icon: Globe2, label: 'Google' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                       bg-white/[0.04] border border-white/[0.08] hover:border-white/15
                       hover:bg-white/[0.07] text-sm text-white/70 hover:text-white
                       transition-all duration-200 font-medium"
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-xs text-white/25 font-mono">or continue with email</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* Form fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          renderField('name', 'Full name')
        )}
        {renderField('email', 'Email address', 'email')}
        {renderField('password', 'Password (min 8 chars)')}

        {isLogin && (
          <div className="flex justify-end">
            <Link to="/forgot-password"
              className="text-xs text-white/35 hover:text-white/60 transition-colors">
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center text-sm py-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
              {isLogin ? 'Authenticating...' : 'Creating profile...'}
            </>
          ) : (
            <>
              <Zap size={15} />
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      {/* Role disclaimer */}
      <p className="mt-6 text-[10px] text-white/20 text-center font-mono leading-relaxed">
        {role === 'student' && 'Keystroke telemetry is active during all assessments.'}
        {role === 'teacher' && 'You will have access to cohort intelligence dashboards.'}
        {role === 'reviewer' && 'Full administrative access to all student cognitive profiles.'}
      </p>
    </div>
  );
}

// ── Exported pages ───────────────────────────────────────────────────────────
export function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0D14] flex">
      {/* Left panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] border-r border-white/[0.06]">
        <AuthLeftPanel mode="login" />
      </div>
      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-md">
          <AuthForm mode="login" />
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0A0D14] flex">
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] border-r border-white/[0.06]">
        <AuthLeftPanel mode="register" />
      </div>
      <div className="flex-1 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-md">
          <AuthForm mode="register" />
        </div>
      </div>
    </div>
  );
}
