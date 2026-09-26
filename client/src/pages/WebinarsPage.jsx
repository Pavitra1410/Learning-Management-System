import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import WebinarModal from '../components/webinar/WebinarModal';
import { SkeletonGrid } from '../components/ui/Skeleton';
import { Video, Calendar, Clock, User, CheckCircle2, ArrowRight, Play, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function WebinarsPage() {
  const { user } = useAuth();
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [activeWebinar, setActiveWebinar] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getWebinars();
        setWebinars(res.webinars || []);
      } catch (err) {
        toast.error('Failed to load scheduled webinars');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRegister = async (webinar) => {
    if (!user) {
      toast.warning('Please log in to register for live masterclasses.');
      return;
    }
    setRegisteringId(webinar._id);
    try {
      const res = await api.registerWebinar(webinar._id);
      toast.success(res.message || 'Registered successfully for masterclass!');
      const updated = await api.getWebinars();
      setWebinars(updated.webinars || []);
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 min-h-[calc(100vh-4rem)]">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200/80 text-blue-700 text-xs font-semibold">
          <Video className="w-3.5 h-3.5 text-blue-600" />
          <span>Interactive Sessions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Live Masterclasses & Webinars</h1>
        <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
          Join expert instructors for real-time interactive masterclasses covering JavaScript execution context, React hook optimizations, and algorithmic problem solving.
        </p>
      </div>

      {loading ? (
        <SkeletonGrid count={4} />
      ) : webinars.length === 0 ? (
        <div className="py-20 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
          No upcoming webinars scheduled.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {webinars.map((webinar) => {
            const isRegistered = user && webinar.registeredStudents?.some(s => s.userId === user.id || s.userId === user._id);
            return (
              <div 
                key={webinar._id} 
                className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 space-y-6 flex flex-col justify-between hover:shadow-lg hover:border-blue-300/80 transition-all duration-300 shadow-sm group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200/80 tracking-wide text-[11px]">
                      LIVE MASTERCLASS
                    </span>
                    <span className="text-slate-500 flex items-center gap-1.5 font-medium bg-slate-100/80 px-2.5 py-1 rounded-full text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {webinar.durationMinutes || 90} mins
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {webinar.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {webinar.description}
                  </p>
                </div>

                <div className="space-y-4 border-t border-slate-100 pt-5">
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{webinar.instructorName}</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{webinar.date} ({webinar.time})</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    {isRegistered ? (
                      <button
                        onClick={() => setActiveWebinar(webinar)}
                        className="btn-primary w-full text-xs h-11 justify-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Enter Virtual Auditorium</span>
                        <i className="lumen-ring" aria-hidden="true" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(webinar)}
                        disabled={registeringId === webinar._id}
                        className="btn-primary w-full text-xs h-11 justify-center gap-2"
                      >
                        <span>{registeringId === webinar._id ? 'Registering...' : 'Register for Masterclass'}</span>
                        <ArrowRight className="w-4 h-4" />
                        <i className="lumen-ring" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Webinar Modal Auditorium */}
      {activeWebinar && (
        <WebinarModal
          webinar={activeWebinar}
          isOpen={!!activeWebinar}
          onClose={() => setActiveWebinar(null)}
        />
      )}

    </div>
  );
}

