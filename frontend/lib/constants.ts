import { isAddress, type Address } from "viem";

function configuredAddress(value: string | undefined): Address | undefined {
  return value && isAddress(value) ? value : undefined;
}

export const SEPOLIA_CHAIN_ID = 11_155_111;
export const HARDHAT_CHAIN_ID = 31_337;
export const DEFAULT_TRADE_CHAIN_ID = SEPOLIA_CHAIN_ID;
export const SEPOLIA_RPC_URL =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL?.trim() ||
  "https://ethereum-sepolia-rpc.publicnode.com";
export const SUPPORTED_TRADE_CHAIN_IDS = [SEPOLIA_CHAIN_ID, HARDHAT_CHAIN_ID] as const;
export type SupportedTradeChainId = (typeof SUPPORTED_TRADE_CHAIN_IDS)[number];

export function isSupportedTradeChain(chainId: number): chainId is SupportedTradeChainId {
  return SUPPORTED_TRADE_CHAIN_IDS.includes(chainId as SupportedTradeChainId);
}

export const TRADE_CHAIN_NAMES: Record<SupportedTradeChainId, string> = {
  [SEPOLIA_CHAIN_ID]: "Sepolia",
  [HARDHAT_CHAIN_ID]: "Hardhat Local",
};

export type ContractAddresses = {
  amm: Address | undefined;
  tokenA: Address | undefined;
  tokenB: Address | undefined;
};

export type CompleteContractAddresses = {
  amm: Address;
  tokenA: Address;
  tokenB: Address;
};

export function hasConfiguredContracts(addresses: ContractAddresses): addresses is CompleteContractAddresses {
  return Boolean(addresses.amm && addresses.tokenA && addresses.tokenB);
}

export const CONTRACT_ADDRESSES_BY_CHAIN: Record<SupportedTradeChainId, ContractAddresses> = {
  [SEPOLIA_CHAIN_ID]: {
    amm: configuredAddress(process.env.NEXT_PUBLIC_SEPOLIA_AMM_ADDRESS),
    tokenA: configuredAddress(process.env.NEXT_PUBLIC_SEPOLIA_TOKEN_A_ADDRESS),
    tokenB: configuredAddress(process.env.NEXT_PUBLIC_SEPOLIA_TOKEN_B_ADDRESS),
  },
  [HARDHAT_CHAIN_ID]: {
    amm: configuredAddress(process.env.NEXT_PUBLIC_AMM_ADDRESS),
    tokenA: configuredAddress(process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS),
    tokenB: configuredAddress(process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS),
  },
};

export const HARDHAT_RPC_URL = process.env.NEXT_PUBLIC_HARDHAT_RPC_URL?.trim() || "http://127.0.0.1:8545";
export const HARDHAT_RPC_UNAVAILABLE_MESSAGE = "Hardhat Local is unreachable. The wallet must be connected to chain 31337 and its RPC must be available from the browser.";
export const SEPOLIA_RPC_UNAVAILABLE_MESSAGE = "Sepolia's public RPC is unavailable. Check the network connection and make sure the connected wallet is on Sepolia (chain ID 11155111).";
