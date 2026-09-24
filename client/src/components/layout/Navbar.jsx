import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Menu, X, BookOpen, Network, FlaskConical, LogOut, User as UserIcon } from 'lucide-react';
import { authApi } from '../../services/api';

const navLinks = [
  { to: '/about', label: 'Manifesto', icon: BookOpen },
  { to: '/#how-it-works', label: 'How It Works', icon: Zap },
  { to: '/#dag', label: 'Knowledge DAG', icon: Network },
  { to: '/#sandbox', label: 'Sandbox', icon: FlaskConical },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(() => authApi.getCurrentUser());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled
          ? 'backdrop-blur-md bg-[#0A0D14]/80 border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]'
          : 'bg-transparent border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Animated node logo */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#00F0FF] opacity-20 group-hover:opacity-35 transition-opacity duration-300" />
              <div className="absolute w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-glow-pulse" />
              <div className="absolute w-5 h-5 rounded-full border border-[#00F0FF]/20 animate-ping opacity-30" />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight text-[15px]">
                Cogni<span className="gradient-text">Trace</span>
              </span>
              <div className="text-[9px] font-mono text-white/30 -mt-0.5 tracking-widest uppercase">
                v1.0 · Cognitive Verification
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-3 py-2 text-sm text-white/50 hover:text-white/90
                           rounded-md hover:bg-white/[0.04] transition-all duration-200 font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                  <UserIcon size={14} className="text-[#00F0FF]" />
                  <span className="text-xs text-white/80 font-medium">{user.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50 uppercase tracking-wider">{user.role}</span>
                </div>
                <button onClick={handleLogout} className="btn-ghost text-sm px-3 py-2 text-rose-400 hover:text-rose-300">
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm px-4 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  <Zap size={14} />
                  Launch Lab
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden p-2 rounded-md text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0A0D14]/95 backdrop-blur-md">
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm
                           text-white/60 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                <Icon size={15} className="text-[#00F0FF]/60" />
                {label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/[0.06] flex flex-col gap-2 mt-2">
              {user ? (
                <>
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.04]">
                    <span className="text-xs text-white/80">{user.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50 uppercase">{user.role}</span>
                  </div>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn-ghost justify-center text-rose-400">
                    <LogOut size={14} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost justify-center">Sign In</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary justify-center">
                    <Zap size={14} /> Launch Lab
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
