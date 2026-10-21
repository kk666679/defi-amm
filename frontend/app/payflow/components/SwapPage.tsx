"use client";

import { useMemo, useState } from "react";
import { SWAP_RATE, SWAP_FEE } from "../data";
import { BackIcon, ChevronDownIcon, CheckIcon } from "../icons";
import type { PageId, TokenId } from "../types";

const TOKEN_META: Record<TokenId, { icon: string; label: string; iconClass: string; balance: string }> = {
  eth: { icon: "Ξ", label: "ETH", iconClass: "eth", balance: "4.2081 ETH" },
  usdc: { icon: "$", label: "USDC", iconClass: "usdc", balance: "2,104.20 USDC" },
};

export default function SwapPage({ onNavigate }: { onNavigate: (p: PageId) => void }) {
  const [fromToken, setFromToken] = useState<TokenId>("eth");
  const [toToken, setToToken] = useState<TokenId>("usdc");
  const [fromAmount, setFromAmount] = useState("1.0");

  const rate = fromToken === "eth" ? SWAP_RATE : 1 / SWAP_RATE;
  const toAmount = useMemo(() => {
    const v = parseFloat(fromAmount.replace(/,/g, "")) || 0;
    return (v * rate * (1 - SWAP_FEE)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [fromAmount, rate]);

  const rateLabel = fromToken === "eth"
    ? `1 ETH = ${SWAP_RATE.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`
    : `1 USDC = ${(1 / SWAP_RATE).toFixed(6)} ETH`;

  const flip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount.replace(/,/g, ""));
  };

  const fromMeta = TOKEN_META[fromToken];
  const toMeta = TOKEN_META[toToken];

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={() => onNavigate("home")} className="w-8 h-8 rounded-full bg-gb-code flex items-center justify-center text-gb-muted shadow-sm mr-3 hover:text-gb-text transition">
            <BackIcon />
          </button>
          <h1 className="text-[18px] font-bold text-gb-text">Swap</h1>
        </div>
        <div className="bg-brand-blue/15 text-brand-blue px-2.5 py-1 rounded-lg text-[11px] font-bold">Gasless Enabled</div>
      </div>

      <div className="app-card p-5">
        <div className="app-input p-4 mb-2">
          <div className="flex justify-between text-[12px] text-gb-muted mb-1">
            <span>From</span><span>Balance: {fromMeta.balance}</span>
          </div>
          <div className="flex items-center gap-3">
            <input type="text" inputMode="decimal" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)} className="bg-transparent outline-none w-full text-[28px] font-bold text-gb-text tabular" />
            <button className="flex items-center gap-2 bg-gb-code border border-gb-border rounded-lg px-2.5 py-1.5 shadow-sm hover:bg-gb-hover transition shrink-0">
              <div className={`asset-icon ${fromMeta.iconClass} !w-5 !h-5 !text-[10px]`}>{fromMeta.icon}</div>
              <span className="text-[14px] font-bold text-gb-text">{fromMeta.label}</span>
              <ChevronDownIcon />
            </button>
          </div>
        </div>

        <div className="flex justify-center -my-3 relative z-10">
          <button onClick={flip} className="w-9 h-9 bg-gb-code border border-gb-border rounded-full flex items-center justify-center text-brand-blue shadow-sm hover:bg-gb-hover transition">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v12M7 4l-3 3M7 4l3 3M17 20V8M17 20l-3-3M17 20l3-3" /></svg>
          </button>
        </div>

        <div className="app-input p-4 mt-2">
          <div className="flex justify-between text-[12px] text-gb-muted mb-1">
            <span>To</span><span>Balance: {toMeta.balance}</span>
          </div>
          <div className="flex items-center gap-3">
            <input type="text" inputMode="decimal" value={toAmount} readOnly className="bg-transparent outline-none w-full text-[28px] font-bold text-gb-text tabular" />
            <button className="flex items-center gap-2 bg-gb-code border border-gb-border rounded-lg px-2.5 py-1.5 shadow-sm hover:bg-gb-hover transition shrink-0">
              <div className={`asset-icon ${toMeta.iconClass} !w-5 !h-5 !text-[10px]`}>{toMeta.icon}</div>
              <span className="text-[14px] font-bold text-gb-text">{toMeta.label}</span>
              <ChevronDownIcon />
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-2.5 text-[13px]">
          <div className="flex justify-between text-gb-muted"><span>Rate</span><span className="font-semibold text-gb-text">{rateLabel}</span></div>
          <div className="flex justify-between text-gb-muted"><span>Network Fee</span><span className="font-semibold text-brand-green flex items-center gap-1"><CheckIcon />Sponsored</span></div>
          <div className="flex justify-between text-gb-muted"><span>Price Impact</span><span className="font-semibold text-brand-green">&lt; 0.01%</span></div>
        </div>

        <button className="btn-paypal w-full py-3.5 mt-6 text-[15px]">Continue with PayPal</button>
        <div className="flex items-center gap-3 mt-4">
          <div className="h-px bg-gb-border flex-1" />
          <span className="text-[11px] text-gb-muted font-medium uppercase tracking-wider">or</span>
          <div className="h-px bg-gb-border flex-1" />
        </div>
        <button className="btn-tng w-full py-3.5 mt-4 text-[15px]">Pay with TNG eWallet</button>
      </div>
    </div>
  );
}
