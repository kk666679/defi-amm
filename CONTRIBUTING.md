# Contributing

Thank you for your interest in contributing to PayFlow DeFi AMM. This document explains how to set up the project, what standards apply, and how to submit changes.

---

## Code of conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating you agree to uphold it.

---

## Before you start

- Check the open issues to see if your idea or bug is already being tracked.
- For significant changes, open an issue first to discuss the approach before writing code.
- For security vulnerabilities, follow the process in [SECURITY.md](./SECURITY.md) — do not open a public issue.

---

## Development setup

Follow [QUICK_START.md](./QUICK_START.md) to get the full stack running locally. The short version:

```bash
npm install
npx hardhat node          # terminal 1
npx hardhat run scripts/deploy-amm.ts --network localhost  # terminal 2
npm run dev               # terminal 3
```

---

## Project structure

The key constraint is that `app/` must not be restructured. Routes, file names, and the provider tree inside `app/` are stable. All new shared code belongs in `components/`, `lib/`, `hooks/`, or `types/`.

See [AGENTS.md](./AGENTS.md) for the full architecture rules.

---

## Making changes

### Branches

Work on a feature branch:

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-description
```

### Commit messages

Use the conventional commits format:

```
type(scope): short description

Optional longer explanation.
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`.

Examples:
```
feat(swap): add price impact warning above 5%
fix(wallet): prevent header collision at 320px
docs: update QUICK_START with Sepolia faucet link
test(contracts): add reserve rollback test for swapBForA
```

---

## Checks before submitting

Run all of these and fix any failures before opening a pull request:

```bash
npm run typecheck      # TypeScript — must pass with zero errors
npm run lint           # ESLint — must pass with zero errors
npm run compile        # Solidity — must compile cleanly
npm run test           # Contract tests — all must pass
npm run build          # Next.js production build — must succeed
```

---

## Smart contract changes

- Solidity pragma is `0.8.24`. Do not change it without checking all contracts.
- Write a test in `test/` for every new contract function before submitting.
- Do not add `payable` to functions that do not accept ETH.
- Validate all external inputs (zero-address checks, reserve checks, overflow guards).
- The optimizer is off by default. Do not enable it without benchmarking and documenting the gas savings.
- This project is a demo. Do not add upgrade proxies, access control, or governance without a clear design discussion.

---

## Frontend changes

- TypeScript strict mode is on. All new code must type-check.
- Use path aliases (`@/components/*`, `@/lib/*`, `@/hooks/*`, `@/types/*`) — no relative `../../` imports across directory boundaries.
- Use `cn()` from `@/lib/utils` for conditional class merging.
- Prefer Server Components for static content. Add `"use client"` only when the component genuinely requires browser APIs or React state.
- All wallet interaction must be in Client Components.
- Do not scatter chain IDs or RPC URLs across components — they live in `app/wagmi.ts` and `lib/constants.ts`.
- Never assume a transaction succeeded before the receipt is confirmed.
- Test responsive behaviour at 320 px, 768 px, and 1280 px before submitting UI changes.

---

## CSS and styling

- All theme tokens live in `app/globals.css` under `@theme inline`. Do not duplicate them.
- PayFlow brand colours (`--color-brand-blue`, etc.) are defined once in the `PAYFLOW HYBRID WALLET CUSTOM STYLES` section.
- Use Tailwind utility classes. Avoid inline styles except for dynamic values that cannot be expressed as utilities.

---

## Environment variables

- `NEXT_PUBLIC_` variables are exposed to the browser. Only use this prefix for values that are safe to make public (contract addresses, public RPC URLs).
- Never commit `.env.local` or any file containing private keys.
- Update `.env.example` if you add a new environment variable.

---

## Pull request checklist

- [ ] All checks pass (`typecheck`, `lint`, `compile`, `test`, `build`)
- [ ] New contract functions have tests
- [ ] `.env.example` updated if new environment variables were added
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
- [ ] No private keys, mnemonics, or real addresses committed
- [ ] Responsive behaviour tested at mobile, tablet, and desktop widths (UI changes only)

---

## Reporting bugs

Open a GitHub issue with:

1. A clear title
2. Steps to reproduce
3. Expected behaviour
4. Actual behaviour
5. Environment (OS, browser, Node.js version, MetaMask version)
6. Relevant error messages or screenshots
