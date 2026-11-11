"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "@/components/ui/button";
import { HARDHAT_CHAIN_ID } from "@/lib/constants";

export function WalletBar() {
  const { address, chainId, isConnected } = useAccount();
  const { connect, error: connectError, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, error: switchError, isPending: isSwitching } = useSwitchChain();
  const wrongNetwork = isConnected && chainId !== HARDHAT_CHAIN_ID;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {isConnected && address && (
        <span className="text-xs font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      )}
      {!isConnected ? (
        <Button disabled={isConnecting} onClick={() => connect({ connector: injected() })}>
          {isConnecting ? "Connecting…" : "Connect wallet"}
        </Button>
      ) : (
        <>
          {wrongNetwork && (
            <Button
              disabled={isSwitching}
              onClick={() => switchChain({ chainId: HARDHAT_CHAIN_ID })}
              className="px-3 text-xs"
            >
              {isSwitching ? "Switching…" : "Switch to Hardhat"}
            </Button>
          )}
          <Button variant="outline" onClick={() => disconnect()}>
            Disconnect
          </Button>
        </>
      )}
      {(connectError || switchError) && (
        <p role="alert" className="max-w-56 text-xs text-destructive">
          {(connectError ?? switchError)?.message}
        </p>
      )}
    </div>
  );
}
