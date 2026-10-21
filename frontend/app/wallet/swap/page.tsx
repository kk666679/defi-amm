'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { AMM_ABI, ERC20_ABI } from "@/lib/abi";
import { AMM_ADDRESS, TOKEN_A_ADDRESS, TOKEN_B_ADDRESS } from "@/lib/constants";

export default function SwapPage() {
  const { address, isConnected } = useAccount();
  const [amountIn, setAmountIn] = useState("");
  const [direction, setDirection] = useState<"AtoB" | "BtoA">("AtoB");

  const tokenIn = direction === "AtoB" ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS;
  const tokenInSymbol = direction === "AtoB" ? "TKA" : "TKB";
  const tokenOutSymbol = direction === "AtoB" ? "TKB" : "TKA";

  const { data: reserveA } = useReadContract({ address: AMM_ADDRESS, abi: AMM_ABI, functionName: "reserveA" });
  const { data: reserveB } = useReadContract({ address: AMM_ADDRESS, abi: AMM_ABI, functionName: "reserveB" });
  const { data: balanceIn } = useReadContract({
    address: tokenIn,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });
  const { data: allowance } = useReadContract({
    address: tokenIn,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, AMM_ADDRESS] : undefined,
  });

  const amountInWei = amountIn ? parseEther(amountIn) : 0n;
  const reserveIn = direction === "AtoB" ? reserveA : reserveB;
  const reserveOut = direction === "AtoB" ? reserveB : reserveA;

  let amountOut = 0n;
  if (reserveIn && reserveOut && amountInWei > 0n) {
    const inWithFee = amountInWei * 997n;
    amountOut = (inWithFee * reserveOut) / (reserveIn * 1000n + inWithFee);
  }

  const needsApproval = allowance !== undefined && amountInWei > 0n && allowance < amountInWei;

  const { writeContract: approve, isPending: isApproving, data: approveHash } = useWriteContract();
  const { writeContract: swap, isPending: isSwapping, data: swapHash } = useWriteContract();
  const { isLoading: waitingApprove } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: waitingSwap } = useWaitForTransactionReceipt({ hash: swapHash });

  const handleFlip = () => {
    setDirection(direction === "AtoB" ? "BtoA" : "AtoB");
    setAmountIn("");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/wallet" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-gray shadow-sm mr-3 hover:text-brand-dark transition">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <h1 className="text-[18px] font-bold text-brand-dark">Swap</h1>
        </div>
        <div className="bg-brand-lightBlue text-brand-blue px-2.5 py-1 rounded-lg text-[11px] font-bold">PayFlow AMM</div>
      </div>

      <div className="app-card p-5 bg-white">
        
        {/* From Input */}
        <div className="app-input p-4 mb-2 bg-brand-bg border-slate-200">
          <div className="flex justify-between text-[12px] text-brand-gray mb-1">
            <span>You Pay</span>
            <span>Balance: {balanceIn !== undefined ? Number(formatEther(balanceIn)).toLocaleString() : "—"} {tokenInSymbol}</span>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="number" 
              value={amountIn} 
              onChange={(e) => setAmountIn(e.target.value)} 
              placeholder="0.0"
              className="bg-transparent outline-none w-full text-[28px] font-bold text-brand-dark tabular-nums placeholder:text-gray-300" 
            />
            <button className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-2.5 py-1.5 shadow-sm shrink-0">
              <div className="asset-icon bg-brand-darkBlue !w-5 !h-5 !text-[10px]">{tokenInSymbol[0]}</div>
              <span className="text-[14px] font-bold">{tokenInSymbol}</span>
            </button>
          </div>
        </div>

        {/* Flip Button */}
        <div className="flex justify-center -my-3 relative z-10">
          <button 
            onClick={handleFlip} 
            className="w-9 h-9 bg-white border border-gray-100 rounded-full flex items-center justify-center text-brand-blue shadow-sm hover:bg-blue-50 hover:scale-110 active:scale-95 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 4v12M7 4l-3 3M7 4l3 3M17 20V8M17 20l-3-3M17 20l3-3"/>
            </svg>
          </button>
        </div>

        {/* To Input */}
        <div className="app-input p-4 mt-2 bg-brand-bg border-slate-200">
          <div className="flex justify-between text-[12px] text-brand-gray mb-1">
            <span>You Receive</span>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              readOnly 
              value={amountOut > 0n ? Number(formatEther(amountOut)).toLocaleString(undefined, { maximumFractionDigits: 6 }) : "0.0"} 
              className="bg-transparent outline-none w-full text-[28px] font-bold text-brand-dark tabular-nums" 
            />
            <button className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-2.5 py-1.5 shadow-sm shrink-0">
              <div className="asset-icon bg-brand-darkBlue !w-5 !h-5 !text-[10px]">{tokenOutSymbol[0]}</div>
              <span className="text-[14px] font-bold">{tokenOutSymbol}</span>
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="mt-5 space-y-2.5 text-[13px]">
          <div className="flex justify-between text-brand-gray">
            <span>Network Fee</span>
            <span className="font-semibold text-brand-green flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg> 0.3% AMM Fee
            </span>
          </div>
          <div className="flex justify-between text-brand-gray">
            <span>Pool Reserves</span>
            <span className="font-semibold text-brand-dark text-[11px]">
              {reserveA ? Math.round(Number(formatEther(reserveA))).toLocaleString() : "—"} TKA / {reserveB ? Math.round(Number(formatEther(reserveB))).toLocaleString() : "—"} TKB
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {!isConnected ? (
            <div className="p-3 bg-brand-red/10 text-brand-red text-sm text-center rounded-xl font-bold border border-brand-red/20">
              Please connect your wallet to swap
            </div>
          ) : needsApproval ? (
            <button
              onClick={() => approve({ address: tokenIn, abi: ERC20_ABI, functionName: "approve", args: [AMM_ADDRESS, amountInWei] })}
              disabled={isApproving || waitingApprove}
              className="btn-paypal w-full py-3.5 text-[15px] disabled:opacity-50"
            >
              {isApproving || waitingApprove ? "Approving..." : `Approve ${tokenInSymbol}`}
            </button>
          ) : (
            <button
              onClick={() => swap({ address: AMM_ADDRESS, abi: AMM_ABI, functionName: direction === "AtoB" ? "swapAForB" : "swapBForA", args: [amountInWei] })}
              disabled={!amountIn || isSwapping || waitingSwap}
              className="btn-paypal w-full py-3.5 text-[15px] disabled:opacity-50"
            >
              {isSwapping || waitingSwap ? "Confirming..." : "Swap Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
