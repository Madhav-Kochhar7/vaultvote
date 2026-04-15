// src/components/Toast.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Simple animated toast for success / error notifications.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect } from "react";

interface ToastProps {
  type: "success" | "error" | "info";
  message: string;
  txHash?: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ type, message, txHash, onClose }) => {
  // Auto-dismiss after 6 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: {
      border: "border-emerald-500/50",
      icon: "✅",
      accent: "text-emerald-400",
    },
    error: {
      border: "border-rose-500/50",
      icon: "❌",
      accent: "text-rose-400",
    },
    info: {
      border: "border-cyan-500/50",
      icon: "ℹ️",
      accent: "text-cyan-400",
    },
  }[type];

  return (
    <div
      className={`
        animate-slide-up fixed bottom-6 right-6 z-50
        flex max-w-sm items-start gap-3 rounded-xl
        border ${styles.border} bg-gray-900/95 p-4 shadow-2xl backdrop-blur-sm
      `}
    >
      <span className="text-xl">{styles.icon}</span>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${styles.accent}`}>
          {type === "success" ? "Vote Confirmed!" : type === "error" ? "Transaction Failed" : "Info"}
        </p>
        <p className="mt-0.5 text-xs text-white/70">{message}</p>
        {txHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs text-cyan-400 underline hover:text-cyan-300"
          >
            View on Etherscan ↗
          </a>
        )}
      </div>
      <button onClick={onClose} className="text-white/30 hover:text-white/70 text-lg leading-none">
        ×
      </button>
    </div>
  );
};

export default Toast;
