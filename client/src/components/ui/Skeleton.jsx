import React from 'react';

export function SkeletonCard({ height = 'h-40' }) {
  return (
    <div className={`p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 animate-pulse ${height}`}>
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-800 rounded"></div>
        <div className="h-4 w-12 bg-slate-800 rounded"></div>
      </div>
      <div className="h-6 w-3/4 bg-slate-800 rounded"></div>
      <div className="h-4 w-full bg-slate-800 rounded"></div>
      <div className="h-4 w-2/3 bg-slate-800 rounded"></div>
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} height="h-32" />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} height="h-48" />
      ))}
    </div>
  );
}
