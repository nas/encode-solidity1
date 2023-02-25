
import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// Get a provider
// Ger the signer from .env
// create contract instance attach
// Interact with the contract


function convertStringArrayToBytes32(array: string[]) {
  return array.map((e) => ethers.utils.formatBytes32String(e));
}
async function main() {
  const args = process.argv;
  console.log(args);
  const proposals = args.slice(2);

  if (proposals.length <= 0)
    throw new Error("Mission parameters for proposals");

  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic || mnemonic?.length <= 0)
    throw new Error("Missing env: Menomic seed");

  const provider = new ethers.providers.EtherscanProvider(
    "goerli",
    process.env.ETHERSCAN_API_KEY
  );
  console.log(await provider.getBlock("latest"));

  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  console.log(`Connected to the wallet address ${wallet}`);

  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`${balance} wei`);

  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  let ballotContract: Ballot;
  const ballotContractFactory = new Ballot__factory(signer);

  ballotContract = ballotContractFactory.attach(
    "0x9A67DF050425C5083E95D8CaF781f5101f8CCe5F"
  );

  console.log(
    `The Ballot Contract was deployed at the address ${ballotContract.address}`
  );

  const p1 = await ballotContract.proposals(0);
  console.log(
    `Read proposals from ballot Contract: ${ethers.utils.parseBytes32String(
      p1.name
    )}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
