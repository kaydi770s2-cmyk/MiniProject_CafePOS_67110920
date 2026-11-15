import React from 'react';

export default function StatCard({ title, count, colorClass }: { title: string; count: number; colorClass: string }): React.JSX.Element {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{count}</p>
      </div>
      <div className="text-xs text-slate-400 self-end">รายการ</div>
    </div>
  );
}