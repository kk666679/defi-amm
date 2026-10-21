"use client";

import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import { AMM_ABI } from "@/lib/abi";
import { AMM_ADDRESS } from "@/lib/constants";

export function ReservesDisplay() {
  const { data: reserveA } = useReadContract({ address: AMM_ADDRESS, abi: AMM_ABI, functionName: "reserveA" });
  const { data: reserveB } = useReadContract({ address: AMM_ADDRESS, abi: AMM_ABI, functionName: "reserveB" });

  return (
    <div className="flex gap-6 text-sm text-muted-foreground">
      <span>TKA Reserve: {reserveA !== undefined ? formatEther(reserveA) : "—"}</span>
      <span>TKB Reserve: {reserveB !== undefined ? formatEther(reserveB) : "—"}</span>
    </div>
  );
}
