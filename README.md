# 🗳️ VaultVote — Transparent On-Chain Voting

> A decentralized, tamper-proof voting system built on the Ethereum Sepolia Testnet. Every vote is a permanent, publicly verifiable transaction on the blockchain.


##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Smart Contract](#smart-contract)
- [Project Structure](#project-structure)
- [MetaMask Setup](#metamask-setup)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [How Voting Works](#how-voting-works)
---

##  Overview

VaultVote is a fully on-chain voting dApp where every vote is recorded as an immutable transaction on the Ethereum blockchain. Built for a 24-hour hackathon, it demonstrates how blockchain technology can make elections transparent, fair, and manipulation-proof.

**Live Demo:** [vaultvote.netlify.app](https://vaultvote.netlify.app)


---

##  Features

-  **Wallet Connect** — Connect via MetaMask using ConnectKit
-  **On-Chain Voting** — Every vote is a permanent blockchain transaction
-  **One Person One Vote** — Enforced by smart contract, not by humans
-  **Live Results** — Vote tallies auto-refresh every 10 seconds
-  **Fully Verifiable** — Every vote is publicly visible on Sepolia Etherscan
-  **Responsive Design** — Works on desktop and mobile

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS |
| Web3 | Wagmi v2 + Viem |
| Wallet | ConnectKit + MetaMask |
| Smart Contract | Solidity + OpenZeppelin |
| Network | Ethereum Sepolia Testnet |
| Deployment | Netlify + GitHub |

---

##  Smart Contract

**Network:** Sepolia Testnet (Chain ID: 11155111)  
**Language:** Solidity 0.8.x + OpenZeppelin Ownable

### Key Functions

| Function | Access | Description |
|----------|--------|-------------|
| `addCandidate(string name)` | Owner only | Add a new candidate |
| `openElection()` | Owner only | Open the election for voting |
| `closeElection()` | Owner only | Close the election |
| `vote(uint256 candidateId)` | Public | Cast your vote |
| `getAllCandidates()` | Public | Get all candidates and vote counts |
| `hasVoted(address)` | Public | Check if an address has voted |

---

## Project Structure

```
VaultVote/
├── contracts/
│   └── Voting.sol              # Smart contract
├── src/
│   ├── abi/
│   │   └── Voting.abi.json     # Contract ABI
│   ├── components/
│   │   ├── CandidateCard.tsx   # Candidate vote card
│   │   ├── Navbar.tsx          # Top navigation bar
│   │   ├── Toast.tsx           # Transaction notifications
│   ├── constants/
│   │   └── contract.ts         # Contract address + chain ID
│   ├── hooks/
│   │   └── useVoting.ts        # All contract read/write logic
│   ├── App.tsx                 # Main dashboard
│   ├── main.tsx                # React entry point
│   ├── wagmi.config.ts         # Wagmi + ConnectKit config
│   └── index.css               # Global styles + Tailwind
├── .env.example                # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

##  MetaMask Setup

MetaMask is a browser wallet you need to interact with the blockchain. Follow these steps carefully:

### Step 1 — Install MetaMask

1. Go to **[metamask.io](https://metamask.io)**
2. Click **"Download"**
3. Install the extension for your browser (Chrome, Firefox, Edge, or Brave)
4. Pin it to your browser toolbar for easy access

### Step 2 — Create a Wallet

1. Click the MetaMask extension icon
2. Click **"Create a new wallet"**
3. Agree to the terms
4. Create a **strong password** — this unlocks MetaMask on your device
5. You will be shown a **12-word Secret Recovery Phrase**
6. Confirm the phrase by selecting the words in order
7. Your wallet is ready! You'll see your address starting with `0x`

### Step 3 — Switch to Sepolia Testnet

VaultVote runs on Sepolia Testnet, not the real Ethereum network.

1. Open MetaMask
2. Click the **network dropdown** at the top (shows "Ethereum Mainnet" by default)
3. Click **"Show test networks"** if Sepolia is not visible
4. Select **"Sepolia test network"**
5. The badge now shows **"Sepolia"** — you're ready!

>  Sepolia is a test network. It uses fake ETH with no real value, so voting costs you nothing.

### Step 4 — Get Free Sepolia ETH

You need a tiny amount of Sepolia ETH to pay gas fees (transaction processing fees). Get it free: Google Cloud Faucet

1. Copy your MetaMask wallet address (the `0x...` address)
2. Paste it into any faucet above
3. Request ETH — it arrives in 1–2 minutes
4. You only need **0.01 ETH** to vote many times

---

##  Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Git
- MetaMask browser extension (see setup above)


##  How Voting Works

```
1. Visit VaultVote → click "Connect Wallet"
2. MetaMask opens → approve the connection
3. Browse the candidate cards on the dashboard
4. Click "Vote Now" on your chosen candidate
5. MetaMask shows a transaction confirmation → click "Confirm"
6. Wait 15–30 seconds for the transaction to be mined
7. Green success notification appears with an Etherscan link
8. Your vote is now permanently on the Ethereum blockchain
```

### Rules

-  One vote per wallet address — enforced by smart contract
-  Votes cannot be changed or reversed after confirmation
-  All votes are publicly visible on [Sepolia Etherscan](https://sepolia.etherscan.io)
-  No admin can alter the results

---


## 📜 License

This project is licensed under the MIT License.

---

> 🔗 **Contract:** on Sepolia Testnet  
> 🌐 **Live:** [vaultvote.netlify.app](https://vaultvote.netlify.app)  
> 📦 **Repo:** [github.com/Madhav-Kochhar7/VaultVote](https://github.com/Madhav-Kochhar7/VaultVote)
