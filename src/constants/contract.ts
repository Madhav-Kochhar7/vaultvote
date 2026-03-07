// src/constants/contract.ts
// ─────────────────────────────────────────────────────────────────────────────
// After you deploy Voting.sol to Sepolia, paste the deployed address below.
// This is the ONLY file you need to change after deployment.
// ─────────────────────────────────────────────────────────────────────────────

export const VOTING_CONTRACT_ADDRESS =
  (import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`) ??
<<<<<<< HEAD
  "0xd9145CCE52D386f254917e481eB44e9943F39138"; // ← replace after deploy
=======
  "0x9b0E49E5F4b0d1bDa770dC8D382A51eD94636B7C"; // ← replace after deploy
>>>>>>> a2bc7a24f18339832d3e562ddeca823ef20d8f41

// Sepolia chain ID — used to guard against wrong-network errors
export const SEPOLIA_CHAIN_ID = 11155111;
