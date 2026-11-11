"use client";

import { TokenBalances } from "@/components/TokenBalances";
import type { PageId } from "../types";

export default function HomePage({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="rounded-2xl bg-gradient-to-br from-brand-darkBlue to-brand-blue p-6 text-white shadow-float">
        <p className="text-xs font-medium uppercase tracking-wider text-blue-100">Wallet token balances</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Balance overview</h1>
        <p className="mt-2 max-w-lg text-sm text-blue-100">Live TKA and TKB balances from the selected Sepolia or Hardhat deployment. No fiat conversion or external payment account is connected.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={() => onNavigate("swap")} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-darkBlue transition hover:bg-blue-50">Swap tokens</button>
          <button onClick={() => onNavigate("pools")} className="rounded-xl bg-brand-yellow px-4 py-2.5 text-sm font-semibold text-brand-darkBlue transition hover:bg-yellow-400">View pool</button>
        </div>
      </div>
      <div className="app-card flex flex-col gap-4 p-5">
        <div>
          <h2 className="text-base font-bold text-gb-text">Token balances</h2>
          <p className="mt-1 text-sm text-gb-muted">Values are read directly from ERC-20 contracts.</p>
        </div>
        <TokenBalances />
      </div>
    </section>
  );
}
