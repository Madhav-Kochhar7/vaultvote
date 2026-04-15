// src/components/CandidateCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Displays a single candidate with their name, vote count, and a Vote button.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

// A colour palette — cycles through candidates deterministically
const ACCENT_COLORS = [
  { ring: "ring-cyan-400",   bar: "bg-cyan-400",   text: "text-cyan-400",   btn: "bg-cyan-500 hover:bg-cyan-400"   },
  { ring: "ring-violet-400", bar: "bg-violet-400", text: "text-violet-400", btn: "bg-violet-500 hover:bg-violet-400" },
  { ring: "ring-emerald-400",bar: "bg-emerald-400",text: "text-emerald-400",btn: "bg-emerald-500 hover:bg-emerald-400"},
  { ring: "ring-amber-400",  bar: "bg-amber-400",  text: "text-amber-400",  btn: "bg-amber-500 hover:bg-amber-400"  },
  { ring: "ring-rose-400",   bar: "bg-rose-400",   text: "text-rose-400",   btn: "bg-rose-500 hover:bg-rose-400"   },
];

const CandidateCard = ({
  candidate,
  totalVotes,
  canVote,
  isPending,
  votingForId,
  onVote,
}) => {
  const colorIdx = Number(candidate.id - 1n) % ACCENT_COLORS.length;
  const color = ACCENT_COLORS[colorIdx];

  // Percentage for the progress bar
  const pct =
    totalVotes > 0n
      ? Math.round((Number(candidate.voteCount) / Number(totalVotes)) * 100)
      : 0;

  const isThisVoting = votingForId === candidate.id && isPending;

  // Initials avatar
  const initials = candidate.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`
        relative flex flex-col gap-4 rounded-2xl border border-white/10
        bg-white/5 backdrop-blur-sm p-6 
        transition-all duration-300
        hover:border-white/20 hover:bg-white/8 hover:-translate-y-1 hover:shadow-2xl
        ${canVote ? `hover:ring-1 ${color.ring}` : ""}
      `}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div
          className={`
            flex h-14 w-14 flex-shrink-0 items-center justify-center 
            rounded-full border-2 ${color.ring} bg-white/5
            text-lg font-bold tracking-wider ${color.text}
          `}
        >
          {initials}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white leading-tight">
            {candidate.name}
          </h3>
          <p className="text-sm text-white/40">Candidate #{candidate.id.toString()}</p>
        </div>
      </div>

      {/* Vote count */}
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-3xl font-black tabular-nums ${color.text}`}>
            {candidate.voteCount.toString()}
          </p>
          <p className="text-xs text-white/40 mt-0.5">votes received</p>
        </div>
        <span className={`text-xl font-bold ${color.text} opacity-60`}>{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full ${color.bar} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Vote button */}
      <button
        onClick={() => onVote(candidate.id)}
        disabled={!canVote || isPending}
        className={`
          mt-1 w-full rounded-xl py-3 px-4 text-sm font-semibold text-white
          transition-all duration-200 
          ${
            canVote && !isPending
              ? `${color.btn} cursor-pointer active:scale-95`
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }
        `}
      >
        {isThisVoting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Submitting…
          </span>
        ) : (
          "Vote Now"
        )}
      </button>
    </div>
  );
};

export default CandidateCard;
