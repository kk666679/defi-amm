# PayFlow — DeFi AMM

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Hardhat](https://img.shields.io/badge/Hardhat-3-FFF100)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity)
![License](https://img.shields.io/badge/License-MIT-green)

A full-stack **hybrid wallet + DeFi AMM** demo. Single-pool constant-product AMM with a 0.3 % swap fee, a PayFlow-style mobile-first UI, and an in-app documentation site. Runs on a local Hardhat chain or Sepolia testnet — no mainnet deployment.

---

## Table of contents

- [Features](#features)
- [Architecture](#architecture)
- [Contract design](#contract-design)
- [Tech stack](#tech-stack)
- [Directory structure](#directory-structure)
- [Quick start](#quick-start)
- [MetaMask setup](#metamask-setup)
- [Environment variables](#environment-variables)
- [Routes](#routes)
- [Scripts](#scripts)
- [Contract tests](#contract-tests)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Constant-product AMM** (`x * y = k`) with 0.3 % fee
- **Single-pool** TKA ↔ TKB swap with slippage protection (`swapAForBMinOut` / `swapBForAMinOut`)
- **Two-token liquidity** with on-chain reserve tracking
- **Injected wallet** connection (MetaMask — no WalletConnect required for local dev)
- **SSR-safe Web3 state** — cookie-based wagmi hydration, no client/server mismatch
- **Multi-network** — Sepolia testnet and Hardhat Local (chain 31337) supported simultaneously
- **In-browser Sepolia deployment** — deploy TKA, TKB, and the AMM directly from the UI; no private key ever leaves the wallet
- **PayFlow UI** — mobile-first wallet dashboard with balance overview, swap, and pool screens
- **Wallet shell** — App Router route group at `/wallet` with dashboard, swap, and pools sub-routes
- **Responsive layout** — mobile bottom nav, tablet/desktop inline nav; tested at 320 px, 768 px, and 1280 px
- **Docs site** at `/docs` with auto-generated table of contents
- **Dark theme** across the whole app

---

## Architecture

```
Browser
  ├── AMM landing          /
  ├── PayFlow shell        /payflow   (state-based navigation, no URL change)
  ├── Wallet shell         /wallet    (App Router sub-routes)
  └── Docs                 /docs

Next.js App Router
  ├── app/layout.tsx       Root layout — SSR cookie hydration, Geist fonts
  ├── app/providers.tsx    WagmiProvider + QueryClientProvider + ContractAddressesProvider
  ├── app/wagmi.ts         Chain config, transports, injected connector
  └── app/globals.css      Tailwind 4 CSS-first @theme tokens

Web3 layer
  ├── wagmi v2 + viem      Typed contract reads and writes
  ├── Injected connector   MetaMask (no WalletConnect)
  └── TanStack Query v5    Cache, refetch, invalidation

Smart contracts (Hardhat 3 / Solidity 0.8.24)
  ├── SimpleAMM            Constant-product AMM
  ├── TokenA               ERC-20 TKA (1 000 000 supply)
  └── TokenB               ERC-20 TKB (1 000 000 supply)
```

Contract addresses are written to `frontend/.env.local` by the deploy script (Hardhat Local) or resolved from environment variables (Sepolia). Neither is committed.

---

## Contract design

### SimpleAMM

Single-pool AMM. No factory, no router — the pair is the entry point.

| Function | Description |
|---|---|
| `addLiquidity(amountA, amountB)` | Deposit both tokens; update reserves |
| `swapAForB(amountAIn)` | Legacy swap, no slippage guard |
| `swapBForA(amountBIn)` | Legacy swap, no slippage guard |
| `swapAForBMinOut(amountAIn, minimumAmountBOut)` | Swap with slippage protection |
| `swapBForAMinOut(amountBIn, minimumAmountAOut)` | Swap with slippage protection |

**Fee formula**

```
amountOut = (amountIn × 997 × reserveOut) / (reserveIn × 1000 + amountIn × 997)
```

The 0.3 % fee is applied by multiplying `amountIn` by 997 before computing the output. The fee stays in the pool, increasing the effective reserve for future swaps.

**Custom error**

```solidity
error SlippageExceeded(uint256 actualAmountOut, uint256 minimumAmountOut);
```

Reverts and leaves reserves unchanged when the computed output is below the caller's minimum.

### TokenA / TokenB

Standard OpenZeppelin ERC-20. Constructor mints 1 000 000 tokens (18 decimals) to the deployer.

---

## Tech stack

| Layer | Technology | Version |
|---|---|---|
| Contracts | Solidity | 0.8.24 |
| Contract framework | Hardhat 3 (EDR) | ^3.20.0 |
| Contract testing | Mocha + Ethers.js | ^12 / ^6 |
| Contract types | Hardhat-generated TypeScript factories | `types/ethers-contracts/` |
| Frontend | Next.js App Router + Turbopack | 16.4.2 |
| UI runtime | React | 19.3.0 |
| Language | TypeScript strict | ~6.0.3 |
| Styling | Tailwind CSS 4 (CSS-first `@theme`) | ^4 |
| Components | shadcn/ui (base-nova style) + Base UI | latest |
| Web3 | wagmi v2 + viem | ^2.19 / ^2.57 |
| Wallet | Injected (MetaMask) | — |
| State / cache | TanStack Query v5 | ^5.104 |
| Node.js | LTS 22 | `.nvmrc` |

---

## Directory structure

```
defi-amm/
├── app/                        Next.js App Router — do not restructure
│   ├── docs/                   Documentation site
│   │   └── components/         DocsHeader, DocsSidebar, DocsTOC, AskQuestionBar
│   ├── payflow/                PayFlow shell (state-based, single URL)
│   │   └── components/         HomePage, SwapPage, PoolsPage
│   ├── wallet/                 Wallet shell (App Router sub-routes)
│   │   ├── pools/              /wallet/pools
│   │   └── swap/               /wallet/swap
│   ├── globals.css             Tailwind 4 theme tokens + PayFlow custom styles
│   ├── layout.tsx              Root layout — SSR hydration, fonts
│   ├── page.tsx                AMM landing page
│   ├── providers.tsx           WagmiProvider + QueryClientProvider
│   └── wagmi.ts                Chain definitions, transports, injected connector
│
├── components/
│   ├── ui/                     shadcn/ui primitives
│   ├── ai-elements/            AI chat UI components
│   ├── DeploySepoliaContracts.tsx  In-browser Sepolia deployment panel
│   ├── PayFlowLogo.tsx
│   ├── ReservesDisplay.tsx     Live AMM reserve reader
│   ├── SwapCard.tsx            Shared swap UI (used in both shells)
│   ├── TokenBalances.tsx       Live ERC-20 balance reader
│   └── WalletBar.tsx           Connect / network-switch / disconnect control
│
├── lib/
│   ├── contracts/              Solidity source files
│   │   ├── SimpleAMM.sol
│   │   ├── TokenA.sol
│   │   ├── TokenB.sol
│   │   └── Counter.sol
│   ├── abi.ts                  Typed ABIs (as const) for wagmi/viem
│   ├── constants.ts            Chain IDs, RPC URLs, address helpers
│   ├── contract-addresses.tsx  ContractAddressesProvider context
│   ├── deployment-bytecode.ts  Compiled bytecode for in-browser deployment
│   ├── utils.ts                cn() re-export
│   └── wallet-errors.ts        Wallet error classification helpers
│
├── types/
│   └── ethers-contracts/       Hardhat-generated TypeScript contract types
│
├── scripts/
│   ├── deploy-amm.ts           Deploy + seed Hardhat Local; writes frontend/.env.local
│   └── send-op-tx.ts           Utility script
│
├── test/
│   ├── SimpleAMM.ts            AMM swap and slippage tests
│   └── Counter.ts              Counter contract tests
│
├── ignition/
│   └── modules/Counter.ts      Hardhat Ignition module (Counter example)
│
├── public/                     Static assets
├── .env.example                Environment variable template
├── .nvmrc                      Node.js 22 LTS
├── hardhat.config.ts           Hardhat 3 configuration
├── next.config.ts              Next.js 16 configuration + security headers
├── tsconfig.json               TypeScript strict config + path aliases
├── eslint.config.mjs           ESLint 9 flat config
├── postcss.config.mjs          Tailwind 4 PostCSS plugin
├── components.json             shadcn/ui configuration
├── AGENTS.md                   AI agent coding instructions
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── QUICK_START.md
└── SECURITY.md
```

---

## Quick start

See [QUICK_START.md](./QUICK_START.md) for the full step-by-step guide. The short version:

```bash
# 1. Install
npm install

# 2. Start Hardhat node (terminal 1)
npx hardhat node

# 3. Deploy contracts + seed pool (terminal 2)
npx hardhat run scripts/deploy-amm.ts --network localhost

# 4. Start the frontend (terminal 3)
npm run dev
```

Open http://localhost:3000.

---

## MetaMask setup

### Hardhat Local

| Field | Value |
|---|---|
| Network name | Hardhat Local |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency | ETH |

Import a Hardhat test account (local development only — never use on a real network):

```
Address:     0xf39Fd6e51aad88F6f4ce6aB8827279cffFb92266
Private key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

Then import the TKA and TKB token addresses written to `frontend/.env.local` by the deploy script.

### Sepolia testnet

The hosted app defaults to Sepolia (chain ID `11155111`). Connect an injected wallet, select Sepolia in the network control, and use the in-app setup panel to deploy TKA, TKB, and the AMM. The panel signs three deployments, two approvals, and one liquidity transaction — all from your wallet. Sepolia test ETH is required; no private key is ever requested by the app.

After deployment, copy the three contract addresses into Vercel environment variables:

```
NEXT_PUBLIC_SEPOLIA_AMM_ADDRESS=
NEXT_PUBLIC_SEPOLIA_TOKEN_A_ADDRESS=
NEXT_PUBLIC_SEPOLIA_TOKEN_B_ADDRESS=
```

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values. `.env.local` is git-ignored.

| Variable | Network | Description |
|---|---|---|
| `NEXT_PUBLIC_AMM_ADDRESS` | Hardhat Local | Written by `scripts/deploy-amm.ts` |
| `NEXT_PUBLIC_TOKEN_A_ADDRESS` | Hardhat Local | Written by `scripts/deploy-amm.ts` |
| `NEXT_PUBLIC_TOKEN_B_ADDRESS` | Hardhat Local | Written by `scripts/deploy-amm.ts` |
| `NEXT_PUBLIC_HARDHAT_RPC_URL` | Hardhat Local | Defaults to `http://127.0.0.1:8545` |
| `NEXT_PUBLIC_SEPOLIA_AMM_ADDRESS` | Sepolia | Copy from the in-app deployment panel |
| `NEXT_PUBLIC_SEPOLIA_TOKEN_A_ADDRESS` | Sepolia | Copy from the in-app deployment panel |
| `NEXT_PUBLIC_SEPOLIA_TOKEN_B_ADDRESS` | Sepolia | Copy from the in-app deployment panel |
| `NEXT_PUBLIC_SEPOLIA_RPC_URL` | Sepolia | Defaults to the publicnode endpoint |

`NEXT_PUBLIC_` variables are exposed to the browser. Never put private keys or server secrets in them.

---

## Routes

| Route | Description |
|---|---|
| `/` | AMM landing page with SwapCard |
| `/payflow` | PayFlow shell — home, swap, and pools screens (state-based, single URL) |
| `/wallet` | Wallet dashboard — token balances and pool reserves |
| `/wallet/swap` | Wallet-framed SwapCard |
| `/wallet/pools` | Wallet-framed ReservesDisplay |
| `/docs` | Documentation site |

---

## Scripts

```bash
npm run dev            # Next.js dev server (Turbopack)
npm run build          # Production build
npm run start          # Production server
npm run lint           # ESLint
npm run typecheck      # TypeScript check (no emit)
npm run compile        # Hardhat compile
npm run test           # Hardhat Mocha tests
npm run test:contracts # Alias for npm run test
npm run clean          # Remove .next, artifacts, cache, typechain-types, coverage
```

---

## Contract tests

```bash
npm run test
```

Test coverage:

- `test/SimpleAMM.ts` — constant-product swap output, slippage reversion, reserve rollback on revert
- `test/Counter.ts` — Increment event emission, aggregated event sum

---

## Troubleshooting

**`ERESOLVE` peer dependency error**

Add to `package.json`:
```json
"overrides": { "@solana/kit": { "typescript": "$typescript" } }
```
Then `rm -rf node_modules package-lock.json && npm install`.

**Tailwind classes not applying (`bg-brand-*` shows nothing)**

All tokens live in `app/globals.css` under `@theme inline`. If they are missing, restore them from the `PAYFLOW HYBRID WALLET CUSTOM STYLES` section.

**MetaMask shows 0 balance**

- Chain must be `31337`
- Import the deployer account (`0xf39f…`)
- Import TKA and TKB token addresses from `frontend/.env.local` manually

**Swap reverts with `execution reverted`**

- Confirm the `approve` transaction mined before clicking Swap
- Ensure `balanceOf(user) ≥ amountIn`
- Check `reserveA > 0 && reserveB > 0` — add liquidity if the pool is empty

**`127.0.0.1:8545` unreachable in a hosted preview**

`127.0.0.1` resolves to the viewer's own machine. Set `NEXT_PUBLIC_HARDHAT_RPC_URL` to a reachable endpoint, or use Sepolia instead.

---

## Security

See [SECURITY.md](./SECURITY.md) for the vulnerability disclosure policy.

This project is a development and educational demo. The contracts have not been audited. Do not deploy to Ethereum mainnet or any production network.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

MIT © 2026 kk666679
