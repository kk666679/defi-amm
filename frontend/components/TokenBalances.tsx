"use client";

import { formatEther } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { ERC20_ABI } from "@/lib/abi";
import { CONTRACTS_CONFIGURED, HARDHAT_CHAIN_ID, TOKEN_A_ADDRESS, TOKEN_B_ADDRESS } from "@/lib/constants";

export function TokenBalances() {
  const { address, chainId, isConnected } = useAccount();
  const enabled = Boolean(isConnected && address && CONTRACTS_CONFIGURED && chainId === HARDHAT_CHAIN_ID);
  const tokenA = useReadContract({ address: TOKEN_A_ADDRESS!, abi: ERC20_ABI, functionName: "balanceOf", args: address ? [address] : undefined, query: { enabled } });
  const tokenB = useReadContract({ address: TOKEN_B_ADDRESS!, abi: ERC20_ABI, functionName: "balanceOf", args: address ? [address] : undefined, query: { enabled } });

  if (!isConnected) return <p role="status" className="rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">Connect an injected wallet to view token balances.</p>;
  if (chainId !== HARDHAT_CHAIN_ID) return <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Switch to the local Hardhat network (chain ID {HARDHAT_CHAIN_ID}) to view this deployment.</p>;
  if (!CONTRACTS_CONFIGURED) return <p role="status" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-200">Token balances are unavailable until the AMM and token addresses are configured.</p>;
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
