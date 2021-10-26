// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SimpleNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    NFT_Sale[] public _listed;

    struct NFT_Sale {
        uint256 id;
        uint256 price;
        bool isForSale;
    }

    constructor() ERC721("MyNFT", "MNFT") {}

    function getNftPrice(uint256 nftId) external view returns (uint256) {
        NFT_Sale storage nft = _listed[nftId];
        return nft.price;
    }

    function markAsSold(uint256 nftId) external {
        NFT_Sale storage nft = _listed[nftId];
        nft.isForSale = false;
    }

    function getAllNfts() public view returns (NFT_Sale[] memory) {
        return _listed;
    }

    function changePartialOwner(address newOwner, uint256 nftId) public {
        // _mint(newOwner, nftId);
        emit ApprovalForAll(msg.sender, newOwner, true);
    }

    function mintNft(
        string memory tokenURI,
        uint256 price,
        address custodian
    ) public {
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        approve(custodian, newItemId);
        NFT_Sale memory sale = NFT_Sale(newItemId, price, true);
        _listed.push(sale);
        _tokenIds.increment();
    }

    function transferNft(
        address currentOwner,
        address newOwner,
        uint256 nftId
    ) external {
        safeTransferFrom(currentOwner, newOwner, nftId);
    }
}
