import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BrainCircuit,
  BookOpen,
  LayoutDashboard,
  FileText,
  Video,
  Info,
  LogOut,
  Library,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: BrainCircuit },
    { label: 'Courses', path: '/courses', icon: BookOpen },
    { label: 'Blogs', path: '/blogs', icon: FileText },
    { label: 'Webinars', path: '/webinars', icon: Video },
    { label: 'eBooks Library', path: '/library', icon: Library },
    { label: 'About', path: '/about', icon: Info },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'teacher') return '/teacher';
    return '/student';
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#111827]/95 border-b border-slate-800 text-white shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3.5">
        
        {/* Brand Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300 border border-indigo-400/30">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
              Learnova
            </span>
            <span className="text-[9px] font-mono font-bold tracking-widest text-indigo-400 uppercase leading-none mt-0.5">
              LEARNING MANAGEMENT SYSTEM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Floating Container */}
        <nav className="hidden xl:flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-full border border-slate-700/80 shadow-inner">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-600/40 text-white shadow-sm border border-indigo-500/50 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Medium Screen Nav fallback */}
        <nav className="hidden lg:flex xl:hidden items-center gap-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-semibold transition-colors ${
                  isActive ? 'text-indigo-400 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls / Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={getDashboardPath()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-4 py-2 text-xs flex items-center gap-2 shadow-md shadow-indigo-600/30 transition-all border border-indigo-500/40"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-mono uppercase font-bold">
                  {user.role}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700/80 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-4 py-2 rounded-xl border border-slate-700/80 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl shadow-md shadow-indigo-600/30 transition-all border border-indigo-500/40"
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 shadow-sm"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 space-y-3 bg-[#111827] border-b border-slate-800 shadow-2xl rounded-b-3xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-indigo-600/40 text-white border border-indigo-500/50 font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {user ? (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                <span>Go to Dashboard ({user.role})</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-center py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 flex items-center gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
