'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import PayFlowLogo from './PayFlowLogo';

export interface DocsHeaderHandle {
  focusSearch: () => void;
  focusAsk: () => void;
}

interface DocsHeaderProps {
  onAskAssistant?: () => void;
}

const DocsHeader = forwardRef<DocsHeaderHandle, DocsHeaderProps>(
  function DocsHeader({ onAskAssistant }, ref) {
    const searchRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focusSearch: () => searchRef.current?.focus(),
      focusAsk: () => onAskAssistant?.(),
    }));

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        const meta = e.ctrlKey || e.metaKey;
        if (meta && e.key.toLowerCase() === 'k') { e.preventDefault(); searchRef.current?.focus(); }
        if (meta && e.key.toLowerCase() === 'i') { e.preventDefault(); onAskAssistant?.(); }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [onAskAssistant]);

    return (
      <header className="h-16 bg-gb-header border-b border-gb-border flex items-center justify-between px-4 lg:px-6 shrink-0 z-20">
        <div className="flex items-center gap-3 w-64">
          <a href="/" className="flex items-center gap-1.5 cursor-pointer group">
            <div className="bg-white/95 rounded-lg px-2.5 py-1.5 flex items-center justify-center shadow-sm">
              <PayFlowLogo className="h-7 w-auto transition-transform group-hover:scale-105" />
            </div>
            <div className="h-5 w-px bg-gb-border mx-1" />
            <span className="text-sm font-semibold text-white tracking-wide">Docs</span>
          </a>
        </div>
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-2xl justify-center">
          <div className="relative w-full max-w-[320px] group">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gb-muted absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
            </svg>
            <input ref={searchRef} type="text" placeholder="Search..." className="w-full bg-[#272A33] border border-transparent rounded-lg py-1.5 pl-9 pr-12 text-sm text-white placeholder-gb-muted focus:outline-none focus:border-[#3A3F50] focus:bg-[#2D3139] transition-all" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#3A3F50] border border-[#4A5060] text-[10px] font-medium text-gb-muted pointer-events-none">
              <span>Ctrl</span><span>K</span>
            </div>
          </div>
          <button onClick={onAskAssistant} className="flex items-center gap-2 bg-[#272A33] hover:bg-[#2D3139] border border-transparent hover:border-[#3A3F50] rounded-lg py-1.5 px-3 text-sm font-medium text-gb-muted hover:text-white transition-colors whitespace-nowrap">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Ask Assistant <span className="text-[10px] opacity-70 ml-0.5">Ctrl+I</span>
          </button>
        </div>
        <div className="flex items-center gap-3 justify-end w-64">
          <button className="hidden lg:block text-sm font-medium text-gb-muted hover:text-white transition-colors px-2 py-2">
            Reown Dashboard
          </button>
          <button className="hidden sm:flex items-center gap-1.5 bg-gb-green hover:bg-gb-greenHover text-black text-[13px] font-semibold py-1.5 px-3.5 rounded-lg transition-colors">
            AppKit Demo
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M9 18l6-6-6-6" /></svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-[#272A33] hover:bg-[#2D3139] border border-gb-border flex items-center justify-center text-gb-muted transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </header>
    );
  },
);

export default DocsHeader;
