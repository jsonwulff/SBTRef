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

    // Modifier to ensure a username has been seen before
    modifier isUsernameRegistered(string calldata username){
        address who = lookupUsername(username);
        require(who != address(0), "Username not found");
        require (getIsRegistered(who), "Player isn't registered");
        _;
    }

    // Looks up an address by a given username
    // NOTE: Returns the null address if none is found. Handle in caller
    function lookupUsername(string calldata username) public view returns (address) {
        return _usernames[uint256(keccak256(abi.encode(username)))];
    }

    // Registers a user with a username and playerinfo
    // Reverts if username /or/ address already exists
    // emits the UserRegister event on success
    function register(string calldata username) public {
        address who = msg.sender;
        require(_playerInfo[who].playerLevel == 0, "Player is already registered");
        _playerInfo[who].playerLevel = 1;
        _playerInfo[who].reputation = 50;
    }

    function getPlayerInfo(address who) public isRegistered(who) view returns (PlayerInfo memory){
        return _playerInfo[who];
    }

    function incrementTrades(address who) public isRegistered(who) {
        _playerInfo[who].trades++;
    }

}
