import React from 'react';
import { ShieldAlert, AlertTriangle, Clock, Code2 } from 'lucide-react';

export default function KeystrokeTelemetryLog({ submissions = [] }) {
  // Filter for submissions with paste events or suspicion flags
  const flaggedLogs = submissions.filter(s => s.pasteCount > 0 || s.quadrant === 'COPY_PASTER');

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
      
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          Keystroke & Paste Telemetry Audit Log
        </h3>
        <p className="text-xs text-slate-400">
          Non-accusatory telemetry flags monitoring rapid burst code insertion (&gt;50 characters in &lt;100ms) and paste events.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-300 uppercase font-mono border-b border-slate-800">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Concept</th>
              <th className="p-3">Test Score</th>
              <th className="p-3">Paste Events</th>
              <th className="p-3">MCI Score</th>
              <th className="p-3">Status Signal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {flaggedLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  No suspicious paste activity or rapid burst events flagged.
                </td>
              </tr>
            ) : (
              flaggedLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">
                    {log.studentName}
                    <span className="text-[10px] text-slate-500 block font-normal">{log.email}</span>
                  </td>
                  <td className="p-3 font-mono text-indigo-400">{log.conceptSlug}</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">{log.testScore}%</td>
                  <td className="p-3 font-mono font-bold text-rose-400">{log.pasteCount} Pastes</td>
                  <td className="p-3 font-mono font-bold text-amber-400">{log.mciScore}%</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-semibold">
                      Viva Review Recommended
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
