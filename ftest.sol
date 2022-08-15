// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TCGTok is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    struct Trade{
        address offerer;
        address reciever;
        uint256[] offers;
        uint256[] wants;
    }
    mapping (address => Trade[]) public openTrades;
    mapping (address => Trade[]) public openTradeOffers;
    struct Statblok {
        uint8 _rarity;
        uint8 _str;
        uint8 _def;
        uint8 _hlt;
        uint256 traded;
    }
    mapping(uint256 => Statblok) public _stats;

    constructor() ERC721("cs1Token", "Meeee") {}

    function _baseURI() internal pure override returns (string memory) {
        return "cshare.dk/nft/";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _setTokenStats(tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal override(ERC721) {
        super._transfer(from, to, tokenId);
        _stats[tokenId].traded += 1;
    }

    // Pseudo-random number gen(override when we get better ideas)
    function _psdFun() internal view returns (uint8) {
        return uint8(uint(keccak256(abi.encode(block.timestamp + gasleft()))) % 8);
    }

    // Roll with advantage: max(Nd8)
    function _roll(uint8 N) internal view returns (uint8){
        uint8 result = 0;
        for(uint8 i = 0; i < N; i++){
            uint8 tmp = _psdFun();
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
        if (_psdFun() <= 5)
            rarity = 1;
        else if(_psdFun() <= 6)
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
    function CombineCards(uint256[4] calldata tokenIds) public {
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
}
