// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./PlayerRegistry.sol";

// Main token contract:
// Extends ERC721
// - URI storage for metadata
// - Burnable
// - Contract is Ownable
contract TCGTok is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    constructor(address _registryAddress) ERC721("NFTC Token", "NFTC") {
        // Bind the player registry on construction
        _registry = TCGReg(_registryAddress);
    }

    struct Trade {
        uint id;
        address offerer;
        address reciever;
        uint[] offers;
        uint[] wants;
        bool closed;
    }

    struct Statblok {
        uint id;
        uint traded;
        uint8 cardType;
        uint8 rarity;
        uint8 str;
        uint8 def;
        uint8 hlt;
    }
    //!  ___             _      
    //! | __|_ _____ _ _| |_ ___
    //! | _|\ V / -_) ' \  _(_-<
    //! |___|\_/\___|_||_\__/__/
                        
    event TradeOffered(uint indexed tradeId, address indexed sender, address indexed reciever);
    event TradeAccept(uint indexed tradeId, address indexed sender, address indexed reciever);
    event TradeDecline(uint indexed tradeId, address indexed sender, address indexed reciever);
    event TradeClose(uint indexed tradeId, address indexed sender, address indexed reciever);


    //!  ___ _        _       
    //! / __| |_ __ _| |_ ___ 
    //! \__ \  _/ _` |  _/ -_)
    //! |___/\__\__,_|\__\___|

    // Nonce for random number generation
    Counters.Counter private _nonce;

    // State for trading
    Counters.Counter private _tradeIdCounter;
    mapping (uint => Trade) public trades;

    // Token stats and id
    Counters.Counter private _tokenIdCounter;
    mapping (uint => Statblok) public stats;

    // State values for buying packs
    uint private _packCost = 0.00264 ether; // approx 5 usd
    uint private _cardTypeAmount = 120;
    
    // Address for the registry
    TCGReg private _registry;

    //!  _              _    
    //! | |   ___  __ _(_)__ 
    //! | |__/ _ \/ _` | / _|
    //! |____\___/\__, |_\__|
    //!           |___/      


    // Utility functions for randum number and stat generation
    // Pseudo-random number gen, not inclusive i.e. from <= result < to
    function _generateRandomNum(uint _from, uint _to) internal returns (uint) {
        require(_to > _from, "To needs to be greater than from");
        uint rand = uint(keccak256(abi.encode(block.timestamp, gasleft(), _nonce)));
        _nonce.increment();
        return (rand % (_to - _from)) + _from;
    }
    // Roll with advantage: max(Nd8)
    function _roll(uint _n, uint _diceSize) internal returns (uint) {
        uint result = 0;
        for (uint i = 0; i < _n; i++){
            result = _max(result, _generateRandomNum(0, _diceSize));
        }
        return result;
    }
    
    function _max(uint _a, uint _b) internal pure returns (uint) {
        if (_a > _b)
            return _a;
        return _b;
    }

    // Checks with player registry if account is registered
    modifier isRegistered(address who) {
        require (_registry.getIsRegistered(who), "Player isn't registered");
        _;
    }
    // Change pointer to registry
    function changeRegistryAddress(address _newRegistryAddress) 
             external onlyOwner {
        _registry = TCGReg(_newRegistryAddress);
    }

    // Throwavay uri that we control. Currently unused
    function _baseURI() internal pure override returns (string memory) {
        return "cpj.nu/nft/";
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint _tokenId) internal override(ERC721, ERC721URIStorage) {
        stats[_tokenId].rarity = 0;
        stats[_tokenId].str = 0;
        stats[_tokenId].def = 0;
        stats[_tokenId].hlt = 0; 
        super._burn(_tokenId);
    }

    // Overrides transfer function to record token trade amount
    function _transfer(address _from, address _to, uint _tokenId) 
             internal override(ERC721) {
        super._transfer(_from, _to, _tokenId);
        stats[_tokenId].traded += 1;
    }

    // ------------------------ CARD MINTING ------------------

    // ERC-721 required
    function safeMint(address _to, string memory _uri, uint _cardType) 
             public onlyOwner {
        _mintNewCard(_to, _uri, _cardType);
    }

    // Function that mints new cards. Only called inside contract from either
    // `safeMint` or when buying card packs
    function _mintNewCard(address _to, string memory _uri, uint _cardType) 
             private {
        uint tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _uri);
        _setTokenStats(_generateRandomRarity(), tokenId, _cardType);
    } 

    // Weighted random for card rarity
    function _generateRandomRarity() internal returns (uint) {
        // Start with rarity
        // 0-4 Common
        // 5-6 uncommon
        // 7   rare
        uint rarity;
        uint rand = _generateRandomNum(0, 8);
        if (rand <= 4)
            rarity = 1;
        else if(rand <= 6)
            rarity = 2;
        else
            rarity = 3;
        
        return rarity;
    }

    // When minting a token, generate it's random stats, and setup defaults
    function _setTokenStats(uint _rarity, uint _tokenId, uint _cardType) 
             internal {
        stats[_tokenId] = Statblok({
            id: _tokenId,
            cardType: uint8(_cardType),
            rarity: uint8(_rarity),
            str: uint8(_roll(_rarity, 8)),
            def: uint8(_roll(_rarity, 8)),
            hlt: uint8(_roll(_rarity, 8)),
            traded: 0
        });
    }

    // ------------------------ COMBINE CARDS ------------------

    // Given 4 cardId's of same rarity, mint a new token with rarity+1
    function combineCards(uint[4] calldata _tokenIds) public {
        address newOwner = msg.sender;
        uint oldRarity = stats[_tokenIds[0]].rarity;
        uint cardType = stats[_tokenIds[0]].cardType;

        // Require user owns card, rarity and card type is consistent
        for (uint i = 0; i < _tokenIds.length; i++){
            require(ownerOf(_tokenIds[i]) == newOwner, "Sender doesn't own card");
            require(stats[_tokenIds[i]].rarity == oldRarity, "Cards aren't same rarity");
            require(stats[_tokenIds[i]].cardType == cardType, "Cards aren't same type");
        }

        // Burn old cards
        for (uint i = 0; i < _tokenIds.length; i++){
            _burn(_tokenIds[i]);
        }

        // Mint a new card
        // NOTE: Could just use the new internal minting function
        uint tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(newOwner, tokenId);
        _setTokenURI(tokenId, "");
        _setTokenStats(oldRarity + 1, tokenId, cardType);
    }

    // ------------------------ TRADE LOGIC ------------------
    // Setup logic for trading. Performs sanity checks, then records the offer
    // ... and publishes trade event
    function makeTradeOffer
             (address _to, uint[] memory _offer, uint[] memory _wants) 
             external isRegistered(msg.sender) isRegistered(_to) {
        address from = msg.sender;
        // Sanity checks
        require(from != _to, "Cannot trade with yourself");
        for (uint i = 0 ; i < _offer.length; i++) {
            require(ownerOf(_offer[i]) == from, "Sender doesn't own card");
        }

        for (uint i = 0 ; i < _wants.length; i++) {
            require(ownerOf(_wants[i]) == _to, "Reciever doesn't own card");
        }

        // Generate new Trade we can record
        _tradeIdCounter.increment();
        Trade memory trade = Trade({
            id: _tradeIdCounter.current(),
            offerer: from,
            reciever: _to,
            offers: _offer,
            wants: _wants,
            closed: false
        });
        trades[trade.id] = trade;

        // Emit Event
        emit TradeOffered(trade.id, from, _to);
    }

    // Logic to accept trade offers
    function acceptTrade(uint _tradeId) external {
        Trade storage trade = trades[_tradeId];

        // Sanity checks
        require(trade.id != 0, "Trade doesn't exist");
        require(msg.sender == trade.reciever, "Sender must be reciever");
        require(trade.closed == false, "Trade is closed");

        // Transfer cards through internal function
        // Don't need safeTransfer here, since players must be registered to
        // ... even generate a trade offer
        for (uint i = 0; i < trade.offers.length; i++) {
            _transfer(trade.offerer, trade.reciever, trade.offers[i]);
        }

        for (uint i = 0; i < trade.wants.length; i++) {
            _transfer(trade.reciever, trade.offerer, trade.wants[i]);
        }

        // Bookkeeping
        trade.closed = true;
        _registry.incrementTrades(trade.offerer, trade.reciever);

        // Emit event to close trade
        emit TradeAccept(trade.id, trade.offerer, trade.reciever);
    }

    // Logic when a player declines a trade
    function declineTrade(uint _tradeId) external {
        Trade storage trade = trades[_tradeId];

        // Same sanity checks
        require(trade.id != 0, "Trade doesn't exist");
        require(msg.sender == trade.reciever, "Sender must be reciever");
        require(trade.closed == false, "Trade is closed");

        // Much simpler bookkeeping
        trade.closed = true;

        emit TradeDecline(trade.id, trade.offerer, trade.reciever);
    }

    // If a user wants to withdraw a trade offer
    function closeTrade(uint _tradeId) external {
        Trade storage trade = trades[_tradeId];

        // Sanity checks
        require(trade.id != 0, "Trade doesn't exist");
        require(msg.sender == trade.offerer, "Sender must be offerer");
        require(trade.closed == false, "Trade is closed");

        // Bookkeeping
        trade.closed = true;

        emit TradeClose(trade.id, trade.offerer, trade.reciever);
    }

    // ------------------------ CARD BUYING ------------------

    // In case we want to update pack price
    function setPackCost(uint _amount) external onlyOwner {
        _packCost = _amount;
    }

    // Ensures the owner can withdraw money
    function withdrawEth() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Functions to buy packs of 10, 20, 50 cards
    // They are so closely related we could probably make a more generic version
    function buyPackOfTen(address _to) external payable isRegistered(_to) {
        // Check if they sent enough money
        uint newPackCost = _packCost;
        require(msg.value >= newPackCost, "Not enough ETH");

        // Send back overflow of money(we don't accept donations)
        if (msg.value > newPackCost) {
            payable(msg.sender).transfer(msg.value - newPackCost);
        }

        // Mint ten new cards
        for (uint i = 0; i < 10; i++) {
            _mintNewCard(_to, "", _generateRandomNum(0, _cardTypeAmount));
        }
    }

    function buyPackOfTwenty(address _to) external payable isRegistered(_to) {
        uint newPackCost = _packCost * 2;
        require(msg.value >= newPackCost, "Not enough ETH");

        if (msg.value > newPackCost) {
            payable(msg.sender).transfer(msg.value - newPackCost);
        }

        for (uint i = 0; i < 20; i++) {
            _mintNewCard(_to, "", _generateRandomNum(0, _cardTypeAmount));
        }
    }

    function buyPackOfFifty(address _to) external payable isRegistered(_to) {
        uint newPackCost = _packCost * 5;
        require(msg.value >= newPackCost, "Not enough ETH");

        if (msg.value > newPackCost) {
            payable(msg.sender).transfer(msg.value - newPackCost);
        }

        for (uint i = 0; i < 50; i++) {
            _mintNewCard(_to, "", _generateRandomNum(0, _cardTypeAmount));
        }
    }

    //! __   ___               
    //! \ \ / (_)_____ __ _____
    //!  \ V /| / -_) V  V (_-<
    //!   \_/ |_\___|\_/\_//__/
                       
    function tokenURI(uint _tokenId)
             public view override(ERC721, ERC721URIStorage) 
             returns (string memory) {
        return super.tokenURI(_tokenId);
    }

    // Enumerate cards by owner
    function getCardsByOwner(address _owner) 
             external view returns(uint256[] memory) {
        // Allocate result array from balanceOF(amount of tokens owned)
        uint256[] memory result = new uint[](balanceOf(_owner));
        uint counter = 0;
        // Loop through all tokens, record found tokens
        for (uint i = 0; i < _tokenIdCounter.current(); i++) {
            if (ownerOf(i) == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    // Gets information on a trade
    function getTrade(uint _tradeId) public view returns (Trade memory) {
        return trades[_tradeId];
    }

    // Get cost of a single pack of cards
    function getPackCost() external view returns (uint) {
        return _packCost;
    }


}
