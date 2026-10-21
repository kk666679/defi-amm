"use client";

import { useState } from "react";
import type { PageId } from "../types";

type Tab = "crypto" | "fiat";

export default function HomePage({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  const [tab, setTab] = useState<Tab>("crypto");

  return (
    <>
      <div className="bg-gradient-to-br from-brand-darkBlue to-brand-blue rounded-2xl p-6 text-white shadow-float mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl" />
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[12px] text-blue-100 font-medium mb-1 uppercase tracking-wider">Total Balance</div>
              <div className="text-[34px] font-bold tracking-tight mb-1">RM 18,450.00</div>
              <div className="text-[13px] text-blue-100 flex items-center gap-2">
                <span className="bg-white/20 px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1">
                  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3}><path d="M12 5v14M5 12h14" /></svg>
                  +2.4%
                </span>
                <span>vs last month</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
              <div className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Linked</div>
              <div className="text-[12px] font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-green" /> Both
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => onNavigate("swap")} className="flex-1 bg-white text-brand-darkBlue font-semibold text-[13px] py-2.5 rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M7 16V4M7 4L3 8M7 4l4 4" /><path d="M17 8v12M17 20l4-4M17 20l-4-4" /></svg>
              Swap
            </button>
            <button onClick={() => onNavigate("pools")} className="flex-1 bg-brand-yellow text-brand-darkBlue font-semibold text-[13px] py-2.5 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              Earn
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        <QuickAction label="Top Up"><path d="M12 5v14M5 12h14" /></QuickAction>
        <QuickAction label="Send"><path d="M19 12H5M12 19l-7-7 7-7" /></QuickAction>
        <QuickAction label="Request"><path d="M7 17l9.2-9.2M17 17V7H7" /></QuickAction>
        <QuickAction label="Pay"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></QuickAction>
      </div>

      <div className="flex items-center bg-gb-code rounded-xl p-1 mb-4">
        <button onClick={() => setTab("crypto")} className={`flex-1 py-2 text-[13px] rounded-lg transition ${tab === "crypto" ? "font-semibold bg-gb-hover text-gb-text shadow-sm" : "font-medium text-gb-muted hover:text-gb-text"}`}>Crypto</button>
        <button onClick={() => setTab("fiat")} className={`flex-1 py-2 text-[13px] rounded-lg transition ${tab === "fiat" ? "font-semibold bg-gb-hover text-gb-text shadow-sm" : "font-medium text-gb-muted hover:text-gb-text"}`}>Fiat</button>
      </div>

      <div className="space-y-3">
        <AssetRow iconClass="paypal" icon="P" title="PayPal Balance" badge="Linked" badgeClass="bg-brand-blue/15 text-brand-blue" subtitle="USD Wallet" main="$450.00" sub="≈ RM 2,115.00" />
        <AssetRow iconClass="" icon="T" iconStyle={{ backgroundColor: "#0057B8", fontSize: 14 }} title="TNG eWallet" badge="Linked" badgeClass="bg-brand-tngBlue/15 text-brand-tngBlue" subtitle="MYR Wallet" main="RM 1,200.00" sub="Available" />
        <AssetRow iconClass="eth" icon="Ξ" title="Ethereum" subtitle="ETH" main="1.2081 ETH" sub="+2.1%" subClass="text-brand-green" />
        <AssetRow iconClass="usdc" icon="$" title="USD Coin" subtitle="USDC" main="2,104.20 USDC" sub="+0.01%" subClass="text-brand-green" />
      </div>
    </>
  );
}

function QuickAction({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button className="flex flex-col items-center gap-2 p-3 bg-gb-code rounded-xl border border-gb-border hover:bg-gb-hover transition">
      <div className="w-10 h-10 rounded-full bg-brand-blue/15 flex items-center justify-center text-brand-blue">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>{children}</svg>
      </div>
      <span className="text-[11px] font-medium text-gb-muted">{label}</span>
    </button>
  );
}

function AssetRow({ iconClass, icon, iconStyle, title, badge, badgeClass, subtitle, main, sub, subClass }: { iconClass: string; icon: string; iconStyle?: React.CSSProperties; title: string; badge?: string; badgeClass?: string; subtitle: string; main: string; sub: string; subClass?: string }) {
  return (
    <div className="app-card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`asset-icon ${iconClass}`} style={iconStyle}>{icon}</div>
        <div>
          <div className="text-[14px] font-bold text-gb-text flex items-center gap-1.5">
            {title}
            {badge && <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${badgeClass}`}>{badge}</span>}
          </div>
          <div className="text-[12px] text-gb-muted">{subtitle}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[14px] font-bold text-gb-text">{main}</div>
        <div className={`text-[12px] ${subClass || "text-gb-muted"}`}>{sub}</div>
      </div>
    </div>
  );
}
