import React, { useEffect, useState } from "react";
import getWeb3 from "./getWeb3";
import SimpleNFT from "./contracts/SimpleNFT.json";
import SimpleNFTCustodian from "./contracts/SimpleNFTCustodian.json";

export default function App() {
  const [address, setaddress] = useState("");
  const [price, setprice] = useState("");
  const [uri, seturi] = useState("");
  const [contract, setcontract] = useState("");
  const [contract2, setcontract2] = useState("");
  const [ListedNfts, setListedNfts] = useState([]);
  const [accounts, setaccounts] = useState();
  const [nftIdForPartialOwnership, setnftIdForPartialOwnership] = useState();
  useEffect(() => {
    const getWeb3Custom = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      console.log(accounts, "accounts");
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleNFT.networks[networkId];

      const instance = new web3.eth.Contract(
        SimpleNFT.abi,
        deployedNetwork && deployedNetwork.address
      );

      const deployedNetwork2 = SimpleNFTCustodian.networks[networkId];

      const instance2 = new web3.eth.Contract(
        SimpleNFTCustodian.abi,
        deployedNetwork2 && deployedNetwork2.address
      );
      instance2.methods
        .setSimpleNftAddress(instance._address)
        .send({ from: accounts[0] });

      setcontract2(instance2);
      setaddress(instance2._address);
      console.log("2 con", instance);
      const nfts = instance && (await instance.methods.getAllNfts().call());
      setListedNfts(nfts);
      setaccounts(accounts);
      setcontract(instance);
    };
    getWeb3Custom();
  }, []);

  const handleMint = async () => {
    console.log(typeof contract, "contract");

    await contract.methods
      .mintNft(uri, Number(price), address)
      .send({ from: accounts[0] });

    const nfts = await contract.methods.getAllNfts().call();
    console.log(nfts, "nfts");
    setListedNfts(nfts);
  };

  const handlePartialAddress = () => {
    contract2.methods
      .setPartialOwnership(
        [
          "0xa856394fB5aa232eB7413293bcc9FeDA320Aeb28",
          "0x4c06FAF851b76ddeC8492b090C46d716FACA6ba5",
        ],
        nftIdForPartialOwnership
      )
      .send({ from: accounts[0] });
  };

  const handleGetPartialAddress = async () => {
    console.log(
      await contract2.methods
        .getPartialOwnershipAddressById(nftIdForPartialOwnership)
        .call()
    );
  };

  const handleBuying = async (id) => {
    console.log(id);
    await contract2.methods
      .buyNft(id)
      .send({ from: accounts[0], value: 3000000000000000000 });
    const nfts = await contract.methods.getAllNfts().call();
    console.log(nfts, "nfts");
    setListedNfts(nfts);
  };

  return (
    <div className="p-3 mb-2 bg-dark text-white text-center">
      <div>
        <h1> Welcome To NFT World </h1>
        <h4> Mint Nft </h4>
        <div
          className="d-flex align-items-center justify-content-center "
          style={{ width: "1000px" }}
        >
          <input
            type="text"
            value={price}
            placeholder="price for nft ie:100"
            onChange={(e) => {
              setprice(e.target.value);
            }}
            className="form-control w100"
          />
          <input
            type="text"
            placeholder="URI for nft"
            value={uri}
            onChange={(e) => {
              seturi(e.target.value);
            }}
            className="form-control w100"
          />
          <button onClick={handleMint} className="btn btn-info border-circle">
            {" "}
            Mint{" "}
          </button>
        </div>
      </div>
      <br />
      <div className="d-flex align-items-center w20">
        <input
          type="text"
          placeholder="NFT Id"
          value={nftIdForPartialOwnership}
          onChange={(e) => {
            setnftIdForPartialOwnership(e.target.value);
          }}
          className="form-control w100"
        />
        <button
          onClick={handlePartialAddress}
          className="btn btn-secondary border-circle"
        >
          {" "}
          Set Partial Fractions Address{" "}
        </button>
        <button
          onClick={handleGetPartialAddress}
          className="btn btn-primary border-circle"
        >
          {" "}
          Get Partial Fractions Address{" "}
        </button>
      </div>
      <br />

      <table className="table text-white">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col">price</th>
            <th scope="col">Available</th>
          </tr>
        </thead>
        <tbody>
          {ListedNfts.map((nft) => {
            return (
              <tr>
                <td> {nft.id} </td>
                <td> {nft.price} </td>
                <td>
                  {" "}
                  {nft.isForSale ? (
                    <button onClick={() => handleBuying(nft.id)}> Buy </button>
                  ) : (
                    "Not Available"
                  )}{" "}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
