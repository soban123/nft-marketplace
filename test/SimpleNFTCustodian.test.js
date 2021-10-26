const SimpleNFT = artifacts.require("./SimpleNFT.sol");
const SimpleNFTCustodian = artifacts.require("./SimpleNFTCustodian.sol");

contract("SimpleNFTCustodian", (accounts) => {
  const ORIGINAL_NFT_OWNER = accounts[1];
  const NEW_NFT_OWNER = accounts[2];

  let simpleNftCustodian;
  let simpleNft;

  before(async () => {
    simpleNftCustodian = await SimpleNFTCustodian.deployed();
    simpleNft = await SimpleNFT.deployed();

    await simpleNftCustodian.setSimpleNftAddress(simpleNft.address);

    await simpleNft.mintNft("mock-uri", 100, simpleNftCustodian.address, {
      from: ORIGINAL_NFT_OWNER,
    });
  });
});
