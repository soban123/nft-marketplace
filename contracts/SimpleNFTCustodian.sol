// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./SimpleNFT.sol";

contract SimpleNFTCustodian {
    SimpleNFT public simpleNft;
    struct PartialOwnersData {
        uint256 nftId;
        address[] partialOwners;
    }
    PartialOwnersData[] public partialOwnerDataArray;

    function setSimpleNftAddress(SimpleNFT instanceAddress) public {
        simpleNft = instanceAddress;
    }

    function setPartialOwnership(
        address[] memory partialOwnersArray,
        uint256 nftId
    ) public {
        partialOwnerDataArray.push(
            PartialOwnersData({nftId: nftId, partialOwners: partialOwnersArray})
        );
    }

    function getPartialOwnershipAddressById(uint256 nftId)
        public
        view
        returns (address[] memory)
    {
        for (uint256 i = 0; i < partialOwnerDataArray.length; i++) {
            if (partialOwnerDataArray[i].nftId == nftId) {
                return partialOwnerDataArray[i].partialOwners;
            }
        }
    }

    function buyNft(uint256 nftId) public payable {
        uint256 salePrice = simpleNft.getNftPrice(nftId);
        uint256 amountPaid = msg.value;

        require(amountPaid >= salePrice);

        address payable currentOwner = payable(simpleNft.ownerOf(nftId));
        address[] memory partialOwnersAddress = getPartialOwnershipAddressById(
            nftId
        );

        uint256 newAmountPaid = amountPaid / partialOwnersAddress.length;
        for (uint256 i = 0; i < partialOwnersAddress.length; i++) {
            simpleNft.changePartialOwner(partialOwnersAddress[i], nftId);
            payable(partialOwnersAddress[i]).transfer(newAmountPaid);
        }
        // currentOwner.transfer(amountPaid);
        simpleNft.transferNft(currentOwner, msg.sender, nftId);
        simpleNft.markAsSold(nftId);
    }
}
