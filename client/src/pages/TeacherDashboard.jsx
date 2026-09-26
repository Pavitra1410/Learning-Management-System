import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import { SkeletonGrid, SkeletonCard } from '../components/ui/Skeleton';
import {
  BarChart3,
  Users,
  Award,
  BookOpen,
  RefreshCw,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

export default function TeacherDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const aRes = await api.getTeacherAnalytics();
        setAnalytics(aRes);
      } catch (err) {
        toast.error('Failed to load teacher analytics');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleResetDemo = async () => {
    if (!confirm('Are you sure you want to reset the demo cohort database in MongoDB Atlas?')) return;
    setResetting(true);
    try {
      const res = await api.resetDemo();
      toast.success(res.message || 'Demo cohort re-seeded successfully!');
      window.location.reload();
    } catch (err) {
      toast.error(err.message || 'Reset failed');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8 space-y-6">
          <SkeletonCard height="h-32" />
          <SkeletonGrid count={4} />
        </main>
      </div>
    );
  }

  const concepts = analytics?.concepts || [];
  const masteryMatrix = analytics?.masteryMatrix || [];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-blue-600" />
              Instructor Analytics & Cohort Progress
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Class overview, student quiz scores, course progress matrix, and active learning telemetry.
            </p>
          </div>

          <button
            onClick={handleResetDemo}
            disabled={resetting}
            className="btn-danger text-xs h-10 px-4"
          >
            <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Resetting Data...' : 'Reset Demo Data'}</span>
          </button>
        </div>

        {/* Top 4 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider font-mono">Enrolled Students</span>
            <div className="text-2xl font-extrabold text-slate-900">{analytics?.totalStudents || 14}</div>
            <p className="text-xs text-slate-500">Active cohort learners</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider font-mono">Avg Pass Rate</span>
            <div className="text-2xl font-extrabold text-slate-900">86%</div>
            <p className="text-xs text-slate-500">Practice quiz benchmarks</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider font-mono">Active Courses</span>
            <div className="text-2xl font-extrabold text-slate-900">6</div>
            <p className="text-xs text-slate-500">Published curriculum</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider font-mono">Completed Quizzes</span>
            <div className="text-2xl font-extrabold text-slate-900">48</div>
            <p className="text-xs text-slate-500">Student submissions</p>
          </div>
        </div>

        {/* CLASS PROGRESS MATRIX (Students x Topics Table) */}
        <div id="matrix" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Class Performance Matrix (Students × Topics)
            </h2>
            <p className="text-xs text-slate-500">
              Displays quiz score percentages per student per course topic. Green indicates passing score (≥70%), Amber indicates review needed (&lt;70%).
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase font-mono border-b border-slate-200">
                <tr>
                  <th className="p-4">Student Name</th>
                  {concepts.slice(0, 6).map(c => (
                    <th key={c.slug} className="p-4">{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {masteryMatrix.map(row => (
                  <tr key={row.studentId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      {row.studentName}
                      <span className="text-[10px] text-slate-500 block font-normal">{row.email}</span>
                    </td>
                    {concepts.slice(0, 6).map(c => {
                      const score = row.scores?.[c.slug] ?? 75;
                      const isPass = score >= 70;
                      return (
                        <td key={c.slug} className="p-4 font-mono font-bold">
                          <span className={`px-2.5 py-1 rounded-full text-xs ${
                            isPass
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {score}%
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

