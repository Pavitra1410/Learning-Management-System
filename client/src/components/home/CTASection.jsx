import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Users, GraduationCap } from 'lucide-react';

const TERMINAL_LINES = [
  { prefix: '$', text: 'cognitrace init --mode=verification', color: 'text-white/60' },
  { prefix: '>', text: 'Loading concept DAG... 20 nodes resolved', color: 'text-[#00F0FF]/70' },
  { prefix: '>', text: 'AST validator online — Babel 7.24', color: 'text-[#00F0FF]/70' },
  { prefix: '>', text: 'BKT engine initialized — p_know: 0.10', color: 'text-[#6366F1]/80' },
  { prefix: '>', text: 'Socratic viva gateway: ARMED', color: 'text-emerald-400/80' },
  { prefix: '$', text: 'Ready. Start your assessment.', color: 'text-white/50' },
];

const PERSONAS = [
  {
    icon: GraduationCap,
    role: 'Students',
    headline: 'Prove What You Actually Know',
    desc: "Your grade reflects genuine understanding — not your ability to prompt ChatGPT. Mastery is tracked longitudinally through Bayesian probability.",
    cta: 'Start Learning',
    to: '/register',
    color: 'text-[#00F0FF]',
    borderColor: 'border-[#00F0FF]/20 hover:border-[#00F0FF]/40',
    glowColor: 'hover:shadow-glow-cyan',
  },
  {
    icon: Users,
    role: 'Instructors',
    headline: 'See Through the Illusion',
    desc: 'The 4-quadrant Intelligence Matrix instantly identifies AI copy-pasters vs. genuine learners in your cohort. No manual marking required.',
    cta: 'Teacher Dashboard',
    to: '/register?role=teacher',
    color: 'text-[#6366F1]',
    borderColor: 'border-[#6366F1]/20 hover:border-[#6366F1]/40',
    glowColor: 'hover:shadow-glow-indigo',
  },
];

export default function CTASection() {
  return (
    <section className="py-24 px-4" id="sandbox">
      <div className="max-w-5xl mx-auto">
        {/* Terminal banner */}
        <div className="card-glass overflow-hidden mb-8">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <div className="flex items-center gap-1.5 ml-2">
              <Terminal size={12} className="text-[#00F0FF]/60" />
              <span className="text-xs font-mono text-white/30">cognitrace — zsh</span>
            </div>
          </div>
          <div className="p-5 space-y-2">
            {TERMINAL_LINES.map((line, i) => (
              <div key={i} className="flex gap-3 font-mono text-sm">
                <span className="text-[#6366F1]/60 shrink-0">{line.prefix}</span>
                <span className={line.color}>{line.text}</span>
                {i === TERMINAL_LINES.length - 1 && (
                  <span className="w-2 h-4 bg-[#00F0FF]/60 animate-blink ml-0.5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA headline */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Benchmark Your{' '}
            <span className="gradient-text">Actual Understanding</span>
          </h2>
          <p className="text-base text-white/40 max-w-lg mx-auto">
            No tutorial completion certificates. No ChatGPT workarounds.
            Just provable, time-stable, cognitive mastery.
          </p>
        </div>

        {/* Persona cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {PERSONAS.map(({ icon: Icon, role, headline, desc, cta, to, color, borderColor, glowColor }) => (
            <div
              key={role}
              className={`card-glass p-6 border ${borderColor} ${glowColor} transition-all duration-300 flex flex-col gap-4`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] ${color}`}>
                <Icon size={18} />
              </div>
              <div>
                <div className={`text-xs font-mono ${color} mb-1 opacity-70`}>{role}</div>
                <h3 className="text-lg font-bold text-white mb-2">{headline}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
              </div>
              <Link to={to} className={`btn-primary mt-auto w-full justify-center text-sm ${
                color.includes('6366F1') ? 'from-[#6366F1] to-[#818CF8]' : ''
              }`}>
                {cta}
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
