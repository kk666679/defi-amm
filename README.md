# PayFlow — DeFi AMM

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Hardhat](https://img.shields.io/badge/Hardhat-3-FFF100)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity)
![License](https://img.shields.io/badge/License-MIT-green)

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
- **Docs site** at `/docs` with auto-generated table of contents
- **Dark theme** across the whole app

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Browser["🖥️ Browser (Windows)"]
        UI["PayFlow UI<br/>HomePage · SwapPage · PoolsPage"]
        MM["MetaMask<br/>chain 31337"]
    end

    subgraph Next["⚛️ Next.js 16 (WSL)"]
        Root["app/page.tsx<br/>(AMM)"]
        Docs["app/docs/page.tsx<br/>(Docs)"]
        Providers["Providers<br/>WagmiProvider + ReactQuery"]
        Config["wagmi.ts<br/>injected + hardhatLocal"]
    end

    subgraph HH["⛓️ Hardhat 3 (WSL)"]
        Node["hardhat node<br/>http://127.0.0.1:8545"]
        AMM["SimpleAMM.sol<br/>0x9fE4…6e0"]
        TA["TokenA.sol<br/>0x5FbD…aa3"]
        TB["TokenB.sol<br/>0xe7f1…512"]
    end

    UI --> Providers
    Providers --> Config
    Config --> MM
    MM -->|JSON-RPC| Node
    Node --> AMM
    AMM --> TA
    AMM --> TB
    Root --> Providers
    Docs --> Providers

    style Browser fill:#1e3a8a,color:#fff
    style Next fill:#7c3aed,color:#fff
    style HH fill:#065f46,color:#fff
```

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
        +swapAForB(amountAIn) returns(amountBOut)
        +swapBForA(amountBIn) returns(amountAOut)
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

    Frontend --> Src["src/app/"]
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
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js ≥ 22 LTS
- WSL2 (Ubuntu) or native Linux/macOS
- MetaMask browser extension

### 1. Backend

```bash
# Terminal 1 — local chain
npx hardhat node

# Terminal 2 — deploy + seed liquidity
npx hardhat run scripts/deploy-amm.ts --network localhost
```

Copy the three printed addresses into `frontend/.env.local`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local        # then fill in the addresses
npm install --legacy-peer-deps
npm run dev
```

Open:
- **AMM**: <http://localhost:3000/>
- **Docs**: <http://localhost:3000/docs>

---

## 🦊 MetaMask Setup

```mermaid
flowchart TD
    A[Open MetaMask] --> B{Network: Hardhat Local?}
    B -->|No| C[Add Network]
    C --> C1["Name: Hardhat Local<br/>RPC: http://127.0.0.1:8545<br/>Chain ID: 31337<br/>Symbol: ETH"]
    C1 --> D[Import Account]
    B -->|Yes| D
    D --> E["Paste private key<br/>(Account #0 from hardhat node)"]
    E --> F[Import Tokens]
    F --> F1["TokenA: 0x5FbDB...<br/>TokenB: 0xe7f17..."]
    F1 --> G[Back to localhost:3000]
    G --> H[Click Connect MetaMask]
    H --> I[Confirm in popup]
    I --> J[✅ Connected]

    style A fill:#f59e0b,color:#fff
    style J fill:#10b981,color:#fff
```

| Field | Value |
|---|---|
| Network Name | Hardhat Local |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency | ETH |

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
| `NEXT_PUBLIC_WC_PROJECT_ID` | WalletConnect / Reown Project ID (optional for injected-only) | `abc123…` |
| `NEXT_PUBLIC_AMM_ADDRESS` | Deployed `SimpleAMM` address | `0x9fE4…` |
| `NEXT_PUBLIC_TOKEN_A_ADDRESS` | Deployed `TokenA` address | `0x5FbD…` |
| `NEXT_PUBLIC_TOKEN_B_ADDRESS` | Deployed `TokenB` address | `0xe7f1…` |

> `.env.local` is git-ignored. Use `.env.example` as the template.

---

## 🛣️ Routes

| Route | Description |
|---|---|
| `/` | PayFlow AMM — dashboard, swap, earn |
| `/docs` | Documentation with sidebar + TOC + ask bar |

### In-app navigation

```mermaid
graph LR
    Home["/ (Home)"] -->|Swap button| Swap["/swap (in-app state)"]
    Home -->|Earn button| Pools["/pools (in-app state)"]
    Swap -->|Back| Home
    Pools -->|Back| Home
    Home -.->|URL| Docs["/docs"]
```

The PayFlow app uses **internal state** for `home` / `swap` / `pools` navigation (no URL change), keeping the wallet connection alive across views.

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

All tokens live in `frontend/src/app/globals.css` under `@theme`. If you deleted them, re-add:

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
- Add liquidity math
- Swap fee calculation (0.3%)
- Reserve updates post-swap
- Revert on zero-liquidity swaps

---

## 📜 License

MIT © 2026 kk666679
