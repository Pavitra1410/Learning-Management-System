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
  ArrowRight,
  TrendingUp,
  Terminal,
  Play,
  HelpCircle,
  Layers,
  Check
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
          api.getStudentProfile().catch(() => ({ profile: null })),
          api.getMyCourses().catch(() => ({ enrollments: [] })),
          api.getRecommendations().catch(() => ({ recommendations: [] })),
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

  // Active course reference or fallback hero course
  const activeEnrollment = enrolledCourses.length > 0 ? enrolledCourses[0] : null;
  const activeCourse = activeEnrollment?.courseId || {
    _id: 'js-adv-101',
    title: 'Advanced Object Prototypes & Meta-Programming',
    category: 'Core JavaScript',
    level: 'Advanced',
    instructorId: { name: 'Prof. Marcus Chen' },
    description: 'Master V8 prototype chains, Proxy traps, Reflect API, and custom class abstractions.'
  };
  const activeProgress = activeEnrollment?.progressPercentage || 65;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 font-sans">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
        
        {/* Welcome & Header Container */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-[11px] font-bold border border-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Student Telemetry
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Student Session
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Pavitra</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Track your course progress, interactive lab sessions, and practice quizzes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/student/lab"
              className="btn-primary text-xs h-10 px-5 gap-2"
            >
              <Code2 className="w-4 h-4" />
              <span>Programming Lab</span>
              <i className="lumen-ring" aria-hidden="true" />
            </Link>

            <Link
              to="/courses"
              className="btn-secondary text-xs h-10 px-5 gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        </div>

        {/* 1. TOP TELEMETRY METRICS ROW (4 BENTO KPI CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Enrolled Courses */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Enrolled Courses</span>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-xs font-semibold border border-blue-200">
                Active learning modules
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                {enrolledCourses.length > 0 ? enrolledCourses.length.toString().padStart(2, '0') : '02'}
              </div>
              <span className="text-[11px] font-mono text-slate-500">1 core track, 1 elective</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/60">
              <div className="bg-blue-600 h-full w-3/4 rounded-full"></div>
            </div>
          </div>

          {/* Card 2: Completed Quizzes */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Completed Quizzes</span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-xs font-semibold border border-emerald-200">
                Passed assessments
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">04</div>
              {/* Mini Sparkline */}
              <div className="flex items-end gap-1 h-6">
                {[40, 65, 80, 100].map((h, i) => (
                  <div key={i} className="w-1.5 rounded-t bg-emerald-500" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">100% submission pass rate</p>
          </div>

          {/* Card 3: Average Quiz Score */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Average Quiz Score</span>
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-xs font-semibold border border-indigo-200">
                Across completed topics
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-extrabold font-mono text-indigo-600 tracking-tight">88%</div>
              
              {/* Circular SVG Ring */}
              <div className="relative w-9 h-9 flex items-center justify-center">
                <svg className="w-9 h-9 transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-indigo-600" strokeDasharray="88, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Telemetry verified across 16 concepts</p>
          </div>

          {/* Card 4: Lab Practice */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">Lab Practice</span>
              <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-mono text-xs font-semibold border border-purple-200">
                Hands-on coding time
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-extrabold font-mono text-purple-700 tracking-tight">12.4 hrs</div>
              
              {/* 7-Day Mini Bar Chart Sparkline */}
              <div className="flex items-end gap-1 h-7">
                {[30, 50, 40, 85, 60, 95, 75].map((val, i) => (
                  <div key={i} className="w-1.5 rounded-t bg-purple-500" style={{ height: `${val}%` }}></div>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Compiler execution & sandbox time</p>
          </div>

        </div>

        {/* 2. MAIN BENTO GRID (12 COLUMNS: SPAN 8 LEFT, SPAN 4 RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN (SPAN 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* HERO CARD: Active Course in Progress */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-xs font-semibold border border-blue-200 uppercase tracking-wider">
                    My Enrolled Courses
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-xs">
                    {activeCourse.category || 'Core JavaScript'}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500 font-medium">
                  {activeCourse.level || 'Advanced'} • {activeCourse.instructorId?.name || 'Prof. Marcus Chen'}
                </span>
              </div>

              {/* Course Title & Code Graphic Container */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-7 space-y-3">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    {activeCourse.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {activeCourse.description}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1.5 text-blue-700 font-medium">
                      <Layers className="w-4 h-4" /> 4 of 12 lessons remaining
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-4 h-4" /> All Labs Passed
                    </span>
                  </div>
                </div>

                {/* Code Artwork Thumbnail Box */}
                <div className="md:col-span-5 p-4 rounded-2xl bg-slate-900 font-mono text-[11px] text-indigo-300 space-y-1.5 shadow-inner">
                  <div className="text-slate-400 flex items-center justify-between border-b border-slate-800 pb-1 mb-2">
                    <span>// Proxy Traps & Reflect</span>
                    <span className="text-emerald-400 text-[10px] font-bold">🟢 Live AST</span>
                  </div>
                  <div><span className="text-purple-400">const</span> proxy = <span className="text-amber-300">new</span> Proxy(target, &#123;</div>
                  <div className="pl-3 text-cyan-300">get(target, prop) &#123;</div>
                  <div className="pl-6 text-slate-300">return Reflect.get(...arguments);</div>
                  <div className="pl-3 text-cyan-300">&#125;</div>
                  <div>&#125;);</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 font-medium">Course Progress</span>
                  <span className="font-extrabold text-blue-700">{activeProgress}% Complete</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${activeProgress}%` }}
                  />
                </div>
              </div>

              {/* Next Lesson Box & Action Buttons */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">Next Up:</span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                    Lesson 4.2: Proxy Traps & Reflect API
                  </h4>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Link
                    to={`/student/learn/${activeCourse._id}`}
                    className="btn-primary text-xs h-9 px-5 gap-2 w-full sm:w-auto justify-center"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                    <i className="lumen-ring" aria-hidden="true" />
                  </Link>

                  <Link
                    to="/student/lab"
                    className="btn-secondary text-xs h-9 px-4 gap-1.5 w-full sm:w-auto justify-center"
                  >
                    <Code2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sandbox</span>
                  </Link>
                </div>
              </div>

            </div>

            {/* INTERACTIVE PROGRAMMING LAB TEASER & TELEMETRY */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Interactive Programming Lab Telemetry</h3>
                    <p className="text-[11px] text-slate-500 font-mono">Live code challenge status & test assertions</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  3/3 Test Cases Passing
                </span>
              </div>

              {/* Code Snippet Editor Preview Pane */}
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2 relative shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-slate-300 ml-2 font-bold">challenge_04_private_counter.js</span>
                  </span>
                  <span className="text-indigo-400 text-[10px]">Execution: 0.012s</span>
                </div>

                <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto">
{`// Challenge: Create a Private Counter Closure
function createPrivateCounter(initialValue = 0) {
  let count = initialValue;
  return {
    get: () => count,
    increment: () => ++count,
    decrement: () => --count
  };
}`}
                </pre>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[11px]">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Assert: counter.increment() === 1 (PASSED)
                  </span>
                  <Link to="/student/lab" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline flex items-center gap-1">
                    <span>Launch Full Compiler Sandbox</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (SPAN 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* RECOMMENDED COURSES (3 DISTINCT TOPICS - NO DUPLICATES) */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Recommended Courses for You
                  </h3>
                  <span className="text-[10px] font-mono text-blue-700 font-bold px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                    Learnova AI
                  </span>
                </div>
                <p className="text-xs text-slate-500">Popular courses & tailored topic recommendations</p>
              </div>

              {/* 3 Distinct Dynamic Cards */}
              <div className="space-y-3.5">
                
                {/* Card 1: Asynchronous Foundations */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 shadow-xs hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-xs font-bold border border-blue-200">
                      Topic Practice
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-medium">95% Match</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Asynchronous Foundations & Promises
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Matches your Web Architecture track.
                  </p>
                  <Link
                    to="/courses"
                    className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <span>Explore Course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Card 2: Lexical Scope & Closures */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 shadow-xs hover:border-amber-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 font-mono text-xs font-bold border border-amber-200">
                      Prerequisite Review
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-medium">Review Recommended</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Lexical Scope & Closures
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Prerequisite review for meta-programming.
                  </p>
                  <Link
                    to="/courses"
                    className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700 hover:text-amber-800"
                  >
                    <span>Review Concept</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Card 3: React Internals & Concurrent Mode */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2.5 shadow-xs hover:border-emerald-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
                      Next Step Track
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-medium">Popular Track</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    React Internals & Concurrent Mode
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Popular next step among senior learners.
                  </p>
                  <Link
                    to="/courses"
                    className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Explore Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

            {/* QUICK DOUBT RESOLUTION & VIVA WIDGET */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  Doubt Resolution & Viva
                </h3>
                <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold border border-indigo-200">
                  Ready
                </span>
              </div>

              {/* Viva Readiness Gauge */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 font-medium">Viva Readiness Score</span>
                  <span className="font-extrabold text-indigo-600">92%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-[92%] rounded-full shadow-xs"></div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-indigo-700 font-bold">
                  <span>Recent Doubt Ticket</span>
                  <span className="text-emerald-600 font-semibold">Resolved</span>
                </div>
                <p className="text-xs text-slate-700 font-medium line-clamp-2">
                  "How does queueMicrotask differ from Promise.resolve().then()?"
                </p>
              </div>

              <Link
                to="/student/doubts"
                className="btn-primary w-full text-xs h-10 justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Ask Question & Get Hint</span>
                <i className="lumen-ring" aria-hidden="true" />
              </Link>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
