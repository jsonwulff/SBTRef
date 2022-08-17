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

    constructor() Ownable() {}

    function getIsRegistered(address who) public view returns (bool) {
        return _playerInfo[who].playerLevel != 0;
    }

    modifier isRegistered(address who) {
        require (getIsRegistered(who), "Player isn't registered");
        _;
    }
    
    function register() public {
        address who = msg.sender;
        require(_playerInfo[who].playerLevel == 0, "Player is already registered");
        _playerInfo[who].playerLevel = 1;
        _playerInfo[who].reputation = 50;
    }

    function getPlayerLevel(address who) public isRegistered(who) view returns(uint256){
        return _playerInfo[who].playerLevel;
    }

    function incrementTrades(address who) public isRegistered(who) {
        _playerInfo[who].trades++;
    }

}
