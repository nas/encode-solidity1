import { ethers } from "ethers";
import "dotenv/config";
import * as tokenJson from "../artifacts/contracts/ERC20.sol/MyToken.json";

const GAS_OPTIONS = {
  maxFeePerGas: 30 * 10 ** 9,
  maxPriorityFeePerGas: 30 * 10 ** 9,
};

function setupProvider() {
  const rpcUrl = process.env.CUSTOM_RPC_URL_MATIC;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  return provider;
}

async function main() {
  // Set up wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  console.log(`Using address ${wallet.address}`);

  // Set up a provider
  const provider = setupProvider();

  // Printing connection URL
  const connectionUrl = provider.connection.url;
  console.log(
    `Connected to the node at ${connectionUrl.replace(
      /\w{25}$/,
      Array(25).fill("*").join("")
    )}`
  );

  // Printing network info
  const network = await provider.getNetwork();
  console.log(`Network name: ${network.name}\nChain Id: ${network.chainId}`);
  const lastBlock = await provider.getBlock("latest");
  console.log(`Connected at height: ${lastBlock.number}`);

  // Set up a signer
  const signer = wallet.connect(provider);

  // Printing wallet info
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough network tokens");
  }

  // Setting the fees
  const maxFeePerGasGwei = ethers.utils.formatUnits(
    GAS_OPTIONS.maxFeePerGas,
    "gwei"
  );
  const maxPriorityFeePerGasGwei = ethers.utils.formatUnits(
    GAS_OPTIONS.maxPriorityFeePerGas,
    "gwei"
  );
  console.log(
    `Using ${maxFeePerGasGwei} maximum Gwei per gas unit and ${maxPriorityFeePerGasGwei} maximum Gwei of priority fee per gas unit`
  );

  // The next methods require network tokens to pay gas

  // Deploy a token
  console.log("Deploying Token contract");
  const tokenFactory = new ethers.ContractFactory(
    tokenJson.abi,
    tokenJson.bytecode,
    signer
  );
  const tokenContract = await tokenFactory.deploy(GAS_OPTIONS);
  console.log("Awaiting confirmations");
  await tokenContract.deployed();
  console.log("Completed");
  console.log(`Contract deployed at ${tokenContract.address}`);

  // Minting 100 decimals of token
  const mintTx = await tokenContract.mint(wallet.address, 100);
  await mintTx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
