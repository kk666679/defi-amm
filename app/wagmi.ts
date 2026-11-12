import { cookieStorage, createStorage, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { custom, defineChain, fallback, http, type EIP1193Parameters, type EIP1193Provider, type EIP1474Methods } from "viem";
import { injected } from "wagmi/connectors";
import {
  HARDHAT_CHAIN_ID,
  HARDHAT_RPC_URL,
  SEPOLIA_RPC_URL,
} from "@/lib/constants";

// Allowlist of trusted RPC URL prefixes to prevent SSRF
const ALLOWED_RPC_PREFIXES = [
  "http://127.0.0.1:",
  "http://localhost:",
  "https://rpc.sepolia.org",
  "https://sepolia.infura.io",
  "https://eth-sepolia",
  "https://rpc2.sepolia.org",
];

function assertSafeRpcUrl(url: string, label: string): void {
  const isAllowed = ALLOWED_RPC_PREFIXES.some((prefix) => url.startsWith(prefix));
  if (!isAllowed) {
    throw new Error(`Blocked untrusted RPC URL for ${label}: ${url}`);
  }
}

export const hardhatLocal = defineChain({
  id: HARDHAT_CHAIN_ID,
  name: "Hardhat Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [HARDHAT_RPC_URL] },
  },
});

const sepoliaWithPublicRpc = {
  ...sepolia,
  rpcUrls: {
    ...sepolia.rpcUrls,
    default: {
      ...sepolia.rpcUrls.default,
      http: [SEPOLIA_RPC_URL],
    },
  },
};

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
    chains: [sepoliaWithPublicRpc, hardhatLocal, mainnet],
    connectors: [injected()],
    transports: {
      [sepolia.id]: (assertSafeRpcUrl(SEPOLIA_RPC_URL, "Sepolia"), http(SEPOLIA_RPC_URL)),
      [hardhatLocal.id]: (assertSafeRpcUrl(HARDHAT_RPC_URL, "Hardhat"), fallback([injectedWalletTransport, http(HARDHAT_RPC_URL)])),
      [mainnet.id]: http(),
    },
    ssr: true,
    storage: createStorage({ storage: cookieStorage }),
  });
}
