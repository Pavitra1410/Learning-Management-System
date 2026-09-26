import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  FileText,
  Award,
  Code2,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function LearningPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await api.getCourses();
        const foundCourse = res.courses.find(c => c._id === courseId || c.slug === courseId);
        setCourse(foundCourse);

        const myCoursesRes = await api.getMyCourses();
        const foundEnrollment = myCoursesRes.enrollments.find(e => e.courseId?._id === courseId || e.courseId === courseId);
        setEnrollment(foundEnrollment);
      } catch (err) {
        console.error('Failed to load course player data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseId]);

  if (loading) return <div className="py-20 text-center text-slate-400">Loading course environment...</div>;
  if (!course) return <div className="py-20 text-center text-rose-400">Course not found.</div>;

  const currentModule = course.modules?.[currentModuleIndex];
  const currentLesson = currentModule?.lessons?.[currentLessonIndex];

  const isCompleted = enrollment?.completedLessons?.includes(currentLesson?._id);

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    try {
      const res = await api.updateProgress(course._id, currentLesson._id);
      setEnrollment(res.enrollment);
    } catch (err) {
      console.error('Failed to mark complete:', err);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link to="/student" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Back to Student Dashboard
          </Link>
          <div className="text-xs font-mono text-slate-500">
            Progress: <strong className="text-emerald-600 font-bold">{enrollment?.progressPercentage || 0}%</strong>
          </div>
        </div>

        {/* Player Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {currentLesson ? (
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-6 shadow-sm">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <span className="text-xs font-mono text-indigo-600 uppercase tracking-wider font-semibold">
                    {currentModule?.title} • Lesson {currentLessonIndex + 1}
                  </span>
                  <h1 className="text-2xl font-bold text-slate-900">{currentLesson.title}</h1>
                </div>

                {/* Lesson Video / Text Viewer */}
                {currentLesson.contentType === 'video' && currentLesson.videoUrl ? (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md">
                    <iframe
                      src={currentLesson.videoUrl}
                      title={currentLesson.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-slate-50/70 border border-slate-200/80 text-slate-700 text-sm leading-relaxed space-y-4">
                    <p>{currentLesson.content || 'Lesson study notes and concept overview.'}</p>
                  </div>
                )}

                {/* Interactive Assessment Links */}
                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-left">
                    <span className="text-xs font-semibold text-indigo-900 block">Concept Assessment & Lab</span>
                    <p className="text-[11px] text-slate-600">Evaluate understanding with confidence-aware MCQs or coding challenge.</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to="/quiz/js-quiz"
                      className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5"
                    >
                      <Award className="w-4 h-4" />
                      Take Quiz
                    </Link>

                    <Link
                      to="/student/lab"
                      className="btn-accent py-2 px-4 text-xs flex items-center gap-1.5"
                    >
                      <Code2 className="w-4 h-4" />
                      Open Lab
                    </Link>
                  </div>
                </div>

                {/* Completion Control */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <button
                    onClick={handleMarkComplete}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'btn-success shadow-md'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCompleted ? 'Completed' : 'Mark as Completed'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-slate-500 card-glass">Select a lesson from the module playlist.</div>
            )}
          </div>

          {/* Module Playlist Sidebar */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Course Curriculum</h3>

            <div className="space-y-4">
              {course.modules?.map((mod, mIdx) => (
                <div key={mod._id || mIdx} className="space-y-2">
                  <span className="text-xs font-mono text-indigo-600 font-semibold uppercase">{mod.title}</span>
                  <div className="space-y-1">
                    {mod.lessons?.map((les, lIdx) => {
                      const isSelected = currentModuleIndex === mIdx && currentLessonIndex === lIdx;
                      const lesDone = enrollment?.completedLessons?.includes(les._id);
                      return (
                        <button
                          key={les._id || lIdx}
                          onClick={() => {
                            setCurrentModuleIndex(mIdx);
                            setCurrentLessonIndex(lIdx);
                          }}
                          className={`w-full p-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-semibold shadow-md'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium'
                          }`}
                        >
                          <span className="truncate">{les.title}</span>
                          {lesDone && <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
