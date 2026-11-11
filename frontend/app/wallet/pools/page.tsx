import Link from "next/link";
import { ReservesDisplay } from "@/components/ReservesDisplay";
import { CONTRACTS_CONFIGURED } from "@/lib/constants";

export default function WalletPoolsPage() {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <Link href="/wallet" aria-label="Back to wallet dashboard" className="flex size-8 items-center justify-center rounded-full bg-white text-brand-gray shadow-sm transition hover:text-brand-dark">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </Link>
        <div>
          <h1 className="text-lg font-bold text-brand-dark">AMM pool</h1>
          <p className="text-xs text-brand-gray">Live local deployment reserves</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-2xl border border-black/[0.03] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-base font-semibold text-brand-dark">TKA / TKB</h2>
          <p className="mt-1 text-sm text-brand-gray">Single constant-product pool · 0.3% swap fee</p>
        </div>
        <ReservesDisplay />
        {!CONTRACTS_CONFIGURED && <p role="status" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800">Pool data is unavailable until the local contracts are deployed and configured.</p>}
        <p className="text-xs text-brand-gray">The current contracts expose one pool. TVL, APR, fiat pricing, and other trading pairs are not available from this deployment.</p>
      </div>
    </section>
  );
}
