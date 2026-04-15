// src/components/Navbar.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Top navigation bar with branding and ConnectKit wallet button.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { ConnectKitButton } from "connectkit";

const Navbar = ({ electionOpen }) => {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Vote<span className="text-cyan-400">Chain</span>
          </span>
        </div>

        {/* Status badge + connect button */}
        <div className="flex items-center gap-4">
          {electionOpen !== undefined && (
            <span
              className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                electionOpen
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${electionOpen ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`}
              />
              {electionOpen ? "Election Live" : "Election Closed"}
            </span>
          )}

          {/* ConnectKit renders a fully managed wallet button here */}
          <ConnectKitButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
