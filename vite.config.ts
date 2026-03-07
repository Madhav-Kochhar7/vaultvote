// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // ConnectKit / wagmi require some Node polyfills in Vite
  resolve: {
    alias: {
      // Polyfill for Buffer (needed by some wallet libs)
      buffer: "buffer",
    },
  },
  define: {
    // Required polyfill for WalletConnect
    global: "globalThis",
  },
});
