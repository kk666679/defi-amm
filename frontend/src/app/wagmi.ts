import { cookieStorage, createStorage } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";
import { defineChain } from "viem";

export const hardhatLocal = defineChain({
  id: 31337,
  name: "Hardhat Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
});

export function getConfig() {
  return getDefaultConfig({
    appName: "DeFi AMM",
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "demo",
    chains: [hardhatLocal, mainnet, sepolia],
    ssr: true,
    storage: createStorage({ storage: cookieStorage }),
  });
}
