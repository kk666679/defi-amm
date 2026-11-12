# Repository Guide

## Project overview

PayFlow is a Next.js App Router demo for a single-pair, constant-product TKA/TKB AMM. The frontend connects to Sepolia or a local Hardhat chain through an injected wallet. The Solidity contracts are educational and unaudited; do not treat them as production-ready or deploy them to mainnet.

The stack includes Next.js 16, React 19, strict TypeScript, Tailwind CSS 4, wagmi/viem, Hardhat 3 with Solidity 0.8.24, and Prisma 7 with PostgreSQL.

## Repository map

- `app/` — App Router routes, shared providers, wallet configuration, and styles. Keep the existing route and file structure stable.
  - `/` — AMM landing page and swap.
  - `/payflow` — mobile-first shell with state-based Home, Swap, and Earn views; it does not change the URL between views.
  - `/wallet`, `/wallet/swap`, `/wallet/pools` — wallet dashboard and route-based swap/pool views.
  - `/docs` — in-app documentation pages and navigation.
- `components/` — shared wallet/AMM components, `ui/` primitives, and `ai-elements/` UI components.
- `lib/` — shared ABI, chain/address constants, address context, deployment bytecode, wallet errors, utilities, Prisma client, and Solidity sources in `contracts/`.
- `types/ethers-contracts/` — Hardhat-generated Ethers contract types; regenerate rather than hand-edit generated files.
- `test/` — Hardhat Mocha/Ethers contract tests.
- `scripts/` — Hardhat deployment and transaction scripts.
- `ignition/modules/` — Hardhat Ignition modules.
- `prisma/` — PostgreSQL schema. The generated Prisma client is configured under `generated/prisma/`.
- `.agents/skills/hardhat/` and `.agents/skills/hardhat-toolbox-mocha-ethers/` — project guidance for Hardhat 3 and the configured Mocha/Ethers toolbox.

There are no `hooks/` or `config/` directories at present, although TypeScript path aliases for them are configured. Do not assume those modules exist.

## Architecture and implementation rules

### Next.js and UI

- Preserve existing paths under `app/`; do not move or rename route files as part of unrelated work.
- Prefer Server Components. Add `"use client"` only where browser APIs, React state, or client-side wallet hooks are needed. All wallet interaction belongs in Client Components.
- Keep wagmi configuration in `app/wagmi.ts` and the provider tree in `app/providers.tsx`. Root layout hydrates wagmi state from request cookies.
- Use the existing `@/*` aliases and `cn` from `@/lib/utils` for conditional classes.
- Theme tokens and shared Tailwind utilities live in `app/globals.css`; avoid duplicate token blocks. The `/payflow` shell also has scoped styles in `app/payflow/payflow.css`.
- Reuse `components/ui/` primitives and existing shared components rather than introducing competing UI patterns.
- Keep layouts responsive, including the mobile bottom navigation and safe-area spacing.

### Web3

- Chain IDs, RPC URLs, supported trading networks, and environment-derived contract addresses live in `lib/constants.ts`; wagmi chain and transport configuration lives in `app/wagmi.ts`.
- Resolve current-network contract addresses through `useContractAddresses()` from `lib/contract-addresses.tsx`. Do not scatter addresses, chain IDs, or RPC URLs through UI components.
- Keep viem ABIs typed with `as const` in `lib/abi.ts`. The browser deployment panel uses the checked-in bytecode in `lib/deployment-bytecode.ts`; if contracts change, keep their ABI and deployment bytecode in sync.
- Simulate transactions when practical. Report wallet/RPC errors clearly, handle disconnected wallets and unsupported networks, and only display success after the transaction receipt is confirmed.
- `NEXT_PUBLIC_*` values are exposed in the browser. Restrict them to public RPC URLs and contract addresses; never put private keys, mnemonics, or server secrets in them or in source control.
- Contract addresses deployed into the provider's session state are not persistent across refreshes; configure environment variables to reuse a deployment.

### Solidity and Hardhat

- Solidity sources are in `lib/contracts/` (not a root `contracts/` directory). The app's AMM is a single TKA/TKB pool with a 0.3% fee; it has no factory or router.
- Keep Solidity at `0.8.24` unless all contracts and the toolchain are deliberately updated together. Do not enable the optimizer without benchmarking and documenting the impact.
- Validate external inputs and token transfer outcomes when changing contracts; do not add `payable` unless a function must receive native currency.
- Add or update focused tests in `test/` for contract behavior. Preserve coverage for swap output, slippage reverts, and reserve rollback.
- `hardhat.config.ts` uses the Hardhat 3 plugin API. Follow the repository's Hardhat skills when changing Hardhat configuration, tests, or related code.

### Data layer

- `prisma/schema.prisma` defines user, wallet, token, pool, swap, liquidity-event, and price-snapshot models.
- `lib/prisma.ts` is server-only and requires `DATABASE_URL`; never import it into a Client Component.
- Prisma schema/client support exists, but the current app has no API route or UI flow wired to persist AMM activity. Do not imply that on-chain swaps are currently indexed or stored.

## Current behavior boundaries

- The on-chain interface is one TKA/TKB pool, even where screens use broader wallet/DeFi language.
- The `/payflow` shell's pool listings and displayed rates in `app/payflow/data.ts` are sample UI data, not live contract reads. The shared swap and reserves components are the chain-backed AMM UI.
- Sepolia contract deployment is wallet-signed in the browser. Never add a server-side private-key deployment flow.
- The local deploy script currently writes address variables to `frontend/.env.local`, while the Next.js app and `.env.example` are at the repository root. Check this path before assuming the script's output is loaded by the app; do not silently change deployment behavior as part of an unrelated task.
- `components/ai-elements/` is a component collection; do not assume there is a configured AI backend or an active AI product flow.

## Environment and local development

Use `.env.example` as the template. Relevant variables:

- `NEXT_PUBLIC_AMM_ADDRESS`, `NEXT_PUBLIC_TOKEN_A_ADDRESS`, `NEXT_PUBLIC_TOKEN_B_ADDRESS` — Hardhat Local contracts.
- `NEXT_PUBLIC_HARDHAT_RPC_URL` — local RPC; defaults to `http://127.0.0.1:8545`.
- `NEXT_PUBLIC_SEPOLIA_AMM_ADDRESS`, `NEXT_PUBLIC_SEPOLIA_TOKEN_A_ADDRESS`, `NEXT_PUBLIC_SEPOLIA_TOKEN_B_ADDRESS` — Sepolia contracts.
- `NEXT_PUBLIC_SEPOLIA_RPC_URL` — public Sepolia RPC; defaults to a public endpoint.
- `DATABASE_URL` — PostgreSQL connection for Prisma, server-side only.

Typical local workflow:

```bash
npm install
npx hardhat node
npx hardhat run scripts/deploy-amm.ts --network localhost
npm run dev
```

The local chain must remain running while using its contracts. Hardhat's printed test keys are public local-development fixtures only; never use them on a real network.

## Commands

Run the narrowest relevant check, and run the complete set for broad changes:

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

`npm run test` and `npm run test:contracts` both run Hardhat tests. There is currently no `clean` script in `package.json`.

For Prisma generation, ensure `DATABASE_URL` is available to Prisma's config. Do not create or apply database migrations unless the task requires a schema change and the intended database is clear.

## Documentation and security

- Keep repository documentation consistent with implementation. Update `README.md`, `QUICK_START.md`, or `CONTRIBUTING.md` when a change alters their documented setup, commands, routes, or behavior.
- Follow `AGENTS.md` for additional repository-specific contributor and agent rules.
- Follow `SECURITY.md` for vulnerability reporting. Treat contract, wallet, and transaction changes as security-sensitive; never claim the demo is audited.
