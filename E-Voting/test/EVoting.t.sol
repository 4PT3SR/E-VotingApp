// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console2.sol";
import "../src/EVoting.sol";

contract EVotingTest is Test {
    EVoting public evotingCore;

    struct Candidate {
        string candidateName;
        uint256 voteCount;
        ElectionType election_type;
    }

    enum ElectionType {
        College,
        Department,
        General
    }

    function setUp() public {
        vm.prank(address(1));
        evotingCore = new EVoting();
    }

    function testCreateElection() public {
        startHoax(address(1));

        string memory _title = "SUG Election";
        uint256 _start = 1687303489000;
        uint256 _end = 1687307089000;
        uint8 _electionType = 2;

        evotingCore.createElection(_title, _start, _end, _electionType);

        (string memory title,,,,) = evotingCore.Elections(1);
        // console.log("Title:", title);
        // console.log("Timestamp:", block.timestamp);

        assertTrue(keccak256(abi.encodePacked(title)) == keccak256(abi.encodePacked(_title)));

        vm.stopPrank();
    }

    function testCandidateRegistration() public {
        testCreateElection();

        startHoax(address(1));

        uint256 _electionId = 1;
        string memory _candidateName = "John Doe";
        string memory _post = "Presidential";
        uint8 _electionType = 2;

        evotingCore.registerCandidate(_electionId, _candidateName, _post, _electionType);

        (, string memory candidateName,,,) = evotingCore.CandidateStats(1, keccak256(abi.encodePacked(_post)), 0);
        assertTrue(keccak256(abi.encodePacked(candidateName)) == keccak256(abi.encodePacked(_candidateName)));

        vm.stopPrank();
    }

    function testCandidateRegistrationTwo() public {
        testCandidateRegistration();

        startHoax(address(1));

        uint256 _electionId = 1;
        string memory _candidateName = "Jane Doe";
        string memory _post = "Presidential";
        uint8 _electionType = 2;

        evotingCore.registerCandidate(_electionId, _candidateName, _post, _electionType);

        (, string memory candidateName,,,) = evotingCore.CandidateStats(1, keccak256(abi.encodePacked(_post)), 1);
        assertTrue(keccak256(abi.encodePacked(candidateName)) == keccak256(abi.encodePacked(_candidateName)));

        vm.stopPrank();
    }

    function testCantRegisterCandidate_AlreadyRegistered() public {
        testCandidateRegistrationTwo();

        startHoax(address(1));

        uint256 _electionId = 1;
        string memory _candidateName = "Jane Doe";
        string memory _post = "Presidential";
        uint8 _electionType = 2;

        vm.expectRevert("EVoting: Candidate already registered!");
        evotingCore.registerCandidate(_electionId, _candidateName, _post, _electionType);

        vm.stopPrank();
    }

    function testRegisterVoter() public {
        testCandidateRegistrationTwo();

        startHoax(address(1));

        string memory _matNo = "U19CS2023";
        string memory email = "Kaci_Raynor62@hotmail.com";

        evotingCore.registerVoter(_matNo, email);

        vm.stopPrank();
    }

    function testCastVote() public {
        testRegisterVoter();

        startHoax(address(1));

        uint256 _electionId = 1;
        uint256 _candidateId = 1;
        string memory _candidateName = "John Doe";
        string memory _post = "Presidential";
        string memory _matNo = "U19CS2023";
        string memory _email = "Kaci_Raynor62@hotmail.com";

        evotingCore.castVote(_electionId, _candidateId, _candidateName, _post, _matNo, _email);

        vm.stopPrank();

        (, , , uint256 johnVotes,) = evotingCore.CandidateStats(1, keccak256(abi.encodePacked(_post)), 0);
        assertTrue(johnVotes == 1);
    }

    function testCantCastVote_NotWhitelisted() public {
      testRegisterVoter();

      startHoax(address(1));
      
      vm.expectRevert("EVoting: Not whitelisted!");
      evotingCore.castVote(1, 1, "John Doe", "Presidential", "U19CS2023", "Kaci_Raynor62@hotmaill.com");

      vm.stopPrank();
    }

    function testCantVote_AlreadyVoted() public {
      testCastVote();

      startHoax(address(1));

      vm.expectRevert("EVoting: User already voted!");
      evotingCore.castVote(1, 2, "Jane Doe", "Presidential", "U19CS2023", "Kaci_Raynor62@hotmail.com");
      vm.stopPrank();
    }

    function testGetAllVotes() public {
      testCastVote();

      EVoting.Candidate[] memory candidates = evotingCore.getVotesByElection(1, "Presidential");

      console.log("John: ", candidates[0].candidateName, candidates[0].voteCount, candidates[0].post);
      // console.log("Timestamp:", block.timestamp);

    }
}
