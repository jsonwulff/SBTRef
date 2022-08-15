// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TCGReg is Ownable {

    struct PlayerInfo{
        uint256 trades;
        uint256 playerLevel;
        uint256 reputation;
    }

    // Internal so we can 'hide' information in some calls
    mapping (address => PlayerInfo) internal _playerInfo;

    address public token_addr;

    constructor(address token) Ownable() {
        token_addr = token;
    }

    function changeTokenAddr(address token) public onlyOwner{
        token_addr = token;
    }

}