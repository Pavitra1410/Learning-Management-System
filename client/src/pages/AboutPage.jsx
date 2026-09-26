import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  FileCheck,
  Code2,
  BookMarked,
  MessageSquare,
  Video,
  Users,
  ShieldCheck,
  ArrowRight,
  Compass,
  CheckCircle2,
  Layers,
  GraduationCap,
  Zap,
  Terminal,
  Database,
  Globe,
  Cpu
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20 bg-slate-50 text-slate-900">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-14 pb-20 border-b border-slate-200/80 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-indigo-200/30 via-violet-200/20 to-cyan-200/20 blur-3xl pointer-events-none rounded-full"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>ABOUT LEARNOVA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Learning Made Simpler, Smarter & <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent">More Interactive</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Learnova is a modern learning management system designed to bring courses, assessments, programming practice, resources, and interactive learning experiences together in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/courses" className="btn-primary w-full sm:w-auto">
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link to="/login" className="btn-secondary w-full sm:w-auto">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ABOUT COGNITRACE - CENTRALIZED PLATFORM OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">Unified Platform</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything You Need to Learn in One Place
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Learnova replaces fragmented educational tools with a centralized digital campus. Students, instructors, and administrators can seamlessly discover, interact, and grow within a unified ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 text-sm">
            {[
              "Discover curated courses across various domains",
              "Learn through structured lessons and video modules",
              "Take quizzes & assignments with instant feedback",
              "Practice coding in an in-browser multi-language lab",
              "Access interactive 3D eBooks & digital monographs",
              "Clarify doubts directly with instructors & peers",
              "Attend live masterclasses and webinars",
              "Read insightful community blogs and articles",
              "Track real-time learning progress and performance"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 font-medium hover:border-indigo-200 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHAT STUDENTS CAN DO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">Student Experience</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            What Students Can Do
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Designed to support every step of your learning path with engaging and practical tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Learn */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-card-hover hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>📚 Learn</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Access structured courses, modules, and lessons tailored for all skill levels from beginner to advanced.
            </p>
          </div>

          {/* Assess */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-card-hover hover:border-purple-300 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>📝 Assess</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Take quizzes and assignments, immediately review your scores, view correct answer keys, and read detailed explanations.
            </p>
          </div>

          {/* Practice */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-card-hover hover:border-cyan-300 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>💻 Practice</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Use the built-in multi-language programming lab to write, compile, and execute code in JavaScript, Python, C, C++, and Java.
            </p>
          </div>

          {/* Read */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-card-hover hover:border-amber-300 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <BookMarked className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>📖 Read</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explore the interactive 3D eBook library with tactile page flipping and rich digital reference guides.
            </p>
          </div>

          {/* Ask & Learn */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-card-hover hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>💬 Ask & Learn</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Post questions, clarify difficult concepts, and get guidance directly from course instructors.
            </p>
          </div>

          {/* Attend */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-card-hover hover:border-rose-300 transition-all duration-300 hover:-translate-y-1 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>🎥 Attend</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Discover upcoming webinars, join live interactive learning sessions, and download calendar reminders.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FOR TEACHERS & 5. FOR ADMINS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* FOR TEACHERS */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-100/50 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider block">Educators</span>
                <h3 className="text-2xl font-bold text-slate-900">For Teachers</h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Learnova provides instructors with complete authoring and management tools to deliver impactful courses and measure cohort success.
            </p>

            <ul className="space-y-3 text-sm text-slate-700">
              {[
                "Create, edit, and organize courses and video lessons",
                "Design quizzes and assignments with customized explanations",
                "Share supplementary learning materials and eBook references",
                "Host live webinars and schedule masterclasses",
                "Monitor cohort progress and individual quiz scores"
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FOR ADMINS */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-100/50 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-purple-600 uppercase tracking-wider block">Governance</span>
                <h3 className="text-2xl font-bold text-slate-900">For Administrators</h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Centralized platform administration tools give administrators total oversight over security, users, and content operations.
            </p>

            <ul className="space-y-3 text-sm text-slate-700">
              {[
                "Manage user accounts and role assignments (Students, Teachers, Admins)",
                "Review and oversee published course catalogs and categories",
                "Manage platform-wide blogs, webinars, and eBook uploads",
                "Oversee overall LMS system health, security, and access control"
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* 6. OUR LEARNING EXPERIENCE (4-STEP PROCESS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest">Simple Workflow</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Learning Experience
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            A straightforward 4-step path designed to build practical confidence and long-term knowledge retention.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 text-center relative group hover:border-indigo-300 transition-all">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              1
            </div>
            <h4 className="text-lg font-bold text-slate-900">Discover</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore popular courses, filter by category, or choose recommendations tailored to your goals.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 text-center relative group hover:border-indigo-300 transition-all">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              2
            </div>
            <h4 className="text-lg font-bold text-slate-900">Learn</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Watch structured video lessons, review study guides, and read interactive 3D eBooks.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 text-center relative group hover:border-indigo-300 transition-all">
            <div className="w-10 h-10 rounded-full bg-cyan-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              3
            </div>
            <h4 className="text-lg font-bold text-slate-900">Practice</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Write, test, and debug code instantly in our integrated multi-language compiler lab.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 text-center relative group hover:border-indigo-300 transition-all">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              4
            </div>
            <h4 className="text-lg font-bold text-slate-900">Assess</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete quizzes, receive instant score breakdowns with explanations, and earn completion progress.
            </p>
          </div>

        </div>
      </section>

      {/* 7. TECHNOLOGY / PLATFORM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">Modern Stack</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Built for a Modern Learning Experience
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Learnova leverage standard, high-performance web technology to ensure lightning-fast responsiveness, reliable data persistence, and a smooth user experience across desktop and mobile devices.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
            {[
              { name: "React.js", desc: "Interactive Frontend UI", icon: Globe },
              { name: "Tailwind CSS", desc: "Responsive Styling", icon: Layers },
              { name: "Node.js", desc: "Server Runtime", icon: Cpu },
              { name: "Express.js", desc: "RESTful Backend API", icon: Terminal },
              { name: "MongoDB", desc: "Database Storage", icon: Database },
            ].map((tech, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center space-y-2 hover:border-indigo-500 transition-colors">
                <tech.icon className="w-5 h-5 text-indigo-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">{tech.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ready to Start Learning?
            </h2>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              Explore courses, practice new skills, and make learning part of your everyday journey.
            </p>
          </div>

          <div className="pt-2 relative z-10">
            <Link to="/courses" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-0.5">
              <span>Explore Courses</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
