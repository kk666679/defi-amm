"use client";

import { formatEther } from "viem";
import { useReadContract } from "wagmi";
import { AMM_ABI } from "@/lib/abi";
import {
  HARDHAT_CHAIN_ID,
  HARDHAT_RPC_UNAVAILABLE_MESSAGE,
  SEPOLIA_RPC_UNAVAILABLE_MESSAGE,
  TRADE_CHAIN_NAMES,
  isSupportedTradeChain,
} from "@/lib/constants";
import { useContractAddresses } from "@/lib/contract-addresses";

export function ReservesDisplay() {
  const { addresses, chainId, configured } = useContractAddresses();
  const supportedNetwork = isSupportedTradeChain(chainId);
  const rpcMessage = chainId === HARDHAT_CHAIN_ID
    ? HARDHAT_RPC_UNAVAILABLE_MESSAGE
    : SEPOLIA_RPC_UNAVAILABLE_MESSAGE;
  const { data: reserveA, isLoading: loadingA, error: errorA } = useReadContract({
    address: addresses.amm!, abi: AMM_ABI, chainId, functionName: "reserveA", query: { enabled: configured && supportedNetwork },
  });
  const { data: reserveB, isLoading: loadingB, error: errorB } = useReadContract({
    address: addresses.amm!, abi: AMM_ABI, chainId, functionName: "reserveB", query: { enabled: configured && supportedNetwork },
  });

  if (!supportedNetwork) return <p role="status" className="text-sm text-amber-700 dark:text-amber-300">Select Sepolia or Hardhat Local with the wallet network selector above.</p>;
  if (!configured) return <p role="status" className="text-sm text-muted-foreground">No {TRADE_CHAIN_NAMES[chainId]} contracts are configured. Deploy the Sepolia contracts above or add this network’s addresses to Vercel Vars.</p>;
  if (errorA || errorB) {
    return (
      <div className="flex flex-col gap-2 text-sm">
        <p role="alert" className="text-destructive">{rpcMessage}</p>
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
        <dd className="mt-1 font-semibold tabular-nums">{loadingA ? "Loading…" : reserveA != null ? formatEther(reserveA) : "—"} TKA</dd>
      </div>
      <div className="rounded-xl bg-muted/60 p-4">
        <dt className="text-muted-foreground">TKB reserve</dt>
        <dd className="mt-1 font-semibold tabular-nums">{loadingB ? "Loading…" : reserveB != null ? formatEther(reserveB) : "—"} TKB</dd>
      </div>
    </dl>
  );
}
