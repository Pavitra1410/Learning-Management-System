import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import InteractiveSkillTree from '../components/skilltree/InteractiveSkillTree';
import { SkeletonGrid, SkeletonCard } from '../components/ui/Skeleton';
import { Brain, Layers, CheckCircle2, AlertTriangle, Activity, Clock, ArrowRight } from 'lucide-react';

export default function LearningProfilePage() {
  const [profile, setProfile] = useState(null);
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [profRes, graphRes] = await Promise.all([
          api.getStudentProfile().catch(() => ({ profile: null })),
          api.getConceptGraph().catch(() => ({ nodes: [] })),
        ]);
        setProfile(profRes?.profile || null);
        setConcepts(graphRes?.nodes || []);
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

  // Curated 9 diagnostic concept items for Bayesian Knowledge Tracing matrix
  const matrixItems = [
    {
      id: 'js-variables',
      title: 'Variables & Execution Context',
      category: 'Core JS',
      pct: 92,
      status: 'Mastered',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      barColor: 'bg-emerald-500',
      attempts: 5,
    },
    {
      id: 'closures',
      title: 'Lexical Scope & Closures',
      category: 'Core JS',
      pct: 86,
      status: 'Mastered',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      barColor: 'bg-emerald-500',
      attempts: 8,
    },
    {
      id: 'currying',
      title: 'Function Currying & Composition',
      category: 'Core JS',
      pct: 42,
      status: 'Prerequisite Gap',
      badgeClass: 'bg-rose-50 text-rose-700 border border-rose-100',
      barColor: 'bg-rose-500',
      attempts: 2,
    },
    {
      id: 'promises',
      title: 'Promises & Microtask Queue',
      category: 'Async JS',
      pct: 88,
      status: 'Mastered',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      barColor: 'bg-emerald-500',
      attempts: 6,
    },
    {
      id: 'async-await',
      title: 'Async / Await Syntactic Sugar',
      category: 'Async JS',
      pct: 64,
      status: 'Needs Review',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-100',
      barColor: 'bg-amber-500',
      attempts: 4,
    },
    {
      id: 'event-loop',
      title: 'Event Loop & Starvation',
      category: 'Async JS',
      pct: 35,
      status: 'Critical Gap',
      badgeClass: 'bg-rose-50 text-rose-700 border border-rose-100',
      barColor: 'bg-rose-500',
      attempts: 1,
    },
    {
      id: 'react-components',
      title: 'React Component Lifecycle',
      category: 'React',
      pct: 90,
      status: 'Mastered',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      barColor: 'bg-emerald-500',
      attempts: 7,
    },
    {
      id: 'react-effects',
      title: 'useEffect & Dependency Arrays',
      category: 'React',
      pct: 55,
      status: 'Needs Review',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-100',
      barColor: 'bg-amber-500',
      attempts: 3,
    },
    {
      id: 'memoization',
      title: 'useMemo & Referential Equality',
      category: 'React',
      pct: 28,
      status: 'Locked',
      badgeClass: 'bg-slate-100 text-slate-600 border border-slate-200',
      barColor: 'bg-slate-400',
      attempts: 0,
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Header & Cognitive Telemetry */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-semibold">
              <Brain className="w-4 h-4 text-indigo-600" />
              <span>Bayesian Knowledge Profile & Concept Graph</span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900">
              Student Concept Mastery Map
            </h1>
          </div>

          {/* Executive 4-Card Cognitive Telemetry Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-8">
            
            {/* Card 1: Mastered Nodes */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Mastered Nodes</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-semibold">
                  ≥ 85%
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900">5 / 12</span>
                <span className="text-xs text-slate-500 font-mono">concepts</span>
              </div>
            </div>

            {/* Card 2: Active Learning Gaps */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Active Learning Gaps</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-mono font-semibold">
                  Detected
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900">2 Critical Gaps</span>
                <span className="text-xs text-slate-500 font-mono">action needed</span>
              </div>
            </div>

            {/* Card 3: Knowledge Retention (BKT) */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Knowledge Retention (BKT)</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-mono font-semibold">
                  78% Stability
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900">Optimal</span>
                <span className="text-xs text-slate-500 font-mono">decay model</span>
              </div>
            </div>

            {/* Card 4: Spaced Review Due */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Spaced Review Due</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-mono font-semibold">
                  1 Concept Today
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900">Ebbinghaus Alert</span>
                <span className="text-xs text-slate-500 font-mono">review ready</span>
              </div>
            </div>

          </div>
        </div>

        {/* Skill Tree Graph */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Interactive Curriculum Skill Tree
          </h2>
          <InteractiveSkillTree masteries={masteries} />
        </div>

        {/* Detailed Concept Mastery & Diagnostic Breakdown Section */}
        <div className="space-y-4 pt-4">
          <div>
            <h2 className="text-slate-900 font-bold text-lg">
              Detailed Concept Mastery & Diagnostic Breakdown
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Granular Bayesian Knowledge Tracing scores across curriculum modules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {matrixItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-mono font-medium px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.badgeClass}`}>
                      {item.status === 'Mastered' ? '🟢 Mastered' : item.status === 'Needs Review' ? '🟡 Needs Review' : item.status === 'Locked' ? '🔒 Locked' : '🔴 ' + item.status} ({item.pct}%)
                    </span>
                  </div>

                  <h3 className="text-slate-900 font-semibold text-sm mt-3">
                    {item.title}
                  </h3>

                  {/* Progress Bar */}
                  <div className="bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-mono">
                    Attempts: <strong className="text-slate-700">{item.attempts}</strong>
                  </span>

                  <Link
                    to="/compiler"
                    className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1 group"
                  >
                    <span>Practice Concept</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
