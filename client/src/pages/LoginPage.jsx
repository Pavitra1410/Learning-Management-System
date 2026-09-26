import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrainCircuit, Lock, Mail, ArrowRight, Zap, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const loggedUser = await login({ email, password });
      if (loggedUser.role === 'admin') navigate('/admin');
      else if (loggedUser.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setSubmitting(true);
    try {
      const loggedUser = await login({ email: demoEmail, password: demoPass });
      if (loggedUser.role === 'admin') navigate('/admin');
      else if (loggedUser.role === 'teacher') navigate('/teacher');
      else navigate('/student');
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200/90 rounded-xl shadow-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>← Back</span>
          </button>
        </div>

        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-extrabold text-slate-900">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <span>Learnova LMS</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
          <p className="text-xs text-slate-500">Interactive course progress & assessment dashboard</p>
        </div>

        {/* Demo Quick Account Selectors */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider block flex items-center gap-1.5 font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Single-Click Demo Accounts
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDemoLogin('alice@learnova.edu', 'student123')}
              className="p-2.5 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/80 text-left border border-emerald-200/80 transition-all"
            >
              <strong className="text-emerald-800 block truncate font-semibold">Alice (Learner)</strong>
              <span className="text-[10px] text-emerald-600">High Mastery</span>
            </button>

            <button
              onClick={() => handleDemoLogin('bob@learnova.edu', 'student123')}
              className="p-2.5 rounded-xl bg-amber-50/60 hover:bg-amber-100/80 text-left border border-amber-200/80 transition-all"
            >
              <strong className="text-amber-800 block truncate font-semibold">Bob (Misconception)</strong>
              <span className="text-[10px] text-amber-600">Wrong + High Conf</span>
            </button>

            <button
              onClick={() => handleDemoLogin('teacher@learnova.edu', 'teacher123')}
              className="p-2.5 rounded-xl bg-violet-50/60 hover:bg-violet-100/80 text-left border border-violet-200/80 transition-all"
            >
              <strong className="text-violet-800 block truncate font-semibold">Dr. Vance (Teacher)</strong>
              <span className="text-[10px] text-violet-600">Mastery Matrix</span>
            </button>

            <button
              onClick={() => handleDemoLogin('admin@learnova.edu', 'admin123')}
              className="p-2.5 rounded-xl bg-cyan-50/60 hover:bg-cyan-100/80 text-left border border-cyan-200/80 transition-all"
            >
              <strong className="text-cyan-800 block truncate font-semibold">Platform Admin</strong>
              <span className="text-[10px] text-cyan-600">User Management</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@learnova.edu"
                className="input-field pl-9"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-9"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-3"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}
