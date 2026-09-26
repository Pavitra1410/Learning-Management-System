import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SkeletonCard } from '../components/ui/Skeleton';
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  FileText,
  Clock,
  User,
  Star,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [openModuleIndex, setOpenModuleIndex] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getCourseBySlug(slug);
        setCourse(res.course);
        setIsEnrolled(res.isEnrolled);
        setEnrollment(res.enrollment);
      } catch (err) {
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    try {
      const res = await api.enrollCourse(course._id);
      setIsEnrolled(true);
      setEnrollment(res.enrollment);
      toast.success('Successfully enrolled in course!');
    } catch (err) {
      toast.error(err.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <SkeletonCard height="h-96" />
      </div>
    );
  }

  if (!course) {
    return <div className="py-20 text-center text-rose-400">Course not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Course Hero Header */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/90 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center shadow-sm">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
              {course.category}
            </span>
            <span className="text-slate-500 font-medium">• {course.level} Level</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            {course.title}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 pt-2 font-medium">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Instructor: {course.instructorId?.name || 'Dr. Sarah Vance'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{course.rating || 4.8} / 5.0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Course Certificate</span>
            </div>
          </div>
        </div>

        {/* Enrollment Card */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6 shadow-sm">
          <div className="text-center space-y-1">
            <span className="text-3xl font-extrabold text-slate-900">
              {course.price === 0 ? 'Free Access' : `$${course.price}`}
            </span>
            <p className="text-xs text-slate-500">Full lifetime access & Course Certificate</p>
          </div>

          {isEnrolled ? (
            <Link
              to={`/student/learn/${course._id}`}
              className="w-full btn-success py-3 text-sm flex items-center justify-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Continue Learning ({enrollment?.progressPercentage || 0}%)</span>
            </Link>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full btn-primary py-3 text-sm"
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          )}

          <div className="text-xs text-slate-600 space-y-2 border-t border-slate-200 pt-4 font-medium">
            <div className="flex items-center justify-between">
              <span>Modules</span>
              <strong className="text-slate-900">{course.modules?.length || 0}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Assessment Type</span>
              <strong className="text-indigo-600">Confidence + Lab</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Course Modules Accordion */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Course Curriculum</h2>

        <div className="space-y-4">
          {course.modules?.map((mod, mIdx) => {
            const isOpen = openModuleIndex === mIdx;
            return (
              <div key={mod._id || mIdx} className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenModuleIndex(isOpen ? -1 : mIdx)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-indigo-600 uppercase tracking-wider font-semibold">Module {mIdx + 1}</span>
                    <h3 className="text-lg font-bold text-slate-900">{mod.title}</h3>
                    {mod.description && <p className="text-xs text-slate-500">{mod.description}</p>}
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-2 border-t border-slate-100 pt-4">
                    {mod.lessons?.map((les, lIdx) => (
                      <div key={les._id || lIdx} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {les.contentType === 'video' ? (
                            <PlayCircle className="w-4 h-4 text-violet-600" />
                          ) : les.contentType === 'quiz' ? (
                            <Award className="w-4 h-4 text-amber-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-indigo-600" />
                          )}
                          <span className="text-sm text-slate-800 font-medium">{les.title}</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="px-2 py-0.5 rounded bg-indigo-50 font-mono text-[10px] text-indigo-700 font-semibold border border-indigo-100">
                            {les.conceptSlug}
                          </span>
                          <span className="font-medium">{les.durationMinutes || 10} mins</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
