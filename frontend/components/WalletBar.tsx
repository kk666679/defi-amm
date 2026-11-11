"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  HARDHAT_CHAIN_ID,
  SEPOLIA_CHAIN_ID,
  isSupportedTradeChain,
} from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WalletBar() {
  const { address, chainId, isConnected } = useAccount();
  const { connect, connectors, error: connectError, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, error: switchError, isPending: isSwitching } = useSwitchChain();
  const selectedNetwork = chainId && isSupportedTradeChain(chainId) ? String(chainId) : "";
  const injectedConnector = connectors.find((connector) => connector.id === "injected");

  const handleNetworkChange = (value: string | null) => {
    if (!value) return;
    const nextChainId = Number(value);
    if (nextChainId === SEPOLIA_CHAIN_ID || nextChainId === HARDHAT_CHAIN_ID) {
      switchChain({ chainId: nextChainId });
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {isConnected && address && (
        <span className="hidden text-xs font-mono sm:inline">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      )}
      {!isConnected ? (
        <Button disabled={isConnecting || !injectedConnector} onClick={() => injectedConnector && connect({ connector: injectedConnector })}>
          {isConnecting ? "Connecting…" : injectedConnector ? "Connect wallet" : "No injected wallet detected"}
        </Button>
      ) : (
        <>
          <Select value={selectedNetwork} onValueChange={handleNetworkChange}>
            <SelectTrigger aria-label="Trading network" size="sm" disabled={isSwitching}>
              <SelectValue placeholder="Choose network" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                <SelectItem value={String(SEPOLIA_CHAIN_ID)}>Sepolia</SelectItem>
                <SelectItem value={String(HARDHAT_CHAIN_ID)}>Hardhat Local</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => disconnect()}>
            Disconnect
          </Button>
        </>
      )}
      {(connectError || switchError) && (
        <p role="alert" className="max-w-56 text-xs text-destructive">
          {(connectError ?? switchError)?.message}
        </p>
      )}
      {isSwitching && <span role="status" className="sr-only">Switching wallet network</span>}
    </div>
  );
}
