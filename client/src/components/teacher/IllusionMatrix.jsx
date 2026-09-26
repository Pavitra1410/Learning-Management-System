import React from 'react';
import { Target, AlertTriangle, CheckCircle2, HelpCircle, ShieldAlert } from 'lucide-react';

export default function IllusionMatrix({ data = [] }) {
  // Categorize data into 4 quadrants
  const trueMastery = data.filter(d => d.quadrant === 'GENUINE_MASTERY' || (d.testScore >= 70 && d.mciScore >= 70));
  const misconceptions = data.filter(d => d.quadrant === 'COPY_PASTER' || (d.testScore >= 70 && d.mciScore < 70));
  const imposter = data.filter(d => d.quadrant === 'LUCKY_GUESSER' || (d.testScore < 70 && d.mciScore >= 70));
  const struggling = data.filter(d => d.quadrant === 'STRUGGLING_LEARNER' || (d.testScore < 70 && d.mciScore < 70));

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
      
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" />
          Illusion of Competence Scatter Matrix (4-Quadrant Plot)
        </h3>
        <p className="text-xs text-slate-400">
          Evaluates student accuracy against confidence calibration & MCI score to differentiate genuine understanding from AI copy-pasting and overconfidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Quadrant 1: Imposter Syndrome (Low Confidence / High Accuracy) */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-amber-300 uppercase">Top-Left: Imposter Syndrome</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 font-mono text-[10px]">
              {imposter.length} Students
            </span>
          </div>

          <p className="text-[11px] text-amber-200/80">Low Confidence + High Accuracy (Under-confident capability)</p>

          <div className="space-y-1.5 pt-2">
            {imposter.length === 0 ? (
              <span className="text-[11px] text-slate-500 italic">No students in this quadrant</span>
            ) : (
              imposter.map(s => (
                <div key={s.studentId} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex justify-between text-slate-200">
                  <span className="font-semibold">{s.studentName}</span>
                  <span className="font-mono text-amber-300">MCI: {s.mciScore}%</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quadrant 2: True Mastery (High Confidence / High Accuracy) */}
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-emerald-300 uppercase">Top-Right: True Mastery</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 font-mono text-[10px]">
              {trueMastery.length} Students
            </span>
          </div>

          <p className="text-[11px] text-emerald-200/80">High Confidence + High Accuracy (Verified Genuine Mastery)</p>

          <div className="space-y-1.5 pt-2">
            {trueMastery.length === 0 ? (
              <span className="text-[11px] text-slate-500 italic">No students in this quadrant</span>
            ) : (
              trueMastery.map(s => (
                <div key={s.studentId} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex justify-between text-slate-200">
                  <span className="font-semibold">{s.studentName}</span>
                  <span className="font-mono text-emerald-300">MCI: {s.mciScore}%</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quadrant 3: Struggling / Novice (Low Confidence / Low Accuracy) */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-slate-400 uppercase">Bottom-Left: Novice Learner</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
              {struggling.length} Students
            </span>
          </div>

          <p className="text-[11px] text-slate-400">Low Confidence + Low Accuracy (Foundational gaps)</p>

          <div className="space-y-1.5 pt-2">
            {struggling.length === 0 ? (
              <span className="text-[11px] text-slate-500 italic">No students in this quadrant</span>
            ) : (
              struggling.map(s => (
                <div key={s.studentId} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs flex justify-between text-slate-300">
                  <span>{s.studentName}</span>
                  <span className="font-mono text-slate-400">MCI: {s.mciScore}%</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quadrant 4: Dangerous Misconception / Copy-Paster (High Confidence / Low Accuracy) */}
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-rose-300 uppercase">Bottom-Right: Misconception / Telemetry Flag</span>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-200 font-mono text-[10px]">
              {misconceptions.length} Students
            </span>
          </div>

          <p className="text-[11px] text-rose-200/80">High Confidence + Low Accuracy / High Paste Events</p>

          <div className="space-y-1.5 pt-2">
            {misconceptions.length === 0 ? (
              <span className="text-[11px] text-slate-500 italic">No students in this quadrant</span>
            ) : (
              misconceptions.map(s => (
                <div key={s.studentId} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex justify-between text-slate-200">
                  <div>
                    <span className="font-semibold text-rose-300 block">{s.studentName}</span>
                    <span className="text-[10px] text-rose-400/80">Pastes: {s.pasteCount}</span>
                  </div>
                  <span className="font-mono text-rose-400 font-bold">MCI: {s.mciScore}%</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
