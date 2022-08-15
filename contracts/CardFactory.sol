// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract CardFactory is Ownable {

  using SafeMath for uint256;

  event NewCard(uint zombieId, string name, uint dna);

  uint dnaDigits = 16;
  uint dnaModulus = 10 ** dnaDigits;
  uint cooldownTime = 1 days;

  struct Card {
    string name;
    uint dna;
    uint32 level;
    uint32 readyTime;
    uint16 winCount;
    uint16 lossCount;
  }

  Card[] public cards;

  mapping (uint => address) public cardToOwner;
  mapping (address => uint) ownerCardCount;

  function _createCard(string calldata _name, uint _dna) internal {
    cards.push(Card(_name, _dna, 1, uint32(block.timestamp + cooldownTime), 0, 0));
    uint id = cards.length - 1;
    cardToOwner[id] = msg.sender;
    ownerCardCount[msg.sender] = ownerCardCount[msg.sender].add(1);
    emit NewCard(id, _name, _dna);
  }

  function _generateRandomDna(string calldata _str) private view returns (uint) {
    uint rand = uint(keccak256(abi.encodePacked(_str)));
    return rand % dnaModulus;
  }

  function createRandomCard(string calldata _name) public {
    require(ownerCardCount[msg.sender] == 0, "You already have a card");
    uint randDna = _generateRandomDna(_name);
    randDna = randDna - randDna % 100;
    _createCard(_name, randDna);
  }

}