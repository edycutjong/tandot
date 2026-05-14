import Link from 'next/link';
import Image from 'next/image';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden items-center justify-center">
      {/* ── Background Mesh ──────────────────────────────────── */}
      <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-(image:--noise-svg) opacity-[0.03] pointer-events-none -z-10 mix-blend-overlay" />

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-(--cyan-500)/20 blur-[120px] rounded-full z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity mb-12">
          <Image
            src="/icon.svg"
            alt="Tandot logo"
            width={48}
            height={48}
            className="w-12 h-12"
            priority
          />
        </Link>

        <div className="w-20 h-20 rounded-full bg-slate-800/50 border border-(--cyan-500)/30 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
          <ShieldAlert className="w-10 h-10 text-(--cyan-400)" />
        </div>

        <h1 className="font-heading font-extrabold text-6xl md:text-8xl leading-none mb-4 tracking-tighter bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent">
          404
        </h1>
        
        <h2 className="font-heading font-semibold text-2xl text-(--text-hi) mb-6">
          Page Not Found / Página No Encontrada
        </h2>
        
        <p className="text-(--text-mid) mb-10 max-w-md font-body text-lg">
          We couldn&apos;t find the page you were looking for. It might have been moved or doesn&apos;t exist.
        </p>

        <Link href="/" className="btn-primary text-base px-8 py-4 glow-cyan group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
