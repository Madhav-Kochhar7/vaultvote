// src/wagmi.config.js
// ─────────────────────────────────────────────────────────────────────────────
// Wagmi v2 + ConnectKit configuration
// This is the single source of truth for all blockchain settings.
// ─────────────────────────────────────────────────────────────────────────────

import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";

// ─── STEP 1: Get a free WalletConnect Project ID ─────────────────────────────
// Visit https://cloud.walletconnect.com → create a project → copy the Project ID.
// Paste it in your .env file as VITE_WALLETCONNECT_PROJECT_ID
const WALLETCONNECT_PROJECT_ID =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "YOUR_PROJECT_ID_HERE";

// ─── STEP 2: Wagmi config via ConnectKit's helper ────────────────────────────
// getDefaultConfig wires together:
//   • WalletConnect v2
//   • Injected wallets (MetaMask, Coinbase, Brave, etc.)
//   • The Sepolia testnet chain
export const wagmiConfig = createConfig(
  getDefaultConfig({
    // The chain(s) your dApp supports — Sepolia only for this hackathon
    chains: [sepolia],

    // Viem transports: use the public Sepolia RPC.
    // For production, replace with Alchemy/Infura for reliability:
    //   http("https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY")
    transports: {
      [sepolia.id]: http(),
    },

    // WalletConnect metadata — shows in wallet approval screens
    walletConnectProjectId: WALLETCONNECT_PROJECT_ID,
    appName: "VoteChain",
    appDescription: "Transparent on-chain voting powered by Ethereum Sepolia",
    appUrl: "http://localhost:5173",
    appIcon: "https://avatars.githubusercontent.com/u/37784886", // placeholder
  })
);
