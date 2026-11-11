'use client';

import Link from 'next/link';
import { TokenBalances } from '@/components/TokenBalances';
import { ReservesDisplay } from '@/components/ReservesDisplay';

export default function WalletHome() {
  return (
    <section className="flex flex-col gap-5">
      <div className="rounded-2xl bg-gradient-to-br from-brand-darkBlue to-brand-blue p-6 text-white shadow-[0_8px_24px_rgba(0,112,186,0.2)]">
        <p className="text-xs font-medium uppercase tracking-wider text-blue-100">Local AMM account</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Wallet dashboard</h1>
        <p className="mt-2 text-sm text-blue-100">On-chain balances and pool data for the connected injected wallet.</p>
        <div className="mt-5 flex gap-3">
          <Link href="/wallet/swap" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-darkBlue">Swap tokens</Link>
          <Link href="/wallet/pools" className="rounded-xl bg-brand-yellow px-4 py-2.5 text-sm font-semibold text-brand-darkBlue">View pool</Link>
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-2xl border border-black/[0.03] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-base font-bold text-brand-dark">Token balances</h2>
          <p className="mt-1 text-sm text-brand-gray">Live ERC-20 balances on the configured Hardhat deployment.</p>
        </div>
        <TokenBalances />
      </div>
      <div className="flex flex-col gap-4 rounded-2xl border border-black/[0.03] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
        <div>
          <h2 className="text-base font-bold text-brand-dark">Pool reserves</h2>
          <p className="mt-1 text-sm text-brand-gray">Read from the SimpleAMM contract.</p>
        </div>
        <ReservesDisplay />
      </div>
    </section>
  );
}
