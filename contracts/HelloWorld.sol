// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

contract HelloWorld {
  string myName = "Tristan";
  
  function getMyName() public view returns(string memory) {
    return myName;
  }
  
  function changeMyName(string memory _newName) public {
    myName = _newName;
  }
}