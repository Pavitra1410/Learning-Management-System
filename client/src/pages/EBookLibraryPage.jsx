import React, { useState } from 'react';
import { BookshelfScene } from '../shaders/bookshelf/BookshelfScene';
import { Sketchbook } from '../shaders/sketchbook/Sketchbook';
import '../shaders/threeui.css';
import { toast } from 'sonner';
import {
  BookOpen,
  Search,
  Sparkles,
  Bookmark,
  Download,
  Eye,
  Clock,
  User,
  X,
  CheckCircle2,
  Maximize2,
  Minimize2,
  FileText,
  Brain,
  Compass,
  ArrowRight,
  ChevronRight,
  Library
} from 'lucide-react';

const EBOOK_COLLECTION = [
  {
    id: "codex",
    title: "Foundations of Web Systems & Architecture",
    roman: "Vol. I",
    discipline: "Software Engineering & Web Architecture",
    author: "Dr. Evelyn Vance & Learnova Labs",
    readTime: "24 min read",
    coverColor: "#182a43",
    foilColor: "#c87046",
    badge: "Core Theory",
    chapters: [
      { number: "01", title: "Full-Stack System Design & Patterns", pages: "14-38" },
      { number: "02", title: "Database Optimization & Indexing", pages: "39-65" },
      { number: "03", title: "Asynchronous Workflows & REST APIs", pages: "66-92" }
    ],
    summary: "A foundational manual on full-stack system architecture, database design, REST APIs, and scalable software development.",
    excerpt: "Modern web application design relies on clean decoupled architecture, state management, optimized database queries, and resilient backend service APIs."
  },
  {
    id: "claude-code",
    title: "Modern Web Performance & Engineering Analytics",
    roman: "Vol. II",
    discipline: "Performance Optimization & System Analytics",
    author: "Prof. Marcus Thorne",
    readTime: "32 min read",
    coverColor: "#c24d24",
    foilColor: "#efc16d",
    badge: "Analytics",
    chapters: [
      { number: "01", title: "Quantitative Application Profiling", pages: "10-42" },
      { number: "02", title: "Measuring Network & Render Performance", pages: "43-78" },
      { number: "03", title: "Evaluating Server-Side Caching Strategies", pages: "79-115" }
    ],
    summary: "An authoritative guide to designing quantitative learning pathways, measuring cognitive engagement, and evaluating instructional interventions using empirical LMS telemetry.",
    excerpt: "Empirical learning analytics bridge instructional design and raw behavioral telemetry. By tracking pause durations, review cycles, and hint request intervals, LMS platforms construct high-resolution learner profiles."
  },
  {
    id: "cursor",
    title: "Cognitive Load Theory & Spaced Retrieval",
    roman: "Vol. III",
    discipline: "Cognitive Neuroscience & Memory Systems",
    author: "Dr. Sarah Lin",
    readTime: "18 min read",
    coverColor: "#afc400",
    foilColor: "#171a16",
    badge: "Neuroscience",
    chapters: [
      { number: "01", title: "Intrinsic vs. Extraneous Cognitive Load", pages: "08-30" },
      { number: "02", title: "SuperMemo Spaced Repetition Schedules", pages: "31-54" },
      { number: "03", title: "Preventing Working Memory Overload", pages: "55-80" }
    ],
    summary: "Principles of intrinsic, extraneous, and germane cognitive load balanced with optimal spaced repetition schedules (SuperMemo / Ebbinghaus algorithms) to accelerate mastery.",
    excerpt: "Human working memory is constrained to 4-7 active chunks. When instruction presents excessive extraneous load, germane schema construction stalls. Spaced retrieval activates neural consolidation at optimal decay thresholds."
  },
  {
    id: "antigravity",
    title: "Psychometrics, Mastery Trees & Diagnostic Rubrics",
    roman: "Vol. IV",
    discipline: "Directed Acyclic Graphs & Rubric Design",
    author: "Dr. Aris Thorne",
    readTime: "28 min read",
    coverColor: "#1537a1",
    foilColor: "#dbe8f1",
    badge: "Skill Trees",
    chapters: [
      { number: "01", title: "Constructing Skill DAG Prerequisites", pages: "12-40" },
      { number: "02", title: "Automated Diagnostic Rubric Generation", pages: "41-75" },
      { number: "03", title: "Isolating Misconceptions via Node States", pages: "76-110" }
    ],
    summary: "Designing node dependencies for skill trees, calculating node mastery states, and constructing formative rubrics that isolate student misconceptions in real time.",
    excerpt: "Skill graphs model knowledge as Directed Acyclic Graphs (DAGs) where edges represent strict cognitive dependencies. A learner cannot transition to node B until prerequisite node A achieves validated mastery state."
  },
  {
    id: "figma",
    title: "Socratic AI & Metacognitive Calibration",
    roman: "Vol. V",
    discipline: "AI Pedagogy & Dialogue Prompt Engineering",
    author: "Elena Rostova",
    readTime: "22 min read",
    coverColor: "#c83222",
    foilColor: "#efb0aa",
    badge: "AI Dialogue",
    chapters: [
      { number: "01", title: "Non-Lethal Hint Prompt Engineering", pages: "06-28" },
      { number: "02", title: "Guided Discovery vs. Direct Instruction", pages: "29-58" },
      { number: "03", title: "Timed Viva Gateways & Over-Reliance", pages: "59-88" }
    ],
    summary: "Utilizing LLM agents for non-lethal hints, guided discovery learning, self-explanation prompts, and preventing over-reliance through timed Viva Gateway challenges.",
    excerpt: "Socratic AI tutors must never reveal final answers directly. Instead, they probe student mental models with reflective questioning, guiding the learner to locate edge-case flaws independently."
  },
  {
    id: "framer",
    title: "V8 JavaScript Execution & AST Telemetry",
    roman: "Vol. VI",
    discipline: "AST Code Analysis & Sandboxed Evaluation",
    author: "Vikram Patel",
    readTime: "35 min read",
    coverColor: "#da3b2f",
    foilColor: "#ff8eab",
    badge: "Code Lab",
    chapters: [
      { number: "01", title: "Babel Abstract Syntax Tree Parsing", pages: "16-48" },
      { number: "02", title: "Keystroke Cadence & Auth Analytics", pages: "49-82" },
      { number: "03", title: "Detecting AI Copy-Paste in Coding Labs", pages: "83-120" }
    ],
    summary: "Deep technical analysis of static syntax trees, live code evaluation telemetry, and identifying authentic problem-solving patterns versus copy-paste behavior.",
    excerpt: "By evaluating the Abstract Syntax Tree (AST) produced during code compilation, LMS evaluators inspect structural logic, loop nesting depths, and variable scope hygiene beyond simple test pass/fail status."
  },
  {
    id: "xcode",
    title: "Learnova System Architecture & Security",
    roman: "Vol. VII",
    discipline: "Full-Stack MERN Engineering & Security",
    author: "Learnova Core Group",
    readTime: "40 min read",
    coverColor: "#78a7bd",
    foilColor: "#e4e7e5",
    badge: "Full-Stack",
    chapters: [
      { number: "01", title: "JWT Role-Based Access Control Architecture", pages: "10-45" },
      { number: "02", title: "React 19 & Monaco Integration", pages: "46-85" },
      { number: "03", title: "Real-time 3D WebGL Component Integration", pages: "86-130" }
    ],
    summary: "Complete system architecture manual covering JWT role authorization, Monaco editor AST integration, React Flow DAGs, and real-time WebGL course showcases.",
    excerpt: "Modern full-stack educational platforms combine reactive UI layers with sandboxed code evaluation and secure backend microservices to deliver frictionless, resilient learning environments."
  }
];

export default function EBookLibraryPage() {
  const [selectedBook, setSelectedBook] = useState(EBOOK_COLLECTION[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [focus3DMode, setFocus3DMode] = useState(false);

  const categories = ['All', 'Core Theory', 'Analytics', 'Neuroscience', 'Skill Trees', 'AI Dialogue', 'Code Lab'];

  const filteredBooks = EBOOK_COLLECTION.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.discipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || book.badge === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenPreview = (book) => {
    setSelectedBook(book);
    setActiveChapter(0);
    setPreviewModalOpen(true);
  };

  const handleBookmark = (bookTitle) => {
    toast.success(`Bookmarked "${bookTitle}" to your Personal Reading List!`);
  };

  const handleDownloadPDF = (bookTitle) => {
    toast.info(`Preparing PDF download for "${bookTitle}"...`);
    setTimeout(() => {
      toast.success(`Downloaded "${bookTitle}" (PDF Specimen Edition).`);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden font-sans">
      
      {/* 1. FULL-BLEED 3D BACKDROP LAYER (-z-10, fixed inset-0) */}
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-auto bg-slate-100">
        <BookshelfScene className="w-full h-full" />
        
        {/* Soft Light Overlay for Legibility */}
        <div 
          className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
            focus3DMode 
              ? 'opacity-0' 
              : 'opacity-90 bg-gradient-to-b from-slate-50/95 via-slate-100/80 to-slate-50/95 backdrop-blur-[2px]'
          }`} 
        />
      </div>

      {/* Floating 3D Scene / UI Focus Mode Toggle Button (fixed top-20 right-6 z-40) */}
      <div className="fixed top-20 right-6 z-40">
        <button
          onClick={() => setFocus3DMode(!focus3DMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all border backdrop-blur-md ${
            focus3DMode
              ? 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-400/50 scale-105'
              : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-white shadow-sm'
          }`}
        >
          {focus3DMode ? (
            <>
              <Minimize2 className="w-4 h-4" />
              <span>Show Library UI Overlay</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 text-indigo-600" />
              <span>Interactive 3D Focus Mode</span>
            </>
          )}
        </button>
      </div>

      {/* 2. FOREGROUND UI LAYER (relative z-10) */}
      <main className={`relative z-10 transition-all duration-500 pb-20 ${focus3DMode ? 'opacity-0 pointer-events-none scale-98' : 'opacity-100 scale-100'}`}>
        
        {/* 1. HEADER / HERO SECTION */}
        <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Interactive Digital Library
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-semibold">
                  {filteredBooks.length} Interactive Monographs
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
                eBook Library
              </h1>
              
              <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed font-medium">
                Explore, read and learn from a collection of interactive educational resources.
              </p>
            </div>

            {/* Platform Quick Badge */}
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-mono font-medium">Educational Framework</div>
                <div className="text-sm font-bold text-slate-900">SuperMemo &amp; IRT Analytics</div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Peer-Reviewed Content
                </div>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, author, or research discipline..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white font-semibold border-blue-600 shadow-md'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 2. INTERACTIVE SKETCHBOOK SHOWCASE SECTION (Hero Stage) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-14">
          <div className="flex items-center justify-between px-1 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                Interactive 3D eBook Reader Stage
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Currently Reading: <strong className="text-blue-600">{selectedBook.roman}</strong>
            </span>
          </div>

          {/* 3D Sketchbook Component Stage (Directly on stage, no outer white card) */}
          <Sketchbook ebook={selectedBook} className="w-full shadow-lg" />

          {/* Quick Action Controls Bar Under Stage */}
          <div className="mt-3 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200/90 px-4 py-2.5 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1 font-semibold text-slate-900">
                <User className="w-3.5 h-3.5 text-blue-600" /> {selectedBook.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> {selectedBook.readTime}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-slate-500">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" /> {selectedBook.discipline}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenPreview(selectedBook)}
                className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Full Monograph Text</span>
              </button>

              <button
                onClick={() => handleBookmark(selectedBook.title)}
                className="btn-ghost p-1.5 text-slate-600 hover:text-blue-600"
                title="Save to Personal Reading List"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDownloadPDF(selectedBook.title)}
                className="btn-ghost p-1.5 text-slate-600 hover:text-blue-600"
                title="Download Specimen PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* 3. EBOOK CATALOG SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between px-1 mb-6 border-b border-slate-200/80 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Library className="w-5 h-5 text-blue-600" /> Monograph Catalog
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select an eBook from the catalog below to open it inside the 3D Sketchbook reader.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {filteredBooks.length} Available
            </span>
          </div>

          {/* Grid of Available eBooks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((b) => {
              const isSelected = selectedBook.id === b.id;
              return (
                <div
                  key={b.id}
                  className={`group bg-white/95 backdrop-blur-md rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md ${
                    isSelected
                      ? 'border-blue-400 ring-2 ring-blue-500/20 bg-blue-50/30'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-8 rounded-sm shrink-0 shadow-inner"
                          style={{ backgroundColor: b.coverColor || '#3b82f6' }}
                        />
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-blue-700 border border-slate-200">
                          {b.roman}
                        </span>
                      </div>
                      
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {b.badge}
                      </span>
                    </div>

                    {/* Book Title & Author */}
                    <h3 className="mt-3.5 text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      {b.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 font-medium flex items-center gap-1">
                      <User className="w-3 h-3 text-blue-600" /> {b.author}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-blue-700 font-mono">
                      {b.discipline}
                    </p>

                    <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      "{b.summary}"
                    </p>
                  </div>

                  {/* Card Footer & Action Button */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600" /> {b.readTime}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedBook(b);
                        window.scrollTo({ top: 160, behavior: 'smooth' });
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-800 hover:bg-blue-600 hover:text-white'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Currently Reading' : 'Open eBook'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* 3. READ PREVIEW MODAL */}
      {previewModalOpen && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-slate-200/90 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin">
            
            <button
              onClick={() => setPreviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-semibold border border-indigo-100">
                {selectedBook.roman}
              </span>
              <span className="text-xs text-slate-500 font-mono font-medium">LMS Monograph Specimen</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              {selectedBook.title}
            </h2>

            <p className="text-xs text-indigo-600 font-medium mt-1">
              By {selectedBook.author} · {selectedBook.discipline}
            </p>

            {/* Chapter Tabs */}
            <div className="mt-6 border-b border-slate-100 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {selectedBook.chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveChapter(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    activeChapter === idx
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {ch.number}. {ch.title}
                </button>
              ))}
            </div>

            {/* Chapter Content Specimen */}
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs leading-relaxed font-mono">
                <p className="text-indigo-600 font-semibold mb-2">
                  [EXCERPT FROM CHAPTER {selectedBook.chapters[activeChapter]?.number || '01'}: {selectedBook.chapters[activeChapter]?.title}]
                </p>
                <p>{selectedBook.excerpt}</p>
                <p className="mt-3 text-slate-500">
                  Continuous measurement of confidence intervals allows the LMS to adjust problem difficulty parameter θ dynamically, maintaining optimal challenge in the zone of proximal development.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <h4 className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> Key Pedagogical Takeaways
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside font-medium">
                  <li>Empirical calibration reduces learner frustration by 42%.</li>
                  <li>Spaced retrieval prompts ensure long-term retention beyond 30-day thresholds.</li>
                  <li>Socratic AI intervention keeps cognitive load within optimal boundaries.</li>
                </ul>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-500 font-mono font-medium">
                Format: {selectedBook.format || 'Standard Monograph'}
              </span>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownloadPDF(selectedBook.title)}
                  className="btn-primary py-2 px-4 text-xs flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full Chapter PDF</span>
                </button>
                <button
                  onClick={() => setPreviewModalOpen(false)}
                  className="btn-ghost py-2 px-4 text-xs"
                >
                  Close Reader
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
