// src/main.tsx
// ─────────────────────────────────────────────────────────────────────────────
// App entry point. Wraps the tree in:
//   WagmiProvider  → blockchain context (reads/writes)
//   QueryClientProvider → React Query (caching for wagmi hooks)
//   ConnectKitProvider  → wallet UI modal
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { wagmiConfig } from "./wagmi.config";
import App from "./App";
import "./index.css";

// React Query client — wagmi uses this internally for caching RPC calls
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* ConnectKit theme options: "auto" | "web95" | "retro" | "soft" | "midnight" | "nouns" */}
        <ConnectKitProvider theme="midnight" mode="dark">
          <App />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
