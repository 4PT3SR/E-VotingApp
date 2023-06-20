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
    
    (string memory title, , , , ) = evotingCore.Elections(1);
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
    uint8 _electionType = 2;

    evotingCore.registerCandidate(_electionId, _candidateName, _electionType);

    (string memory candidateName, ,) = evotingCore.CandidateStats(1, 0);
    assertTrue(keccak256(abi.encodePacked(candidateName)) == keccak256(abi.encodePacked(_candidateName)));

    vm.stopPrank();
  }

  function testCandidateRegistrationTwo() public {
    testCandidateRegistration();

    startHoax(address(1));
    
    uint256 _electionId = 1;
    string memory _candidateName = "Jane Doe";
    uint8 _electionType = 2;

    evotingCore.registerCandidate(_electionId, _candidateName, _electionType);

    (string memory candidateName, ,) = evotingCore.CandidateStats(1, 1);
    assertTrue(
      keccak256(abi.encodePacked(candidateName)) == keccak256(abi.encodePacked(_candidateName))
    );

    vm.stopPrank();
  }

  function testRegisterVoter() public {}
}
