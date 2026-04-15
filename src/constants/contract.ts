// src/constants/contract.ts
// ─────────────────────────────────────────────────────────────────────────────
// After you deploy Voting.sol to Sepolia, paste the deployed address below.
// This is the ONLY file you need to change after deployment.
// ─────────────────────────────────────────────────────────────────────────────

export const VOTING_CONTRACT_ADDRESS =
  (import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`) ; // ← replace after deploy

// Sepolia chain ID — used to guard against wrong-network errors
export const SEPOLIA_CHAIN_ID = 11155111;
