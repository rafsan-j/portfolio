'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VisitorMode } from '@/components/ui/VisitorModeProvider';

type Message = { role: 'user' | 'assistant'; content: string };

const STARTERS: Record<VisitorMode, string[]> = {
  recruiter: ["What is Rafsan's strongest skill?", 'Tell me about his leadership.', 'What are his academic achievements?', 'Is he open to opportunities?'],
  developer: ["What projects has he built?", "What's the AgriBase project?", "What's his tech stack?", 'Has he done research?'],
  friend:    ["What does Rafsan do for fun?", 'Where is he from?', "What's he working on now?", "What's his biggest achievement?"],
};

interface Props { onClose: () => void; mode?: VisitorMode; }

export function AIAssistant({ onClose, mode = 'developer' }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm Rafsan's AI representative. Ask me anything about his background, projects, or skills." },
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text?: string) => {
    const userMsg = (text ?? input).trim();
    if (!userMsg || loading) return;
    setInput('');
    const updated: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(updated);
    setLoading(true);
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      if (!res.ok) throw new Error();
      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      let reply = '';
      setMessages(p => [...p, { role: 'assistant', content: '' }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages(p => { const c = [...p]; c[c.length-1] = { role: 'assistant', content: reply }; return c; });
      }
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: 'Connection issue. Email rafsan2972jani@gmail.com directly.' }]);
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-void/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
        onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40 }}
          className="panel w-full max-w-lg flex flex-col" style={{ height: '520px' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="status-dot" /><span className="font-display text-xs text-neon tracking-widest">AI ASSISTANT</span>
            </div>
            <button onClick={onClose} className="text-ghost hover:text-snow text-xs">✕ ESC</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] text-xs px-3 py-2 rounded leading-relaxed ${
                  m.role === 'user' ? 'bg-neon/10 border border-neon/20 text-snow' : 'bg-surface border border-border text-ghost'}`}>
                  {m.role === 'assistant' && <span className="text-neon text-[10px] mr-1 font-display">RJ.AI&gt;</span>}
                  {m.content}
                  {m.role === 'assistant' && loading && i === messages.length-1 && m.content === '' && <span className="cursor" />}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {STARTERS[mode].map(q => (
                <button key={q} onClick={() => send(q)}
                  className="text-[10px] px-2 py-1 border border-border text-muted hover:text-neon hover:border-neon/40 rounded transition-all">
                  {q}
                </button>
              ))}
            </div>
          )}
          <div className="px-4 pb-4">
            <div className="flex gap-2 border border-border rounded bg-surface px-3 py-2">
              <span className="text-neon text-xs self-center">&gt;</span>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about Rafsan..."
                className="flex-1 bg-transparent text-sm text-snow outline-none placeholder:text-muted" autoFocus />
              <button onClick={() => send()} disabled={loading}
                className="text-neon text-xs disabled:opacity-30">SEND</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
