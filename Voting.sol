// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

//Transparent on-chain voting system with one-person-one-vote enforcement
contract Voting is Ownable {
    
//Struct representing a single candidate in the election
    struct Candidate {
        uint256 id;        
        string  name;      
        uint256 voteCount; 
    }

// State Variables
   //Maps candidate IDs to their Candidate struct
    mapping(uint256 => Candidate) public candidates;

    //Tracks whether an address has already voted
    mapping(address => bool) public hasVoted;
    
    uint256 public candidateCount;
    bool public electionOpen;

// Events
    event CandidateAdded(uint256 indexed id, string name);
    event Voted(address indexed voter, uint256 indexed candidateId);
    event ElectionStatusChanged(bool isOpen);

//Constructor
    constructor() Ownable(msg.sender) {
        electionOpen = false;
    }

// Owner-Only Admin Functions
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

//Opens the election so voters can start casting votes
    function openElection() external onlyOwner {
        require(candidateCount > 0, "Voting: add at least one candidate before opening");
        require(!electionOpen, "Voting: election is already open");
        electionOpen = true;
        emit ElectionStatusChanged(true);
    }

//Function to close the election 
    function closeElection() external onlyOwner {
        require(electionOpen, "Voting: election is already closed");
        electionOpen = false;
        emit ElectionStatusChanged(false);
    }

    
// Public Voting Function
    function vote(uint256 _candidateId) external {
        //Election must be active
        require(electionOpen, "Voting: election is not currently open");

        //Candidate must exist
        require(_candidateId > 0 && _candidateId <= candidateCount, "Voting: invalid candidate ID");

        //One-person-one-vote
        require(!hasVoted[msg.sender], "Voting: you have already cast your vote");

        // Record the vote
        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

// Read Functions
    function getAllCandidates()
        external
        view
        returns (
            //arrays
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

// Returns the total number of votes cast across all candidates
    function getTotalVotes() external view returns (uint256 total) {
        for (uint256 i = 1; i <= candidateCount; i++) {
            total += candidates[i].voteCount;
        }
    }
}
