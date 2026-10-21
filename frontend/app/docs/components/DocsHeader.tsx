'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import PayFlowLogo from '@/components/PayFlowLogo';
import Link from 'next/link';

export interface DocsHeaderHandle { focusSearch: () => void; focusAsk: () => void; }
interface DocsHeaderProps { onAskAssistant?: () => void; }

const DocsHeader = forwardRef<DocsHeaderHandle, DocsHeaderProps>(function DocsHeader({ onAskAssistant }, ref) {
  const searchRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({ focusSearch: () => searchRef.current?.focus(), focusAsk: () => onAskAssistant?.() }));

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
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0 z-20">
      <div className="flex items-center gap-3 w-64">
        <Link href="/" className="flex items-center gap-1.5 cursor-pointer group">
          <div className="bg-white rounded-lg px-2.5 py-1.5 flex items-center justify-center shadow-sm border border-border">
            <PayFlowLogo className="h-6 w-auto transition-transform group-hover:scale-105" />
          </div>
          <div className="h-5 w-px bg-border mx-1" />
          <span className="text-sm font-semibold text-foreground tracking-wide">Docs</span>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center gap-3 flex-1 max-w-2xl justify-center">
        <div className="relative w-full max-w-[320px] group">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-foreground transition-colors" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input ref={searchRef} type="text" placeholder="Search docs..." className="w-full bg-muted border border-transparent rounded-lg py-1.5 pl-9 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border focus:bg-background transition-all" />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-medium text-muted-foreground pointer-events-none shadow-sm"><span>Ctrl</span><span>K</span></div>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end w-auto lg:w-64">
        <Link 
          href="/"
          className="hidden sm:flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-semibold py-1.5 px-3.5 rounded-lg transition-colors shadow-sm"
        >
          Launch App <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M9 18l6-6-6-6" /></svg>
        </Link>
      </div>
    </header>
  );
});
export default DocsHeader;
