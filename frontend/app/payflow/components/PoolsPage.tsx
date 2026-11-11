"use client";

import { ReservesDisplay } from "@/components/ReservesDisplay";
import { BackIcon } from "../icons";
import type { PageId } from "../types";

export default function PoolsPage({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center">
        <button aria-label="Back to balance" onClick={() => onNavigate("home")} className="mr-3 flex size-8 items-center justify-center rounded-full bg-gb-code text-gb-muted shadow-sm transition hover:text-gb-text">
          <BackIcon />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gb-text">AMM pool</h1>
          <p className="text-xs text-gb-muted">Live reserves from the selected network</p>
        </div>
      </div>
      <div className="app-card flex flex-col gap-4 p-5">
        <div>
          <h2 className="text-base font-semibold text-gb-text">TKA / TKB</h2>
          <p className="mt-1 text-sm text-gb-muted">Constant-product pool · 0.3% swap fee</p>
        </div>
        <ReservesDisplay />
        <p className="text-xs text-gb-muted">This repository exposes a single TKA/TKB pool. TVL, APR, USD pricing, and additional pairs are not available from the current contracts.</p>
      </div>
    </section>
  );
}
