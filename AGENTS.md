# PayFlow DeFi AMM — Repository Instructions

These are the canonical repository-specific engineering rules for AI agents. Follow applicable higher-priority system, developer, and user instructions first. Read the relevant source before editing; make focused changes and verify the requested behavior.

## Agent environment

- Read `.autoclaw/AGENT-ORIENTATION.md` for the AutoClaw on-disk contract and `.autoclaw/agent-style.md` for generated, advisory project learnings. These files are AutoClaw-generated; do not edit or recreate them by hand.
- Follow `docs/AGENT_SESSION_PROTOCOL.md` for AutoClaw identity, assignment, scope, and message handling. The current registry and board are runtime state, not proof that a task is assigned or that a command/worker is available.
- Only use an AutoClaw agent ID and mailbox when the current registry actually registers that identity. Do not impersonate Cline, Kilo Code, Claude Code, or another agent; do not invent assignments, messages, votes, reviews, or active workers.
- Treat `.clinerules/` as tool-specific behavior. Its specialized rules do not override this file, generated AutoClaw contracts, or higher-priority safety instructions.
- `.autoclaw/` is generated/local runtime state and is git-ignored in this workspace. Do not hand-edit generated orientation/style, databases, indexes, or metrics; use the supported host integration when available.

## Project architecture

- This is a Next.js App Router application with a single-pair TKA/TKB AMM demo. Solidity source is under `lib/contracts/`, not a root `contracts/` directory.
- Preserve existing paths and route structure under `app/`. Do not move or rename routes as an unrelated refactor.
- Routes: `/` (AMM landing/swap), `/payflow` (state-based PayFlow shell), `/wallet`, `/wallet/swap`, `/wallet/pools`, and `/docs`.
- Keep `app/wagmi.ts` and `app/providers.tsx` in place. `app/layout.tsx` is a Server Component that hydrates wagmi state from cookies; keep static routes server-rendered where practical.
- Add `"use client"` only where browser APIs, React state, or wallet hooks require it. All wallet interaction belongs in Client Components.
- Shared wallet/AMM components are in `components/`; reusable primitives are in `components/ui/`. `components/ai-elements/` is a component collection, not evidence of an active AI backend.
- `lib/` owns shared ABIs, chain/address constants, address context, deployment bytecode, wallet errors, utilities, and the server-only Prisma client.
- `types/ethers-contracts/` and `generated/prisma/` contain generated artifacts. Regenerate them with the project toolchain; do not hand-edit generated files.
- `prisma/schema.prisma` defines a PostgreSQL data model, but the current app has no API route or UI flow that persists AMM activity. Do not claim swaps are indexed or stored.

## Frontend and styling

- TypeScript strict mode is enabled. Use the existing `@/*` aliases. Aliases for `@/hooks/*` and `@/config/*` exist, but those directories are not currently present; do not assume their modules exist.
- Use `cn` from `@/lib/utils` for conditional class merging.
- Keep shared Tailwind CSS 4 theme tokens in `app/globals.css`; do not duplicate token blocks. The `/payflow` shell also has `app/payflow/payflow.css`.
- Reuse existing primitives and shared components. Preserve responsive layouts, mobile navigation, and safe-area spacing.
- The `/payflow` shell includes sample pool/rate data in `app/payflow/data.ts`; it is not live chain data. The shared swap and reserves components are the chain-backed AMM UI.

## Web3 and smart contracts

- Chain IDs, RPC URLs, supported trading networks, and environment-derived addresses are centralized in `lib/constants.ts`; wagmi chain/transport configuration is in `app/wagmi.ts`.
- Resolve contract addresses with `useContractAddresses()` from `lib/contract-addresses.tsx`. Keep typed viem ABIs (`as const`) in `lib/abi.ts`.
- If Solidity changes, keep the ABI and checked-in deployment bytecode in `lib/deployment-bytecode.ts` synchronized.
- Simulate transactions when practical. Handle disconnected wallets, unsupported networks, absent providers, and RPC failures explicitly. Do not report success until the transaction receipt is confirmed.
- The AMM is one TKA/TKB constant-product pool with a 0.3% fee; it has no factory or router. Treat all contracts as educational and unaudited; do not deploy them to mainnet or use real funds.
- Solidity pragma is `0.8.24`. Do not change it without checking all contracts and the toolchain. Do not enable the optimizer without benchmarking and documenting the effect.
- Validate external inputs and token transfer outcomes when changing contracts. Do not add `payable` to functions that do not accept native currency.
- Add or update focused tests in `test/` for contract behavior. Existing tests use Hardhat 3 with TypeScript, Mocha, Ethers, and the configured toolbox; follow those patterns and the project-local Hardhat skills before adding another test stack.

## Data, configuration, and secrets

- `lib/prisma.ts` is server-only and requires `DATABASE_URL`; never import it into a Client Component.
- `NEXT_PUBLIC_*` variables are browser-visible. Use them only for public RPC URLs and contract addresses. Keep database credentials, private keys, and other secrets server-side.
- Never commit `.env.local`, private keys, mnemonics, or other credentials. Use `.env.example` for safe variable names and placeholder values; do not copy secret values into examples or logs.
- Sepolia deployment is wallet-signed in the browser. Do not introduce a server-side private-key deployment flow.
- The local deploy script currently writes address variables to `frontend/.env.local`, while the Next.js app and `.env.example` are at the repository root. Check that mismatch before relying on generated local addresses; do not change it as an unrelated task.

## Testing and documentation

- Check `package.json` before relying on a script; run only scripts that exist in the valid manifest. For relevant changes, prefer the narrowest applicable lint, typecheck, build, compile, or contract-test command.
- For Solidity tests, Hardhat configuration, or code using the Hardhat network API, follow `.agents/skills/hardhat/SKILL.md` and `.agents/skills/hardhat-toolbox-mocha-ethers/SKILL.md`. Project-local patterns take precedence over generic examples that require absent dependencies.
- Update `README.md`, `QUICK_START.md`, `CONTRIBUTING.md`, or `SECURITY.md` when a change alters their documented behavior or setup. Keep claims evidence-based.
- Follow `SECURITY.md` for vulnerability disclosure. Security review must be read-only unless the user separately requests a fix.
- Do not commit, deploy, merge, or run persistent automation unless the user explicitly requests that action. Never overwrite unrelated or pre-existing work during cleanup or rollback.
