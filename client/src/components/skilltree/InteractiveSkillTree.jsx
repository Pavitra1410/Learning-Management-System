import React, { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CheckCircle2, Lock, Clock, AlertTriangle, Brain } from 'lucide-react';

// Custom Node Component for Concept Status
function ConceptNode({ data }) {
  const { label, p_know = 0.10, category, isBacktracking } = data;
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
  } else if (isBacktracking || p_know < 0.50) {
    borderStyle = 'border-rose-500/80 bg-slate-900 shadow-lg shadow-rose-500/20 text-white';
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
    <div className="w-full rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-sm space-y-0">
      
      {/* Refactored Header Bar with macOS Window Controls & Title */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        
        {/* macOS Dots & Window Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          </div>
          <span className="text-xs font-mono font-medium text-slate-600 flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-indigo-600" />
            Interactive Curriculum Directed Acyclic Graph (DAG) • Live BKT Projections
          </span>
        </div>

        {/* Legend on Right */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-600">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Mastered (≥85%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Review Due</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Prereq Gap (&lt;50%)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Locked Node</span>
        </div>

      </div>

      {/* Styled Canvas Interior */}
      <div className="w-full h-[500px] bg-[#0F172A] relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#0F172A]"
        >
          <Background color="#334155" gap={20} size={1} />
          <Controls className="!bg-slate-800 !border-slate-700 !text-slate-200" />
        </ReactFlow>
      </div>

    </div>
  );
}
