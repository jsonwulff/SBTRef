// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TCGReg is Ownable {
    using Counters for Counters.Counter;

    struct PlayerInfo{
        uint256 trades;
        uint256 playerLevel;
        uint256 reputation;
    }

    event PlayerRegistered(address indexed player);

    // Internal so we can 'hide' information in some calls
    mapping (address => PlayerInfo) public playerInfo;

    constructor() Ownable() {}

    function getIsRegistered(address who) public view returns (bool) {
        return playerInfo[who].playerLevel != 0;
    }

    modifier isRegistered(address who) {
        require (getIsRegistered(who), "Player isn't registered");
        _;
    }
    
    function register() public {
        address who = msg.sender;
        require(playerInfo[who].playerLevel == 0, "Player is already registered");
        playerInfo[who].playerLevel = 1;
        playerInfo[who].reputation = 50;
        emit PlayerRegistered(who);
    }

    function getPlayerInfo(address who) public isRegistered(who) view returns (PlayerInfo memory){
        return playerInfo[who];
    }

    function incrementTrades(address who) public isRegistered(who) {
        playerInfo[who].trades++;
    }

}
