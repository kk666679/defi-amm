# PayFlow — DeFi AMM

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
<<<<<<< HEAD
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)
=======
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript)
>>>>>>> origin/main
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Hardhat](https://img.shields.io/badge/Hardhat-3-FFF100)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity)
![License](https://img.shields.io/badge/License-MIT-green)

<<<<<<< HEAD
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
=======
A full-stack **hybrid wallet + DeFi AMM** demo running on a local Hardhat chain. Single-pool constant-product AMM with 0.3% swap fee, a PayFlow-style mobile UI, and an in-app docs page.

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Contract Design](#-contract-design)
- [Swap Flow](#-swap-flow)
- [User Journey](#-user-journey)
- [Tech Stack](#-tech-stack)
- [Directory Structure](#-directory-structure)
- [Quick Start](#-quick-start)
- [MetaMask Setup](#-metamask-setup)
- [Environment Variables](#-environment-variables)
- [Routes](#-routes)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## ✨ Features

- **Constant-product AMM** (`x * y = k`) with 0.3% fee
- **Single-pool** TKA ↔ TKB swap
- **Two-token liquidity** with reserve tracking on-chain
- **Injected wallet** connection (MetaMask, no WalletConnect required for local dev)
- **SSR-safe** Web3 state (cookie-based hydration, no flicker)
- **PayFlow UI** — mobile-first wallet dashboard (balance, quick actions, swap, earn)
>>>>>>> origin/main
- **Docs site** at `/docs` with auto-generated table of contents
- **Dark theme** across the whole app

---

<<<<<<< HEAD
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
=======
## 🏗️ Architecture

```mermaid
flowchart TB
    subgraph Browser[Browser]
        Landing[AMM landing /]
        PayFlow[PayFlow /payflow]
        Wallet[Wallet /wallet]
        Injected[Injected wallet]
    end

    subgraph Frontend[Next.js App Router]
        Providers[Wagmi + query providers]
        Config[Injected connector + Hardhat chain config]
        PayFlowShell[PayFlow shell]
        Swap[Swap screen + shared SwapCard]
        Pools[Pool screen + reserves]
    end

    subgraph LocalChain[Local development only]
        RPC[Hardhat JSON-RPC :8545]
        AMM[SimpleAMM]
        TokenA[Token A / TKA]
        TokenB[Token B / TKB]
    end

    Landing --> Providers
    PayFlow --> PayFlowShell
    PayFlowShell --> Swap
    PayFlowShell --> Pools
    Wallet --> Providers
    Providers --> Config
    Config --> Injected
    Injected -. user-configured network .-> RPC
    RPC -. after deployment .-> AMM
    AMM --> TokenA
    AMM --> TokenB
    Swap --> RPC
    Pools --> RPC
```

Contract addresses are generated by the deployment script and saved to the ignored `frontend/.env.local`; they are not assumed or committed.

---

## 📜 Contract Design

### SimpleAMM

Single-pool AMM storing two reserves. No factory, no router — the pair **is** the entry point.

```mermaid
classDiagram
    class SimpleAMM {
        +IERC20 tokenA
        +IERC20 tokenB
        +uint256 reserveA
        +uint256 reserveB
        +addLiquidity(amountA, amountB)
        +swapAForB(amountAIn) returns(amountBOut) [legacy]
        +swapBForA(amountBIn) returns(amountAOut) [legacy]
        +swapAForBMinOut(amountAIn, minimumAmountBOut)
        +swapBForAMinOut(amountBIn, minimumAmountAOut)
        +error SlippageExceeded(actualAmountOut, minimumAmountOut)
        +event LiquidityAdded(amountA, amountB)
        +event Swap(user, tokenIn, amountIn, amountOut)
    }

    class TokenA {
        +ERC20 "Token A" "TKA"
        +mint 1,000,000 to deployer
    }

    class TokenB {
        +ERC20 "Token B" "TKB"
        +mint 1,000,000 to deployer
    }

    SimpleAMM --> TokenA : reserveA
    SimpleAMM --> TokenB : reserveB
```

### Fee Formula

```mermaid
flowchart LR
    IN["amountIn"] --> FEE["× 997<br/>(0.3% fee)"]
    FEE --> NUM["numerator"]
    RES_IN["reserveIn × 1000"] --> DEN_BASE["denominator base"]
    DEN_BASE --> DEN["+ numerator"]
    NUM --> DIV["÷ denominator"]
    DEN --> DIV
    DIV --> OUT["amountOut"]
    OUT --> MINUS["reserveOut − amountOut"]
    MINUS --> NEW["new reserveOut"]

    style IN fill:#10b981,color:#fff
    style OUT fill:#10b981,color:#fff
    style FEE fill:#f59e0b,color:#fff
```

**Formula**: `amountOut = (amountIn × 997 × reserveOut) / (reserveIn × 1000 + amountIn × 997)`

---

## 🔄 Swap Flow

### Sequence: User swaps TKA → TKB

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant W as PayFlow UI
    participant MM as MetaMask
    participant AMM as SimpleAMM
    participant TA as TokenA
    participant TB as TokenB

    U->>W: Enter amount + click Swap
    W->>W: Calculate amountOut<br/>(0.3% fee)
    W->>MM: eth_sendTransaction<br/>approve(AMM, amountIn)
    MM-->>U: Approve prompt
    U->>MM: Confirm
    MM->>TA: approve()
    TA-->>MM: allowance = amountIn
    MM-->>W: tx hash

    W->>MM: eth_sendTransaction<br/>swapAForB(amountIn)
    MM-->>U: Swap prompt
    U->>MM: Confirm
    MM->>AMM: swapAForB(amountIn)
    AMM->>TA: transferFrom(user, AMM, amountIn)
    AMM->>AMM: reserveA += amountIn
    AMM->>AMM: amountOut = formula(...)
    AMM->>AMM: reserveB -= amountOut
    AMM->>TB: transfer(user, amountOut)
    AMM-->>MM: Swap event
    MM-->>W: receipt
    W->>W: Refetch reserves
    W-->>U: New balances shown
```

### State Machine: Contract-level swap

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Checking: swapAForB(amountAIn)
    Checking --> Reverting: reserveA == 0 or reserveB == 0
    Checking --> TransferringIn: reserves > 0
    TransferringIn --> Computing: transferFrom succeeds
    TransferringIn --> Reverting: insufficient balance/allowance
    Computing --> UpdatingReserves: amountOut > 0
    UpdatingReserves --> PayingOut: reserveB -= amountOut
    PayingOut --> Emitting: transfer succeeds
    Emitting --> [*]: Swap event
    Reverting --> [*]: revert
```

---

## 🚀 User Journey

```mermaid
journey
    title First-time user → swap complete
    section Setup
      Start Hardhat node: 5: Dev
      Deploy contracts: 4: Dev
      Open localhost:3000: 5: User
    section Connect
      Click Connect MetaMask: 4: User
      Approve in wallet: 3: User, MetaMask
      Switch to chain 31337: 3: User, MetaMask
    section Swap
      Pick token pair: 5: User
      Enter amount: 5: User
      Approve spend: 3: User, MetaMask
      Confirm swap: 3: User, MetaMask
      See new balance: 5: User
```

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Contracts** | Solidity 0.8.24 | AMM + ERC20 tokens |
| **Dev chain** | Hardhat 3 (EDR) | Local JSON-RPC at `:8545` |
| **Testing** | Mocha + Ethers.js (via Hardhat) | Contract test suite |
| **Frontend** | Next.js 16 (App Router, Turbopack) | SSR + client routing |
| **UI runtime** | React 19 | Server + client components |
| **Language** | TypeScript 7 | Full type safety |
| **Styling** | Tailwind 4 (CSS-first `@theme`) | Utility CSS + tokens |
| **Components** | shadcn/ui + ai-elements | Accessible primitives |
| **Web3** | wagmi v2 + viem | Hooks + typed contract calls |
| **Wallet** | Injected (MetaMask) | No WalletConnect needed |
| **State** | TanStack Query v5 | Cache + refetch |

---

## 📁 Directory Structure

```mermaid
graph LR
    Root["defi-amm/"]

    Root --> Contracts["contracts/"]
    Root --> Scripts["scripts/"]
    Root --> Config["hardhat.config.ts"]
    Root --> Frontend["frontend/"]

    Contracts --> AMM["SimpleAMM.sol"]
    Contracts --> TA["TokenA.sol"]
    Contracts --> TB["TokenB.sol"]

    Scripts --> Deploy["deploy-amm.ts"]

    Frontend --> Src["app/"]
    Src --> Page["page.tsx (AMM)"]
    Src --> Layout["layout.tsx"]
    Src --> Wagmi["wagmi.ts"]
    Src --> Providers["providers.tsx"]
    Src --> Payflow["payflow/"]
    Src --> DocsDir["docs/"]

    Payflow --> HomeP["HomePage.tsx"]
    Payflow --> SwapP["SwapPage.tsx"]
    Payflow --> PoolsP["PoolsPage.tsx"]
    Payflow --> PFApp["PayFlowApp.tsx"]
    Payflow --> Icons["icons.tsx"]
    Payflow --> Types["types.ts"]
    Payflow --> Data["data.ts"]

    DocsDir --> DocsPage["page.tsx"]
    DocsDir --> DocsLayout["layout.tsx"]
    DocsDir --> DocsComp["components/<br/>DocsHeader, DocsSidebar,<br/>DocsTOC, AskQuestionBar"]
>>>>>>> origin/main
```

---

<<<<<<< HEAD
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
=======
## ⚡ Quick Start

### Prerequisites

- Node.js ≥ 22 LTS
- WSL2 (Ubuntu) or native Linux/macOS
- MetaMask browser extension

### 1. Install dependencies

```bash
# Repository root: Hardhat contracts and tests
npm install

# Frontend package with its npm lockfile
npm ci --legacy-peer-deps --prefix frontend
```

### 2. Start and deploy the local chain

```bash
# Terminal 1 — repository root
npx hardhat node

# Terminal 2 — repository root; deploys tokens + AMM, seeds liquidity,
# and updates only the three NEXT_PUBLIC_* addresses in frontend/.env.local
npx hardhat run scripts/deploy-amm.ts --network localhost
```

The deploy script preserves unrelated values already in `frontend/.env.local`. Restart the frontend dev server after deploying so Next.js reloads the new addresses.

### 3. Start the frontend

```bash
cd frontend
npm run dev
```

Open <http://localhost:3000/> for the landing page, <http://localhost:3000/payflow> for PayFlow, or <http://localhost:3000/wallet> for the wallet shell. See `/docs` for project documentation.

---

## Wallet Networks

### Sepolia testnet (hosted preview)

The hosted app defaults to Sepolia (chain ID `11155111`). Connect an injected wallet, select Sepolia in the network control, and use the setup panel to deploy TKA, TKB, and the AMM. The wallet signs three contract deployments, two token approvals, and one initial-liquidity transaction; it needs Sepolia test ETH. The private key never leaves the wallet.

After deployment, copy the three public contract addresses into Vercel Vars (`NEXT_PUBLIC_SEPOLIA_AMM_ADDRESS`, `NEXT_PUBLIC_SEPOLIA_TOKEN_A_ADDRESS`, and `NEXT_PUBLIC_SEPOLIA_TOKEN_B_ADDRESS`) so the app can restore the deployment after a refresh.

### Hardhat Local (optional)

```mermaid
flowchart TD
    A[Open MetaMask] --> B{Network: Hardhat Local?}
    B -->|No| C[Add Network]
    C --> C1["Name: Hardhat Local<br/>RPC: http://127.0.0.1:8545<br/>Chain ID: 31337<br/>Symbol: ETH"]
    C1 --> D[Import Account]
    B -->|Yes| D
    D --> E["Import a Hardhat test account<br/>(local development only)"]
    E --> F[Import Tokens from frontend/.env.local]
    F --> F1["Use addresses written by deploy-amm.ts"]
    F1 --> G[Back to localhost:3000]
    G --> H[Click Connect wallet]
    H --> I[Confirm in popup]
    I --> J[✅ Connected]

    style A fill:#f59e0b,color:#fff
    style J fill:#10b981,color:#fff
```

| Field | Value |
|---|---|
| Network Name | Hardhat Local |
>>>>>>> origin/main
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency | ETH |

<<<<<<< HEAD
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
=======
**Test account** (from `hardhat node` output):

```
Address:     0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
Private key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

> ⚠️ **Never use these on a real chain** — they are publicly known.

---

## 🔐 Environment Variables

`frontend/.env.local`:

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_AMM_ADDRESS` | Deployed local `SimpleAMM` address | Written by `scripts/deploy-amm.ts` |
| `NEXT_PUBLIC_TOKEN_A_ADDRESS` | Deployed local `TokenA` address | Written by `scripts/deploy-amm.ts` |
| `NEXT_PUBLIC_TOKEN_B_ADDRESS` | Deployed local `TokenB` address | Written by `scripts/deploy-amm.ts` |
| `NEXT_PUBLIC_HARDHAT_RPC_URL` | Optional local Hardhat RPC URL | Defaults to `http://127.0.0.1:8545` |
| `NEXT_PUBLIC_SEPOLIA_RPC_URL` | Optional Sepolia JSON-RPC URL | Defaults to the publicnode endpoint; never put a private API key in this public variable |
| `NEXT_PUBLIC_SEPOLIA_AMM_ADDRESS` | Deployed Sepolia `SimpleAMM` address | Copy from the deployment panel |
| `NEXT_PUBLIC_SEPOLIA_TOKEN_A_ADDRESS` | Deployed Sepolia `TokenA` address | Copy from the deployment panel |
| `NEXT_PUBLIC_SEPOLIA_TOKEN_B_ADDRESS` | Deployed Sepolia `TokenB` address | Copy from the deployment panel |

> `.env.local` is git-ignored. Use `.env.example` as the template. Contract addresses are public; never add wallet private keys to these variables.

---

## 🛣️ Routes

| Route | Description |
|---|---|
| `/` | AMM landing page |
| `/payflow` | PayFlow shell with balance home, swap, and pools screens |
| `/wallet` | Wallet dashboard with on-chain balances and pool reserves |
| `/wallet/swap` | Wallet-framed shared swap card |
| `/wallet/pools` | Wallet-framed pool reserves |
| `/docs` | Documentation site |

PayFlow switches between `home`, `swap`, and `pools` in shell state without changing the URL; wallet routes use App Router navigation.

---

## 🩺 Troubleshooting

<details>
<summary><b>ERESOLVE peer dependency error on <code>npm install</code></b></summary>

Add to `frontend/package.json`:

```json
"overrides": {
  "@solana/kit": { "typescript": "$typescript" }
}
```

Then `rm -rf node_modules package-lock.json && npm install`.
</details>

<details>
<summary><b><code>403 Forbidden</code> from Reown</b></summary>

You're using the placeholder `projectId`. Either:
- Get a real one at [dashboard.reown.com](https://dashboard.reown.com), or
- We already removed RainbowKit's `getDefaultConfig` — the app uses injected wallets only, so this warning is harmless.
</details>

<details>
<summary><b>Tailwind classes not applying (<code>bg-brand-*</code> shows nothing)</b></summary>

All tokens live in `frontend/app/globals.css` under `@theme`. If you deleted them, re-add:

```css
@theme inline {
  --color-brand-blue: #0070BA;
  /* ... */
}
```
</details>

<details>
<summary><b>MetaMask shows 0 balance</b></summary>

- Chain must be `31337`
- Import the **deployer** account (`0xf39f…`)
- Tokens don't appear automatically — import `TokenA` / `TokenB` addresses manually
</details>

<details>
<summary><b>Swap reverts with <code>execution reverted</code></b></summary>

- Confirm the `approve` tx mined before clicking Swap
- Ensure `balanceOf(user) ≥ amountIn`
- Check `reserveA > 0 && reserveB > 0` (add liquidity if empty)
</details>

---

## 🧪 Contract Tests

```bash
npx hardhat test
```

Covers:
- AMM swap output using the 0.3% fee formula
- Minimum-output success and slippage reversion
- Reserve updates and rollback after a reverted swap
- The starter Counter contract tests

---

## Architecture relationship verification — November 2026

| Source | Target | Relationship | Evidence | Status |
|---|---|---|---|---|
| User | AMM Landing (`/`) | Opens | `frontend/app/page.tsx` | Verified |
| User | PayFlow Route (`/payflow`) | Opens | `frontend/app/payflow/page.tsx` | Verified |
| PayFlow Route | PayFlow Shell | Renders | `frontend/app/payflow/page.tsx` | Verified |
| PayFlow Shell | Balance Home | Renders | `frontend/app/payflow/PayFlowApp.tsx` | Verified |
| PayFlow Shell | Swap Screen | Renders | `frontend/app/payflow/PayFlowApp.tsx` | Verified |
| PayFlow Shell | Pool Screen | Renders | `frontend/app/payflow/PayFlowApp.tsx` | Verified |
| Swap Screen | Quote data | Reads quote from reserves and computes fee-adjusted output | `frontend/app/payflow/components/SwapPage.tsx`, `frontend/components/SwapCard.tsx` | Verified |
| Pool Screen | Pool data | Reads contract reserves | `frontend/app/payflow/components/PoolsPage.tsx`, `frontend/components/ReservesDisplay.tsx` | Verified |
| PayFlow Balance Home | Token balances | Displays live ERC-20 balances for the connected wallet | `frontend/app/payflow/components/HomePage.tsx`, `frontend/components/TokenBalances.tsx` | Verified |
| Wallet Shell | Wallet Dashboard | Frames | `frontend/app/wallet/layout.tsx`, `frontend/app/wallet/page.tsx` | Verified |
| Wallet Shell | Wallet Pools | Frames | `frontend/app/wallet/layout.tsx`, `frontend/app/wallet/pools/page.tsx` | Verified |
| Wallet Shell | Wallet Swap | Frames | `frontend/app/wallet/layout.tsx`, `frontend/app/wallet/swap/page.tsx` | Verified |
| Wallet Shell | Wallet Bar | Uses | `frontend/app/wallet/layout.tsx`, `frontend/components/WalletBar.tsx` | Verified |
| Wallet Swap | Swap Card | Uses | `frontend/app/wallet/swap/page.tsx`, `frontend/components/SwapCard.tsx` | Verified |
| Wallet Dashboard | Token balances | Displays live ERC-20 balances for the connected wallet | `frontend/app/wallet/page.tsx`, `frontend/components/TokenBalances.tsx` | Verified |
| Wallet Dashboard | Reserve Display | Uses live reserve panel | `frontend/app/wallet/page.tsx`, `frontend/components/ReservesDisplay.tsx` | Verified |
| AMM Landing | Web3 Providers | Uses app-level provider tree | `frontend/app/layout.tsx`, `frontend/app/providers.tsx` | Verified |
| Web3 Providers | Wallet Config | Configures wagmi | `frontend/app/providers.tsx`, `frontend/app/wagmi.ts` | Verified |
| Wallet Config | Injected Wallet | Configures injected connector | `frontend/app/wagmi.ts` | Verified |
| Injected Wallet | Local Hardhat Chain | Supplies contract reads and signs transactions after switching to chain 31337 | `frontend/app/wagmi.ts`, `frontend/components/WalletBar.tsx` | Configured; browser-wallet transaction untested |
| Local Hardhat Chain | Constant-Product AMM | Hosts the deployed local AMM | `hardhat.config.ts`, `scripts/deploy-amm.ts` | Verified in this workspace; ephemeral chain |
| Constant-Product AMM | Pool Tokens | Uses ERC-20 token contracts and reserves | `contracts/SimpleAMM.sol`, `contracts/TokenA.sol`, `contracts/TokenB.sol` | Verified |
| Swap Card | Contract ABI | Uses min-output swap and approval methods | `frontend/components/SwapCard.tsx`, `frontend/lib/abi.ts` | Verified |
| Reserve Display | Contract ABI | Reads `reserveA` and `reserveB` | `frontend/components/ReservesDisplay.tsx`, `frontend/lib/abi.ts` | Verified |
| Production deployment | Contract addresses | Requires environment-specific deployed addresses; none are committed or assumed | `frontend/lib/constants.ts`, `frontend/.env.example` | Missing until deployed/configured |

**Local setup:** the deployment script seeds the Hardhat pool and writes the generated addresses to the git-ignored `frontend/.env.local`, preserving unrelated existing values. The wallet control can add or switch to Hardhat Local (chain ID 31337). Contract reads use the injected wallet provider when available, with HTTP fallback. `NEXT_PUBLIC_HARDHAT_RPC_URL` defaults to `http://127.0.0.1:8545`; in a hosted preview, `127.0.0.1` refers to the viewer's own computer, so use a reachable RPC endpoint if the local node is not on that machine. This `NEXT_PUBLIC_` URL is exposed to browsers and must not contain a private API key. Production contracts, network access, and user wallet behavior remain environment-dependent and require separate verification.

---

## 📜 License
>>>>>>> origin/main

MIT © 2026 kk666679
