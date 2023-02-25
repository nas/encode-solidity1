import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// USAGE: ts-node --files scripts/Deployment.ts Proposal1 Proposal2 Proposal3

function convertStringArrayToBytes32(array: string[]) {
  return array.map((e) => ethers.utils.formatBytes32String(e));
}

async function main() {
  const args = process.argv;
  const proposals = args.slice(2);

  if (proposals.length <= 0)
    throw new Error("Missing parameters for proposals");

  const mnemonic = process.env.MNEMONIC;

  if (!mnemonic || mnemonic?.length <= 0)
    throw new Error("Missing env: Menomic seed");

  const provider = new ethers.providers.EtherscanProvider(
    "goerli",
    process.env.ETHERSCAN_API_KEY
  );
  console.log(await provider.getBlock("latest"));

  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  console.log(`Connected to the wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`${ethers.utils.formatEther(balance)} Eth`);

  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  let ballotContract: Ballot;
  const ballotContractFactory = new Ballot__factory(signer);

  ballotContract = await ballotContractFactory.deploy(
    convertStringArrayToBytes32(proposals)
  );
  const deployTxReceipt = await ballotContract.deployTransaction.wait();

  console.log(
    `The Ballot Contract was deployed at the address ${ballotContract.address}`
  );

  console.log({ deployTxReceipt });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
