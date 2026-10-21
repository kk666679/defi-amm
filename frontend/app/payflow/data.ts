import type { Pool } from "./types";

export const SWAP_RATE = 2842.19;
export const SWAP_FEE = 0.003;

export const POOLS: Pool[] = [
  {
    id: "eth-usdc",
    pair: "ETH / USDC",
    tokenA: { icon: "Ξ", className: "eth" },
    tokenB: { icon: "$", className: "usdc" },
    feeTier: "0.05% Fee Tier",
    apr: "16.8% APR",
    tvl: "$612.4M TVL",
  },
  {
    id: "usdc-dai",
    pair: "USDC / DAI",
    tokenA: { icon: "$", className: "usdc" },
    tokenB: { icon: "◈", className: "dai" },
    feeTier: "0.01% Fee Tier",
    apr: "6.2% APR",
    tvl: "$248.7M TVL",
  },
  {
    id: "wbtc-eth",
    pair: "WBTC / ETH",
    tokenA: { icon: "₿", className: "wbtc" },
    tokenB: { icon: "Ξ", className: "eth" },
    feeTier: "0.30% Fee Tier",
    apr: "12.4% APR",
    tvl: "$384.1M TVL",
  },
];
