import Link from "next/link";
import { SwapCard } from "@/components/SwapCard";

export default function WalletSwapPage() {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/wallet"
            aria-label="Back to wallet dashboard"
            className="flex size-8 items-center justify-center rounded-full bg-white text-brand-gray shadow-sm transition hover:text-brand-dark"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-brand-dark">Swap</h1>
        </div>
        <span className="rounded-lg bg-brand-lightBlue px-2.5 py-1 text-[11px] font-bold text-brand-blue">
          PayFlow AMM
        </span>
      </div>
      <SwapCard />
    </section>
  );
}
