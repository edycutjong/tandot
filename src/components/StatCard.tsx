'use client';

import React from 'react';

interface StatCardProps {
  label: React.ReactNode;
  value: string | React.ReactNode;
  suffix?: string | React.ReactNode;
  subValue?: string | React.ReactNode;
  icon: string;
  trend?: string | React.ReactNode;
  color?: string;
}

export function StatCard({
  label,
  value,
  suffix,
  subValue,
  icon,
  trend,
  color = 'var(--cyan-400)',
}: StatCardProps) {
  return (
    <div className="glass-card wow-card p-5 border-white/5 hover:border-cyan-500/20 transition-all group relative overflow-hidden">
      {/* Background glow on hover */}
      <div 
        className="absolute -top-10 -right-10 w-24 h-24 blur-3xl rounded-full opacity-0 group-hover:opacity-10 transition-opacity"
        style={{ backgroundColor: color }}
      />
      
      <div className="flex items-start justify-between mb-3">
        <span 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-xs border border-white/5" 
          style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
        >
          {icon}
        </span>
        {(trend || subValue) && (
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: trend ? 'var(--emerald-400, #34d399)' : 'var(--text-muted)' }}>
            {trend || subValue}
          </span>
        )}
      </div>
      <div className="stat-value text-2xl mb-0.5 font-heading font-bold">
        {value}
        {suffix && <span className="text-sm opacity-50 ml-1 font-normal font-sans">{suffix}</span>}
      </div>
      <p className="text-xs font-medium uppercase tracking-tight" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  );
}
