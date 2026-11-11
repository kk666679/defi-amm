"use client";

import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount, usePublicClient, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { AMM_ABI, ERC20_ABI } from "@/lib/abi";
import { AMM_ADDRESS, CONTRACTS_CONFIGURED, HARDHAT_CHAIN_ID, TOKEN_A_ADDRESS, TOKEN_B_ADDRESS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SLIPPAGE_OPTIONS = [0.1, 0.5, 1];

export function SwapCard() {
  const { address, chainId, isConnected } = useAccount();
  const publicClient = usePublicClient({ chainId: HARDHAT_CHAIN_ID });
  const [amountIn, setAmountIn] = useState("");
  const [direction, setDirection] = useState<"AtoB" | "BtoA">("AtoB");
  const [slippage, setSlippage] = useState(0.5);
  const tokenIn = direction === "AtoB" ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS;
  const tokenInSymbol = direction === "AtoB" ? "TKA" : "TKB";
  const tokenOutSymbol = direction === "AtoB" ? "TKB" : "TKA";
  const configured = CONTRACTS_CONFIGURED && Boolean(AMM_ADDRESS && tokenIn);

  const amountInWei = (() => {
    if (!/^\d+(\.\d{0,18})?$/.test(amountIn)) return BigInt(0);
    try {
      return parseEther(amountIn);
    } catch {
      return BigInt(0);
    }
  })();

  const { data: reserveA, isLoading: loadingReserveA, error: reserveErrorA, refetch: refetchReserveA } = useReadContract({
    address: AMM_ADDRESS!, abi: AMM_ABI, functionName: "reserveA", query: { enabled: configured },
  });
  const { data: reserveB, isLoading: loadingReserveB, error: reserveErrorB, refetch: refetchReserveB } = useReadContract({
    address: AMM_ADDRESS!, abi: AMM_ABI, functionName: "reserveB", query: { enabled: configured },
  });
  const { data: balanceIn, refetch: refetchBalance } = useReadContract({
    address: tokenIn!, abi: ERC20_ABI, functionName: "balanceOf", args: address ? [address] : undefined,
    query: { enabled: configured && Boolean(address) },
  });
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenIn!, abi: ERC20_ABI, functionName: "allowance", args: address && AMM_ADDRESS ? [address, AMM_ADDRESS] : undefined,
    query: { enabled: configured && Boolean(address) },
  });

  const reserveIn = direction === "AtoB" ? reserveA : reserveB;
  const reserveOut = direction === "AtoB" ? reserveB : reserveA;
  const amountOut = (() => {
    if (reserveIn === undefined || reserveOut === undefined || reserveIn === BigInt(0) || amountInWei === BigInt(0)) return BigInt(0);
    const inputWithFee = amountInWei * BigInt(997);
    return (inputWithFee * reserveOut) / (reserveIn * BigInt(1000) + inputWithFee);
  })();
  const minimumOut = amountOut * BigInt(Math.round((100 - slippage) * 100)) / BigInt(10_000);
  const needsApproval = allowance !== undefined && amountInWei > 0n && allowance < amountInWei;
  const insufficientBalance = balanceIn !== undefined && amountInWei > balanceIn;

  const { writeContract: approve, data: approveHash, isPending: isApproving, error: approveError } = useWriteContract();
  const { writeContract: swap, data: swapHash, isPending: isSwapping, error: swapError } = useWriteContract();
  const { isLoading: waitingApproval, isSuccess: approvalConfirmed, error: approvalReceiptError } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: waitingSwap, isSuccess: swapConfirmed, error: swapReceiptError } = useWaitForTransactionReceipt({ hash: swapHash });

  const wrongNetwork = isConnected && chainId !== HARDHAT_CHAIN_ID;
  const isPending = isApproving || waitingApproval || isSwapping || waitingSwap;
  const actionError = approveError ?? approvalReceiptError ?? swapError ?? swapReceiptError ?? reserveErrorA ?? reserveErrorB;

  const handleFlip = () => {
    setDirection((current) => current === "AtoB" ? "BtoA" : "AtoB");
    setAmountIn("");
  };

  const handleApprove = () => {
    if (!tokenIn || !AMM_ADDRESS || !amountInWei) return;
    approve({ address: tokenIn, abi: ERC20_ABI, functionName: "approve", args: [AMM_ADDRESS, amountInWei] }, {
      onSuccess: async (hash) => {
        const receipt = await publicClient?.waitForTransactionReceipt({ hash });
        if (receipt?.status === "success") await refetchAllowance();
      },
    });
  };

  const handleSwap = () => {
    if (!AMM_ADDRESS || !amountInWei || !minimumOut || wrongNetwork || insufficientBalance) return;
    swap({
      address: AMM_ADDRESS,
      abi: AMM_ABI,
      functionName: direction === "AtoB" ? "swapAForBMinOut" : "swapBForAMinOut",
      args: [amountInWei, minimumOut],
    }, {
      onSuccess: async (hash) => {
        const receipt = await publicClient?.waitForTransactionReceipt({ hash });
        if (receipt?.status === "success") {
          await Promise.all([refetchBalance(), refetchAllowance(), refetchReserveA(), refetchReserveB()]);
        }
      },
    });
  };

  return (
    <Card className="w-full max-w-md border-border/50 bg-background/80 shadow-xl backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-xl">
          <span>Swap</span>
          <span className="rounded-full bg-muted px-2 py-1 text-xs font-normal text-muted-foreground">0.3% pool fee</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {!configured && <p role="status" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-200">AMM contracts are not configured. Set the three NEXT_PUBLIC_* contract addresses after deploying to Hardhat.</p>}
        {wrongNetwork && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">Switch your wallet to the local Hardhat network (chain ID {HARDHAT_CHAIN_ID}).</p>}
        <div className="rounded-2xl border border-border/50 bg-muted/50 p-4">
          <div className="mb-2 flex justify-between text-sm text-muted-foreground">
            <label htmlFor="swap-amount">You pay</label>
            <span>Balance: {balanceIn !== undefined ? Number(formatEther(balanceIn)).toLocaleString(undefined, { maximumFractionDigits: 5 }) : "—"} {tokenInSymbol}</span>
          </div>
          <div className="flex items-center gap-3">
            <Input id="swap-amount" aria-label={`Amount of ${tokenInSymbol}`} inputMode="decimal" value={amountIn} onChange={(event) => setAmountIn(event.target.value)} placeholder="0.0" className="h-auto border-0 bg-transparent p-0 text-2xl font-semibold shadow-none focus-visible:ring-0" />
            <span className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm font-bold">{tokenInSymbol}</span>
          </div>
        </div>
        <div className="-my-2 flex justify-center">
          <Button type="button" variant="outline" size="icon" aria-label="Reverse token direction" onClick={handleFlip} className="rounded-full">↕</Button>
        </div>
        <div className="rounded-2xl border border-border/50 bg-muted/50 p-4">
          <div className="mb-2 flex justify-between text-sm text-muted-foreground"><span>You receive</span><span>{tokenOutSymbol}</span></div>
          <p aria-live="polite" className="truncate text-2xl font-semibold">
            {amountOut > 0n ? Number(formatEther(amountOut)).toLocaleString(undefined, { maximumFractionDigits: 6 }) : "0.0"}
          </p>
        </div>
        <label className="flex items-center justify-between gap-4 text-sm text-muted-foreground" htmlFor="slippage">
          <span>Slippage tolerance</span>
          <select id="slippage" value={slippage} onChange={(event) => setSlippage(Number(event.target.value))} className="rounded-lg border border-border bg-background px-2 py-1 text-foreground">
            {SLIPPAGE_OPTIONS.map((value) => <option key={value} value={value}>{value}%</option>)}
          </select>
        </label>
        <p className="text-xs text-muted-foreground">Minimum received: {minimumOut > 0n ? Number(formatEther(minimumOut)).toLocaleString(undefined, { maximumFractionDigits: 6 }) : "0"} {tokenOutSymbol}</p>
        {isConnected ? needsApproval ? (
          <Button onClick={handleApprove} disabled={!configured || wrongNetwork || isPending || insufficientBalance} className="w-full">
            {isPending ? "Waiting for approval…" : `Approve ${tokenInSymbol}`}
          </Button>
        ) : (
          <Button onClick={handleSwap} disabled={!configured || wrongNetwork || isPending || !amountInWei || !amountOut || insufficientBalance || allowance === undefined} className="w-full">
            {isPending ? "Waiting for confirmation…" : insufficientBalance ? "Insufficient balance" : "Swap"}
          </Button>
        ) : <p className="rounded-xl border border-border p-3 text-center text-sm text-muted-foreground">Connect an injected wallet to trade.</p>}
        {insufficientBalance && <p role="alert" className="text-sm text-destructive">Amount exceeds your {tokenInSymbol} balance.</p>}
        {actionError && <p role="alert" className="break-words text-sm text-destructive">Transaction failed: {actionError.message}</p>}
        {approvalConfirmed && <p role="status" className="text-sm text-muted-foreground">Approval confirmed. You can submit the swap.</p>}
        {swapConfirmed && <p role="status" className="text-sm text-green-700 dark:text-green-400">Swap transaction confirmed.</p>}
        <div className="flex flex-wrap justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <span>{loadingReserveA || loadingReserveB ? "Loading reserves…" : `Pool TKA: ${reserveA !== undefined ? Number(formatEther(reserveA)).toLocaleString() : "—"}`}</span>
          <span>Pool TKB: {reserveB !== undefined ? Number(formatEther(reserveB)).toLocaleString() : "—"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
