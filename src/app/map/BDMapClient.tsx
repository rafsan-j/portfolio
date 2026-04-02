'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MapLocation } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

// Approximate viewport positions for known BD cities (% from top-left of the map iframe)
const COORD_MAP: Record<string, { top: string; left: string }> = {
  'Dinajpur':    { top: '14%', left: '18%' },
  'Rajshahi':    { top: '30%', left: '20%' },
  'Dhaka':       { top: '50%', left: '47%' },
  "Cox's Bazar": { top: '82%', left: '63%' },
  'Sylhet':      { top: '34%', left: '72%' },
  'Chittagong':  { top: '70%', left: '66%' },
  'Khulna':      { top: '62%', left: '24%' },
  'Rangpur':     { top: '10%', left: '26%' },
};

export function BDMapClient() {
  const [locations, setLocations]   = useState<MapLocation[]>([]);
  const [selected, setSelected]     = useState<MapLocation | null>(null);
  const [wishlist, setWishlist]     = useState(false);

  useEffect(() => {
    supabase.from('pf_map_locations').select('*').then(({ data }) => {
      if (data) setLocations(data);
    });
  }, []);

  const visible = wishlist ? locations : locations.filter(l => !l.is_wishlist);

  return (
    <div className="relative">
      {/* Controls */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <button onClick={() => setWishlist(w => !w)}
          className={`tag transition-all ${wishlist ? 'tag-cyan' : 'tag-ghost'}`}>
          {wishlist ? '◉' : '○'} Show Wishlist
        </button>
        <div className="flex gap-4 text-xs text-ghost">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-neon inline-block" /> Visited</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan inline-block" /> Wishlist</span>
        </div>
      </div>

      {/* Map + story pin overlay */}
      <div className="relative panel overflow-hidden" style={{ minHeight: '580px' }}>
        <iframe src="/bd_map.html" className="w-full border-0" style={{ height: '580px' }} title="Bangladesh Map" />

        {/* Story pins floating above iframe */}
        <div className="absolute inset-0 pointer-events-none">
          {visible.map(loc => {
            const pos = COORD_MAP[loc.location_name];
            if (!pos) return null;
            return (
              <button key={loc.id} onClick={() => setSelected(s => s?.id === loc.id ? null : loc)}
                className="absolute pointer-events-auto group"
                style={{ top: pos.top, left: pos.left, transform: 'translate(-50%,-50%)' }}>
                <span className="w-3 h-3 rounded-full border-2 block transition-all duration-200 group-hover:scale-150"
                  style={{
                    background:  loc.is_wishlist ? '#00d4ff' : '#00ff88',
                    borderColor: loc.is_wishlist ? '#00d4ff' : '#00ff88',
                    boxShadow:   `0 0 8px ${loc.is_wishlist ? '#00d4ff' : '#00ff88'}`,
                  }} />
                <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] whitespace-nowrap font-mono
                                 bg-surface border border-border px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100
                                 transition-opacity pointer-events-none z-10"
                  style={{ color: loc.is_wishlist ? '#00d4ff' : '#00ff88' }}>
                  {loc.location_name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Story panel */}
        <AnimatePresence>
          {selected && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-4 w-64 panel p-4 z-20 pointer-events-auto"
              style={{ boxShadow: '0 0 0 1px rgba(0,255,136,0.15)' }}>
              <div className="flex justify-between items-start mb-2">
                <p className="font-display text-sm text-snow">{selected.location_name}</p>
                <button onClick={() => setSelected(null)} className="text-ghost hover:text-snow text-sm leading-none">✕</button>
              </div>
              {selected.is_wishlist && <span className="tag tag-cyan text-[10px] mb-2 inline-block">Wishlist</span>}
              {selected.visited_date && <p className="text-xs text-muted mb-2">{selected.visited_date}</p>}
              {selected.story && <p className="text-ghost text-xs leading-relaxed">{selected.story}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location cards below map */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {visible.map(loc => (
          <button key={loc.id} onClick={() => setSelected(s => s?.id === loc.id ? null : loc)}
            className={`panel p-3 text-left transition-all group ${selected?.id === loc.id ? 'border-neon/40' : 'hover:border-neon/20'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: loc.is_wishlist ? '#00d4ff' : '#00ff88' }} />
              <span className="font-display text-xs text-snow group-hover:text-neon transition-colors truncate">{loc.location_name}</span>
            </div>
            {loc.story && <p className="text-[10px] text-muted line-clamp-2 pl-4">{loc.story}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}
