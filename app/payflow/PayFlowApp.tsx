"use client";

import { useCallback, useState } from "react";
import HomePage from "./components/HomePage";
import SwapPage from "./components/SwapPage";
import PoolsPage from "./components/PoolsPage";
import { HomeIcon, SwapIcon, EarnIcon } from "./icons";
import type { PageId } from "./types";
import { WalletBar } from "@/components/WalletBar";
import { DeploySepoliaContracts } from "@/components/DeploySepoliaContracts";
import "./payflow.css";

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "swap", label: "Swap" },
  { id: "pools", label: "Earn" },
];

export default function PayFlowApp() {
  const [page, setPage] = useState<PageId>("home");

  const nav = useCallback((p: PageId) => {
    setPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="font-sans antialiased bg-gb-bg text-gb-text min-h-[100dvh] pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      <Header page={page} onLogoClick={() => nav("home")} onNavigate={nav} />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <DeploySepoliaContracts />
        {page === "home" && <HomePage onNavigate={nav} />}
        {page === "swap" && <SwapPage onNavigate={nav} />}
        {page === "pools" && <PoolsPage onNavigate={nav} />}
      </main>
      <BottomNav active={page} onNavigate={nav} />
    </div>
  );
}

function Header({
  page,
  onLogoClick,
  onNavigate,
}: {
  page: PageId;
  onLogoClick: () => void;
  onNavigate: (p: PageId) => void;
}) {
  return (
    <header className="bg-gb-header border-b border-gb-border sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-3 text-left shrink-0"
          onClick={onLogoClick}
          aria-label="Go to PayFlow balance home"
        >
          <div className="w-8 h-8 rounded-full bg-brand-darkBlue flex items-center justify-center text-white font-bold text-sm relative">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7h16M4 12h10M4 17h6" />
            </svg>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-green rounded-full border-2 border-gb-header" />
          </div>
          <div className="hidden sm:block">
            <div className="text-[11px] text-gb-muted font-medium">Hello,</div>
            <div className="text-[14px] font-bold text-gb-text leading-tight">PayFlow</div>
          </div>
        </button>

        {/* Desktop inline nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="PayFlow navigation">
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                page === id
                  ? "bg-brand-lightBlue text-brand-blue"
                  : "text-gb-muted hover:text-gb-text hover:bg-black/5"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2 min-w-0">
          <WalletBar />
        </div>
      </div>
    </header>
  );
}

function BottomNav({
  active,
  onNavigate,
}: {
  active: PageId;
  onNavigate: (p: PageId) => void;
}) {
  return (
    <nav
      aria-label="PayFlow navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gb-header border-t border-gb-border shadow-[0_-2px_10px_rgba(0,0,0,0.3)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around h-16 px-2">
        <NavItem id="home" label="Home" active={active === "home"} onNavigate={onNavigate}>
          <HomeIcon />
        </NavItem>
        <NavItem id="swap" label="Swap" active={active === "swap"} onNavigate={onNavigate}>
          <SwapIcon />
        </NavItem>
        <NavItem id="pools" label="Earn" active={active === "pools"} onNavigate={onNavigate}>
          <EarnIcon />
        </NavItem>
      </div>
    </nav>
  );
}

function NavItem({
  id,
  label,
  active,
  onNavigate,
  children,
}: {
  id: PageId;
  label: string;
  active: boolean;
  onNavigate: (p: PageId) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(id)}
      className={`nav-item flex flex-col items-center gap-1 w-16 ${active ? "active" : ""}`}
    >
      {children}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
