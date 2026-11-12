# PayFlow — DeFi AMM

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Hardhat](https://img.shields.io/badge/Hardhat-3-FFF100)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity)
![License](https://img.shields.io/badge/License-MIT-green)

PayFlow is an educational hybrid-wallet and DeFi AMM demo. It includes a single-pool, constant-product TKA/TKB AMM with a 0.3% swap fee, a mobile-first Next.js UI, and an in-app documentation site. Trading is intended for a local Hardhat chain or Sepolia testnet; the contracts are not for mainnet or production use.

## Contents

- [Features](#features)
- [Architecture](#architecture)
- [Contract design](#contract-design)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Quick start](#quick-start)
- [Wallet networks](#wallet-networks)
- [Environment variables](#environment-variables)
- [Routes](#routes)
- [Commands and tests](#commands-and-tests)
- [Security](#security)
- [Contributing](#contributing)

## Features

- Constant-product AMM (`x * y = k`) with a 0.3% swap fee.
- Single TKA/TKB pool with minimum-output slippage protection.
- Two-token liquidity deposits and on-chain reserve tracking.
- Injected-wallet connection, network switching, and transaction receipt handling.
- Cookie-based wagmi hydration for SSR-safe wallet state.
- Sepolia and Hardhat Local trading support.
- Wallet-signed in-browser Sepolia deployment; the app never asks for a private key.
- `/wallet` dashboard with live ERC-20 balances and pool reserves.
- Mobile-first `/payflow` shell and `/docs` site.

The `/payflow` shell includes sample pool/rate data. Those samples are not live on-chain quotes; the shared swap and reserves components are the chain-backed AMM UI.

## Architecture

```text
Browser
  ├── /                 AMM landing page and shared swap card
  ├── /payflow          PayFlow shell; state-based Home, Swap, and Earn views
  ├── /wallet            Wallet dashboard
  │   ├── /wallet/swap   Shared swap card
  │   └── /wallet/pools  Live AMM reserves
  └── /docs              In-app documentation

Next.js App Router
  ├── app/layout.tsx     Root layout and cookie-based wagmi hydration
  ├── app/providers.tsx  Wagmi, TanStack Query, and contract-address providers
  ├── app/wagmi.ts       Chain, transport, and injected-connector config
  └── app/globals.css    Tailwind CSS 4 theme and shared styles

Web3
  ├── wagmi + viem       Typed contract reads and wallet writes
  ├── injected connector Browser wallet connection
  └── TanStack Query     Contract query cache and refetching

Contracts
  ├── SimpleAMM          Single-pool constant-product AMM
  ├── TokenA             ERC-20 TKA
  └── TokenB             ERC-20 TKB
```

Chain IDs, RPC URLs, and per-chain contract addresses are centralized in `lib/constants.ts` and `app/wagmi.ts`. Contract addresses are supplied through environment variables or, for a browser deployment, held in client session state until refresh.

## Contract design

`SimpleAMM` is a single-pair pool. It has no factory, router, LP-token issuance, or liquidity-removal function.

| Function | Description |
|---|---|
| `addLiquidity(amountA, amountB)` | Deposits both tokens and updates reserves |
| `swapAForB(amountAIn)` / `swapBForA(amountBIn)` | Legacy swaps without a caller-specified minimum |
| `swapAForBMinOut(amountAIn, minimumAmountBOut)` | TKA-to-TKB swap with minimum-output protection |
| `swapBForAMinOut(amountBIn, minimumAmountAOut)` | TKB-to-TKA swap with minimum-output protection |

The output formula is:

```text
amountOut = (amountIn * 997 * reserveOut) /
            (reserveIn * 1000 + amountIn * 997)
```

The 997/1000 multiplier applies the 0.3% fee. The fee remains in the pool. The minimum-output functions revert with `SlippageExceeded` when the calculated output is below the requested minimum.

`TokenA` and `TokenB` are OpenZeppelin ERC-20 tokens. Each constructor mints 1,000,000 tokens with 18 decimals to the deployer.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 App Router, React 19, TypeScript 7 |
| Styling | Tailwind CSS 4 |
| UI | shadcn/ui primitives and Base UI |
| Web3 | wagmi v2, viem, TanStack Query v5 |
| Contracts | Solidity 0.8.24, Hardhat 3 |
| Contract tests | TypeScript, Mocha, Ethers |
| Optional data layer | Prisma 7, PostgreSQL |

The Prisma schema and server-only client are present, but the current app does not persist or index on-chain swaps.

## Repository layout

```text
app/                         Next.js App Router and routes
  docs/                      In-app documentation
  payflow/                   State-based PayFlow shell
  wallet/                    Dashboard and wallet sub-routes
components/                  Shared wallet/AMM, UI, and AI-element components
lib/
  contracts/                 Solidity sources
  abi.ts                     Typed viem ABIs
  constants.ts               Chain IDs, RPC URLs, and contract addresses
  contract-addresses.tsx     Per-chain address context
  deployment-bytecode.ts     Bytecode used by browser deployment
  prisma.ts                  Server-only Prisma client
prisma/                      PostgreSQL schema
scripts/                     Hardhat deploy and transaction scripts
test/                        Hardhat Mocha/Ethers contract tests
types/ethers-contracts/       Generated contract types
ignition/modules/             Hardhat Ignition modules
components/ui/                Shared UI primitives
components/ai-elements/       AI-oriented UI component collection
docs/                        Agent session protocol
```

## Quick start

Use the Node.js version pinned in `.nvmrc` (currently 24.21.0). See [QUICK_START.md](./QUICK_START.md) for the full setup guide.

```bash
npm install

# Terminal 1: keep the local chain running
npx hardhat node

# Terminal 2: deploy tokens and AMM, then seed the pool
npx hardhat run scripts/deploy-amm.ts --network localhost

# Terminal 3: start Next.js from the repository root
npm run dev
```

Open <http://localhost:3000/>.

**Local address-file caveat:** `scripts/deploy-amm.ts` writes addresses to `frontend/.env.local`, but the Next.js app runs from the repository root and reads the root `.env.local`. Copy the three `NEXT_PUBLIC_*_ADDRESS` values from the generated frontend file (or the deployment output) into the root `.env.local`. Restart Next.js after changing environment variables.

## Wallet networks

### Hardhat Local

| Setting | Value |
|---|---|
| Network name | Hardhat Local |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency | ETH |

Use only a test account printed by the local Hardhat node. These development keys are public and must never be used on a real network.

### Sepolia

1. Switch the injected wallet to Sepolia (chain ID `11155111`).
2. Obtain Sepolia test ETH.
3. Use the in-app setup panel to deploy TKA, TKB, and the AMM, then seed the initial pool.
4. Configure the resulting public contract addresses as `NEXT_PUBLIC_SEPOLIA_*` variables to reuse the deployment after a page refresh.

The wallet signs each transaction; the application does not request or store private keys.

## Environment variables

Copy `.env.example` to the repository-root `.env.local` and set values as needed.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_AMM_ADDRESS` | Hardhat Local AMM address |
| `NEXT_PUBLIC_TOKEN_A_ADDRESS` / `NEXT_PUBLIC_TOKEN_B_ADDRESS` | Hardhat Local token addresses |
| `NEXT_PUBLIC_HARDHAT_RPC_URL` | Hardhat RPC; defaults to `http://127.0.0.1:8545` |
| `NEXT_PUBLIC_SEPOLIA_AMM_ADDRESS` | Sepolia AMM address |
| `NEXT_PUBLIC_SEPOLIA_TOKEN_A_ADDRESS` / `NEXT_PUBLIC_SEPOLIA_TOKEN_B_ADDRESS` | Sepolia token addresses |
| `NEXT_PUBLIC_SEPOLIA_RPC_URL` | Sepolia RPC; defaults to a public endpoint |
| `DATABASE_URL` | Server-side PostgreSQL connection for Prisma |

`NEXT_PUBLIC_*` values are exposed to browsers. Use this prefix only for public RPC URLs and contract addresses; never put private keys, database credentials, or other secrets in them.

## Routes

| Route | Description |
|---|---|
| `/` | AMM landing page and swap |
| `/payflow` | PayFlow Home, Swap, and Earn screens; navigation is state-based |
| `/wallet` | Dashboard with token balances and pool reserves |
| `/wallet/swap` | Wallet-framed swap |
| `/wallet/pools` | Wallet-framed pool reserves |
| `/docs` | Documentation site |

## Commands and tests

Run scripts defined by `package.json`:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run compile
npm run test
npm run test:contracts
npm run prisma:generate
```

`npm run test` and `npm run test:contracts` run the Hardhat contract tests. `npm run prisma:generate` requires `DATABASE_URL` to be available to Prisma's configuration. There is no `clean` script.

The focused contract tests are in `test/SimpleAMM.ts` (swap output, slippage reversion, reserve rollback) and `test/Counter.ts` (events and accumulated values).

## Security

This is an educational demo. The contracts have not been audited and should not be deployed to mainnet or used with real funds. See [SECURITY.md](./SECURITY.md) for known limitations and vulnerability reporting.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the contribution workflow and checks.

## License

MIT © 2026 kk666679
