'use client';
import { createContext, useContext, useState, useEffect } from 'react';

export type VisitorMode = 'recruiter' | 'developer' | 'friend';

interface Ctx { mode: VisitorMode; setMode: (m: VisitorMode) => void; }
const VisitorCtx = createContext<Ctx>({ mode: 'developer', setMode: () => {} });

export function VisitorModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<VisitorMode>('developer');
  useEffect(() => {
    const saved = localStorage.getItem('pf_mode') as VisitorMode | null;
    if (saved) setModeState(saved);
  }, []);
  const setMode = (m: VisitorMode) => { setModeState(m); localStorage.setItem('pf_mode', m); };
  return <VisitorCtx.Provider value={{ mode, setMode }}>{children}</VisitorCtx.Provider>;
}

export const useVisitorMode = () => useContext(VisitorCtx);
