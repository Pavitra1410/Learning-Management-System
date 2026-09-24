import { Link } from 'react-router-dom';
import { Code2, CheckCircle2 } from 'lucide-react';

const footerLinks = [
  { label: 'Manifesto', to: '/about' },
  { label: 'How It Works', to: '/#how-it-works' },
  { label: 'Knowledge DAG', to: '/#dag' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0A0D14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand col */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[#6366F1] to-[#00F0FF] opacity-20" />
                <div className="w-2 h-2 rounded-full bg-[#00F0FF]" />
              </div>
              <span className="font-bold text-white text-sm">
                Cogni<span className="gradient-text">Trace</span>
              </span>
            </Link>
            <p className="text-white/40 text-xs leading-relaxed max-w-[220px]">
              Cognitive verification infrastructure for the post-AI assessment era.
            </p>
          </div>

          {/* Links col */}
          <div>
            <p className="section-label">Navigation</p>
            <div className="flex flex-col gap-2">
              {footerLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm text-white/40 hover:text-white/80 transition-colors w-fit"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Status col */}
          <div>
            <p className="section-label">System Status</p>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <CheckCircle2 size={12} className="text-emerald-400" />
                All Verification Nodes Operational
              </span>
            </div>

            {/* DAG node mini visual */}
            <div className="flex items-center gap-1 mb-5">
              {['AST', 'BKT', 'VIVA', 'DAG'].map((label, i) => (
                <div key={label} className="flex items-center gap-1">
                  <div className="px-2 py-0.5 rounded text-[9px] font-mono
                                  bg-[#101522] border border-[#00F0FF]/15 text-[#00F0FF]/70">
                    {label}
                  </div>
                  {i < 3 && <div className="w-3 h-px bg-[#00F0FF]/20" />}
                </div>
              ))}
            </div>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors w-fit"
            >
              <Code2 size={14} />
              View on GitHub
            </a>
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row
                        items-center justify-between gap-3">
          <p className="text-xs text-white/25 font-mono">
            © 2026 CogniTrace. Built on pure MERN engineering.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
            <span className="text-xs font-mono text-white/25">
              AST · BKT · Socratic Viva
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
