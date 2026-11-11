export const AMM_ABI = [
  { type: "function", name: "reserveA", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "reserveB", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "tokenA", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "tokenB", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "swapAForB", stateMutability: "nonpayable", inputs: [{ type: "uint256", name: "amountAIn" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "swapBForA", stateMutability: "nonpayable", inputs: [{ type: "uint256", name: "amountBIn" }], outputs: [{ type: "uint256" }] },
  { type: "error", name: "SlippageExceeded", inputs: [{ type: "uint256", name: "actualAmountOut" }, { type: "uint256", name: "minimumAmountOut" }] },
  { type: "error", name: "SlippageExceeded", inputs: [{ type: "uint256", name: "actualAmountOut" }, { type: "uint256", name: "minimumAmountOut" }] },
  { type: "function", name: "swapAForBMinOut", stateMutability: "nonpayable", inputs: [{ type: "uint256", name: "amountAIn" }, { type: "uint256", name: "minimumAmountBOut" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "swapBForAMinOut", stateMutability: "nonpayable", inputs: [{ type: "uint256", name: "amountBIn" }, { type: "uint256", name: "minimumAmountAOut" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "addLiquidity", stateMutability: "nonpayable", inputs: [{ type: "uint256", name: "amountA" }, { type: "uint256", name: "amountB" }], outputs: [] },
] as const;

export const ERC20_ABI = [
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "allowance", stateMutability: "view", inputs: [{ type: "address" }, { type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ type: "address", name: "spender" }, { type: "uint256", name: "amount" }], outputs: [{ type: "bool" }] },
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
] as const;
