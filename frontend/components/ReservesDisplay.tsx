"use client";

import { formatEther } from "viem";
import { useReadContract } from "wagmi";
import { AMM_ABI } from "@/lib/abi";
import { AMM_ADDRESS, CONTRACTS_CONFIGURED } from "@/lib/constants";

export function ReservesDisplay() {
  const { data: reserveA, isLoading: loadingA, error: errorA } = useReadContract({
    address: AMM_ADDRESS!, abi: AMM_ABI, functionName: "reserveA", query: { enabled: CONTRACTS_CONFIGURED },
  });
  const { data: reserveB, isLoading: loadingB, error: errorB } = useReadContract({
    address: AMM_ADDRESS!, abi: AMM_ABI, functionName: "reserveB", query: { enabled: CONTRACTS_CONFIGURED },
  });

  if (!CONTRACTS_CONFIGURED) return <p role="status" className="text-sm text-muted-foreground">Contract addresses are not configured.</p>;
  if (errorA || errorB) return <p role="alert" className="text-sm text-destructive">Could not read pool reserves: {(errorA ?? errorB)?.message}</p>;

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
