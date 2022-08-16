// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TCGTok is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    struct Trade {
        uint256 id;
        address offerer;
        address reciever;
        uint256[] offers;
        uint256[] wants;
        bool closed;
    }

    struct Statblok {
        uint8 _rarity;
        uint8 _str;
        uint8 _def;
        uint8 _hlt;
        uint256 traded;
    }

    event TradeOffered(uint256 tradeId, address sender, address reciever);
    event TradeAccept(uint256 tradeId, address sender, address reciever);
    event TradeDecline(uint256 tradeId, address sender, address reciever);
    event TradeClose(uint256 tradeId, address sender, address reciever);

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _tradeIdCounter;
    Counters.Counter private _nonce;

    mapping (uint256 => Trade) public trades;
    mapping (uint256 => Statblok) public _stats;

    constructor() ERC721("NFTC Token", "NFTC") {}

    function getAllCardOwners() external view returns (address[] memory) {
        address[] memory result = new address[](_tokenIdCounter.current());
        for (uint256 i = 0; i < result.length; i++) {
            result[i] = ownerOf(i);
        }
        return result;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "cshare.dk/nft/";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _setTokenStats(tokenId);
        _tokenIdCounter.increment();
    }

    function _transfer(address from, address to, uint256 tokenId) internal override(ERC721) {
        super._transfer(from, to, tokenId);
        _stats[tokenId].traded += 1;
    }

    // Pseudo-random number gen, not inclusive i.e. from <= result < to
    function _generateRandomNum(uint256 from, uint256 to) internal returns (uint256) {
        require(to > from, "To needs to be greater than from");
        uint256 rand = uint(keccak256(abi.encode(block.timestamp, gasleft(), _nonce)));
        _nonce.increment();
        return (rand % (to - from)) + from;
    }

    // Roll with advantage: max(Nd8)
    function _roll(uint8 N) internal returns (uint8){
        uint8 result = 0;
        for(uint8 i = 0; i < N; i++){
            uint8 tmp = uint8(_generateRandomNum(0, 8));
            if (tmp > result)
                result = tmp;
        }
        return result;
    }

    function _setTokenStats(uint256 tokenId) internal {
        // Start with rarity
        // 0-4 Common
        // 5-6 uncommon
        // 7   rare
        uint8 rarity;
        uint8 rand = uint8(_generateRandomNum(0, 8));
        if (rand <= 5)
            rarity = 1;
        else if(rand <= 6)
            rarity = 2;
        else
            rarity = 3;
        _setTokenStats(tokenId, rarity);
    }
    function _setTokenStats(uint256 tokenId, uint8 rarity) internal {
        _stats[tokenId]._rarity = rarity;
        _stats[tokenId]._str = _roll(rarity);
        _stats[tokenId]._def = _roll(rarity);
        _stats[tokenId]._hlt = _roll(rarity);
    }


    // Given 4 cardId's of same rarity, mint a new token with rarity+1
    function combineCards(uint256[4] calldata tokenIds) public {
        address newOwner = msg.sender;
        uint8 oldRarity = _stats[tokenIds[0]]._rarity;
        for(uint8 i = 0; i < 4; i++){
            // Require user owns card and rarity is consistent
            require(ownerOf(tokenIds[i]) == newOwner, "Sender doesn't own card");
            require(_stats[tokenIds[i]]._rarity == oldRarity, "Cards aren't same rarity");
            _burn(tokenIds[i]);
        }
        uint8 newRarity = oldRarity + 1;
        // Minting
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(newOwner, tokenId);
        _setTokenURI(tokenId, "");
        _setTokenStats(tokenId,newRarity);
    }


    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        _stats[tokenId]._rarity = 0;
        _stats[tokenId]._str = 0;
        _stats[tokenId]._def = 0;
        _stats[tokenId]._hlt = 0;
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function makeTradeOffer(address _from, address _to, uint256[] memory _offer, uint256[] memory _wants) external {
        require(msg.sender == _from, "Sender must be offerer");
        require(_from != _to, "Cannot trade with yourself");

        for (uint i = 0 ; i < _offer.length; i++) {
            require(ownerOf(_offer[i]) == _from, "Sender doesn't own card");
        }

        for (uint i = 0 ; i < _wants.length; i++) {
            require(ownerOf(_wants[i]) == _to, "Reciever doesn't own card");
        }

        Trade memory trade = Trade({
            id: _tradeIdCounter.current(),
            offerer: _from,
            reciever: _to,
            offers: _offer,
            wants: _wants,
            closed: false
        });
        _tradeIdCounter.increment();

        trades[trade.id] = trade;
        emit TradeOffered(trade.id, _from, _to);
    }

    function acceptTrade(uint256 _tradeId) external {
        Trade storage trade = trades[_tradeId];

        require(trade.id == 0, "Trade doesn't exist");
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

    function declineTrade(uint256 _tradeId) external {
        Trade storage trade = trades[_tradeId];

        require(trade.id == 0, "Trade doesn't exist");
        require(msg.sender == trade.reciever, "Sender must be reciever");
        require(trade.closed == false, "Trade is closed");

        trade.closed = true;

        emit TradeDecline(trade.id, trade.offerer, trade.reciever);
    }

    function closeTrade(uint256 _tradeId) external {
        Trade storage trade = trades[_tradeId];

        require(trade.id == 0, "Trade doesn't exist");
        require(msg.sender == trade.offerer, "Sender must be offerer");
        require(trade.closed == false, "Trade is closed");

        trade.closed = true;

        emit TradeClose(trade.id, trade.offerer, trade.reciever);
    }

    function getTrade(uint256 _tradeId) public view returns (Trade memory) {
        return trades[_tradeId];
    }
}
