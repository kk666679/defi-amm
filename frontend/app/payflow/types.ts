export type PageId = "home" | "swap" | "pools";

export type TokenId = "eth" | "usdc";

export interface PoolToken {
  icon: string;
  className: string;
}

export interface Pool {
  id: string;
  pair: string;
  tokenA: PoolToken;
  tokenB: PoolToken;
  feeTier: string;
  apr: string;
  tvl: string;
}
