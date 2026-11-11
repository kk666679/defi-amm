"use client";

import { formatEther } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { AMM_ABI } from "@/lib/abi";
import { AMM_ADDRESS, CONTRACTS_CONFIGURED, HARDHAT_CHAIN_ID, HARDHAT_RPC_UNAVAILABLE_MESSAGE } from "@/lib/constants";

export function ReservesDisplay() {
  const { chainId, isConnected } = useAccount();
  const wrongNetwork = isConnected && chainId !== HARDHAT_CHAIN_ID;
  const canReadReserves = CONTRACTS_CONFIGURED && !wrongNetwork;
  const { data: reserveA, isLoading: loadingA, error: errorA } = useReadContract({
    address: AMM_ADDRESS!, abi: AMM_ABI, chainId: HARDHAT_CHAIN_ID, functionName: "reserveA", query: { enabled: canReadReserves },
  });
  const { data: reserveB, isLoading: loadingB, error: errorB } = useReadContract({
    address: AMM_ADDRESS!, abi: AMM_ABI, chainId: HARDHAT_CHAIN_ID, functionName: "reserveB", query: { enabled: canReadReserves },
  });

  if (!CONTRACTS_CONFIGURED) return <p role="status" className="text-sm text-muted-foreground">Contract addresses are not configured.</p>;
  if (wrongNetwork) return <p role="status" className="text-sm text-amber-700 dark:text-amber-300">Switch your wallet to Hardhat Local (chain ID {HARDHAT_CHAIN_ID}) using the wallet control above.</p>;
  if (errorA || errorB) {
    return (
      <div className="space-y-2 text-sm">
        <p role="alert" className="text-destructive">{HARDHAT_RPC_UNAVAILABLE_MESSAGE}</p>
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer">Technical details</summary>
          <p className="mt-1 break-words">{(errorA ?? errorB)?.message}</p>
        </details>
      </div>
    );
  }

  return (
    <dl aria-label="Current AMM pool reserves" className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
      <div className="rounded-xl bg-muted/60 p-4">
        <dt className="text-muted-foreground">TKA reserve</dt>
        <dd className="mt-1 font-semibold tabular-nums">{loadingA ? "Loading…" : reserveA !== undefined ? formatEther(reserveA) : "—"} TKA</dd>
      </div>
      <div className="rounded-xl bg-muted/60 p-4">
        <dt className="text-muted-foreground">TKB reserve</dt>
        <dd className="mt-1 font-semibold tabular-nums">{loadingB ? "Loading…" : reserveB !== undefined ? formatEther(reserveB) : "—"} TKB</dd>
      </div>
    </dl>
  );
}
