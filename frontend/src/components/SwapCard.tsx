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

  const { writeContract: approve, data: approveHash } = useWriteContract();
  const { writeContract: swap, data: swapHash } = useWriteContract();
  const { isLoading: approving } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: swapping } = useWaitForTransactionReceipt({ hash: swapHash });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Swap</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button variant={direction === "AtoB" ? "default" : "outline"} onClick={() => setDirection("AtoB")}>TKA → TKB</Button>
          <Button variant={direction === "BtoA" ? "default" : "outline"} onClick={() => setDirection("BtoA")}>TKB → TKA</Button>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Amount In</label>
          <Input value={amountIn} onChange={(e) => setAmountIn(e.target.value)} placeholder="0.0" type="number" />
          <p className="text-xs text-muted-foreground mt-1">
            Balance: {balanceIn !== undefined ? formatEther(balanceIn) : "—"}
          </p>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Expected Out</label>
          <p className="text-2xl font-semibold">{amountOut > 0n ? formatEther(amountOut) : "0.0"}</p>
          <p className="text-xs text-muted-foreground">Rate with 0.3% fee</p>
        </div>

        {!isConnected ? (
          <p className="text-sm text-destructive">Connect wallet first</p>
        ) : needsApproval ? (
          <Button
            onClick={() => approve({ address: tokenIn, abi: ERC20_ABI, functionName: "approve", args: [AMM_ADDRESS, amountInWei] })}
            disabled={approving}
            className="w-full"
          >
            {approving ? "Approving..." : "Approve"}
          </Button>
        ) : (
          <Button
            onClick={() => swap({ address: AMM_ADDRESS, abi: AMM_ABI, functionName: direction === "AtoB" ? "swapAForB" : "swapBForA", args: [amountInWei] })}
            disabled={!amountIn || swapping}
            className="w-full"
          >
            {swapping ? "Swapping..." : "Swap"}
          </Button>
        )}

        <div className="text-xs text-muted-foreground">
          Reserves: {reserveA ? formatEther(reserveA) : "—"} TKA / {reserveB ? formatEther(reserveB) : "—"} TKB
        </div>
      </CardContent>
    </Card>
  );
}
