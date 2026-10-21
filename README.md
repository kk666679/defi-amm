# DeFi AMM

Local DeFi AMM (constant-product, 0.3% fee) built with **Hardhat 3** + **Next.js 16** + **wagmi** + **Tailwind 4**.

## Stack

| Layer | Tech |
|---|---|
| Contracts | Solidity 0.8.24, Hardhat 3, OpenZeppelin 5 |
| Frontend | Next.js 16 (App Router, Turbopack), React 19, TypeScript 7 |
| Web3 | wagmi v2, viem, injected wallet |
| Styling | Tailwind 4 (CSS-first tokens), shadcn/ui |
| Docs | Custom `/docs` page with auto-TOC |

## Project layout
defi-amm/
├── contracts/ # SimpleAMM.sol, TokenA.sol, TokenB.sol
├── scripts/ # deploy-amm.ts
├── hardhat.config.ts
└── frontend/ # Next.js app
└── src/app/
├── page.tsx # AMM UI (PayFlow-style)
├── payflow/ # components, icons, types
└── docs/ # /docs route

text

## Run locally

### 1. Backend (contracts + local chain)

```bash
# Terminal 1 — local chain
npx hardhat node

# Terminal 2 — deploy
npx hardhat run scripts/deploy-amm.ts --network localhost
Copy the three printed addresses into frontend/.env.local.

2. Frontend
bash
cd frontend
cp .env.example .env.local   # then fill in addresses + Reown Project ID
npm install
npm run dev
Open http://localhost:3000 (AMM) and http://localhost:3000/docs (docs).

3. MetaMask
Add network: RPC http://127.0.0.1:8545, Chain ID 31337, symbol ETH.
Import Hardhat account #0 private key (printed by hardhat node).

Contracts
SimpleAMM.sol implements a single-pool constant-product AMM:

addLiquidity(amountA, amountB) — deposit both tokens

swapAForB(amountAIn) / swapBForA(amountBIn) — swap with 0.3% fee

reserveA / reserveB — live reserves for pricing

Fee formula: amountOut = (amountIn * 997 * reserveOut) / (reserveIn * 1000 + amountIn * 997)

License
MIT
