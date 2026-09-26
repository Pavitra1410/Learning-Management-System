import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import InteractiveSkillTree from '../components/skilltree/InteractiveSkillTree';
import { SkeletonGrid, SkeletonCard } from '../components/ui/Skeleton';
import { Brain, Layers } from 'lucide-react';

export default function LearningProfilePage() {
  const [profile, setProfile] = useState(null);
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [profRes, graphRes] = await Promise.all([
          api.getStudentProfile(),
          api.getConceptGraph(),
        ]);
        setProfile(profRes.profile);
        setConcepts(graphRes.nodes || []);
      } catch (err) {
        console.error('Failed to load learning profile:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8 space-y-6">
          <SkeletonCard height="h-32" />
          <SkeletonGrid count={6} />
        </main>
      </div>
    );
  }

  const masteries = profile?.conceptMasteries || {};

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-semibold">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span>Bayesian Knowledge Profile & Concept Graph</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">
            Student Concept Mastery Map
          </h1>

          <p className="text-xs text-slate-500">
            Dynamic probabilities (p_know: 0–100%) estimated from multi-source cognitive evidence and Ebbinghaus retention decay.
          </p>
        </div>

        {/* Skill Tree Graph */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Interactive Curriculum Skill Tree
          </h2>
          <InteractiveSkillTree masteries={masteries} />
        </div>

        {/* Concept Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((node) => {
            const entry = masteries[node.slug] || masteries.get?.(node.slug);
            const p_know = entry?.p_know ?? 0.10;
            const pct = Math.round(p_know * 100);
            const isMastered = p_know >= 0.85;
            const isReview = p_know >= 0.60 && p_know < 0.85;

            return (
              <div key={node.slug} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="badge-primary font-mono text-[10px]">
                    L{node.level} • {node.category}
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    isMastered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : isReview
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    {isMastered ? '🟢 Mastered' : isReview ? '🟡 Review' : '🔴 Gap'} ({pct}%)
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">{node.label}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{node.description}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isMastered ? 'bg-emerald-500' : isReview ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {node.prerequisites?.length > 0 && (
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                    <span>Prereqs:</span>
                    <strong className="text-indigo-600">{node.prerequisites.join(', ')}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
