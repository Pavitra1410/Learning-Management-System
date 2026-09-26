import React from 'react';
import { BrainCircuit, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
            <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span>Learnova LMS</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Comprehensive Learning Management System. Streamlining course management, assessments, and interactive programming practice.
          </p>
          <div className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50/80 p-2.5 rounded-xl border border-indigo-200/80 font-medium">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Interactive Learning & Assessment Engine</span>
          </div>
        </div>

        <div>
          <h4 className="text-slate-900 font-semibold mb-3 text-xs uppercase tracking-wider font-mono">Technology Stack</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              React.js + Tailwind CSS
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              Node.js + Express.js APIs
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              MongoDB Atlas + Mongoose
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              JWT & Role Authorization
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 font-semibold mb-3 text-xs uppercase tracking-wider font-mono">Platform Features</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Structured Course Lessons</li>
            <li>• Interactive Practice Quizzes</li>
            <li>• Multi-Language Programming Lab</li>
            <li>• Live Webinar Masterclasses</li>
            <li>• Digital eBook Library</li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-900 font-semibold mb-3 text-xs uppercase tracking-wider font-mono">User Roles</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• <strong className="text-slate-800">Student:</strong> Learning Path & Multi-Lang Compiler</li>
            <li>• <strong className="text-slate-800">Teacher:</strong> Course & Quiz Management</li>
            <li>• <strong className="text-slate-800">Admin:</strong> Platform Analytics & Users</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© 2026 Learnova LMS. Full-Stack Web Development Project.</p>
        <p className="flex items-center gap-1 font-medium text-slate-500">
          Built with precision for modern online education.
        </p>
      </div>
    </footer>
  );
}
