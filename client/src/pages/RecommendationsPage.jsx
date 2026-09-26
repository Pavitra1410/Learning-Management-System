import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getRecommendations();
        setRecommendations(res.recommendations || []);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="py-20 text-center text-slate-500 bg-slate-50 min-h-[calc(100vh-4rem)]">Loading course recommendations...</div>;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Recommended Learning</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Recommended Courses & Topics
          </h1>

          <p className="text-xs sm:text-sm text-slate-500">
            Explore curated courses and practice exercises tailored to expand your software development skills.
          </p>
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                  {rec.type || 'Featured Course'}
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono text-[10px] uppercase font-bold">
                  Recommended
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">{rec.title}</h3>

              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-blue-50/40 p-4 rounded-2xl border border-blue-200/60">
                {rec.reason || 'Highly rated course topic among developers building full-stack web applications.'}
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  to="/courses"
                  className="btn-primary py-2 px-5 text-xs gap-1.5"
                >
                  <span>Explore Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <i className="lumen-ring" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

