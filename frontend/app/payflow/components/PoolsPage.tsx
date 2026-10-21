"use client";

import { POOLS } from "../data";
import { BackIcon, StarIcon } from "../icons";
import type { PageId } from "../types";

export default function PoolsPage({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  return (
    <>
      <div className="flex items-center mb-6">
        <button onClick={() => onNavigate("home")} className="w-8 h-8 rounded-full bg-gb-code flex items-center justify-center text-gb-muted shadow-sm mr-3 hover:text-gb-text transition">
          <BackIcon />
        </button>
        <h1 className="text-[18px] font-bold text-gb-text">Earn</h1>
      </div>

      <div className="bg-gradient-to-r from-brand-darkBlue to-brand-blue rounded-2xl p-5 text-white mb-6 shadow-card relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 transform skew-x-12" />
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-1 text-brand-yellow">
            <StarIcon /> Featured Pool
          </div>
          <div className="text-[20px] font-bold mb-1">ETH / USDC</div>
          <div className="text-[13px] text-blue-100 mb-3">Earn up to 16.8% APR on your liquidity.</div>
          <button className="bg-white text-brand-darkBlue text-[12px] font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition shadow-sm">Provide Liquidity</button>
        </div>
      </div>

      <h2 className="text-[16px] font-bold text-gb-text mb-4">All Pools</h2>

      <div className="space-y-3">
        {POOLS.map((pool) => (
          <div key={pool.id} className="app-card p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className={`asset-icon ${pool.tokenA.className} ring-2 ring-gb-bg !w-9 !h-9`}>{pool.tokenA.icon}</div>
                  <div className={`asset-icon ${pool.tokenB.className} ring-2 ring-gb-bg !w-9 !h-9`}>{pool.tokenB.icon}</div>
                </div>
                <div>
                  <div className="text-[14px] font-bold text-gb-text">{pool.pair}</div>
                  <div className="text-[12px] text-gb-muted">{pool.feeTier}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[15px] font-bold text-brand-green">{pool.apr}</div>
                <div className="text-[12px] text-gb-muted">{pool.tvl}</div>
              </div>
            </div>
            <button className="bg-brand-blue/15 text-brand-blue w-full py-2.5 rounded-xl text-[13px] font-semibold hover:bg-brand-blue/25 transition">Deposit</button>
          </div>
        ))}
      </div>
    </>
  );
}
