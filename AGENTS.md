<<<<<<< HEAD
# PayFlow DeFi AMM — Agent Instructions
=======
# Hardhat + ethers project
>>>>>>> origin/main

## Project layout

```
<<<<<<< HEAD
app/                  Next.js App Router (DO NOT restructure)
  docs/               Documentation site
  payflow/            PayFlow shell — home, swap, pools screens
  wallet/             Wallet dashboard and sub-routes
  globals.css         Tailwind 4 CSS-first theme tokens
  layout.tsx          Root layout with SSR cookie hydration
  providers.tsx       WagmiProvider + QueryClientProvider
  wagmi.ts            Chain config, transports, injected connector
components/           Shared React components
  ui/                 shadcn/ui primitives
lib/
  abi.ts              Typed contract ABIs (as const)
  constants.ts        Chain IDs, RPC URLs, contract address helpers
  contract-addresses.tsx  ContractAddressesProvider context
  deployment-bytecode.ts  Compiled bytecode for in-browser deployment
  utils.ts            cn() re-export
  wallet-errors.ts    Wallet error helpers
types/
  ethers-contracts/   Hardhat-generated TypeScript contract types
contracts/            Solidity source (*.sol)
scripts/              Hardhat run scripts
test/                 TypeScript contract tests (Mocha + Ethers)
ignition/             Hardhat Ignition modules
hardhat.config.ts
```

## Architecture rules

- **Preserve app/ routes exactly.** Do not rename, move, or delete any file under `app/`.
- **Do not add `"use client"` to layout.tsx or page.tsx** unless the component genuinely requires browser APIs. Prefer Server Components for static content.
- **Keep `wagmi.ts` and `providers.tsx` inside `app/`** unless a migration is explicitly proposed and approved.
- **All wallet interaction must happen in Client Components** (`"use client"`).
- **Never commit private keys, mnemonics, or `.env.local`** to version control.
- **`NEXT_PUBLIC_` variables are browser-visible.** Only use this prefix for values safe to expose publicly (contract addresses, public RPC URLs). Never prefix private keys or server secrets with `NEXT_PUBLIC_`.

## Coding standards

- TypeScript strict mode is enabled. All new code must type-check with `npm run typecheck`.
- Use path aliases: `@/components/*`, `@/lib/*`, `@/hooks/*`, `@/types/*`, `@/config/*`.
- Prefer `as const` ABIs in `lib/abi.ts` for full viem type inference.
- Use `cn()` from `@/lib/utils` for conditional class merging.
- Do not duplicate CSS token blocks in `globals.css`.

## Web3 conventions

- Chain configuration lives in `app/wagmi.ts` and `lib/constants.ts`. Do not scatter chain IDs or RPC URLs across components.
- Contract addresses are resolved per-chain via `useContractAddresses()` from `lib/contract-addresses.tsx`.
- Always simulate a transaction before submitting it when possible.
- Never assume a transaction succeeded before the receipt is confirmed.
- Handle wallet disconnection, unsupported networks, and missing provider gracefully.

## Smart contract safety

- Solidity pragma is `0.8.24`. Do not change it without checking all contracts.
- The optimizer is off by default in `hardhat.config.ts`; enable it only if you benchmark the gas savings.
- Do not add `payable` to functions that do not accept ETH.
- Validate all external inputs in Solidity (zero-address checks, reserve checks).
- Write a test for every new contract function before merging.

## Commands

```bash
# Frontend
npm run dev          # Next.js dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check (no emit)

# Contracts
npm run compile      # Hardhat compile
npm run test         # Hardhat Mocha tests
npm run test:contracts

# Utilities
npm run clean        # Remove .next, artifacts, cache, coverage
```
=======
contracts/        Solidity source files (*.sol) and unit tests (*.t.sol)
test/             TypeScript integration tests and Solidity unit tests (*.sol)
ignition/         Hardhat Ignition deployment modules
scripts/          Standalone scripts run with `hardhat run`
hardhat.config.ts
```

## Working in this project

When writing or modifying tests, configuring `hardhat.config.ts`, or interacting with the network from TypeScript, invoke the **`hardhat`** skill. It covers Solidity and TypeScript testing, how to choose between them, `forge-std` cheatcodes, the `network.create()` API, `networkHelpers`, and the compile-then-typecheck workflow. The skill itself points to the matching `hardhat-toolbox-*` skill for toolbox-specific guidance (signers, contract interaction, assertions).
>>>>>>> origin/main

## Docs

- Hardhat 3 — https://hardhat.org/llms.txt
<<<<<<< HEAD
- ethers.js v6 — https://docs.ethers.org/v6/
- wagmi v2 — https://wagmi.sh/
- viem — https://viem.sh/
- Next.js 16 — https://nextjs.org/docs
- Tailwind CSS 4 — https://tailwindcss.com/docs
=======
- ethers.js — https://docs.ethers.org/v6/
>>>>>>> origin/main
