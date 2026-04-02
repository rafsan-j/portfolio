'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisitorMode } from '@/components/ui/VisitorModeProvider';
import { NavBar }          from '@/components/layout/NavBar';
import { WebGLBackground } from '@/components/sections/WebGLBackground';
import { AIAssistant }     from '@/components/sections/AIAssistant';

const MODE_CFG = {
  recruiter: { label: 'RECRUITER MODE', color: '#ffb400', tagline: 'Reviewing a top 0.01% national merit candidate.', cta: 'Download Resume', ctaHref: '/resume.pdf' },
  developer: { label: 'DEVELOPER MODE', color: '#00ff88', tagline: "Let's talk code, systems, and ideas.",              cta: 'View GitHub',      ctaHref: 'https://github.com/rafsan-j' },
  friend:    { label: 'FRIEND MODE',    color: '#00d4ff', tagline: 'Hey! Good to see you here 👋',                       cta: 'Say Hello',        ctaHref: '/contact' },
} as const;

const STATUSES = [
  'Currently building: this portfolio.',
  'Reading: CLRS Algorithms.',
  'Open to: BSc CSE in Türkiye.',
  'Last commit: today.',
  'Status: caffeinated and coding.',
];

const BENTO = [
  { href: '/lab',     label: '// THE LAB',     sub: 'Projects & builds',      color: '#00ff88', size: 'md:col-span-2', icon: '⚗', preview: 'AgriBase · HAYTHAM X ONE · DCMD' },
  { href: '/archive', label: '// THE ARCHIVE',  sub: 'Research & academic',    color: '#00d4ff', size: 'md:col-span-1', icon: '◈', preview: 'CERN · BdJSO · IYMC' },
  { href: '/inkwell', label: '// THE INKWELL',  sub: 'Writing & poetry',       color: '#a78bfa', size: 'md:col-span-1', icon: '✦', preview: 'Essays · Verse · Thoughts' },
  { href: '/visuals', label: '// VISUALS',      sub: 'Photography & art',      color: '#fb923c', size: 'md:col-span-1', icon: '◎', preview: 'Gallery · Generative' },
  { href: '/map',     label: '// COORDINATES',  sub: 'Bangladesh on the grid', color: '#34d399', size: 'md:col-span-2', icon: '◉', preview: 'Dinajpur · Rajshahi · Dhaka' },
  { href: '/contact', label: '// TRANSMISSION', sub: 'Get in touch',           color: '#f472b6', size: 'md:col-span-1', icon: '▶', preview: 'rafsan2972jani@gmail.com' },
];

export default function HomePage() {
  const { mode, setMode } = useVisitorMode();
  const [statusIdx, setStatusIdx] = useState(0);
  const [time, setTime]           = useState('');
  const [showAI, setShowAI]       = useState(false);

  const cfg = MODE_CFG[mode];

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setStatusIdx(i => (i + 1) % STATUSES.length), 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <WebGLBackground />
      <NavBar />
      <main className="relative z-10 min-h-screen px-4 pt-24 pb-16 max-w-6xl mx-auto">

        {/* Mode switcher */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {(Object.keys(MODE_CFG) as (keyof typeof MODE_CFG)[]).map(m => (
            <button key={m} onClick={() => setMode(m)} className="tag transition-all" style={{
              borderColor: m === mode ? MODE_CFG[m].color : 'rgba(255,255,255,0.08)',
              color: m === mode ? MODE_CFG[m].color : '#4a4a6a',
              background: m === mode ? `${MODE_CFG[m].color}12` : 'transparent',
            }}>{MODE_CFG[m].label}</button>
          ))}
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="status-dot" style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
            <span className="text-xs tracking-widest" style={{ color: cfg.color }}>{cfg.label}</span>
            <span className="text-ghost text-xs ml-auto">BD / {time}</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-2 leading-none tracking-tight" data-text="RAFSAN JANI">
            <span className="text-snow">RAFSAN </span>
            <span className="text-neon-glow glitch" data-text="JANI">JANI</span>
          </h1>
          <p className="text-ghost text-sm tracking-[0.3em] uppercase mb-6">Engineering Aspirant &nbsp;·&nbsp; CS Student &nbsp;·&nbsp; Builder</p>

          <AnimatePresence mode="wait">
            <motion.p key={mode} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
              className="text-lg mb-4 max-w-xl" style={{ color: cfg.color }}>{cfg.tagline}</motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p key={statusIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-xs text-ghost tracking-widest mb-8">
              &gt;&nbsp;<span className="text-neon">{STATUSES[statusIdx]}</span><span className="cursor" />
            </motion.p>
          </AnimatePresence>

          <div className="flex gap-4 flex-wrap">
            <a href={cfg.ctaHref} target={cfg.ctaHref.startsWith('http') ? '_blank' : '_self'}
              rel="noreferrer" className="btn-neon" style={{ borderColor: cfg.color, color: cfg.color }}>
              <span>{cfg.cta}</span>
            </a>
            <button onClick={() => setShowAI(true)} className="btn-neon" style={{ borderColor: '#4a4a6a', color: '#8888aa' }}>
              <span>Ask AI About Me ✦</span>
            </button>
          </div>

          {mode === 'recruiter' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="flex gap-6 mt-8 pt-8 border-t border-border flex-wrap">
              {[{ v: '17th', l: 'National Merit Rank' }, { v: '5.00', l: 'HSC GPA (Perfect)' }, { v: '297', l: 'Cadets Led' }, { v: 'Bronze', l: 'Innovation World Cup BD' }]
                .map(s => (
                  <div key={s.l}>
                    <div className="font-display text-2xl text-amber">{s.v}</div>
                    <div className="text-xs text-ghost">{s.l}</div>
                  </div>
                ))}
            </motion.div>
          )}
        </motion.div>

        {/* Bento grid */}
        <section className="mb-12">
          <p className="text-ghost text-xs tracking-widest mb-4">// NAVIGATE</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {BENTO.map((cell, i) => (
              <motion.div key={cell.href} className={cell.size}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .07 }}>
                <Link href={cell.href} className="block">
                  <div className="panel panel-accent p-5 group cursor-pointer transition-all duration-300 hover:shadow-neon min-h-[140px] flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <span className="font-display text-xs tracking-widest" style={{ color: cell.color }}>{cell.label}</span>
                      <span className="text-2xl opacity-30 group-hover:opacity-70 transition-opacity">{cell.icon}</span>
                    </div>
                    <p className="text-snow text-sm mb-auto">{cell.sub}</p>
                    <p className="text-xs text-muted mt-3 group-hover:text-ghost transition-colors">{cell.preview}</p>
                    <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500" style={{ background: cell.color }} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="text-center text-ghost text-xs tracking-widest border-t border-border pt-8">
          Press <kbd className="bg-surface border border-border px-1 rounded">` </kbd> for terminal &nbsp;·&nbsp;
          <kbd className="bg-surface border border-border px-1 rounded">⌘K</kbd> for commands
        </div>
      </main>

      {showAI && <AIAssistant onClose={() => setShowAI(false)} mode={mode} />}
    </>
  );
}
