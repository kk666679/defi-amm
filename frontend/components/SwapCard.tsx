"use client";

import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { AMM_ABI, ERC20_ABI } from "@/lib/abi";
import { AMM_ADDRESS, TOKEN_A_ADDRESS, TOKEN_B_ADDRESS } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SwapCard() {
  const { address, isConnected } = useAccount();
  const [amountIn, setAmountIn] = useState("");
  const [direction, setDirection] = useState<"AtoB" | "BtoA">("AtoB");

  const tokenIn = direction === "AtoB" ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS;
  const tokenOutSymbol = direction === "AtoB" ? "TKB" : "TKA";
  const tokenInSymbol = direction === "AtoB" ? "TKA" : "TKB";

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

  const { writeContract: approve, data: approveHash, isPending: isApproving } = useWriteContract();
  const { writeContract: swap, data: swapHash, isPending: isSwapping } = useWriteContract();
  const { isLoading: waitingApprove } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: waitingSwap } = useWaitForTransactionReceipt({ hash: swapHash });

  const handleFlip = () => {
    setDirection(direction === "AtoB" ? "BtoA" : "AtoB");
    setAmountIn("");
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-border/50 bg-background/60 backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Swap</span>
          <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded-full">0.3% Fee</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        
        {/* Input Section */}
        <div className="bg-muted/50 p-4 rounded-2xl border border-border/50 hover:border-border transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">You Pay</span>
            <span className="text-xs text-muted-foreground">
              Balance: {balanceIn !== undefined ? Number(formatEther(balanceIn)).toLocaleString() : "—"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Input
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              placeholder="0.0"
              type="number"
              className="border-none bg-transparent text-2xl font-semibold p-0 h-auto focus-visible:ring-0 shadow-none"
            />
            <div className="bg-background border border-border px-3 py-1.5 rounded-xl font-bold text-sm shadow-sm flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">
                {tokenInSymbol[0]}
              </div>
              {tokenInSymbol}
            </div>
          </div>
        </div>

        {/* Flip Button */}
        <div className="relative h-4 flex justify-center items-center -my-2 z-10">
          <button 
            onClick={handleFlip}
            className="bg-background border border-border hover:bg-muted p-1.5 rounded-full shadow-sm transition-all hover:scale-110 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-muted/50 p-4 rounded-2xl border border-border/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">You Receive</span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-semibold text-foreground flex-1 truncate">
              {amountOut > 0n ? Number(formatEther(amountOut)).toLocaleString(undefined, { maximumFractionDigits: 6 }) : "0.0"}
            </p>
            <div className="bg-background border border-border px-3 py-1.5 rounded-xl font-bold text-sm shadow-sm flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">
                {tokenOutSymbol[0]}
              </div>
              {tokenOutSymbol}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {!isConnected ? (
            <div className="p-3 bg-destructive/10 text-destructive text-sm text-center rounded-xl font-medium border border-destructive/20">
              Please connect your wallet to swap
            </div>
          ) : needsApproval ? (
            <Button
              onClick={() => approve({ address: tokenIn, abi: ERC20_ABI, functionName: "approve", args: [AMM_ADDRESS, amountInWei] })}
              disabled={isApproving || waitingApprove}
              className="w-full py-6 text-base font-semibold rounded-xl"
            >
              {isApproving || waitingApprove ? "Approving..." : `Approve ${tokenInSymbol}`}
            </Button>
          ) : (
            <Button
              onClick={() => swap({ address: AMM_ADDRESS, abi: AMM_ABI, functionName: direction === "AtoB" ? "swapAForB" : "swapBForA", args: [amountInWei] })}
              disabled={!amountIn || isSwapping || waitingSwap}
              className="w-full py-6 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            >
              {isSwapping || waitingSwap ? "Confirming..." : "Swap"}
            </Button>
          )}
        </div>

        {/* Reserves Footer */}
        <div className="pt-4 pb-2 flex justify-between text-xs text-muted-foreground/80 font-medium">
          <span>Pool TKA: {reserveA ? Number(formatEther(reserveA)).toLocaleString() : "—"}</span>
          <span>Pool TKB: {reserveB ? Number(formatEther(reserveB)).toLocaleString() : "—"}</span>
        </div>

      </CardContent>
    </Card>
  );
}
