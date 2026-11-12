# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

---

## [1.2.0] — 2026-11

### Added
- `QUICK_START.md` — step-by-step local setup guide
- `CHANGELOG.md` — this file
- `CODE_OF_CONDUCT.md` — Contributor Covenant v2.1
- `CONTRIBUTING.md` — contribution workflow and standards
- `SECURITY.md` — vulnerability disclosure policy
- `.nvmrc` — pins Node.js 22 LTS
- `npm run typecheck` script (`tsc --noEmit`)
- `npm run test:contracts` script (alias for `hardhat test`)
- `npm run clean` script (removes `.next`, `artifacts`, `cache`, `typechain-types`, `coverage`)
- Desktop inline navigation in `app/wallet/layout.tsx` — pill-style active state, hidden on mobile
- Desktop inline navigation in `app/payflow/PayFlowApp.tsx` — driven by page state, hidden on mobile
- `shrink-0` and `min-w-0` guards throughout header flex rows to prevent collision at 320 px

### Changed
- `README.md` — fully rewritten to reflect current repository state; accurate directory structure, scripts, routes, and environment variable table
- `package.json` — moved `vercel` from `dependencies` to `devDependencies`; added `rimraf` to `devDependencies`
- `components.json` — fixed `tailwind.css` path from `src/app/globals.css` to `app/globals.css`
- `app/globals.css` — removed duplicate `@theme inline` and `@layer base` blocks
- `lib/abi.ts` — removed duplicate `SlippageExceeded` error entry
- `.gitignore` — removed duplicate entries; added `/artifacts`, `/cache`, `/typechain-types`
- `.env.example` — reorganised into labelled sections (Hardhat Local / Sepolia / server-only secrets)
- `AGENTS.md` — rewritten to cover the full stack: frontend architecture rules, Web3 conventions, smart contract safety, all scripts, and documentation links
- `app/wallet/layout.tsx` — widened shell from `max-w-md` to `max-w-2xl`; bottom nav now `md:hidden`; body padding accounts for iOS safe-area inset
- `app/payflow/PayFlowApp.tsx` — bottom nav now `md:hidden`; body padding accounts for iOS safe-area inset; logo text hidden on mobile
- `components/SwapCard.tsx` — balance label row: `shrink-0` on label, `truncate text-right` on balance span; slippage row: `flex-wrap`; reserve footer: `min-w-0 truncate` on both spans
- `app/wallet/swap/page.tsx` — added `min-w-0` to left flex group in page header
- `app/wallet/page.tsx` — added `flex-wrap` to CTA button row
- `app/page.tsx` — header restructured to full-width with inner constrained div; logo text and divider hidden on mobile; `h1` changed from `text-5xl` to `text-4xl sm:text-5xl`
- `components/WalletBar.tsx` — connect button shows "Connect" on mobile and full text on sm+; error paragraph changed from `max-w-72` to `w-full sm:max-w-72`

### Fixed
- Bottom navigation bars were rendered on all viewport sizes while `pb-20 md:pb-0` implied they should be hidden on desktop — content was obscured on desktop by the persistent fixed bar
- Wallet shell was permanently capped at 448 px (`max-w-md`) on all viewports — dead margins on tablet and desktop
- Landing page header logo group and nav group collided at 320 px — no overflow protection on either side
- `SlippageExceeded` ABI entry was duplicated — viem throws on duplicate entries
- `components.json` pointed to a non-existent `src/app/globals.css` path — shadcn CLI could not locate the CSS file
- Duplicate `@theme` and `@layer base` blocks in `globals.css` caused Tailwind to process the same tokens twice

---

## [1.1.0] — 2026-11

### Added
- Sepolia testnet support — `NEXT_PUBLIC_SEPOLIA_*` environment variables, Sepolia chain in wagmi config
- `DeploySepoliaContracts` component — in-browser wallet-signed deployment of TKA, TKB, and SimpleAMM on Sepolia
- `ContractAddressesProvider` context — per-chain address resolution with session deployment support
- `swapAForBMinOut` and `swapBForAMinOut` functions in `SimpleAMM.sol` — slippage-protected swaps
- `SlippageExceeded` custom error in `SimpleAMM.sol`
- Hardhat-generated TypeScript contract types in `types/ethers-contracts/`
- `lib/deployment-bytecode.ts` — compiled bytecode for in-browser contract deployment
- `lib/wallet-errors.ts` — `isWalletProviderMissing` helper
- `lib/contract-addresses.tsx` — `ContractAddressesProvider` and `useContractAddresses` hook
- Security headers in `next.config.ts` — HSTS, X-Frame-Options, Permissions-Policy, CSP report-only
- `WalletBar` network selector — switch between Sepolia and Hardhat Local from the UI
- PayFlow shell (`/payflow`) — state-based navigation between home, swap, and pools screens
- Wallet shell (`/wallet`) — App Router sub-routes for dashboard, swap, and pools
- `ReservesDisplay` component — live AMM reserve reader
- `TokenBalances` component — live ERC-20 balance reader

### Changed
- `scripts/deploy-amm.ts` — now writes only the three `NEXT_PUBLIC_*` address variables to `frontend/.env.local`, preserving all other existing values
- `hardhat.config.ts` — migrated to Hardhat 3 plugin API (`defineConfig`, `plugins` array)

---

## [1.0.0] — 2026-11

### Added
- `SimpleAMM.sol` — constant-product AMM with `addLiquidity`, `swapAForB`, `swapBForA`
- `TokenA.sol` and `TokenB.sol` — OpenZeppelin ERC-20 tokens, 1 000 000 supply each
- `Counter.sol` — Hardhat starter contract
- `test/SimpleAMM.ts` — swap output and slippage reversion tests
- `test/Counter.ts` — Increment event tests
- `scripts/deploy-amm.ts` — deploy and seed the local Hardhat pool
- Next.js 16 App Router frontend with Turbopack
- `app/wagmi.ts` — wagmi v2 config with SSR cookie storage, injected connector, Hardhat Local chain definition
- `app/providers.tsx` — SSR-safe provider tree with `useState`-initialised QueryClient
- `app/layout.tsx` — root layout with `cookieToInitialState` hydration
- `SwapCard` component — full swap UI with approve + swap flow, slippage selector, reserve display
- `lib/abi.ts` — typed ABIs for SimpleAMM and ERC-20
- `lib/constants.ts` — chain IDs, RPC URLs, address resolution helpers
- Tailwind CSS 4 with CSS-first `@theme` tokens and PayFlow brand colours
- shadcn/ui component library (base-nova style)
- Dark theme
- `/docs` documentation site
