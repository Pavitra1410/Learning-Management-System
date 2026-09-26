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
  Video
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
    <aside className="w-64 bg-white border-r border-slate-200/90 shrink-0 hidden md:block min-h-[calc(100vh-4rem)] p-4 shadow-sm">
      <div className="mb-6 px-3 py-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
          {user.name.charAt(0)}
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-bold text-slate-900 truncate">{user.name}</h4>
          <p className="text-[11px] text-indigo-600 capitalize font-mono font-medium">{user.role} Account</p>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (location.pathname + location.hash) === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/80 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
