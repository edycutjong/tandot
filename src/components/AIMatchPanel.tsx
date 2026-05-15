'use client';

import React, { useState, useEffect } from 'react';
import { BrainCircuit, ShieldCheck, AlertTriangle, TrendingUp, Cpu } from 'lucide-react';
import { trustLabel } from '@/lib/constants';

interface AIMatchPanelProps {
  memberId?: string;
  name?: string;
  score: number;
}

export function AIMatchPanel({ memberId, score }: AIMatchPanelProps) {
  const [logs, setLogs] = useState<string[]>(() => []);
  const [isScanning, setIsScanning] = useState(() => true);
  const trust = trustLabel(score);

  useEffect(() => {
    const rawLogs = [
      `Analizando billetera: ${memberId || '0x...'}`,
      "Verificando historial en Arbitrum Sepolia...",
      "Calculando tasa de puntualidad histórica...",
      "Evaluando red de referidos...",
      "Comparando con perfiles de riesgo MXNB...",
      `Puntuación generada: ${score}/100`,
      `Recomendación: ${trust.text}`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < rawLogs.length) {
        const logToAdd = rawLogs[currentLogIndex];
        setLogs(prev => [...prev, logToAdd]);
        currentLogIndex++;
      } else {
        setIsScanning(false);
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [memberId, score, trust.text]);

  return (
    <div className="glass-card wow-card p-6 relative overflow-hidden">
      {/* Background Brain Icon */}
      <BrainCircuit className="absolute -bottom-6 -right-6 w-32 h-32 opacity-5 text-cyan-400 rotate-12" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Cpu className={`w-4 h-4 text-cyan-400 ${isScanning ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm tracking-tight uppercase">AI Match Analysis</h3>
              <p className="text-[10px] text-cyan-400/60 font-mono">Tandot Intelligence v2.0</p>
            </div>
          </div>
          {isScanning && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          )}
        </div>

        {/* Main Analysis Area */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass-card p-4 bg-black/20 border-white/5 text-center">
            <p className="text-[10px] uppercase text-white/40 mb-1">Trust Score</p>
            <p className="stat-value text-3xl font-mono" style={{ color: trust.color }}>{score}</p>
          </div>
          <div className="glass-card p-4 bg-black/20 border-white/5 text-center">
            <p className="text-[10px] uppercase text-white/40 mb-1">Rating</p>
            <p className="text-sm font-bold uppercase tracking-wider" style={{ color: trust.color }}>{trust.text}</p>
          </div>
        </div>

        {/* Factor Bars */}
        <div className="space-y-3 mb-6">
          <FactorBar icon={TrendingUp} label="Historial" value={85} />
          <FactorBar icon={ShieldCheck} label="Puntualidad" value={92} />
          <FactorBar icon={AlertTriangle} label="Riesgo" value={score > 80 ? 15 : 45} inverse />
        </div>

        {/* AI Console Logs */}
        <div className="bg-black/40 rounded-lg p-3 font-mono text-[10px] space-y-1 h-32 overflow-y-auto border border-white/5">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-cyan-500/50">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
              <span className={i === logs.length - 1 && isScanning ? 'text-white' : 'text-white/60'}>
                {log}
                {i === logs.length - 1 && isScanning && <span className="animate-pulse">_</span>}
              </span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-white/20 animate-pulse">Initializing neural analysis...</p>}
        </div>
      </div>
    </div>
  );
}

export function FactorBar({ icon: Icon, label, value, inverse = false }: { icon: React.ElementType, label: string, value: number, inverse?: boolean }) {
  const colorClass = inverse 
    ? (value > 40 ? 'bg-red-500' : 'bg-emerald-500')
    : (value > 80 ? 'bg-emerald-500' : value > 60 ? 'bg-cyan-500' : 'bg-amber-500');

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px]">
        <div className="flex items-center gap-1.5 text-white/60">
          <Icon className="w-3 h-3" />
          <span>{label}</span>
        </div>
        <span className="font-mono text-white/40">{value}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
