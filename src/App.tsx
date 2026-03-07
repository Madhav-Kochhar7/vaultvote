// src/App.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Main voting dashboard. Reads from the contract, renders candidate cards,
// handles transaction lifecycle, and shows toast notifications.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback } from "react";
import { useAccount, useChainId } from "wagmi";
import Navbar from "./components/Navbar";
import CandidateCard from "./components/CandidateCard";
import Toast from "./components/Toast";
import { useVoting } from "./hooks/useVoting";
import { SEPOLIA_CHAIN_ID } from "./constants/contract";

// ── Toast state type ──────────────────────────────────────────────────────────
interface ToastState {
  type: "success" | "error" | "info";
  message: string;
  txHash?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const isWrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID;

  const [toast, setToast] = useState<ToastState | null>(null);
  const [votingForId, setVotingForId] = useState<bigint | null>(null);

  const {
    candidates,
    totalVotes,
    electionOpen,
    alreadyVoted,
    candidatesLoading,
    isTxPending,
    isConfirming,
    isConfirmed,
    txHash,
    writeError,
    castVote,
    resetWrite,
    refreshAll,
  } = useVoting();

  // ── Show success toast after block confirmation ────────────────────────────
  useEffect(() => {
    if (isConfirmed && txHash) {
      setToast({
        type: "success",
        message: "Your vote has been permanently recorded on the blockchain!",
        txHash,
      });
      setVotingForId(null);
      resetWrite();
      // Refresh tallies immediately after confirmation
      setTimeout(refreshAll, 1500);
    }
  }, [isConfirmed, txHash]);

  // ── Show error toast if the transaction is rejected / reverted ────────────
  useEffect(() => {
    if (writeError) {
      const msg =
        // Try to extract the Solidity revert reason from the error message
        writeError.message?.match(/reason: (.*?)(?:\n|$)/)?.[1] ??
        writeError.message?.slice(0, 100) ??
        "Transaction was rejected or failed.";
      setToast({ type: "error", message: msg });
      setVotingForId(null);
    }
  }, [writeError]);

  // ── Handler: user clicks "Vote Now" ──────────────────────────────────────
  const handleVote = useCallback(
    (candidateId: bigint) => {
      setVotingForId(candidateId);
      castVote(candidateId);
    },
    [castVote]
  );

  // ── Determine whether the Vote button should be enabled ───────────────────
  const canVote =
    isConnected &&
    !isWrongNetwork &&
    electionOpen === true &&
    alreadyVoted === false &&
    !isTxPending &&
    !isConfirming;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Background decoration ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-emerald-600/8 blur-3xl" />
      </div>

      <Navbar electionOpen={electionOpen} />

      <main className="relative mx-auto max-w-6xl px-6 py-12">
        {/* ── Hero header ─────────────────────────────────────────────────── */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Transparent{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              On-Chain
            </span>{" "}
            Voting
          </h1>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            Every vote is an immutable transaction on the Ethereum Sepolia Testnet.
            No central authority. No manipulation.
          </p>

          {/* ── Stats row ─────────────────────────────────────────────────── */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <StatChip label="Total Votes" value={totalVotes?.toString() ?? "—"} />
            <StatChip label="Candidates" value={candidates.length.toString()} />
            <StatChip
              label="Network"
              value="Sepolia Testnet"
              accent="text-cyan-400"
            />
          </div>
        </div>

        {/* ── Wrong network banner ────────────────────────────────────────── */}
        {isWrongNetwork && (
          <div className="mb-8 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-center text-sm text-amber-300">
            ⚠️ You are on the wrong network. Please switch MetaMask to{" "}
            <strong>Sepolia Testnet</strong>.
          </div>
        )}

        {/* ── Not connected prompt ────────────────────────────────────────── */}
        {!isConnected && (
          <div className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-3xl mb-2">🔗</p>
            <p className="font-semibold text-white">Connect your wallet to vote</p>
            <p className="mt-1 text-sm text-white/40">
              Use the "Connect Wallet" button in the top-right corner.
            </p>
          </div>
        )}

        {/* ── Already voted banner ────────────────────────────────────────── */}
        {isConnected && alreadyVoted && (
          <div className="mb-8 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center text-sm text-emerald-300">
            ✅ Your vote has been recorded. You can still watch the live tallies below.
          </div>
        )}

        {/* ── Election closed banner ─────────────────────────────────────── */}
        {electionOpen === false && isConnected && (
          <div className="mb-8 rounded-xl border border-white/20 bg-white/5 p-4 text-center text-sm text-white/50">
            🔒 The election is currently closed. Results are final.
          </div>
        )}

        {/* ── Loading skeleton ────────────────────────────────────────────── */}
        {candidatesLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {/* ── Candidate cards grid ────────────────────────────────────────── */}
        {!candidatesLoading && candidates.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map((c) => (
              <CandidateCard
                key={c.id.toString()}
                candidate={c}
                totalVotes={totalVotes ?? 0n}
                canVote={canVote}
                isPending={isTxPending || isConfirming}
                votingForId={votingForId}
                onVote={handleVote}
              />
            ))}
          </div>
        )}

        {/* ── Empty state ─────────────────────────────────────────────────── */}
        {!candidatesLoading && candidates.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-16 text-center">
            <p className="text-5xl mb-4">🗳️</p>
            <p className="text-xl font-semibold text-white/70">No candidates yet</p>
            <p className="mt-2 text-sm text-white/40">
              The contract owner must call <code className="text-cyan-400">addCandidate()</code> first.
            </p>
          </div>
        )}

        {/* ── Pending tx indicator ─────────────────────────────────────────── */}
        {(isTxPending || isConfirming) && (
          <div className="mt-8 flex items-center justify-center gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-300">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {isTxPending
              ? "Waiting for MetaMask confirmation…"
              : "Transaction submitted — waiting for block confirmation…"}
          </div>
        )}

        {/* ── How it works section ─────────────────────────────────────────── */}
        <section className="mt-20 border-t border-white/10 pt-12">
          <h2 className="text-center text-lg font-semibold text-white/40 uppercase tracking-widest mb-8">
            How it works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 text-center">
            {[
              { step: "01", title: "Connect Wallet", desc: "Use MetaMask on Sepolia Testnet. No real ETH needed." },
              { step: "02", title: "Cast Your Vote", desc: "Click Vote Now. MetaMask will ask you to sign the tx." },
              { step: "03", title: "Result on Chain", desc: "Once mined, your vote is permanently on Ethereum." },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <p className="text-3xl font-black text-cyan-400/40 mb-2">{item.step}</p>
                <p className="font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm text-white/40">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Toast notification ──────────────────────────────────────────────── */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          txHash={toast.txHash}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

// ── Small reusable stat chip ──────────────────────────────────────────────────
const StatChip: React.FC<{ label: string; value: string; accent?: string }> = ({
  label,
  value,
  accent = "text-white",
}) => (
  <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center">
    <p className={`text-xl font-black ${accent}`}>{value}</p>
    <p className="text-xs text-white/40 mt-0.5">{label}</p>
  </div>
);

export default App;
