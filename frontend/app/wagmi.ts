import { cookieStorage, createStorage, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { custom, defineChain, fallback, http, type EIP1193Parameters, type EIP1193Provider, type EIP1474Methods } from "viem";
import { injected } from "wagmi/connectors";
import { HARDHAT_CHAIN_ID, HARDHAT_RPC_URL } from "@/lib/constants";

export const hardhatLocal = defineChain({
  id: 31337,
  name: "Hardhat Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [HARDHAT_RPC_URL] },
  },
});

type InjectedRequestArgs = EIP1193Parameters<EIP1474Methods>;

const injectedWalletTransport = custom({
  request: async (args: InjectedRequestArgs) => {
    const provider = typeof window === "undefined"
      ? undefined
      : (window as Window & { ethereum?: EIP1193Provider }).ethereum;

    if (!provider) throw new Error("No injected wallet provider is available.");
    const connectedChainId = await provider.request({ method: "eth_chainId" });
    if (Number(connectedChainId) !== HARDHAT_CHAIN_ID) {
      throw new Error(`Injected wallet is on chain ${Number(connectedChainId)}; expected ${HARDHAT_CHAIN_ID}.`);
    }
    return provider.request(args);
  },
});

export function getConfig() {
  return createConfig({
    chains: [hardhatLocal, mainnet, sepolia],
    connectors: [injected()],
    transports: {
      [hardhatLocal.id]: fallback([injectedWalletTransport, http(HARDHAT_RPC_URL)]),
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    ssr: true,
    storage: createStorage({ storage: cookieStorage }),
  });
}
