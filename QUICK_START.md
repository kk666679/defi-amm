# Quick start

This guide gets the full stack running locally in under ten minutes.

## Prerequisites

| Requirement | Minimum version | Notes |
|---|---|---|
| Node.js | 24.21.0 | Pinned in `.nvmrc` |
| npm | 10+ | Bundled with Node.js |
| MetaMask | Any current release | Browser extension |
| Git | Any | To clone the repository |

> **WSL2 users:** run all commands inside the WSL2 terminal. The Hardhat RPC at `127.0.0.1:8545` is accessible from the Windows browser when using WSL2 networking.

---

## Step 1 — Clone and install

```bash
git clone <repository-url>
cd defi-amm
npm install
```

---

## Step 2 — Start the Hardhat node

Open a dedicated terminal and leave it running:

```bash
npx hardhat node
```

You will see 20 test accounts printed with their private keys. Keep this terminal open — the chain resets every time you stop it.

---

## Step 3 — Deploy contracts and seed the pool

Open a second terminal in the same directory:

```bash
npx hardhat run scripts/deploy-amm.ts --network localhost
```

The script:
1. Deploys TokenA (TKA) and TokenB (TKB)
2. Deploys SimpleAMM with both token addresses
3. Approves and adds 10 000 TKA / 10 000 TKB initial liquidity
4. Writes the three contract addresses to `frontend/.env.local`

Expected output:
```
Deployer: 0xf39Fd6e51aad88F6f4ce6aB8827279cffFb92266
TokenA: 0x...
TokenB: 0x...
AMM   : 0x...
Liquidity added: 10,000 / 10,000
Saved local contract addresses to frontend/.env.local
```

---

## Step 4 — Start the frontend

```bash
npm run dev
```

Open http://localhost:3000.

---

## Step 5 — Configure MetaMask

### Add the Hardhat Local network

1. Open MetaMask → Settings → Networks → Add a network → Add a network manually
2. Fill in:

| Field | Value |
|---|---|
| Network name | Hardhat Local |
| New RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency symbol | ETH |

3. Save and switch to Hardhat Local.

### Import a test account

> These accounts are publicly known. Never use them on any real network.

1. MetaMask → Import account → Private key
2. Paste: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

This is the Hardhat deployer account. It holds 10 000 ETH on the local chain and owns all minted TKA and TKB.

### Import the token contracts

1. MetaMask → Import tokens → Custom token
2. Paste the `NEXT_PUBLIC_TOKEN_A_ADDRESS` value from `frontend/.env.local`
3. Repeat for `NEXT_PUBLIC_TOKEN_B_ADDRESS`

---

## Step 6 — Connect and swap

1. Open http://localhost:3000
2. Click **Connect** in the header
3. Approve the connection in MetaMask
4. Confirm the network is **Hardhat Local** in the network selector
5. Enter an amount in the swap card and click **Swap tokens**
6. Approve the token spend in MetaMask, then confirm the swap transaction

---

## Sepolia testnet (optional)

The app also supports Sepolia (chain ID `11155111`) without running a local node.

1. Switch MetaMask to Sepolia
2. Get Sepolia test ETH from a faucet (e.g. https://sepoliafaucet.com)
3. Open http://localhost:3000 and select **Sepolia** in the network selector
4. Use the **Sepolia testnet setup** panel to deploy TKA, TKB, and the AMM from your wallet
5. Copy the deployed addresses into `.env.local` (or Vercel environment variables for a hosted deployment):

```
NEXT_PUBLIC_SEPOLIA_AMM_ADDRESS=0x...
NEXT_PUBLIC_SEPOLIA_TOKEN_A_ADDRESS=0x...
NEXT_PUBLIC_SEPOLIA_TOKEN_B_ADDRESS=0x...
```

---

## Useful commands

```bash
npm run dev            # Start the Next.js dev server
npm run build          # Production build
npm run lint           # ESLint
npm run typecheck      # TypeScript check
npm run compile        # Compile Solidity contracts
npm run test           # Run contract tests
npm run clean          # Remove build artifacts
```

---

## Resetting the local chain

Stop the Hardhat node (`Ctrl+C`), restart it with `npx hardhat node`, and re-run the deploy script. The contract addresses will change — the deploy script updates `frontend/.env.local` automatically. Restart the Next.js dev server so it picks up the new addresses.

MetaMask may show a nonce error after a chain reset. Fix it via MetaMask → Settings → Advanced → Clear activity and nonce data.
