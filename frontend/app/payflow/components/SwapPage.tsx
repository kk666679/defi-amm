"use client";

import { SwapCard } from "@/components/SwapCard";
import { BackIcon } from "../icons";
import type { PageId } from "../types";

export default function SwapPage({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  return (
    <section className="mx-auto max-w-md">
      <div className="mb-6 flex items-center">
        <button aria-label="Back to balance" onClick={() => onNavigate("home")} className="mr-3 flex size-8 items-center justify-center rounded-full bg-gb-code text-gb-muted shadow-sm transition hover:text-gb-text">
          <BackIcon />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gb-text">Swap tokens</h1>
          <p className="text-xs text-gb-muted">Live quote from the connected AMM pool</p>
        </div>
      </div>
      <SwapCard />
    </section>
  );
}
