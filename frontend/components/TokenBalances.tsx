"use client";

import { formatEther } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { ERC20_ABI } from "@/lib/abi";
import { TRADE_CHAIN_NAMES, isSupportedTradeChain } from "@/lib/constants";
import { useContractAddresses } from "@/lib/contract-addresses";

export function TokenBalances() {
  const { address, isConnected } = useAccount();
  const { addresses, chainId, configured } = useContractAddresses();
  const supportedNetwork = isSupportedTradeChain(chainId);
  const enabled = Boolean(isConnected && address && configured && supportedNetwork);
  const tokenA = useReadContract({ address: addresses.tokenA!, abi: ERC20_ABI, chainId, functionName: "balanceOf", args: address ? [address] : undefined, query: { enabled } });
  const tokenB = useReadContract({ address: addresses.tokenB!, abi: ERC20_ABI, chainId, functionName: "balanceOf", args: address ? [address] : undefined, query: { enabled } });

  if (!isConnected) return <p role="status" className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">Connect an injected wallet to view token balances.</p>;
  if (!supportedNetwork) return <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Select Sepolia or Hardhat Local with the wallet network selector above.</p>;
  if (!configured) return <p role="status" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-200">No {TRADE_CHAIN_NAMES[chainId]} token addresses are configured. Deploy on Sepolia or add the contract addresses to Vercel Vars.</p>;
  if (tokenA.error || tokenB.error) return <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Could not load token balances: {(tokenA.error ?? tokenB.error)?.message}</p>;

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-background/70 p-4">
        <dt className="text-sm text-muted-foreground">TKA</dt>
        <dd className="mt-1 font-semibold tabular-nums">{tokenA.isLoading ? "Loading…" : tokenA.data !== undefined ? formatEther(tokenA.data) : "—"}</dd>
      </div>
      <div className="rounded-xl border border-border bg-background/70 p-4">
        <dt className="text-sm text-muted-foreground">TKB</dt>
        <dd className="mt-1 font-semibold tabular-nums">{tokenB.isLoading ? "Loading…" : tokenB.data !== undefined ? formatEther(tokenB.data) : "—"}</dd>
      </div>
    </dl>
  );
}
