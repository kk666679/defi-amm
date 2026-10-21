"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletBar() {
  return (
    <div className="flex items-center gap-3">
      <ConnectButton />
    </div>
  );
}
