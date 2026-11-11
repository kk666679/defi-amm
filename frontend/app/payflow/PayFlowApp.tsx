"use client";

import { useCallback, useState } from "react";
import HomePage from "./components/HomePage";
import SwapPage from "./components/SwapPage";
import PoolsPage from "./components/PoolsPage";
import { HomeIcon, SwapIcon, EarnIcon } from "./icons"
import type { PageId } from "./types";
import { WalletBar } from "@/components/WalletBar";

export default function PayFlowApp() {
  const [page, setPage] = useState<PageId>("home");

  const nav = useCallback((p: PageId) => {
    setPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="font-sans antialiased bg-gb-bg text-gb-text min-h-screen pb-20 md:pb-0">
      <Header onLogoClick={() => nav("home")} />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {page === "home" && <HomePage onNavigate={nav} />}
        {page === "swap" && <SwapPage onNavigate={nav} />}
        {page === "pools" && <PoolsPage onNavigate={nav} />}
      </main>
      <BottomNav active={page} onNavigate={nav} />
    </div>
  );
}

function Header({ onLogoClick }: { onLogoClick: () => void }) {
  return (
    <header className="bg-gb-header border-b border-gb-border sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <button type="button" className="flex items-center gap-3 text-left" onClick={onLogoClick} aria-label="Go to PayFlow balance home">
          <div className="w-8 h-8 rounded-full bg-brand-darkBlue flex items-center justify-center text-white font-bold text-sm relative">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h16M4 12h10M4 17h6" />
            </svg>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-green rounded-full border-2 border-gb-header" />
          </div>
          <div>
            <div className="text-[11px] text-gb-muted font-medium">Hello,</div>
            <div className="text-[14px] font-bold text-gb-text leading-tight">PayFlow</div>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <WalletBar />
        </div>
      </div>
    </header>
  );
}

function BottomNav({ active, onNavigate }: { active: PageId; onNavigate: (p: PageId) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around h-16 px-2 bg-gb-header border-t border-gb-border shadow-[0_-2px_10px_rgba(0,0,0,0.3)]">
      <NavItem id="home" label="Home" active={active === "home"} onNavigate={onNavigate}><HomeIcon /></NavItem>
      <NavItem id="swap" label="Swap" active={active === "swap"} onNavigate={onNavigate}><SwapIcon /></NavItem>
      <NavItem id="pools" label="Earn" active={active === "pools"} onNavigate={onNavigate}><EarnIcon /></NavItem>
    </nav>
  );
}

function NavItem({ id, label, active, onNavigate, children }: { id: PageId; label: string; active: boolean; onNavigate: (p: PageId) => void; children: React.ReactNode }) {
  return (
    <button onClick={() => onNavigate(id)} className={`nav-item flex flex-col items-center gap-1 w-16 ${active ? "active" : ""}`}>
      {children}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
