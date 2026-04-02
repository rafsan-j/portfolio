'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { InboxMessage } from '@/lib/supabase';

// Simple password gate — upgrade to Supabase Auth in Week 3
const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS ?? 'rafsan2972';

export default function AdminPage() {
  const [authed, setAuthed]       = useState(false);
  const [pass, setPass]           = useState('');
  const [tab, setTab]             = useState<'inbox' | 'knowledge' | 'projects'>('inbox');
  const [messages, setMessages]   = useState<InboxMessage[]>([]);
  const [knowledge, setKnowledge] = useState('');
  const [kSaved, setKSaved]       = useState(false);
  const [stats, setStats]         = useState({ messages: 0, projects: 0, posts: 0 });

  useEffect(() => {
    const saved = sessionStorage.getItem('pf_admin_authed');
    if (saved === '1') setAuthed(true);
  }, []);

  const login = () => {
    if (pass === ADMIN_PASS) { setAuthed(true); sessionStorage.setItem('pf_admin_authed', '1'); }
    else alert('Wrong password');
  };

  useEffect(() => {
    if (!authed) return;
    supabase.from('pf_inbox_messages').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setMessages(data as InboxMessage[]);
    });
    supabase.from('pf_ai_knowledge').select('system_prompt_text').eq('id', 1).single().then(({ data }) => {
      if (data) setKnowledge(data.system_prompt_text ?? '');
    });
    Promise.all([
      supabase.from('pf_inbox_messages').select('id', { count: 'exact', head: true }),
      supabase.from('pf_projects_lab').select('id', { count: 'exact', head: true }),
      supabase.from('pf_inkwell_posts').select('id', { count: 'exact', head: true }),
    ]).then(([m, p, i]) => setStats({ messages: m.count ?? 0, projects: p.count ?? 0, posts: i.count ?? 0 }));
  }, [authed]);

  const markRead = async (id: string) => {
    await supabase.from('pf_inbox_messages').update({ is_read: true }).eq('id', id);
    setMessages(ms => ms.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  const saveKnowledge = async () => {
    await supabase.from('pf_ai_knowledge').update({ system_prompt_text: knowledge, last_updated: new Date().toISOString() }).eq('id', 1);
    setKSaved(true); setTimeout(() => setKSaved(false), 2000);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="panel p-8 w-full max-w-sm">
          <p className="font-display text-neon text-xs tracking-widest mb-6 text-center">// CONTROL CENTER</p>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Enter access code..."
            className="w-full bg-surface border border-border rounded px-3 py-2.5 text-sm text-snow outline-none
                       focus:border-neon/50 placeholder:text-muted font-mono mb-4" autoFocus />
          <button onClick={login} className="btn-neon w-full"><span>Access Control Center</span></button>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'inbox',     label: `Inbox (${stats.messages})` },
    { id: 'knowledge', label: 'AI Knowledge' },
    { id: 'projects',  label: 'Quick Stats' },
  ] as const;

  return (
    <div className="min-h-screen px-4 pt-8 pb-16 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-neon text-xs tracking-widest mb-1">// CONTROL CENTER</p>
          <h1 className="font-display text-2xl text-snow">Admin Dashboard</h1>
        </div>
        <a href="/" className="tag tag-ghost text-xs">← Back to Site</a>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Messages',  value: stats.messages, color: '#f472b6' },
          { label: 'Projects',  value: stats.projects, color: '#00ff88' },
          { label: 'Ink Posts', value: stats.posts,    color: '#a78bfa' },
        ].map(s => (
          <div key={s.label} className="panel p-4 text-center">
            <div className="font-display text-3xl mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-ghost">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors border-b-2 -mb-px ${
              tab === t.id ? 'text-neon border-neon' : 'text-ghost border-transparent hover:text-snow'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Inbox */}
      {tab === 'inbox' && (
        <div className="space-y-3">
          {messages.length === 0 && <p className="text-ghost text-sm text-center py-12">No messages yet.</p>}
          {messages.map(m => (
            <motion.div key={m.id} layout className={`panel p-5 ${!m.is_read ? 'border-neon/20' : ''}`}>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="font-display text-sm text-snow">{m.sender_name}</span>
                  <span className="text-muted text-xs ml-3">{m.sender_email}</span>
                  {!m.is_read && <span className="tag tag-neon text-[10px] ml-3">NEW</span>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!m.is_read && (
                    <button onClick={() => markRead(m.id)} className="tag tag-ghost text-[10px] hover:tag-neon">Mark read</button>
                  )}
                  <a href={`mailto:${m.sender_email}`} className="tag tag-cyan text-[10px]">Reply ↗</a>
                </div>
              </div>
              <p className="text-ghost text-sm leading-relaxed">{m.message}</p>
              <p className="text-muted text-[10px] mt-2">
                {new Date(m.created_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* AI Knowledge */}
      {tab === 'knowledge' && (
        <div>
          <p className="text-ghost text-xs mb-3">This text is fed to the AI assistant as its knowledge base. Edit it to update what the AI knows about you.</p>
          <textarea value={knowledge} onChange={e => setKnowledge(e.target.value)} rows={20}
            className="w-full bg-surface border border-border rounded px-4 py-3 text-sm text-snow outline-none
                       focus:border-neon/50 font-mono resize-none mb-4" />
          <button onClick={saveKnowledge} className="btn-neon">
            <span>{kSaved ? '✓ Saved!' : 'Save Knowledge Base'}</span>
          </button>
        </div>
      )}

      {/* Quick stats/links */}
      {tab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Add Project',       href: 'https://supabase.com', desc: 'Open Supabase Table Editor → pf_projects_lab' },
            { label: 'Upload Images',     href: 'https://supabase.com', desc: 'Supabase Storage → portfolio_media bucket' },
            { label: 'Write a Post',      href: 'https://supabase.com', desc: 'Supabase → pf_inkwell_posts → Insert Row' },
            { label: 'Add Map Location',  href: 'https://supabase.com', desc: 'Supabase → pf_map_locations → Insert Row' },
          ].map(item => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer"
              className="panel panel-accent p-5 group hover:border-neon/30 transition-all">
              <p className="font-display text-sm text-snow group-hover:text-neon transition-colors mb-2">{item.label} ↗</p>
              <p className="text-ghost text-xs">{item.desc}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
