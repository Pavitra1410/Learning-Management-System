import React, { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CheckCircle2, Lock, Clock, AlertTriangle, Sparkles, Brain } from 'lucide-react';

// Custom Node Component for Concept Status
function ConceptNode({ data }) {
  const { label, p_know = 0.10, status, category, isBacktracking } = data;
  const pct = Math.round(p_know * 100);

  let borderStyle = 'border-slate-700 bg-slate-900 text-slate-400';
  let badgeStyle = 'bg-slate-800 text-slate-400';
  let icon = <Lock className="w-3.5 h-3.5 text-slate-500" />;

  if (p_know >= 0.85) {
    borderStyle = 'border-emerald-500/80 bg-slate-900 shadow-lg shadow-emerald-500/20 text-white';
    badgeStyle = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  } else if (p_know >= 0.60) {
    borderStyle = 'border-amber-500/80 bg-slate-900 shadow-lg shadow-amber-500/20 text-white animate-pulse';
    badgeStyle = 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
    icon = <Clock className="w-4 h-4 text-amber-400" />;
  } else if (isBacktracking) {
    borderStyle = 'border-rose-500 bg-rose-950/40 shadow-xl shadow-rose-500/30 text-white animate-bounce';
    badgeStyle = 'bg-rose-500/20 text-rose-300 border border-rose-500/40';
    icon = <AlertTriangle className="w-4 h-4 text-rose-400" />;
  }

  return (
    <div className={`p-4 rounded-2xl border ${borderStyle} min-w-[200px] space-y-2 transition-all`}>
      <Handle type="target" position={Position.Top} className="!bg-indigo-500 !w-3 !h-3" />
      
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-[10px] uppercase text-indigo-400">{category}</span>
        {icon}
      </div>

      <div className="text-sm font-bold truncate">{label}</div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
        <span className="text-[10px] text-slate-400">BKT Probability</span>
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${badgeStyle}`}>
          {pct}%
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-indigo-500 !w-3 !h-3" />
    </div>
  );
}

const nodeTypes = { conceptNode: ConceptNode };

export default function InteractiveSkillTree({ masteries = {}, backtrackFrom = null }) {
  // Define initial DAG Layout Nodes
  const nodes = useMemo(() => {
    const rawNodes = [
      // Track 1: Core JS
      { id: 'js-variables', label: 'Variables & Scope', category: 'Core JS', x: 50, y: 50 },
      { id: 'js-functions', label: 'Functions', category: 'Core JS', x: 50, y: 180 },
      { id: 'closures', label: 'Lexical Closures', category: 'Core JS', x: 50, y: 310 },
      { id: 'currying', label: 'Function Currying', category: 'Core JS', x: 50, y: 440 },

      // Track 2: Async JS
      { id: 'async-basics', label: 'Async Basics', category: 'Async JS', x: 300, y: 50 },
      { id: 'promises', label: 'Promises & Chaining', category: 'Async JS', x: 300, y: 180 },
      { id: 'async-await', label: 'Async / Await', category: 'Async JS', x: 300, y: 310 },
      { id: 'event-loop', label: 'Event Loop Microtasks', category: 'Async JS', x: 300, y: 440 },

      // Track 3: React Framework
      { id: 'react-components', label: 'React Components', category: 'React', x: 550, y: 50 },
      { id: 'react-state', label: 'State (useState)', category: 'React', x: 550, y: 180 },
      { id: 'react-effects', label: 'Effects (useEffect)', category: 'React', x: 550, y: 310 },
      { id: 'memoization', label: 'Memoization (useMemo)', category: 'React', x: 550, y: 440 },
    ];

    return rawNodes.map((n) => {
      const entry = masteries[n.id] || masteries.get?.(n.id);
      const p_know = entry?.p_know ?? 0.10;
      return {
        id: n.id,
        type: 'conceptNode',
        position: { x: n.x, y: n.y },
        data: {
          label: n.label,
          category: n.category,
          p_know,
          isBacktracking: backtrackFrom === n.id,
        },
      };
    });
  }, [masteries, backtrackFrom]);

  // Define Edges with Backtracking animation
  const edges = useMemo(() => [
    // Core JS Edges
    { id: 'e1', source: 'js-variables', target: 'js-functions', animated: true },
    { id: 'e2', source: 'js-functions', target: 'closures', animated: true },
    { id: 'e3', source: 'closures', target: 'currying', animated: true },

    // Async Edges
    { id: 'e4', source: 'async-basics', target: 'promises', animated: true },
    { id: 'e5', source: 'promises', target: 'async-await', animated: true },
    { id: 'e6', source: 'async-await', target: 'event-loop', animated: true },

    // React Edges
    { id: 'e7', source: 'react-components', target: 'react-state', animated: true },
    { id: 'e8', source: 'react-state', target: 'react-effects', animated: true },
    { id: 'e9', source: 'react-effects', target: 'memoization', animated: true },

    // Cross-track Prerequisite Edges
    { id: 'e10', source: 'closures', target: 'react-effects', label: 'Prerequisite', style: { stroke: '#8b5cf6', strokeDasharray: '5 5' } },
    { id: 'e11', source: 'async-await', target: 'react-effects', label: 'Prerequisite', style: { stroke: '#8b5cf6', strokeDasharray: '5 5' } },
  ], []);

  return (
    <div className="w-full h-[520px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative shadow-2xl">
      <div className="absolute top-4 left-4 z-10 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1 backdrop-blur">
        <div className="flex items-center gap-2 text-indigo-400 font-bold">
          <Brain className="w-4 h-4" />
          <span>Interactive Skill DAG Graph</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Mastered (≥85%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Review Due</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600" /> Locked (&lt;60%)</span>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-950"
      >
        <Background color="#334155" gap={20} size={1} />
        <Controls className="!bg-slate-900 !border-slate-800 !text-white" />
      </ReactFlow>
    </div>
  );
}
