// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/utils/Counters.sol";
import "@openzeppelin/access/Ownable.sol";

contract EVoting is Ownable {
    using Counters for Counters.Counter;
    using Counters for uint256;

    Counters.Counter private electionId;
    Counters.Counter private candidateId;

    uint256 public number;

    // user hash => bool: true = whitelisted, false = not whitelisted (can't vote)
    mapping(bytes32 => bool) public isWhitelisted;
    // electionId => ElectionInfo
    mapping(uint256 => Election) public Elections;
    // electionId => post hash => Candidate Info
    mapping(uint256 => mapping(bytes32 => Candidate[])) public CandidateStats;
    // electionId => voter hash => bool: true = voter has casted a vote, false voter has not casted a vote
    mapping(uint256 => mapping(bytes32 => bool)) private userVoted;

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
        uint256 electionId;
        string candidateName;
        string post;
        uint256 voteCount;
        ElectionType election_type;
    }

    modifier isWhitelistedToVote(string memory _matNo, string memory _email) {
        require(isWhitelisted[keccak256(abi.encodePacked(_matNo, _email))], "EVoting: Not whitelisted!");
        _;
    }

    modifier hasVoted(uint256 _electionId, string memory _matNo, string memory _email) {
      bytes32 _bVoter = keccak256(abi.encodePacked(_matNo, _email));
      require(!userVoted[_electionId][_bVoter], "EVoting: User already voted!");
      _;
    }

    modifier isRegisteredForDifferentOrSameElections(uint256 _electionId,
        string memory _candidateName,
        string memory _post) {
          bytes32 _bPost = keccak256(abi.encodePacked(_post));
          Candidate[] memory temp = CandidateStats[_electionId][_bPost];
          bytes32 emptyStringPost = keccak256(abi.encodePacked(""));

          for(uint256 i = 0; i < temp.length; i++) {
            Candidate memory tempCandidate = temp[i];
            if (keccak256(abi.encodePacked(tempCandidate.candidateName)) == keccak256(abi.encodePacked(_candidateName))) {
              // require(keccak256(abi.encodePacked(tempCandidate.post)) == emptyStringPost, "EVoting: Candidate registered for a different Post!");
              require(keccak256(abi.encodePacked(_post)) != keccak256(abi.encodePacked(tempCandidate.post)), "EVoting: Candidate already registered!");
            }
          }
          _;
        }

    event ElectionCreated(string indexed _title, ElectionType indexed _electionType);
    event VoterRegistered(string indexed _matNo);
    event CandidateCreated(
        string indexed _candidateName, ElectionType indexed _electionType, uint256 indexed _electionId
    );
    event VoteCasted(uint256 indexed _electionId, uint256 indexed _candidateId);

    function createElection(string memory _title, uint256 _start, uint256 _end, uint8 _electionType) public onlyOwner {
        require(block.timestamp <= _start && _start < _end, "EVoting: Invalid election duration!");
        require(_electionType < 3, "EVoting: Election type!");

        Election memory _temp = Election({
            title: _title,
            start: _start,
            end: _end,
            isActive: false,
            election_type: ElectionType(_electionType)
        });

        Elections[electionId.current() + 1] = _temp;
        electionId.increment();

        emit ElectionCreated(_title, ElectionType(_electionType));
    }

    function registerCandidate(
        uint256 _electionId,
        string memory _candidateName,
        string memory _post,
        uint8 _electionType
    ) public onlyOwner isRegisteredForDifferentOrSameElections(_electionId, _candidateName, _post) {
        require(
            !Elections[_electionId].isActive && Elections[_electionId].start > block.timestamp
                && Elections[_electionId].end > block.timestamp,
            "EVoting: Can't register candidate after start or end!"
        );
        require(
            ElectionType(Elections[_electionId].election_type) == ElectionType(_electionType),
            "EVoting: Wrong election!"
        );

        Candidate memory _candidate = Candidate({
            electionId: _electionId,
            candidateName: _candidateName,
            post: _post,
            voteCount: 0,
            election_type: ElectionType(_electionType)
        });

        CandidateStats[_electionId][keccak256(abi.encodePacked(_post))].push(_candidate);

        emit CandidateCreated(_candidateName, ElectionType(_electionType), _electionId);
    }

    function registerVoter(string memory _matNo, string memory email) public onlyOwner {
        bytes32 voterID = keccak256(abi.encodePacked(_matNo, email));
        isWhitelisted[voterID] = true;

        emit VoterRegistered(_matNo);
    }

    function castVote(
        uint256 _electionId,
        uint256 _candidateId,
        string memory _candidateName,
        string memory _post,
        string memory _matNo,
        string memory _email
    ) public onlyOwner isWhitelistedToVote(_matNo, _email) hasVoted(_electionId, _matNo, _email) {
        bytes32 _bPost = keccak256(abi.encodePacked(_post));
        bytes32 _bVoter = keccak256(abi.encodePacked(_matNo, _email));

        Candidate memory _candidateTemp = CandidateStats[_electionId][_bPost][_candidateId - 1];
        require(
            keccak256(abi.encodePacked(_candidateTemp.candidateName)) == keccak256(abi.encodePacked(_candidateName)),
            "EVoting: Candidate mismatch!"
        );

        userVoted[_electionId][_bVoter] = true;
        CandidateStats[_electionId][_bPost][_candidateId - 1].voteCount++;

        emit VoteCasted(_electionId, _candidateId - 1);
    }

    function getVotesByElection(uint256 _electionId, string memory _post) public view returns (Candidate[] memory) {
        return CandidateStats[_electionId][keccak256(abi.encodePacked(_post))];
    }
}
