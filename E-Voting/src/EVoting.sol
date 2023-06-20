// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/utils/Counters.sol";
import "@openzeppelin/access/Ownable.sol";

contract EVoting is Ownable {
    using Counters for Counters.Counter;
    using Counters for uint256;
    Counters.Counter private electionId;

    uint256 public number;

    mapping (bytes32 => bool) public isWhitelisted;
    mapping (uint256 => Election) public Elections;
    mapping (uint256 => Candidate) public CandidateStats;

    enum ElectionType {
      College,
      Department,
      General
    }

    struct Election {
      string title; 
      uint256 start;
      uint256 end;
      bool isActive;
      ElectionType election_type;
    }

    struct Candidate {
      string candidateName;
      uint256 voteCount;
      ElectionType election_type;
    }

    modifier isWhitelistedToVote(string memory _matNo, string memory _email) {
      require(isWhitelisted[keccak256(abi.encodePacked(_matNo, _email))], "Not whitelisted!");
      _;
    }

    event ElectionCreated(string indexed _title, ElectionType indexed _electionType);
    event VoterRegistered(string indexed _matNo);
    event CandidateCreated(string indexed _candidateName, ElectionType indexed _electionType, uint256 indexed _electionId);
    
    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    function createElectiton(string memory _title, uint256 _start, uint256 _end, uint8 _electionType) public onlyOwner {
      require(block.timestamp <= _start && _start < _end, "EVoting: Invalid election duration!");
      require(_electionType < 3, "EVoting: Election type!");

      Election memory _temp = Election({
          title: _title,
          start: _start,
          end: _end,
          isActive: false,
          election_type: ElectionType(_electionType)
        });

      Elections[electionId.current()] = _temp;
      electionId.increment();

      emit ElectionCreated(_title, ElectionType(_electionType));
    }
    
    function registerCandidates(uint256 _electionId, string memory _candidateName, uint8 _electionType) public onlyOwner {
      require(!Elections[_electionId].isActive && Elections[_electionId].start > block.timestamp && Elections[_electionId].end > block.timestamp, "EVoting: Can't register candidate after start or end!");
      
      Candidate memory _candidate = Candidate({
        candidateName: _candidateName,
        voteCount: 0,
        election_type: ElectionType(_electionType)
      });

       CandidateStats[_electionId] = _candidate;

       emit CandidateCreated(_candidateName, ElectionType(_electionType), _electionId);
    }

    function registerVoter(string memory _matNo, string memory email) public onlyOwner {
      bytes32 voterID = keccak256(abi.encodePacked(_matNo, email));
      isWhitelisted[voterID] = true;

      emit VoterRegistered(_matNo);
    }

    // function castVote(uint256 _electionId, uint256 _candidateId, string memory _matNo, string memory _email) public onlyOwner isWhitelistedToVote(_matNo, _email) {
    //   require
    // }
}
