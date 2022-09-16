const { getJsonWalletAddress } = require("@ethersproject/json-wallets");
const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  // const wallet = new ethers.Wallet(process.env.PRIAVTE_KEY, provider);
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  );
  wallet = await getJsonWalletAddress.connect(provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("deploying");
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);

  const currentFavoriteNumber = await contract.retrieve();
  console.log(`Current favorite number ${currentFavoriteNumber.toString()}`);
  const transactionResponse = await contract.store("7");
  const transactionReciept = await transactionResponse.wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(updatedFavoriteNumber.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// synchronous [solidity]
// asynchronous [javascript]

// cooking
// Synchronous
// 1. Put popcorn in microwave -> Promise
// 2. Wait for popcorn to finish
// 3. Pour drinks for everyone

// Asynchronous
// 1. Put popcorn in the mircrowave
// 2. Pour drinks for everyone
// 3. Wait for popcorn to finish

// Promise
// Pending
// Fulfilled
// Rejected
