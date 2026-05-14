'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/lib/constants';
import { GlassCard } from '@/components/ui/GlassCard';
import { TrustRing } from '@/components/ui/TrustRing';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { LocaleProvider, useLocale } from '@/lib/LocaleContext';
import { motion, Variants } from 'framer-motion';
import { ShieldCheck, BrainCircuit, Zap, ArrowRight, Coins } from 'lucide-react';
import type { Locale } from '@/lib/i18n';

export default function LandingPage() {
  const [locale, setLocaleRaw] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tandot-locale');
      if (saved === 'es' || saved === 'en') return saved;
    }
    return 'es';
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleRaw(l);
    try { localStorage.setItem('tandot-locale', l); } catch (_err) { /* quota */ }
  }, []);

  return (
    <LocaleProvider locale={locale} setLocale={setLocale}>
      <LandingContent />
    </LocaleProvider>
  );
}

function LandingContent() {
  const { t } = useLocale();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.4 } }
  };

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden">
      {/* ── Background Mesh ──────────────────────────────────── */}
      <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none -z-10 mix-blend-overlay" />

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-[var(--border)]"
           style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/icon.svg"
              alt="Tandot logo"
              width={32}
              height={32}
              className="w-8 h-8"
              priority
            />
            <span className="font-heading font-bold text-lg tracking-tight">{SITE.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link href="/dashboard" className="btn-primary text-sm">
              {t.nav_launch} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center px-6 pt-32 pb-20">
        
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12 mb-32 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center md:items-start w-full md:w-1/2"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="badge badge-active mb-8 shadow-glow self-center md:self-start">
              <span className="w-2 h-2 rounded-full bg-[var(--emerald-400)] pulse-live inline-block" />
              <span className="font-mono text-[var(--text-hi)]">{t.hero_badge}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="font-heading font-extrabold text-5xl md:text-7xl text-center md:text-left leading-[1.1] mb-6 tracking-tight text-[var(--text-hi)]"
            >
              {t.hero_headline_prefix}<br/><span className="bg-gradient-to-r from-[var(--cyan-400)] to-[var(--emerald-400)] bg-clip-text text-transparent">{t.hero_headline_highlight}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-center md:text-left max-w-2xl mb-4 font-body font-medium text-[var(--text-mid)]"
            >
              {t.hero_subtitle}
            </motion.p>

            <motion.p 
              variants={itemVariants}
              className="text-sm text-center md:text-left max-w-xl mb-12 text-[var(--text-low)]"
            >
              {t.hero_description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center md:justify-start w-full">
              <Link href="/dashboard" className="btn-primary text-base px-8 py-4 glow-cyan group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Coins className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                {t.hero_cta_primary}
              </Link>
              <a href="#how-it-works" className="btn-secondary text-base px-8 py-4">
                {t.hero_cta_secondary}
              </a>
            </motion.div>
          </motion.div>

          {/* 3D Floating Mockup - The WOW Factor */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: -15, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
            transition={{ delay: 0.4, duration: 1, type: "spring" }}
            className="w-full md:w-1/2 relative h-[400px]"
            style={{ perspective: 2000 }}
          >
            {/* Main AI Coordinator Card */}
            <motion.div 
              animate={{ y: [-10, 10, -10], rotateZ: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 rounded-2xl border border-[var(--cyan-500)]/40 bg-[var(--bg-elevated)]/80 backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(6,182,212,0.25)] z-20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--cyan-400)] to-[var(--emerald-400)] flex items-center justify-center shadow-glow">
                  <BrainCircuit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-display font-bold text-[var(--text-hi)]">{t.float_ai_engine}</div>
                  <div className="text-xs text-[var(--emerald-400)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--emerald-400)] animate-pulse" />
                    {t.float_ai_analyzing}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--text-mid)]">{t.float_escrow_status}</span>
                  <span className="text-[var(--text-hi)] font-mono">{t.float_escrow_value} <ShieldCheck className="w-4 h-4 inline text-[var(--emerald-400)] ml-1" /></span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-[var(--border-subtle)] pb-2">
                  <span className="text-[var(--text-mid)]">{t.float_current_round}</span>
                  <span className="text-[var(--text-hi)] font-mono">4 / 10</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-mid)]">{t.float_next_payout}</span>
                  <span className="text-[var(--text-hi)] font-mono">{t.float_next_payout_value}</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Member Card 1 */}
            <motion.div 
              animate={{ y: [0, 15, 0], x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
              className="absolute top-[10%] left-[0%] w-48 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)]/80 backdrop-blur-lg p-4 shadow-xl z-10"
            >
              <div className="text-xs text-[var(--text-low)] mb-1">{t.float_incoming}</div>
              <div className="text-lg font-mono font-bold text-[var(--text-hi)]">+1,000 MXNB</div>
              <div className="text-[10px] text-[var(--cyan-400)] mt-1 font-mono">From: 0x48...e9A2</div>
            </motion.div>

            {/* Floating Member Card 2 */}
            <motion.div 
              animate={{ y: [0, -15, 0], x: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 2 }}
              className="absolute bottom-[10%] right-[0%] w-48 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)]/80 backdrop-blur-lg p-4 shadow-xl z-30"
            >
              <div className="text-xs text-[var(--text-low)] mb-2">{t.float_trust_score}</div>
              <div className="flex items-center gap-3">
                <TrustRing score={96} size={36} strokeWidth={3} />
                <div className="text-xl font-display font-bold text-[var(--text-hi)]">96/100</div>
              </div>
            </motion.div>
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[var(--cyan-500)]/30 blur-[100px] rounded-full z-0 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-[var(--emerald-500)]/25 blur-[80px] rounded-full z-0 pointer-events-none" />
            <div className="absolute top-[80%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[var(--accent)]/20 blur-[80px] rounded-full z-0 pointer-events-none" />

          </motion.div>
        </div>

        {/* ── Stats Row ─────────────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full mb-32 relative z-10"
        >
          {[
            { value: '$2.8M', label: t.stat_volume, suffix: 'MXN' },
            { value: '156', label: t.stat_participants, suffix: '' },
            { value: '234', label: t.stat_payouts, suffix: '' },
            { value: '82', label: t.stat_trust, suffix: '/100', isRing: true },
          ].map((stat) => (
            <GlassCard key={stat.label} className="p-6 text-center flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--border-subtle)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {stat.isRing ? (
                <div className="mb-2">
                  <TrustRing score={82} size={64} strokeWidth={5} />
                </div>
              ) : (
                <div className="stat-value text-3xl md:text-4xl mb-2 font-display">
                  {stat.value}
                  <span className="text-sm opacity-60 ml-1 text-[var(--text-mid)]">{stat.suffix}</span>
                </div>
              )}
              <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-low)] mt-auto">
                {stat.label}
              </div>
            </GlassCard>
          ))}
        </motion.div>

        {/* ── How It Works ──────────────────────────────────── */}
        <section id="how-it-works" className="max-w-5xl w-full scroll-mt-32 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-[var(--text-hi)] mb-4">
              {t.how_title}
            </h2>
            <p className="text-[var(--text-mid)] max-w-2xl mx-auto">
              {t.how_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <BrainCircuit className="w-8 h-8 text-[var(--cyan-400)]" />,
                title: t.how_step1_title,
                desc: t.how_step1_desc,
              },
              {
                step: '02',
                icon: <Zap className="w-8 h-8 text-[var(--amber-500)]" />,
                title: t.how_step2_title,
                desc: t.how_step2_desc,
              },
              {
                step: '03',
                icon: <ShieldCheck className="w-8 h-8 text-[var(--emerald-400)]" />,
                title: t.how_step3_title,
                desc: t.how_step3_desc,
              },
            ].map((item) => (
              <GlassCard key={item.step} className="p-8 relative group">
                <div className="absolute top-6 right-6 font-display font-bold text-xl text-[var(--border-default)] group-hover:text-[var(--cyan-500)] transition-colors">
                  {item.step}
                </div>
                <div className="mb-6 p-4 rounded-2xl bg-[var(--bg-elevated)] inline-block border border-[var(--border-subtle)] group-hover:border-[var(--cyan-500)]/30 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-heading font-semibold text-xl text-[var(--text-hi)] mb-3">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--text-mid)]">
                  {item.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ── Sponsor Stack ─────────────────────────────────── */}
        <section className="max-w-4xl w-full mt-32 border-t border-[var(--border-subtle)] pt-12">
          <p className="text-xs text-center uppercase tracking-widest mb-8 text-[var(--text-low)] font-semibold">
            {t.sponsor_label}
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 items-center opacity-70">
            {['Bitso Business API', 'MXNB Stablecoin', 'Arbitrum Escrow', 'Supabase', 'OpenAI GPT-4'].map((sponsor) => (
              <div key={sponsor} className="font-display text-sm font-medium tracking-wide text-[var(--text-mid)] hover:text-[var(--text-hi)] transition-colors cursor-default">
                {sponsor}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-base)]/80 backdrop-blur-md py-8 px-6 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/icon.svg"
              alt="Tandot logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-sm font-medium text-[var(--text-mid)]">
              {t.footer_brand}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-[var(--text-low)] hover:text-[var(--text-hi)] transition-colors">{t.footer_github}</a>
            <a href="#" className="text-sm text-[var(--text-low)] hover:text-[var(--text-hi)] transition-colors">{t.footer_contracts}</a>
            <a href="#" className="text-sm text-[var(--text-low)] hover:text-[var(--text-hi)] transition-colors">{t.footer_docs}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
