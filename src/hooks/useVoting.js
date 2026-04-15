// src/hooks/useVoting.js
// ─────────────────────────────────────────────────────────────────────────────
// Central hook that encapsulates ALL contract reads and writes.
// Components stay clean — they just call this hook.
// ─────────────────────────────────────────────────────────────────────────────

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { VOTING_CONTRACT_ADDRESS } from "../constants/contract";
import VotingABI from "../abi/Voting.abi.json";

// ─────────────────────────────────────────────────────────────────────────────
export function useVoting() {
  const { address: connectedAddress } = useAccount();

  // ── READ: fetch all candidates from the contract ──────────────────────────
  // getAllCandidates() returns three parallel arrays: ids, names, voteCounts
  const {
    data: candidatesRaw,
    isLoading: candidatesLoading,
    refetch: refetchCandidates,
  } = useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VotingABI,
    functionName: "getAllCandidates",
    // Re-fetches automatically every 10 seconds so vote tallies stay live
    query: { refetchInterval: 10_000 },
  });

  // ── READ: whether the election is currently open ──────────────────────────
  const { data: electionOpen } = useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VotingABI,
    functionName: "electionOpen",
    query: { refetchInterval: 10_000 },
  });

  // ── READ: has the connected wallet already voted? ─────────────────────────
  const { data: alreadyVoted, refetch: refetchHasVoted } = useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VotingABI,
    functionName: "hasVoted",
    args: connectedAddress ? [connectedAddress] : undefined,
    query: {
      enabled: !!connectedAddress,
      refetchInterval: 10_000,
    },
  });

  // ── READ: total votes cast ────────────────────────────────────────────────
  const { data: totalVotes } = useReadContract({
    address: VOTING_CONTRACT_ADDRESS,
    abi: VotingABI,
    functionName: "getTotalVotes",
    query: { refetchInterval: 10_000 },
  });

  // ── WRITE: send the vote transaction ─────────────────────────────────────
  // useWriteContract gives us a `writeContract` function we call on button click
  const {
    writeContract,
    data: txHash,       // the transaction hash returned immediately by MetaMask
    isPending: isTxPending,  // true while MetaMask is open / tx is in mempool
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  // ── WAIT: poll until the tx is mined into a block ────────────────────────
  const {
    isLoading: isConfirming,  // true while waiting for block confirmation
    isSuccess: isConfirmed,   // true once the block is mined ✅
  } = useWaitForTransactionReceipt({
    hash: txHash,
    onReplaced: () => {
      // Handles the edge case where the user sped-up the tx with a higher gas price
      console.warn("Transaction was replaced/sped-up");
    },
  });

  // ── Helper: normalise the raw tuple data into Candidate[] ─────────────────
  const candidates = (() => {
    if (!candidatesRaw) return [];
    const [ids, names, voteCounts] = candidatesRaw;
    return ids.map((id, i) => ({ id, name: names[i], voteCount: voteCounts[i] }));
  })();

  // ── Action: cast vote for a candidate ────────────────────────────────────
  const castVote = (candidateId) => {
    writeContract({
      address: VOTING_CONTRACT_ADDRESS,
      abi: VotingABI,
      functionName: "vote",
      args: [candidateId],
    });
  };

  // ── Refetch data after a successful vote ─────────────────────────────────
  const refreshAll = () => {
    refetchCandidates();
    refetchHasVoted();
  };

  return {
    // Data
    candidates,
    totalVotes,
    electionOpen,
    alreadyVoted,
    // State flags
    candidatesLoading,
    isTxPending,
    isConfirming,
    isConfirmed,
    txHash,
    writeError,
    // Actions
    castVote,
    resetWrite,
    refreshAll,
  };
}
