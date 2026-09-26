import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  Code2,
  HelpCircle,
  Sparkles,
  BarChart3,
  Users,
  FileQuestion,
  Video,
  Terminal,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const role = user.role;

  const studentLinks = [
    { label: 'Overview', path: '/student', icon: LayoutDashboard },
    { label: 'My Courses', path: '/student/courses', icon: BookOpen },
    { label: 'My Progress', path: '/student/profile', icon: Brain },
    { label: 'Programming Lab', path: '/student/lab', icon: Code2 },
    { label: 'Recommendations', path: '/student/recommendations', icon: Sparkles },
    { label: 'Ask Doubts', path: '/student/doubts', icon: HelpCircle },
  ];

  const teacherLinks = [
    { label: 'Class Analytics', path: '/teacher', icon: LayoutDashboard },
    { label: 'Performance Matrix', path: '/teacher#matrix', icon: BarChart3 },
    { label: 'Course Management', path: '/teacher/courses', icon: BookOpen },
    { label: 'Question Bank', path: '/teacher/questions', icon: FileQuestion },
    { label: 'Student Doubts', path: '/teacher/doubts', icon: HelpCircle },
    { label: 'Blogs & Webinars', path: '/teacher/content', icon: Video },
  ];

  const adminLinks = [
    { label: 'System Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'User Management', path: '/admin#users', icon: Users },
    { label: 'Course Catalog', path: '/admin#courses', icon: BookOpen },
    { label: 'Platform Analytics', path: '/admin#analytics', icon: BarChart3 },
  ];

  const links = role === 'admin' ? adminLinks : role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 shrink-0 hidden md:block min-h-[calc(100vh-4rem)] p-4 shadow-sm text-slate-700">
      
      {/* Student Profile Capsule */}
      <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
            {user.name.charAt(0)}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
        </div>

        <div className="overflow-hidden space-y-0.5">
          <h4 className="text-xs font-bold text-slate-900 truncate">{user.name}</h4>
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-[10px] font-semibold border border-indigo-200">
              Lvl 3 Learner
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (location.pathname + location.hash) === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-50/90 text-indigo-700 font-bold border border-indigo-200/80 shadow-xs border-r-2 border-r-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sandbox Telemetry Box */}
      <div className="mt-8 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 font-mono text-[11px]">
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Terminal className="w-3.5 h-3.5 text-indigo-600" />
            Sandbox
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active 🟢
          </span>
        </div>
        <p className="text-[10px] text-slate-500">Multi-Lang Engine: Node 18, Python 3.10, GCC 10</p>
      </div>

    </aside>
  );
}
