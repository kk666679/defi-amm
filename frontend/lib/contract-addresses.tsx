"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useAccount } from "wagmi";
import {
  CONTRACT_ADDRESSES_BY_CHAIN,
  DEFAULT_TRADE_CHAIN_ID,
  hasConfiguredContracts,
  isSupportedTradeChain,
  type CompleteContractAddresses,
  type ContractAddresses,
} from "@/lib/constants";

type ContractAddressesContextValue = {
  chainId: number;
  addresses: ContractAddresses;
  configured: boolean;
  isSessionDeployment: boolean;
  poolSeeded: boolean;
  setDeployedAddresses: (chainId: number, addresses: CompleteContractAddresses) => void;
  markPoolSeeded: (chainId: number) => void;
};

const emptyAddresses: ContractAddresses = { amm: undefined, tokenA: undefined, tokenB: undefined };
const ContractAddressesContext = createContext<ContractAddressesContextValue | null>(null);

export function ContractAddressesProvider({ children }: { children: ReactNode }) {
  const { chainId: walletChainId, isConnected } = useAccount();
  const chainId = isConnected && walletChainId ? walletChainId : DEFAULT_TRADE_CHAIN_ID;
  const [sessionAddresses, setSessionAddresses] = useState<Record<number, CompleteContractAddresses>>({});
  const [seededChains, setSeededChains] = useState<Record<number, boolean>>({});

  const addresses = isSupportedTradeChain(chainId)
    ? sessionAddresses[chainId] ?? CONTRACT_ADDRESSES_BY_CHAIN[chainId]
    : emptyAddresses;
  const setDeployedAddresses = useCallback((targetChainId: number, deployed: CompleteContractAddresses) => {
    setSessionAddresses((current) => ({ ...current, [targetChainId]: deployed }));
    setSeededChains((current) => ({ ...current, [targetChainId]: false }));
  }, []);
  const markPoolSeeded = useCallback((targetChainId: number) => {
    setSeededChains((current) => ({ ...current, [targetChainId]: true }));
  }, []);
  const value = useMemo(() => ({
    chainId,
    addresses,
    configured: hasConfiguredContracts(addresses),
    isSessionDeployment: Boolean(sessionAddresses[chainId]),
    poolSeeded: Boolean(seededChains[chainId]),
    setDeployedAddresses,
    markPoolSeeded,
  }), [addresses, chainId, markPoolSeeded, seededChains, sessionAddresses, setDeployedAddresses]);

  return <ContractAddressesContext.Provider value={value}>{children}</ContractAddressesContext.Provider>;
}

export function useContractAddresses() {
  const context = useContext(ContractAddressesContext);
  if (!context) throw new Error("useContractAddresses must be used within ContractAddressesProvider.");
  return context;
}
