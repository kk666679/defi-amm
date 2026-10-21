import { cookieStorage, createStorage, createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { defineChain } from "viem";
import { injected } from "wagmi/connectors";

export const hardhatLocal = defineChain({
  id: 31337,
  name: "Hardhat Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
});

export function getConfig() {
  return createConfig({
    chains: [hardhatLocal, mainnet, sepolia],
    connectors: [injected()],
    transports: {
      [hardhatLocal.id]: http(),
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    ssr: true,
    storage: createStorage({ storage: cookieStorage }),
  });
}
