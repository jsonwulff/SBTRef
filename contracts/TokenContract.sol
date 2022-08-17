// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./PlayerRegistry.sol";

contract TCGTok is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    struct Trade {
        uint id;
        address offerer;
        address reciever;
        uint[] offers;
        uint[] wants;
        bool closed;
    }

    struct Statblok {
        uint8 cardType;
        uint8 rarity;
        uint8 str;
        uint8 def;
        uint8 hlt;
        uint traded;
    }

    event TradeOffered(uint tradeId, address sender, address reciever);
    event TradeAccept(uint tradeId, address sender, address reciever);
    event TradeDecline(uint tradeId, address sender, address reciever);
    event TradeClose(uint tradeId, address sender, address reciever);

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _tradeIdCounter;
    Counters.Counter private _nonce;
    uint private _packCost = 0.00264 ether; // approx 5 usd
    uint private _cardTypeAmount = 120;
    TCGReg private _registry;

    mapping (uint => Trade) public trades;
    mapping (uint => Statblok) public stats;

    constructor(address _registryAddress) ERC721("NFTC Token", "NFTC") {
        _registry = TCGReg(_registryAddress);
    }

    function changeRegistryAddress(address _newRegistryAddress) external onlyOwner {
        _registry = TCGReg(_newRegistryAddress);
    }

    modifier isRegistered(address who) {
        require (_registry.getIsRegistered(who), "Player isn't registered");
        _;
    }

    function getCardsByOwner(address _owner) external view returns(uint256[] memory) {
      uint256[] memory result = new uint[](balanceOf(_owner));
      uint counter = 0;
      for (uint i = 0; i < _tokenIdCounter.current(); i++) {
        if (ownerOf(i) == _owner) {
          result[counter] = i;
          counter++;
        }
      }
      return result;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "cshare.dk/nft/";
    }

    function safeMint(address _to, string memory _uri, uint _cardType) public onlyOwner {
        uint tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _uri);
        _setTokenStats(_generateRandomRarity(), tokenId, _cardType);
    }

    function _transfer(address _from, address _to, uint _tokenId) internal override(ERC721) {
        super._transfer(_from, _to, _tokenId);
        stats[_tokenId].traded += 1;
    }

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

    function _setTokenStats(uint _rarity, uint _tokenId, uint _cardType) internal {
        stats[_tokenId] = Statblok({
            cardType: uint8(_cardType),
            rarity: uint8(_rarity),
            str: uint8(_roll(_rarity, 8)),
            def: uint8(_roll(_rarity, 8)),
            hlt: uint8(_roll(_rarity, 8)),
            traded: 0
        });
    }


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

        for (uint i = 0; i < _tokenIds.length; i++){
            _burn(_tokenIds[i]);
        }

        // Minting
        uint tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(newOwner, tokenId);
        _setTokenURI(tokenId, "");
        _setTokenStats(oldRarity + 1, tokenId, cardType);
    }


    // The following functions are overrides required by Solidity.
    function _burn(uint _tokenId) internal override(ERC721, ERC721URIStorage) {
        stats[_tokenId].rarity = 0;
        stats[_tokenId].str = 0;
        stats[_tokenId].def = 0;
        stats[_tokenId].hlt = 0; 
        super._burn(_tokenId);
    }

    function tokenURI(uint _tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(_tokenId);
    }

    function makeTradeOffer(address _from, address _to, uint[] memory _offer, uint[] memory _wants) external isRegistered(_from) isRegistered(_to) {
        require(msg.sender == _from, "Sender must be offerer");
        require(_from != _to, "Cannot trade with yourself");

        for (uint i = 0 ; i < _offer.length; i++) {
            require(ownerOf(_offer[i]) == _from, "Sender doesn't own card");
        }

        for (uint i = 0 ; i < _wants.length; i++) {
            require(ownerOf(_wants[i]) == _to, "Reciever doesn't own card");
        }

        _tradeIdCounter.increment();
        Trade memory trade = Trade({
            id: _tradeIdCounter.current(),
            offerer: _from,
            reciever: _to,
            offers: _offer,
            wants: _wants,
            closed: false
        });

        trades[trade.id] = trade;
        emit TradeOffered(trade.id, _from, _to);
    }

    function acceptTrade(uint _tradeId) external {
        Trade storage trade = trades[_tradeId];

        require(trade.id != 0, "Trade doesn't exist");
        require(msg.sender == trade.reciever, "Sender must be reciever");
        require(trade.closed == false, "Trade is closed");

        for (uint i = 0; i < trade.offers.length; i++) {
            _transfer(trade.offerer, trade.reciever, trade.offers[i]);
        }

        for (uint i = 0; i < trade.wants.length; i++) {
            _transfer(trade.reciever, trade.offerer, trade.wants[i]);
        }

        trade.closed = true;

        emit TradeAccept(trade.id, trade.offerer, trade.reciever);
    }

    function declineTrade(uint _tradeId) external {
        Trade storage trade = trades[_tradeId];

        require(trade.id != 0, "Trade doesn't exist");
        require(msg.sender == trade.reciever, "Sender must be reciever");
        require(trade.closed == false, "Trade is closed");

        trade.closed = true;

        emit TradeDecline(trade.id, trade.offerer, trade.reciever);
    }

    function closeTrade(uint _tradeId) external {
        Trade storage trade = trades[_tradeId];

        require(trade.id != 0, "Trade doesn't exist");
        require(msg.sender == trade.offerer, "Sender must be offerer");
        require(trade.closed == false, "Trade is closed");

        trade.closed = true;

        emit TradeClose(trade.id, trade.offerer, trade.reciever);
    }

    function getTrade(uint _tradeId) public view returns (Trade memory) {
        return trades[_tradeId];
    }

    function setPackCost(uint _amount) external onlyOwner {
        _packCost = _amount;
    }

    function getPackCost() external view returns (uint) {
        return _packCost;
    }

    function withdrawEth() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function buyPackOfTen(address _to) external payable isRegistered(_to) {
        uint newPackCost = _packCost;
        require(msg.value >= newPackCost);

        if (msg.value > newPackCost) {
            payable(msg.sender).transfer(msg.value - newPackCost);
        }

        for (uint i = 0; i < 10; i++) {
            safeMint(_to, "", _generateRandomNum(0, _cardTypeAmount));
        }
    }

    function buyPackOfTwenty(address _to) external payable isRegistered(_to) {
        uint newPackCost = _packCost * 2;
        require(msg.value >= newPackCost, "Not enough ETH");

        if (msg.value > newPackCost) {
            payable(msg.sender).transfer(msg.value - newPackCost);
        }

        for (uint i = 0; i < 20; i++) {
            safeMint(_to, "", _generateRandomNum(0, _cardTypeAmount));
        }
    }

    function buyPackOfFifty(address _to) external payable isRegistered(_to) {
        uint newPackCost = _packCost * 5;
        require(msg.value >= newPackCost, "Not enough ETH");

        if (msg.value > newPackCost) {
            payable(msg.sender).transfer(msg.value - newPackCost);
        }

        for (uint i = 0; i < 50; i++) {
            safeMint(_to, "", _generateRandomNum(0, _cardTypeAmount));
        }
    }
}
