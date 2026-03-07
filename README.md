# VoteChain — Transparent On-Chain Voting dApp

A full-stack Web3 voting dApp built for a 24-hour hackathon sprint.
Runs on **Ethereum Sepolia Testnet** — no real money required.

---

## 🗂 Project Structure

```
VotingDApp/
├── contracts/
│   └── Voting.sol              # Solidity smart contract
├── src/
│   ├── abi/
│   │   └── Voting.abi.json     # ABI linking frontend ↔ contract
│   ├── components/
│   │   ├── Navbar.tsx          # Top nav + ConnectKit wallet button
│   │   ├── CandidateCard.tsx   # Individual candidate with vote button
│   │   └── Toast.tsx           # Success / error notification
│   ├── constants/
│   │   └── contract.ts         # Contract address (update after deploy)
│   ├── hooks/
│   │   └── useVoting.ts        # All contract reads & writes
│   ├── App.tsx                 # Main dashboard
│   ├── main.tsx                # Entry + Provider tree
│   ├── wagmi.config.ts         # Wagmi + ConnectKit config
│   └── index.css               # Tailwind base styles
├── .env.example                # Environment variable template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## ⚡ Quickstart (Frontend)

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env
# → Edit .env with your contract address and WalletConnect project ID

# 3. Start the dev server
npm run dev
# → Open http://localhost:5173
```

---

## 🔗 Step 1 — Get Sepolia ETH (Testnet Gas)

You need a tiny amount of Sepolia ETH to deploy the contract and vote.

- **Alchemy Faucet**: https://sepoliafaucet.com  
- **Infura Faucet**: https://www.infura.io/faucet/sepolia  
- **Chainlink Faucet**: https://faucets.chain.link/sepolia  

---

## 📦 Step 2 — Deploy the Smart Contract

### Option A: Remix IDE (Easiest — No CLI needed)

1. Go to https://remix.ethereum.org
2. Create a new file `Voting.sol` and paste the contract code.
3. In the **Solidity Compiler** tab:
   - Select version `0.8.24`
   - Click **Compile Voting.sol**
4. In the **Deploy & Run** tab:
   - Set **Environment** to `Injected Provider - MetaMask`
   - Ensure MetaMask is on **Sepolia**
   - Click **Deploy** → confirm in MetaMask
5. **Copy the deployed contract address** from the left panel.

### Option B: Hardhat (CLI)

```bash
# Install Hardhat in a separate folder
npm install --save-dev hardhat @openzeppelin/contracts
npx hardhat init

# Create scripts/deploy.js:
# const Voting = await ethers.getContractFactory("Voting");
# const voting = await Voting.deploy();
# console.log("Deployed to:", voting.address);

npx hardhat run scripts/deploy.js --network sepolia
```

Add to `hardhat.config.js`:
```js
networks: {
  sepolia: {
    url: "https://rpc.sepolia.org",
    accounts: ["0xYOUR_PRIVATE_KEY"]  // never commit this!
  }
}
```

---

## 🔌 Step 3 — Connect the ABI to the Frontend

The ABI (`src/abi/Voting.abi.json`) is the **contract's interface** — it tells 
Wagmi/Viem what functions exist and how to call them. Think of it as a phone book.

After deployment, you only need to update **one file**:

```ts
// src/constants/contract.ts
export const VOTING_CONTRACT_ADDRESS =
  "0xYourDeployedContractAddressHere";  // ← paste here
```

The ABI file is already pre-generated and correct. You don't need to touch it 
unless you change the Solidity contract.

> **If you DO change the contract**: after recompiling, copy the `abi` array 
> from Remix's "Compilation Details" panel (or from 
> `artifacts/contracts/Voting.sol/Voting.json` in Hardhat) and replace 
> `Voting.abi.json`.

---

## 🗳️ Step 4 — Set Up the Election (Owner Only)

After deploying, use **Remix** (or Hardhat tasks) to call these owner functions:

```
1. addCandidate("Alice Johnson")
2. addCandidate("Bob Smith")
3. addCandidate("Carol White")
4. openElection()            ← voters can now cast ballots
```

The connected wallet address that deployed the contract is the **owner**.

---

## 🏗️ Step 5 — WalletConnect Project ID

1. Go to https://cloud.walletconnect.com
2. Create a free account → New Project
3. Copy the **Project ID**
4. Paste it in your `.env`:
   ```
   VITE_WALLETCONNECT_PROJECT_ID=abc123...
   ```

---

## 🏛️ Smart Contract Architecture

```
Voting.sol (Ownable)
│
├── State
│   ├── mapping(uint256 => Candidate) candidates
│   ├── mapping(address => bool) hasVoted     ← one-person-one-vote
│   ├── uint256 candidateCount
│   └── bool electionOpen
│
├── Owner-Only
│   ├── addCandidate(name)    ← builds the ballot
│   ├── openElection()        ← starts voting
│   └── closeElection()       ← ends voting
│
├── Public Write
│   └── vote(candidateId)
│       ├── require(electionOpen)
│       ├── require(valid candidateId)
│       └── require(!hasVoted[msg.sender])   ← THE key guard
│
└── Public Read (free, no gas)
    ├── getAllCandidates() → (ids[], names[], voteCounts[])
    ├── getTotalVotes()
    ├── hasVoted(address)
    └── electionOpen
```

---

## 🔄 Data Flow

```
MetaMask Wallet
      ↕  (signs transactions)
  ConnectKit (UI modal)
      ↕
  Wagmi hooks
  ├── useReadContract   → calls getAllCandidates(), hasVoted(), etc. every 10s
  └── useWriteContract  → calls vote(candidateId) → sends tx to mempool
            ↕
  useWaitForTransactionReceipt
            ↕  (polls until block is mined)
  Toast notification   → "Vote confirmed! View on Etherscan"
            ↕
  refetchCandidates()  → live tallies update
```

---

## 🛠️ Key Libraries

| Library | Purpose |
|---------|---------|
| `wagmi` | React hooks for Ethereum (read/write contract) |
| `viem` | Low-level Ethereum client (used by wagmi internally) |
| `connectkit` | Plug-and-play wallet connection UI modal |
| `@tanstack/react-query` | Caching layer for RPC calls |

---

## 🚀 Deployment Checklist

- [ ] Get Sepolia ETH from faucet
- [ ] Deploy `Voting.sol` via Remix
- [ ] Copy contract address → `src/constants/contract.ts`
- [ ] Get WalletConnect Project ID → `.env`
- [ ] Add candidates + open election in Remix
- [ ] `npm run dev` → test the full flow
- [ ] `npm run build` → deploy frontend to Vercel/Netlify

---

## 📝 Notes for Judges

- **One vote per wallet** is enforced at the Solidity level via `hasVoted[msg.sender]` — it cannot be bypassed from the frontend.
- All vote data lives on-chain and is publicly verifiable on [Sepolia Etherscan](https://sepolia.etherscan.io).
- The frontend auto-polls every 10 seconds so tallies update without a page refresh.
