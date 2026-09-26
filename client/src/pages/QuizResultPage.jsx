import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Award, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

export default function QuizResultPage() {
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="py-20 text-center text-slate-500 space-y-4 bg-slate-50 min-h-[calc(100vh-4rem)]">
        <p>No assessment result found.</p>
        <Link to="/student" className="text-blue-600 font-semibold hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  const { overallScore = 80, correctCount = 4, totalQuestions = 5 } = result;
  const isPassed = overallScore >= 70;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-slate-50 min-h-[calc(100vh-4rem)]">
      
      {/* Score Header Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 text-center space-y-5 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900">Quiz Results</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Great job! You have completed the practice test.
          </p>
        </div>

        <div className="inline-block px-8 py-4 rounded-3xl bg-blue-50/60 border border-blue-200/80">
          <span className="text-4xl sm:text-5xl font-extrabold text-blue-600">{overallScore}%</span>
          <span className="text-xs text-slate-600 block font-semibold mt-1">Final Score</span>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs sm:text-sm text-slate-600 font-medium pt-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Correct: <strong>{correctCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Total Questions: <strong>{totalQuestions}</strong></span>
          </div>
        </div>
      </div>

      {/* Result Status Banner */}
      <div className={`p-6 rounded-3xl border flex items-center gap-4 shadow-sm ${
        isPassed 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
          : 'bg-amber-50 border-amber-200 text-amber-950'
      }`}>
        <CheckCircle2 className={`w-7 h-7 shrink-0 ${isPassed ? 'text-emerald-600' : 'text-amber-600'}`} />
        <div className="text-xs sm:text-sm">
          <strong className="block font-bold text-base">
            {isPassed ? 'Assessment Passed!' : 'Practice Recommended'}
          </strong>
          <span>
            {isPassed 
              ? 'Congratulations! You have successfully demonstrated understanding of the lesson topics.' 
              : 'Review the course lessons and try the quiz again to improve your score.'}
          </span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex justify-center gap-4 pt-4">
        <Link
          to="/student"
          className="btn-primary py-3 px-8 text-xs gap-2"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
          <i className="lumen-ring" aria-hidden="true" />
        </Link>
      </div>

    </div>
  );
}

