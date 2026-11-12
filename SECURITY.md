# Security policy

## Scope

PayFlow DeFi AMM is a **development and educational demo**. It is not intended for production use, mainnet deployment, or the custody of real funds.

The contracts (`SimpleAMM`, `TokenA`, `TokenB`) have **not been audited**. Known limitations include:

- No reentrancy guard on swap or liquidity functions
- No access control on `addLiquidity` — anyone can add liquidity
- No LP token issuance — liquidity providers receive no on-chain representation of their share
- No price oracle or TWAP — the spot price is manipulable within a single transaction
- Hardhat test accounts and their private keys are publicly known and must never be used on any real network

Do not deploy these contracts to Ethereum mainnet or any network where real value is at risk.

---

## Supported versions

| Version | Supported |
|---|---|
| Latest commit on `main` | Yes |
| All prior versions | No |

---

## Reporting a vulnerability

If you discover a security vulnerability in this repository, please report it responsibly rather than opening a public GitHub issue.

**How to report:**

1. Email the maintainer at the address listed in the repository's GitHub profile, with the subject line: `[SECURITY] PayFlow DeFi AMM — <brief description>`
2. Include:
   - A clear description of the vulnerability
   - Steps to reproduce
   - The potential impact
   - Any suggested mitigations (optional)

**What to expect:**

- Acknowledgement within 72 hours
- An assessment of severity and scope within 7 days
- A fix or documented mitigation within 30 days for confirmed vulnerabilities
- Credit in the changelog if you wish to be acknowledged

**Please do not:**

- Publish details of the vulnerability publicly before a fix is available
- Attempt to exploit the vulnerability against any deployed instance
- Access, modify, or delete data that does not belong to you

---

## Known security properties of the current implementation

### Smart contracts

| Property | Status |
|---|---|
| Solidity 0.8.24 built-in overflow protection | ✓ Active |
| OpenZeppelin ERC-20 (TokenA, TokenB) | ✓ Standard implementation |
| Slippage protection (`swapAForBMinOut`, `swapBForAMinOut`) | ✓ Implemented |
| Reentrancy guard | ✗ Not implemented |
| Access control on `addLiquidity` | ✗ Not implemented |
| Formal audit | ✗ Not performed |

### Frontend

| Property | Status |
|---|---|
| Private keys never requested or stored | ✓ All signing done by the injected wallet |
| `NEXT_PUBLIC_` variables contain only public data | ✓ Contract addresses and public RPC URLs only |
| `.env.local` git-ignored | ✓ |
| Security headers (HSTS, X-Frame-Options, Permissions-Policy, CSP report-only) | ✓ Set in `next.config.ts` |
| Transaction receipt confirmed before state update | ✓ |
| Wallet disconnection and unsupported network handled | ✓ |

---

## Out of scope

The following are not considered security vulnerabilities for this project:

- Issues that require physical access to the user's device
- Issues in third-party dependencies (report those to the respective maintainers)
- Theoretical attacks with no practical exploit path
- Issues that only affect the Hardhat Local development chain
- Missing features (LP tokens, governance, price oracles) — these are known limitations, not vulnerabilities
