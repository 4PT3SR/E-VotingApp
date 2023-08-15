// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/utils/Counters.sol";
import "@openzeppelin/access/Ownable.sol";

contract EVoting is Ownable {
    using Counters for Counters.Counter;
    using Counters for uint256;

    // Counters.Counter private electionId;
    // Counters.Counter private candidateId;

    // user hash => bool: true = whitelisted, false = not whitelisted (can't vote)
    mapping(bytes32 => bool) public isWhitelisted;
    // electionId => ElectionInfo
    mapping(bytes32 => Election) public Elections;
    // electionId => post hash => Candidate hash => Candidate Info
    mapping(bytes32 => mapping(bytes32 => mapping(bytes32 => Candidate)))
        public CandidateStats;
    // electionId => post hash => Candidate hashes
    mapping(bytes32 => mapping(bytes32 => bytes32[])) private CandidateHashes;
    // electionId => postId => voter hash => bool: true = voter has casted a vote, false voter has not casted a vote
    mapping(bytes32 => mapping(bytes32 => mapping(bytes32 => bool)))
        private userVoted;

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
        bytes32 electionId;
        string candidateName;
        string post;
        uint256 voteCount;
        ElectionType election_type;
    }

    modifier isWhitelistedToVote(string memory _matNo, string memory _email) {
        require(
            isWhitelisted[keccak256(abi.encodePacked(_matNo, _email))],
            "EVoting: Not whitelisted!"
        );
        _;
    }

    modifier hasVoted(
        string memory _electionId,
        string memory _postId,
        string memory _matNo,
        string memory _email
    ) {
        bytes32 _bElectionId = keccak256(abi.encodePacked(_electionId));
        bytes32 _bPostId = keccak256(abi.encodePacked(_postId));
        bytes32 _bVoter = keccak256(abi.encodePacked(_matNo, _email));
        require(
            !userVoted[_bElectionId][_bPostId][_bVoter],
            "EVoting: User already voted!"
        );
        _;
    }

    modifier isRegisteredForDifferentOrSameElections(
        string memory _electionId,
        string memory _candidateName,
        string memory _post
    ) {
        bytes32 electionID = keccak256(abi.encodePacked(_electionId));
        bytes32 _cPost = keccak256(abi.encodePacked(_post));
        // bytes32 CandidateID = keccak256(abi.encodePacked(_candidateId));
        bytes32 emptyStringPost = keccak256(abi.encodePacked(""));

        // if (
        //     keccak256(abi.encodePacked(temp.candidateName)) ==
        //     keccak256(abi.encodePacked(_candidateName))
        // ) {
        //     require(
        //         keccak256(abi.encodePacked(_post)) !=
        //             keccak256(abi.encodePacked(temp.post)),
        //         "EVoting: Candidate already registered!"
        //     );
        // }

        // candidate hashes
        bytes32[] memory chashes = CandidateHashes[electionID][_cPost];

        for (uint256 i = 0; i < chashes.length; i++) {
            bytes32 chash = chashes[i];
            Candidate memory tempCandidate = CandidateStats[electionID][_cPost][
                chash
            ];
            if (
                keccak256(abi.encodePacked(tempCandidate.candidateName)) ==
                keccak256(abi.encodePacked(_candidateName))
            ) {
                // require(keccak256(abi.encodePacked(tempCandidate.post)) == emptyStringPost, "EVoting: Candidate registered for a different Post!");
                require(
                    keccak256(abi.encodePacked(_post)) !=
                        keccak256(abi.encodePacked(tempCandidate.post)),
                    "EVoting: Candidate already registered!"
                );
            }
        }
        _;
    }

    event ElectionCreated(
        string indexed _title,
        ElectionType indexed _electionType
    );
    event VoterRegistered(string indexed _matNo);
    event CandidateCreated(
        string indexed _candidateName,
        ElectionType indexed _electionType,
        bytes32 indexed _electionId
    );
    event VoteCasted(bytes32 indexed _electionId, bytes32 indexed _candidateId);

    function createElection(
        string memory _electionId,
        string memory _title,
        uint256 _start,
        uint256 _end,
        uint8 _electionType
    ) public onlyOwner {
        require(
            block.timestamp <= _start && _start < _end,
            "EVoting: Invalid election duration!"
        );
        require(_electionType < 3, "EVoting: Election type!");

        bytes32 electionId = keccak256(abi.encodePacked(_electionId));
        Election memory _temp = Election({
            title: _title,
            start: _start,
            end: _end,
            isActive: false,
            election_type: ElectionType(_electionType)
        });

        Elections[electionId] = _temp;

        emit ElectionCreated(_title, ElectionType(_electionType));
    }

    function registerCandidate(
        string memory _electionId,
        string memory _candidateId,
        string memory _candidateName,
        string memory _post,
        uint8 _electionType
    )
        public
        onlyOwner
        isRegisteredForDifferentOrSameElections(
            _electionId,
            _candidateName,
            _post
        )
    {
        bytes32 electionId = keccak256(abi.encodePacked(_electionId));
        bytes32 candidateId = keccak256(abi.encodePacked(_candidateId));
        bytes32 bPost = keccak256(abi.encodePacked(_post));

        require(
            !Elections[electionId].isActive &&
                Elections[electionId].start > block.timestamp &&
                Elections[electionId].end > block.timestamp,
            "EVoting: Can't register candidate after start or end!"
        );
        require(
            ElectionType(Elections[electionId].election_type) ==
                ElectionType(_electionType),
            "EVoting: Wrong election!"
        );

        Candidate memory _candidate = Candidate({
            electionId: electionId,
            candidateName: _candidateName,
            post: _post,
            voteCount: 0,
            election_type: ElectionType(_electionType)
        });

        CandidateStats[electionId][bPost][candidateId] = _candidate;

        CandidateHashes[electionId][bPost].push(candidateId);

        emit CandidateCreated(
            _candidateName,
            ElectionType(_electionType),
            electionId
        );
    }

    function registerVoter(string memory _matNo, string memory email)
        public
        onlyOwner
    {
        bytes32 voterID = keccak256(abi.encodePacked(_matNo, email));
        isWhitelisted[voterID] = true;

        emit VoterRegistered(_matNo);
    }

    function castVote(
        string memory _electionId,
        string memory _candidateId,
        string memory _candidateName,
        string memory _post,
        string memory _matNo,
        string memory _email
    )
        public
        onlyOwner
        isWhitelistedToVote(_matNo, _email)
        hasVoted(_electionId, _post, _matNo, _email)
    {
        bytes32 _bPost = keccak256(abi.encodePacked(_post));
        bytes32 _bVoter = keccak256(abi.encodePacked(_matNo, _email));
        bytes32 electionId = keccak256(abi.encodePacked(_electionId));
        bytes32 candidateId = keccak256(abi.encodePacked(_candidateId));

        Candidate memory _candidateTemp = CandidateStats[electionId][_bPost][
            candidateId
        ];
        require(
            keccak256(abi.encodePacked(_candidateTemp.candidateName)) ==
                keccak256(abi.encodePacked(_candidateName)),
            "EVoting: Candidate mismatch!"
        );

        userVoted[electionId][_bPost][_bVoter] = true;
        CandidateStats[electionId][_bPost][candidateId].voteCount++;

        emit VoteCasted(electionId, candidateId);
    }

    function getVotesByElection(string memory _electionId, string memory _post)
        public
        view
        returns (Candidate[] memory)
    {
        bytes32 bPost = keccak256(abi.encodePacked(_post));
        bytes32 electionId = keccak256(abi.encodePacked(_electionId));

        // get candidate hashes
        bytes32[] memory chashes = CandidateHashes[electionId][bPost];

        Candidate[] memory stats = new Candidate[](chashes.length);

        // iterate through chashes and get each candidate stat
        for (uint8 i = 0; i < chashes.length; i++) {
            bytes32 chash = chashes[i];
            stats[i] = CandidateStats[electionId][bPost][chash];
        }

        return stats;
    }
}
