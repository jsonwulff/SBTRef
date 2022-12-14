// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TCGReg is Ownable {
    constructor() Ownable() {}

    struct PlayerInfo{
        uint256 trades;
        uint256 playerLevel;
        uint256 reputation;
    }
    function defaultPlayerInfo() internal pure returns (PlayerInfo memory){
        return PlayerInfo({trades: 0, playerLevel: 1, reputation: 50});
    }

    event UserRegister(
        address indexed who,
        uint256 indexed usernameHash,
        string username
    );
    //!  ___ _        _       
    //! / __| |_ __ _| |_ ___ 
    //! \__ \  _/ _` |  _/ -_)
    //! |___/\__\__,_|\__\___|

    // Internal so we can 'hide' information in some calls
    mapping (address => PlayerInfo) public playerInfo;
    
    // Internal username database
    // Hash is uint256(keccak256(abi.encode(username)))
    mapping (uint256 => address) internal _usernames;

    //!  _              _
    //! | |   ___  __ _(_)__
    //! | |__/ _ \/ _` | / _|
    //! |____\___/\__, |_\__|
    //!           |___/

    // Modifier to ensure an adress has been seen before
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

    // Registers a user with a username and playerinfo
    // Reverts if username /or/ address already exists
    // emits the UserRegister event on success
    function register(string calldata username) public {
        address who = msg.sender;
        // Check if user already exists
        require(
            getIsRegistered(who) == false,
            "Player address is already registered");
        require(
            lookupUsername(username) == address(0), 
            "Username is already registered");

        // Hash used for internal identification
        uint256 uhash = uint256(keccak256(abi.encode(username)));
        // Set default stats
        _usernames[uhash] = who;
        playerInfo[who] = defaultPlayerInfo();
        // Emit events
        emit UserRegister(who, uhash, username); 
    }

    // Register a succesful trade for two players
    // Require a valid unseen tradeID
    // NOTE: Currently has no way to verify the tradeId actually exists in token
    function incrementTrades(address from, address to) 
             public isRegistered(from) isRegistered(to) {
        // Bookkeeping mostly
        playerInfo[from].trades++;
        playerInfo[to].trades++;
    }

    //!       _               
    //!  __ _(_)_____ __ _____
    //!  \ V / / -_) V  V (_-<
    //!   \_/|_\___|\_/\_//__/
    // Looks up an address by a given username
    // NOTE: Returns the null address if none is found. Handle in caller
    function lookupUsername(string calldata username) 
             public view returns (address) {
        return _usernames[uint256(keccak256(abi.encode(username)))];
    }

    // Checks if an address is already registered
    function getIsRegistered(address who) public view returns (bool) {
        return playerInfo[who].playerLevel != 0;
    }

    // Returns all player info
    // Note: in future, would be deprecated 
    //       instead: split into view functions like below
    function getPlayerInfo(address who) 
             public isRegistered(who) view returns (PlayerInfo memory){
        return playerInfo[who];
    }

    // polymorphic lookup functions for usernames and address
    function getPlayerLevel(string calldata username) 
             public view isUsernameRegistered(username) returns (uint256) {
        return getPlayerLevel(lookupUsername(username));
    }
    function getPlayerLevel(address who) 
             public view isRegistered(who) returns (uint256){
        return playerInfo[who].playerLevel;
    }
    function getPlayerTrades(string calldata username) 
             public view isUsernameRegistered(username) returns (uint256) {
        return getPlayerTrades(lookupUsername(username));
    }
    function getPlayerTrades(address who) 
             public view isRegistered(who) returns (uint256){
        return playerInfo[who].trades;
    }

}