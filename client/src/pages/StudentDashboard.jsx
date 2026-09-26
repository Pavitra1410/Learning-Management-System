import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import { SkeletonGrid, SkeletonCard } from '../components/ui/Skeleton';
import {
  BookOpen,
  Sparkles,
  Award,
  Code2,
  CheckCircle2,
  Clock,
  User,
  ArrowRight
} from 'lucide-react';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [profRes, courseRes, recRes] = await Promise.all([
          api.getStudentProfile(),
          api.getMyCourses(),
          api.getRecommendations(),
        ]);
        setProfile(profRes.profile);
        setEnrolledCourses(courseRes.enrollments || []);
        setRecommendations(recRes.recommendations || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Welcome Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Student Learning Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Track your course progress, interactive lab sessions, and practice quizzes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/student/lab"
              className="btn-primary text-xs h-10 px-5"
            >
              <Code2 className="w-4 h-4" />
              <span>Programming Lab</span>
              <i className="lumen-ring" aria-hidden="true" />
            </Link>

            <Link
              to="/courses"
              className="btn-secondary text-xs h-10 px-5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider font-mono">Enrolled Courses</span>
            <div className="text-2xl font-extrabold text-slate-900">{enrolledCourses.length}</div>
            <p className="text-xs text-slate-500">Active learning modules</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider font-mono">Completed Quizzes</span>
            <div className="text-2xl font-extrabold text-slate-900">4</div>
            <p className="text-xs text-slate-500">Passed assessments</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider font-mono">Average Quiz Score</span>
            <div className="text-2xl font-extrabold text-slate-900">88%</div>
            <p className="text-xs text-slate-500">Across completed topics</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider font-mono">Lab Practice</span>
            <div className="text-2xl font-extrabold text-slate-900">12 hrs</div>
            <p className="text-xs text-slate-500">Hands-on coding time</p>
          </div>
        </div>

        {/* My Enrolled Courses Progress */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">My Enrolled Courses</h2>
              <p className="text-xs text-slate-500 mt-0.5">Continue learning from where you left off</p>
            </div>
            <Link to="/courses" className="text-xs font-semibold text-blue-600 hover:underline">
              View All Courses →
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <p className="text-sm font-semibold text-slate-700">You have not enrolled in any courses yet.</p>
              <Link to="/courses" className="btn-primary inline-flex text-xs h-9 px-4">
                <span>Explore Course Catalog</span>
                <i className="lumen-ring" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {enrolledCourses.map((item) => {
                const course = item.courseId || item;
                const progressPct = item.progressPercentage || 65;

                return (
                  <div key={course._id || item._id} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between text-xs text-blue-600 font-semibold">
                      <span>{course.category || 'Core'}</span>
                      <span className="text-slate-500">{course.level || 'Intermediate'}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{course.title}</h3>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-600 font-medium">
                        <span>Course Progress</span>
                        <span className="font-bold text-blue-600">{progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {course.instructorId?.name || 'Dr. Sarah Vance'}
                      </span>
                      <Link
                        to={`/student/learn/${course._id || course.slug}`}
                        className="btn-primary text-xs h-8 px-3 gap-1"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                        <i className="lumen-ring" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recommended Courses for You */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Recommended Courses for You
            </h2>
            <p className="text-xs text-slate-500">
              Popular courses and trending topics based on your learning interests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((rec, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200/70 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-900">{rec.title}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-mono text-[10px] uppercase font-semibold">
                      Popular
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {rec.reason || 'Top-rated course among full-stack developers.'}
                  </p>
                </div>

                <Link
                  to="/courses"
                  className="btn-secondary text-xs h-8 px-3 justify-center gap-1 mt-2"
                >
                  <span>Explore Course</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

