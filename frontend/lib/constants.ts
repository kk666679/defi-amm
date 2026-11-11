import { isAddress, type Address } from "viem";

function configuredAddress(value: string | undefined): Address | undefined {
  return value && isAddress(value) ? value : undefined;
}

export const AMM_ADDRESS = configuredAddress(process.env.NEXT_PUBLIC_AMM_ADDRESS);
export const TOKEN_A_ADDRESS = configuredAddress(process.env.NEXT_PUBLIC_TOKEN_A_ADDRESS);
export const TOKEN_B_ADDRESS = configuredAddress(process.env.NEXT_PUBLIC_TOKEN_B_ADDRESS);
export const CONTRACTS_CONFIGURED = Boolean(AMM_ADDRESS && TOKEN_A_ADDRESS && TOKEN_B_ADDRESS);
export const HARDHAT_CHAIN_ID = 31337;
