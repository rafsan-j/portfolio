'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavBar } from '@/components/layout/NavBar';

const SOCIALS = [
  { label: 'Email',    href: 'mailto:rafsan2972jani@gmail.com',          tag: 'rafsan2972jani@gmail.com' },
  { label: 'GitHub',   href: 'https://github.com/rafsan-j',              tag: 'rafsan-j' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/ralsan-jani72',    tag: 'ralsan-jani72' },
  { label: 'Phone',    href: 'tel:+8801776132121',                       tag: '+880 1776 132121' },
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', email: '', message: '', hp: '' });
  const [status, setStatus] = useState<Status>('idle');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message, honeypot: form.hp }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch { setStatus('error'); }
  };

  return (
    <>
      <NavBar />
      <main className="max-w-2xl mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#f472b6] text-xs tracking-widest mb-2">// TRANSMISSION</p>
          <h1 className="font-display text-4xl md:text-5xl text-snow font-bold mb-3">Get in Touch</h1>
          <p className="text-ghost mb-10">For collaborations, opportunities, or just a conversation.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer"
                className="panel px-4 py-3 text-xs text-ghost hover:text-neon hover:border-neon/30 transition-all flex items-center justify-between group">
                <span className="text-muted">{s.label}</span>
                <span className="group-hover:text-neon transition-colors truncate ml-3">{s.tag}</span>
              </a>
            ))}
          </div>

          {status === 'sent' ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="panel p-10 text-center">
              <span className="status-dot block mx-auto mb-4" />
              <p className="font-display text-neon text-lg mb-2">Transmission Received</p>
              <p className="text-ghost text-sm">Thanks for reaching out. You'll get an auto-reply shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="panel p-6 space-y-5">
              {/* Honeypot — invisible to humans */}
              <input type="text" value={form.hp} onChange={set('hp')}
                className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              {[
                { k: 'name',  label: 'Name',  type: 'text',  ph: 'Your name' },
                { k: 'email', label: 'Email', type: 'email', ph: 'your@email.com' },
              ].map(f => (
                <div key={f.k}>
                  <label className="block text-xs text-ghost tracking-widest mb-1.5">{f.label.toUpperCase()}</label>
                  <input type={f.type} required value={(form as Record<string,string>)[f.k]} onChange={set(f.k)}
                    placeholder={f.ph}
                    className="w-full bg-surface border border-border rounded px-3 py-2.5 text-sm text-snow outline-none
                               focus:border-neon/50 transition-colors placeholder:text-muted font-mono" />
                </div>
              ))}

              <div>
                <label className="block text-xs text-ghost tracking-widest mb-1.5">MESSAGE</label>
                <textarea required rows={5} value={form.message} onChange={set('message')}
                  placeholder="What's on your mind..."
                  className="w-full bg-surface border border-border rounded px-3 py-2.5 text-sm text-snow outline-none
                             focus:border-neon/50 transition-colors placeholder:text-muted font-mono resize-none" />
              </div>

              <button type="submit" disabled={status === 'sending'} className="btn-neon w-full disabled:opacity-40">
                <span>{status === 'sending' ? 'Transmitting...' : 'Send Transmission →'}</span>
              </button>

              {status === 'error' && (
                <p className="text-xs text-red-400 text-center">Something went wrong. Email me directly instead.</p>
              )}
            </form>
          )}
        </motion.div>
      </main>
    </>
  );
}
