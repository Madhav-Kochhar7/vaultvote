// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Voting
 * @dev Transparent on-chain voting system with one-person-one-vote enforcement.
 *      Deployed on Ethereum Sepolia Testnet for hackathon purposes.
 * @author Hackathon Team
 */
contract Voting is Ownable {
    // ─────────────────────────────────────────────────────────────────────────
    // Data Structures
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Represents a single candidate in the election.
    struct Candidate {
        uint256 id;        // Unique auto-incremented identifier
        string  name;      // Display name shown on the frontend
        uint256 voteCount; // Number of votes this candidate has received
    }

    // ─────────────────────────────────────────────────────────────────────────
    // State Variables
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Maps candidate IDs to their Candidate struct.
    mapping(uint256 => Candidate) public candidates;

    /// @notice Tracks whether an address has already voted. Enforces one-person-one-vote.
    mapping(address => bool) public hasVoted;

    /// @notice Total number of candidates added. Also serves as the ID counter.
    uint256 public candidateCount;

    /// @notice Whether the election is currently open for voting.
    bool public electionOpen;

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Emitted when a new candidate is added by the owner.
    event CandidateAdded(uint256 indexed id, string name);

    /// @notice Emitted when a voter successfully casts their vote.
    /// @param voter   The address of the voter (msg.sender)
    /// @param candidateId The ID of the candidate they voted for
    event Voted(address indexed voter, uint256 indexed candidateId);

    /// @notice Emitted when the owner opens or closes the election.
    event ElectionStatusChanged(bool isOpen);

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @dev Sets the original contract deployer as the owner via Ownable.
     *      The election starts CLOSED — owner must call openElection() first.
     */
    constructor() Ownable(msg.sender) {
        electionOpen = false;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Owner-Only Admin Functions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Adds a new candidate to the election.
     * @dev Only the contract owner (deployer) can call this. Cannot be called
     *      while the election is open to ensure a fair ballot.
     * @param _name The display name of the candidate.
     */
    function addCandidate(string calldata _name) external onlyOwner {
        require(!electionOpen, "Voting: cannot add candidates while election is open");
        require(bytes(_name).length > 0, "Voting: candidate name cannot be empty");

        candidateCount++;
        candidates[candidateCount] = Candidate({
            id: candidateCount,
            name: _name,
            voteCount: 0
        });

        emit CandidateAdded(candidateCount, _name);
    }

    /**
     * @notice Opens the election so voters can start casting votes.
     * @dev Only the owner can open the election. Requires at least one candidate.
     */
    function openElection() external onlyOwner {
        require(candidateCount > 0, "Voting: add at least one candidate before opening");
        require(!electionOpen, "Voting: election is already open");
        electionOpen = true;
        emit ElectionStatusChanged(true);
    }

    /**
     * @notice Closes the election, preventing further votes.
     * @dev Only the owner can close the election.
     */
    function closeElection() external onlyOwner {
        require(electionOpen, "Voting: election is already closed");
        electionOpen = false;
        emit ElectionStatusChanged(false);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Public Voting Function
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Casts a vote for a specific candidate.
     * @dev Uses `msg.sender` to identify the voter. Enforces:
     *      1. The election must be open.
     *      2. The candidate must exist.
     *      3. The voter must not have voted before (one-person-one-vote).
     * @param _candidateId The ID of the candidate to vote for.
     */
    function vote(uint256 _candidateId) external {
        // 1. Election must be active
        require(electionOpen, "Voting: election is not currently open");

        // 2. Candidate must exist
        require(_candidateId > 0 && _candidateId <= candidateCount, "Voting: invalid candidate ID");

        // 3. One-person-one-vote: msg.sender is the authenticated identity
        require(!hasVoted[msg.sender], "Voting: you have already cast your vote");

        // Record the vote
        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Read Functions (called for free, no gas)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Returns all candidates and their vote tallies as parallel arrays.
     * @dev The frontend loops over these arrays to build the candidate cards.
     * @return ids        Array of candidate IDs.
     * @return names      Array of candidate names.
     * @return voteCounts Array of vote counts.
     */
    function getAllCandidates()
        external
        view
        returns (
            uint256[] memory ids,
            string[]  memory names,
            uint256[] memory voteCounts
        )
    {
        ids        = new uint256[](candidateCount);
        names      = new string[](candidateCount);
        voteCounts = new uint256[](candidateCount);

        for (uint256 i = 1; i <= candidateCount; i++) {
            ids[i - 1]        = candidates[i].id;
            names[i - 1]      = candidates[i].name;
            voteCounts[i - 1] = candidates[i].voteCount;
        }
    }

    /**
     * @notice Returns the total number of votes cast across all candidates.
     */
    function getTotalVotes() external view returns (uint256 total) {
        for (uint256 i = 1; i <= candidateCount; i++) {
            total += candidates[i].voteCount;
        }
    }
}
