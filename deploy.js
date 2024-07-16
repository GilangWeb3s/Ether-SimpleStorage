const ethers = require("ethers");
const fs = require("fs-extra");

require("dotenv").config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "process.env.PRIVATE_KEY"
  );
  const wallet = new ethers.Wallet("process.env.PRIVATE_KEY", provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying...");

  // Set a manual gas limit
  const contract = await contractFactory.deploy({ gasLimit: 3000000 });
  const transactionReceipt = await contract. deployTransaction.wait(1);

  console.log("Contract deployed at address:", contract.address);

  const currentFavoriteNumber = await contract.retrieve();
  console.log("Current Favorite Number:", currentFavoriteNumber.toString());

  const transactionResponse = await contract.store("7");
  const TransactionReceipt = await transactionResponse.wait(1);
  const updatedNumber = await contract.retrieve();
  console.log(`updated number is: ${updatedNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
