import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../shaders/bestsellers-showcase.css';
import {
  BrainCircuit,
  Sparkles,
  Target,
  ShieldCheck,
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle2,
  Zap,
  Users,
  Compass,
  Code2,
  BookOpen,
  Star,
  Clock,
  User,
  Layers,
  ChevronRight,
  Eye,
  Check,
  X
} from 'lucide-react';

const THREEUI_BESTSELLERS_COURSES = [
  {
    id: "codex",
    slug: "javascript-execution-context",
    title: "V8 Execution Contexts & Lexical Scope",
    subtitle: "The Core JS Engine Mechanics",
    kicker: "Mastery Volume · I",
    category: "Core JavaScript",
    level: "Intermediate",
    rating: 4.9,
    reviewsCount: 142,
    durationMinutes: 720,
    instructorName: "Dr. Sarah Vance",
    instructorTitle: "Lead Systems Architect & V8 Engine Researcher",
    coverColor: "#1e293b",
    coverImage: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=80",
    summary: "Master lexical scopes, closures, memory allocation, execution stacks, and variable hoisting in modern ECMAScript engines.",
    steps: [
      { number: "01", title: "Execution Context Initialization", body: "Creation of Global Execution Context, Variable Environment, and Scope Chain setup." },
      { number: "02", title: "Lexical Scope & Closures", body: "Deep dive into memory heap allocations, garbage collection, and persistent lexical environments." },
      { number: "03", title: "Call Stack Execution Dynamics", body: "Tracing frame allocation, stack overflow thresholds, and recursion execution bounds." },
      { number: "04", title: "Formative Viva Gateway", body: "Interactive 60-second Socratic assessment to verify non-lethal comprehension." }
    ],
    codeSnippet: `// Execution Context Scope Chain Example\nfunction createCounter() {\n  let count = 0; // Lexical environment memory allocation\n  return function increment() {\n    count++;\n    return count;\n  };\n}`
  },
  {
    id: "claude",
    slug: "async-javascript-promises",
    title: "Async Execution & Event Loop Mechanics",
    subtitle: "Concurrency & Task Queues",
    kicker: "Mastery Volume · II",
    category: "Async JavaScript",
    level: "Advanced",
    rating: 4.8,
    reviewsCount: 189,
    durationMinutes: 900,
    instructorName: "Prof. Marcus Thorne",
    instructorTitle: "Principal Distributed Systems Engineer",
    coverColor: "#0f172a",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
    summary: "Deep dive into microtask queues, event loop ticks, Promise resolution states, async/await mechanics, and Web Worker threads.",
    steps: [
      { number: "01", title: "V8 Event Loop Tick Pipeline", body: "Distinguishing Task (Macrotask) Queue from Microtask Queue scheduling priority." },
      { number: "02", title: "Promise Resolution & Reaction Jobs", body: "Internal [[PromiseState]] and [[PromiseResult]] slot transitions during fulfillment." },
      { number: "03", title: "Async/Await Desugaring", body: "Understanding state machine generators and stack resumption mechanics." },
      { number: "04", title: "Web Worker Offloading", body: "Parallel thread communication using SharedArrayBuffer and Atomics." }
    ],
    codeSnippet: `// Microtask Queue Priority Test\nconsole.log('1: Sync');\nPromise.resolve().then(() => console.log('2: Microtask'));\nsetTimeout(() => console.log('3: Macrotask'), 0);\nconsole.log('4: Sync');`
  },
  {
    id: "cursor",
    slug: "react-hooks-reconciler",
    title: "React Hook Mechanics & Fiber Reconciler",
    subtitle: "Reactive VDOM Architecture",
    kicker: "Mastery Volume · III",
    category: "React Framework",
    level: "Intermediate",
    rating: 4.9,
    reviewsCount: 210,
    durationMinutes: 600,
    instructorName: "Elena Rostova",
    instructorTitle: "Senior Frontend System Architect",
    coverColor: "#312e81",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    summary: "Understand Fiber reconciliation, state batching, useEffect dependency tracking, memoization patterns, and concurrent rendering.",
    steps: [
      { number: "01", title: "Fiber Node Structure & Work Loop", body: "Inspecting child, sibling, and return pointers in the Fiber tree reconciliation algorithm." },
      { number: "02", title: "Hook Dispatcher & Linked Lists", body: "How React tracks hook order via memoizedState linked list nodes." },
      { number: "03", title: "Concurrent Rendering & Priorities", body: "Time-slicing long renders with startTransition and useDeferredValue." },
      { number: "04", title: "State Batching Optimization", body: "Automatic batching mechanics in React 19 event handlers and asynchronous calls." }
    ],
    codeSnippet: `// Custom Hook Memoization Pattern\nfunction useOptimizedFetch(url) {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    let active = true;\n    fetch(url).then(r => r.json()).then(d => { if (active) setData(d); });\n    return () => { active = false; };\n  }, [url]);\n  return data;\n}`
  }
];

function ThreeUIBestsellersShowcase() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(THREEUI_BESTSELLERS_COURSES);
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);

  useEffect(() => {
    async function fetchBackendCourses() {
      try {
        const res = await api.getCourses();
        if (res.courses && res.courses.length >= 3) {
          // Merge backend course data into the 3D showcase items
          const merged = THREEUI_BESTSELLERS_COURSES.map((fallback, i) => {
            const apiCourse = res.courses[i] || {};
            return {
              ...fallback,
              _id: apiCourse._id || fallback.id,
              slug: apiCourse.slug || fallback.slug,
              title: apiCourse.title || fallback.title,
              category: apiCourse.category || fallback.category,
              level: apiCourse.level || fallback.level,
              rating: apiCourse.rating || fallback.rating,
              instructorName: apiCourse.instructorId?.name || apiCourse.instructorName || fallback.instructorName,
              thumbnail: apiCourse.thumbnail || fallback.coverImage,
              summary: apiCourse.description || fallback.summary
            };
          });
          setCourses(merged);
        }
      } catch (err) {
        console.warn('Using ThreeUI Bestsellers showcase default data');
      }
    }
    fetchBackendCourses();
  }, []);

  const activeCourse = courses[selectedBookIndex] || courses[0];

  const handleNavigate = (slug) => {
    if (slug) {
      navigate(`/courses/${slug}`);
    } else {
      navigate('/courses');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* 3D Showcase Stage Container */}
      <div className="lms-bestsellers-stage p-6 sm:p-10 relative">
        
        {/* Background Hero Word Watermark */}
        <h1 className="lms-hero-word">COURSES</h1>

        {/* Top Header & Item Selector Tabs */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f3f7fe] text-[#3b82f6] border border-blue-200 text-xs font-mono font-bold uppercase tracking-wider shadow-sm mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>ThreeUI Bestsellers Showcase Adaptation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Explore Courses
            </h2>
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed mt-1 font-medium">
              Click any 3D clothbound volume to inspect its syllabus details, instructor credentials, and evidence benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {courses.map((c, idx) => (
              <button
                key={c.id || idx}
                onClick={() => setSelectedBookIndex(idx)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${
                  selectedBookIndex === idx
                    ? 'btn-primary'
                    : 'btn-ghost'
                }`}
              >
                {c.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Showcase Stage Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 pt-4">
          
          {/* Left Side: 3D Tactile Volumes Showcase Stage (6 cols) */}
          <div className="lg:col-span-6 relative min-h-[460px] flex items-center justify-center">
            {courses.map((course, idx) => {
              const isActive = selectedBookIndex === idx;
              return (
                <button
                  key={course.id || idx}
                  onClick={() => setSelectedBookIndex(idx)}
                  className="lms-book-card"
                  data-active={isActive ? 'true' : 'false'}
                  data-idx={idx}
                  style={{
                    '--x': idx === 0 ? '22%' : idx === 1 ? '50%' : '78%',
                    '--y': idx === 0 ? '28%' : idx === 1 ? '20%' : '29%',
                    '--w': 'min(28vw, 360px)',
                    '--r': idx === 0 ? '-7deg' : idx === 1 ? '1deg' : '7deg',
                    '--yaw': idx === 0 ? '-6deg' : idx === 1 ? '-2deg' : '6deg',
                    '--cover-color': course.coverColor || '#1e293b',
                    '--cover-image': `url('${course.thumbnail || course.coverImage}')`
                  }}
                >
                  <span className="lms-book">
                    <span className="lms-book-shadow"></span>
                    <span className="lms-book-back"></span>
                    <span className="lms-page-block"></span>
                    <span className="lms-front-cover">
                      <span className="lms-cover-overlay"></span>
                      <span className="lms-cover-copy">
                        <span className="lms-cover-kicker">{course.kicker || 'Mastery Volume'}</span>
                        <span className="lms-cover-title">{course.title.split(' ')[0]}</span>
                        <span className="lms-cover-subtitle">{course.category}</span>
                        <span></span>
                        <span className="lms-cover-footer">{course.level} Level • {course.rating} ★</span>
                      </span>
                    </span>
                    <span className="lms-open-badge">Explore Course</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Side: Selected Course Detail Inspector Panel (6 cols) */}
          <div className="lg:col-span-6 lms-detail-panel space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#f3f7fe] text-[#3b82f6] text-xs font-mono font-bold border border-blue-100">
                {activeCourse.category}
              </span>
              <span className="flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {activeCourse.rating || 4.9} ({activeCourse.reviewsCount || 142} Reviews)
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
                {activeCourse.title}
              </h3>
              <p className="text-xs text-[#3b82f6] font-bold mb-3">
                Instructor: {activeCourse.instructorName} • {activeCourse.instructorTitle || 'Senior LMS Educator'}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {activeCourse.summary || activeCourse.description}
              </p>
            </div>

            {/* Syllabus Milestones */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Syllabus Milestones & Evidence Benchmarks
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {(activeCourse.steps || []).map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-start gap-3">
                    <span className="font-mono text-[#3b82f6] font-bold text-xs shrink-0 mt-0.5">{step.number || `0${idx + 1}`}</span>
                    <div>
                      <strong className="text-slate-900 block font-bold">{step.title}</strong>
                      <span className="text-slate-600 text-[11px] leading-relaxed font-medium">{step.body}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action CTA Dock */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-medium">
                Duration: <strong className="text-slate-900">{Math.round((activeCourse.durationMinutes || 720) / 60)} Hours</strong>
              </div>

              <button
                onClick={() => handleNavigate(activeCourse.slug)}
                className="btn-primary px-8 py-3 text-sm font-semibold"
              >
                <span>Explore Course</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}

function TypingHeroHeading() {
  const phrases = ['Learn.', 'Practice.', 'Grow.'];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = phrases[phraseIndex];
    let timer;

    if (!isDeleting && currentText === fullText) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 1800);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      const speed = isDeleting ? 65 : 125;
      timer = setTimeout(() => {
        setCurrentText((prev) =>
          isDeleting
            ? fullText.substring(0, prev.length - 1)
            : fullText.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex]);

  return (
    <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15] min-h-[1.2em]">
      <span>Learnova LMS to </span>
      <span className="inline-block bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent font-black min-w-[190px] sm:min-w-[260px] text-left">
        {currentText}
        <span className="inline-block w-[3px] h-[0.85em] ml-1 bg-indigo-600 animate-pulse align-middle rounded-full"></span>
      </span>
    </h1>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-12 pb-20 bg-slate-50">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200/80 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-indigo-200/30 via-violet-200/20 to-cyan-200/20 blur-3xl pointer-events-none rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Modern Learning Management & Skill Assessment</span>
          </div>

          <TypingHeroHeading />

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Empowering students and educators with interactive courses, structured quizzes, multi-language programming compiler labs, interactive eBooks, live webinars, and comprehensive cohort tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/courses"
              className="btn-primary w-full sm:w-auto"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="btn-secondary w-full sm:w-auto"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Try Demo Accounts</span>
            </Link>
          </div>

          {/* Interactive Demo Flow Banner */}
          <div className="mt-10 p-6 rounded-2xl bg-white/90 border border-slate-200 backdrop-blur-lg max-w-4xl mx-auto text-left shadow-glass">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-xs font-mono font-semibold text-indigo-600 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                Standard Learning & Assessment Flow
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                Ready to Demo
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700">
                <strong className="text-indigo-600 block mb-1 font-semibold">1. Student Login</strong>
                Log in as Alice or Bob.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700">
                <strong className="text-purple-600 block mb-1 font-semibold">2. Enrolled Courses</strong>
                Watch lessons & complete modules.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700">
                <strong className="text-amber-600 block mb-1 font-semibold">3. Take Quizzes</strong>
                Submit answers & view score result.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700">
                <strong className="text-emerald-600 block mb-1 font-semibold">4. Multi-Lang Lab</strong>
                Execute code in JS/Python/C++.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* THREEUI BESTSELLERS BOOK SHOWCASE 3D ADAPTATION FOR COURSES */}
      <ThreeUIBestsellersShowcase />

      {/* CORE INNOVATION PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Core Platform Pillars</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm">
            Everything you need for a modern, interactive, and comprehensive learning management experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-card-hover hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Structured Quizzes & Tests</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Standard multiple-choice quizzes with instant grading, detailed explanations, breakdown of correct/incorrect answers, and score history.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-card-hover hover:border-purple-300 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Curriculum & Learning Paths</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Step-by-step course progression from foundational topics to advanced practical projects with progress tracking at every stage.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-card-hover hover:border-cyan-300 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Multi-Language Code Lab</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Built-in sandbox compiler supporting JavaScript, Python, C, C++, and Java with real-time output display and sample test cases.
            </p>
          </div>

        </div>
      </section>

      {/* DASHBOARD PREVIEW BY ROLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Tailored Role Experiences</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm">
            Role-based authorization built for Students, Teachers, and System Administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs font-mono uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>STUDENT ROLE</span>
            </div>
            <h4 className="text-base font-bold text-slate-900">Student Dashboard</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Real-time Course & Quiz Progress</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Unified Programming Lab (JS, Python, C, C++, Java)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Curated Course Recommendations</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-purple-600 font-semibold text-xs font-mono uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>TEACHER ROLE</span>
            </div>
            <h4 className="text-base font-bold text-slate-900">Class Mastery Matrix</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Students x Concepts Matrix Grid</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Misconception Analytics Breakdown</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Course, Question Bank & Doubt Management</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-cyan-600 font-semibold text-xs font-mono uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>ADMIN ROLE</span>
            </div>
            <h4 className="text-base font-bold text-slate-900">Platform Administration</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> User Role Management (Promote / Demote)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Prerequisite Graph Cycle Checker</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> System Analytics & Content Auditing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* QUICK START CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white text-center space-y-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Experience the Future of EdTech Assessment</h2>
          <p className="text-indigo-100 max-w-xl mx-auto text-sm leading-relaxed">
            Ready to evaluate evidence-based assessment in action? Access pre-configured test accounts for Alice (Learner), Bob (Misconception test), Dr. Vance (Teacher), or Admin.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 shadow-md transition-all active:scale-[0.98]"
            >
              <span>Sign In with Demo Accounts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
