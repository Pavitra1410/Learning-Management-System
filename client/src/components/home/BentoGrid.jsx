import { useState, useEffect, useRef } from 'react';
import {
  GitBranch, Cpu, Activity, BarChart3,
  ChevronRight, Check, X, Zap, ArrowDownRight
} from 'lucide-react';

// ── Card 1: AST Validator ────────────────────────────────────────────────────
function ASTCard() {
  const [step, setStep] = useState(0);
  const violations = [
    { line: 4, token: '.sort()', rule: 'ForbiddenMethodCall', status: 'REJECTED' },
    { line: 7, token: 'eval()', rule: 'ForbiddenNodeType', status: 'REJECTED' },
  ];

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % (violations.length + 2)), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="bg-black/50 rounded-lg border border-white/[0.06] p-3 font-mono text-xs flex-1">
        {[
          { n: 1, code: 'function sort(arr) {', ok: true },
          { n: 2, code: '  // student solution', ok: true },
          { n: 3, code: '  const sorted =', ok: true },
          { n: 4, code: '    arr.sort((a,b) => a-b)', ok: false },
          { n: 5, code: '  return sorted;', ok: true },
          { n: 6, code: '  // bonus attempt', ok: true },
          { n: 7, code: '  eval(userInput)', ok: false },
          { n: 8, code: '}', ok: true },
        ].map(({ n, code, ok }) => (
          <div key={n}
            className={`flex gap-2.5 px-1.5 py-0.5 rounded transition-all duration-300
              ${!ok && step >= n - 3 ? 'bg-rose-500/10 border-l-2 border-rose-500/60 -mx-1.5 px-2' : ''}`}
          >
            <span className="text-white/20 w-4 shrink-0">{n}</span>
            <span className={ok ? 'text-slate-400' : 'text-rose-300/80'}>{code}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        {violations.map((v, i) => (
          <div key={i}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-md transition-all duration-500
              ${step >= i + 1
                ? 'bg-rose-500/8 border border-rose-500/20 opacity-100'
                : 'opacity-0 translate-y-1'
              }`}
          >
            <X size={11} className="text-rose-400 shrink-0" />
            <span className="text-[10px] font-mono text-rose-400/80">
              Line {v.line}: <span className="text-rose-300">{v.token}</span> — {v.rule}
            </span>
            <span className="ml-auto text-[9px] font-mono text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">
              {v.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Card 2: DAG Back-tracer ──────────────────────────────────────────────────
const dagNodes = [
  { id: 'react-hooks', label: 'React Hooks', x: 140, y: 10, status: 'failed' },
  { id: 'closures', label: 'Closures', x: 70, y: 75, status: 'gap' },
  { id: 'promises', label: 'Promises', x: 215, y: 75, status: 'ok' },
  { id: 'scope', label: 'Scope', x: 30, y: 140, status: 'gap' },
  { id: 'functions', label: 'Functions', x: 120, y: 140, status: 'partial' },
  { id: 'variables', label: 'Variables', x: 75, y: 205, status: 'ok' },
];
const dagEdges = [
  ['react-hooks', 'closures'], ['react-hooks', 'promises'],
  ['closures', 'scope'], ['closures', 'functions'],
  ['scope', 'variables'], ['functions', 'variables'],
];
const nodeColor = { failed: '#EF4444', gap: '#F59E0B', partial: '#6366F1', ok: '#10B981' };

function DAGCard() {
  const [activeNode, setActiveNode] = useState(null);
  const [traceStep, setTraceStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTraceStep(s => (s + 1) % (dagEdges.length + 1)), 600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex-1 relative bg-black/30 rounded-lg border border-white/[0.06] overflow-hidden min-h-[230px]">
        <svg width="100%" height="100%" viewBox="0 0 280 250" className="absolute inset-0">
          {dagEdges.map(([from, to], i) => {
            const s = dagNodes.find(n => n.id === from);
            const t = dagNodes.find(n => n.id === to);
            const isActive = i < traceStep;
            const isGap = nodeColor[t.status] === nodeColor.gap || nodeColor[s.status] === nodeColor.failed;
            return (
              <line key={i}
                x1={s.x + 32} y1={s.y + 14}
                x2={t.x + 32} y2={t.y + 14}
                stroke={isActive ? (isGap ? '#F59E0B' : '#6366F1') : 'rgba(255,255,255,0.06)'}
                strokeWidth={isActive ? 1.5 : 1}
                strokeDasharray={isActive && isGap ? '4 2' : 'none'}
                className="transition-all duration-400"
              />
            );
          })}
          {dagNodes.map(node => (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}
               style={{ cursor: 'pointer' }} onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}>
              <rect width="64" height="26" rx="5"
                fill={`${nodeColor[node.status]}15`}
                stroke={activeNode === node.id ? nodeColor[node.status] : `${nodeColor[node.status]}40`}
                strokeWidth={activeNode === node.id ? 1.5 : 1}
              />
              <text x="32" y="17" textAnchor="middle" fontSize="8" fill={nodeColor[node.status]} fontFamily="JetBrains Mono, monospace">
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend & back-trace result */}
      <div className="flex items-center gap-3 text-[10px] font-mono flex-wrap">
        {[['failed', 'Failed'], ['gap', 'Gap Found'], ['partial', 'Partial'], ['ok', 'Mastered']].map(([k, l]) => (
          <span key={k} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: nodeColor[k] }} />
            <span className="text-white/40">{l}</span>
          </span>
        ))}
      </div>
      <div className="px-2.5 py-2 rounded-md bg-amber-500/8 border border-amber-500/20 text-[10px] font-mono text-amber-400">
        <ArrowDownRight size={10} className="inline mr-1" />
        Root cause: <span className="text-amber-300">Scope</span> → back-traced via Closures → React Hooks
      </div>
    </div>
  );
}

// ── Card 3: Keystroke Telemetry ──────────────────────────────────────────────
const IKI_DATA = [
  { t: '0ms', h: 5, suspicious: true },
  { t: '8ms', h: 8, suspicious: true },
  { t: '12ms', h: 6, suspicious: true },
  { t: '45ms', h: 2, suspicious: false },
  { t: '130ms', h: 9, suspicious: false },
  { t: '210ms', h: 7, suspicious: false },
  { t: '340ms', h: 5, suspicious: false },
];

function TelemetryCard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(s => s + 1), 800);
    return () => clearInterval(t);
  }, []);

  const pasteCount = 3;
  const burstEvents = 2;

  return (
    <div className="h-full flex flex-col gap-3">
      {/* IKI histogram */}
      <div className="flex-1 bg-black/30 rounded-lg border border-white/[0.06] p-3">
        <div className="text-[9px] font-mono text-white/30 mb-3 uppercase tracking-wider">
          Inter-Keystroke Interval Distribution
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {IKI_DATA.map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t transition-all duration-700
                  ${bar.suspicious
                    ? 'bg-rose-500/70 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                    : 'bg-[#6366F1]/60'
                  }`}
                style={{ height: `${(bar.h / 10) * 100}%` }}
              />
              <span className="text-[7px] font-mono text-white/25 rotate-0">{bar.t}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-3 text-[9px] font-mono">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-rose-500/70" />Suspicious burst</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#6366F1]/60" />Normal typing</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Paste Events', value: pasteCount, color: 'text-rose-400', bg: 'bg-rose-500/8 border-rose-500/20' },
          { label: 'Burst Events', value: burstEvents, color: 'text-amber-400', bg: 'bg-amber-500/8 border-amber-500/20' },
          { label: 'IKI < 20ms', value: `${Math.round(3 / 7 * 100)}%`, color: 'text-rose-400', bg: 'bg-rose-500/8 border-rose-500/20' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`p-2 rounded-md border ${bg} text-center`}>
            <div className={`text-base font-bold font-mono ${color}`}>{value}</div>
            <div className="text-[8px] text-white/30 mt-0.5 leading-tight">{label}</div>
          </div>
        ))}
      </div>

      <div className="px-2.5 py-1.5 rounded-md bg-rose-500/8 border border-rose-500/20 text-[10px] font-mono text-rose-400">
        ⚡ 200ms clipboard dump detected · Viva gate triggered
      </div>
    </div>
  );
}

// ── Card 4: Illusion Matrix ──────────────────────────────────────────────────
const MATRIX_DATA = [
  { name: 'Alice', test: 92, mci: 88, color: '#10B981', quad: 'Genuine Mastery' },
  { name: 'Bob', test: 100, mci: 22, color: '#EF4444', quad: 'Copy-Paster' },
  { name: 'Carlos', test: 38, mci: 35, color: '#F59E0B', quad: 'Struggling' },
  { name: 'Diana', test: 75, mci: 71, color: '#6366F1', quad: 'Genuine Mastery' },
  { name: 'Eve', test: 88, mci: 18, color: '#EF4444', quad: 'Copy-Paster' },
];

function IllusionCard() {
  const [hovered, setHovered] = useState(null);
  const W = 200, H = 160;

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex-1 bg-black/30 rounded-lg border border-white/[0.06] p-3 relative overflow-hidden min-h-[200px]">
        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
          {/* Quadrant lines */}
          <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          {/* Axis labels */}
          <text x={W / 2} y={H - 2} textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.2)" fontFamily="monospace">Test Score →</text>
          <text x="4" y={H / 2} fontSize="7" fill="rgba(255,255,255,0.2)" fontFamily="monospace" transform={`rotate(-90,4,${H/2})`}>MCI →</text>

          {/* Quadrant labels */}
          <text x={W * 0.75} y="14" textAnchor="middle" fontSize="6.5" fill="rgba(16,185,129,0.5)" fontFamily="monospace">Genuine Mastery</text>
          <text x={W * 0.25} y="14" textAnchor="middle" fontSize="6.5" fill="rgba(239,68,68,0.5)" fontFamily="monospace">Copy-Paster</text>
          <text x={W * 0.25} y={H - 6} textAnchor="middle" fontSize="6.5" fill="rgba(245,158,11,0.5)" fontFamily="monospace">Struggling</text>
          <text x={W * 0.75} y={H - 6} textAnchor="middle" fontSize="6.5" fill="rgba(99,102,241,0.5)" fontFamily="monospace">Lucky Guesser</text>

          {/* Data points */}
          {MATRIX_DATA.map(d => {
            const cx = (d.test / 100) * (W - 20) + 10;
            const cy = H - (d.mci / 100) * (H - 20) - 10;
            return (
              <g key={d.name} onMouseEnter={() => setHovered(d)} onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}>
                <circle cx={cx} cy={cy} r={hovered?.name === d.name ? 6 : 4}
                  fill={`${d.color}30`} stroke={d.color} strokeWidth="1.5"
                  className="transition-all duration-200"
                />
                <text x={cx + 7} y={cy + 3} fontSize="7" fill={d.color} fontFamily="monospace">{d.name}</text>
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hovered && (
          <div className="absolute top-2 right-2 px-2.5 py-2 rounded-md bg-[#0A0D14]/90
                          border border-white/10 text-[9px] font-mono backdrop-blur-sm">
            <div className="text-white font-bold">{hovered.name}</div>
            <div className="text-white/50">Test: {hovered.test}%</div>
            <div className="text-white/50">MCI: {hovered.mci}</div>
            <div style={{ color: hovered.color }}>{hovered.quad}</div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 text-[9px] font-mono">
        {MATRIX_DATA.map(d => (
          <span key={d.name} className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.color }} />
            <span className="text-white/50">{d.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Bento Grid ───────────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: 'ast',
    icon: Cpu,
    label: '01 · AST',
    title: 'Abstract Syntax Tree Validation',
    desc: 'Babel traverses every submission. Forbidden tokens, banned libraries, and structural shortcuts are rejected at the compiler level before test execution.',
    component: ASTCard,
    span: 'md:col-span-1',
    accentColor: 'text-rose-400',
    accentBg: 'bg-rose-500/8 border-rose-500/20',
  },
  {
    id: 'dag',
    icon: GitBranch,
    label: '02 · DAG',
    title: 'Directed Acyclic Concept Graphs',
    desc: 'Concept failures are recursively back-traced through prerequisite edges to isolate root-cause learning deficits — not just surface symptoms.',
    component: DAGCard,
    span: 'md:col-span-1',
    accentColor: 'text-amber-400',
    accentBg: 'bg-amber-500/8 border-amber-500/20',
  },
  {
    id: 'telemetry',
    icon: Activity,
    label: '03 · Telemetry',
    title: 'Keystroke Telemetry Engine',
    desc: 'Inter-keystroke interval histograms distinguish genuine human coding from 200ms clipboard dumps. Burst events and IKI outliers trigger automatic viva gating.',
    component: TelemetryCard,
    span: 'md:col-span-1',
    accentColor: 'text-[#00F0FF]',
    accentBg: 'bg-[#00F0FF]/8 border-[#00F0FF]/20',
  },
  {
    id: 'illusion',
    icon: BarChart3,
    label: '04 · Intelligence Matrix',
    title: 'Illusion of Competence Matrix',
    desc: 'A 4-quadrant scatter plot maps raw test scores vs. Socratic defense reasoning scores — instantly revealing AI copy-pasters vs. genuine learners.',
    component: IllusionCard,
    span: 'md:col-span-1',
    accentColor: 'text-[#6366F1]',
    accentBg: 'bg-[#6366F1]/8 border-[#6366F1]/20',
  },
];

export default function BentoGrid() {
  return (
    <section className="relative py-24 px-4" id="dag">
      <div className="absolute inset-0 bg-cyan-glow pointer-events-none opacity-50" />
      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="section-label">Core Engine Subsystems</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Why We Don't Build{' '}
            <span className="gradient-text">Boring LMSs</span>
          </h2>
          <p className="text-base text-white/40 max-w-xl mx-auto leading-relaxed">
            Four integrated subsystems that collectively prove cognitive authenticity —
            not just test pass rates.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {FEATURES.map(({ id, icon: Icon, label, title, desc, component: CardComponent, span, accentColor, accentBg }) => (
            <div
              key={id}
              className={`card-glass-hover p-5 flex flex-col gap-4 ${span} group`}
            >
              {/* Card header */}
              <div className="flex items-start justify-between">
                <div className={`px-2 py-1 rounded-md border text-[10px] font-mono ${accentBg} ${accentColor}`}>
                  {label}
                </div>
                <div className={`p-2 rounded-lg bg-white/[0.04] ${accentColor} opacity-60 group-hover:opacity-100 transition-opacity`}>
                  <Icon size={15} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
              </div>

              {/* Interactive component */}
              <div className="flex-1 min-h-0">
                <CardComponent />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
