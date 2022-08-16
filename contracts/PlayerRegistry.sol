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

    modifier isRegistered(address who) {
        require (_playerInfo[who].playerLevel != 0, "Player isn't registered");
        _;
    }
    
    function register() public {
        address who = msg.sender;
        require(_playerInfo[who].playerLevel == 0, "Player is already registered");
        _playerInfo[who].playerLevel = 0;
        _playerInfo[who].reputation = 50;
    }

    function getPlayerLevel(address who) public isRegistered(who) view returns(uint256){
        return _playerInfo[who].playerLevel;
    }

    function changeTokenAddr(address token) public onlyOwner{
        token_addr = token;
    }

}