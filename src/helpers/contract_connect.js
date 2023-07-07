const ethers = require("ethers");
const abi = require("./Evoting_Artificats/EVoting");

const connect = async () => {
  const contract_address = process.env.CONTRACT_ADDRESS;
  const privKey = process.env.OWNER_KEY;

  console.log(abi.abi);

  const provider = new ethers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/04609237b2a346949396614cb99d4393");
  const signer = new ethers.Wallet(privKey, provider); // will use first address got 
  const contract = new ethers.Contract(contract_address, abi.abi, signer);

  return contract;
}

module.exports = connect;
