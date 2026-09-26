import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, User, X, CheckCircle2, Download, Play, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function WebinarModal({ webinar, isOpen, onClose }) {
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 15, seconds: 0 });

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !webinar) return null;

  const downloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CogniTrace LMS//Webinar Session//EN
BEGIN:VEVENT
SUMMARY:${webinar.title}
DESCRIPTION:${webinar.description}
LOCATION:CogniTrace Virtual Auditorium
DTSTART:20261015T180000Z
DTEND:20261015T193000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${webinar.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Calendar event (.ics) generated and downloaded!');
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-md bg-slate-900/40 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white border border-slate-200/90 space-y-6 shadow-2xl overflow-hidden relative animate-fade-in">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200">
              <Video className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-wider font-semibold">Masterclass Auditorium</span>
              <h2 className="text-xl font-bold text-slate-900">{webinar.title}</h2>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-white text-slate-500 hover:text-slate-800 border border-slate-200 shadow-sm transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Countdown & Stream Preview */}
        <div className="px-6 space-y-6">
          
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-medium">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Live Masterclass Starts In:</span>
            </div>

            <div className="font-mono font-bold text-sm text-indigo-700 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 shadow-sm">{String(countdown.hours).padStart(2, '0')}h</span>
              <span>:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 shadow-sm">{String(countdown.minutes).padStart(2, '0')}m</span>
              <span>:</span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 shadow-sm">{String(countdown.seconds).padStart(2, '0')}s</span>
            </div>
          </div>

          {/* Embedded WebRTC Stream Player Preview */}
          <div className="aspect-video w-full rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-indigo-600/30 border border-indigo-400 text-indigo-300 flex items-center justify-center animate-pulse">
              <Play className="w-8 h-8 fill-indigo-300" />
            </div>
            <p className="text-xs font-semibold text-slate-200">Virtual Auditorium Test Stream Ready</p>
            <span className="text-[10px] text-slate-400 font-mono">Stream Signal: WebRTC HD • Low Latency</span>
          </div>

          {/* Instructor & Syllabus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="text-slate-500 uppercase font-mono text-[10px] font-semibold">Lead Instructor</span>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <User className="w-4 h-4 text-indigo-600" />
                <span>{webinar.instructorName}</span>
              </div>
              <p className="text-slate-600 text-[11px]">Senior EdTech Researcher & Principal Systems Architect</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <span className="text-slate-500 uppercase font-mono text-[10px] font-semibold">Syllabus Highlights</span>
              <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside font-medium">
                <li>V8 Execution Contexts & Lexical Closures</li>
                <li>Event Loop Microtask Priority Scheduling</li>
                <li>React State Synchronization & Memoization</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={downloadICS}
            className="w-full sm:w-auto btn-primary text-xs flex items-center justify-center gap-2 py-2.5 px-5"
          >
            <Download className="w-4 h-4" />
            <span>Add to Google Calendar (.ics)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto btn-ghost text-xs py-2.5 px-6"
          >
            Close Auditorium
          </button>
        </div>

      </div>
    </div>
  );
}
