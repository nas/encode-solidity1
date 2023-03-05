import { ERC20Votes__factory, MyToken__factory } from "../typechain-types";
import { ethers } from "hardhat";

const MINT_VALUE = ethers.utils.parseEther("10");

// “TokenizedBallot.sol” within your group to
// give voting tokens,
// delegating voting power,
// casting votes,
// checking vote power and
// querying results

// TODO:
// 1. Write scripts/DeployERC20Votes.ts; deploy ERC20Votes - August
// 2. Write scripts/GiveTokens.ts; allots tokens to every account - August
// 3. Write scripts/DeployTokenizeBallot.ts; deploy tokenizedBallot - August
// 4. Write scripts/Delegate.ts; accepts an account address as argument on command line
// 5. scripts/CastVotes.ts
// 6. scripts/QueryResults.ts

async function main() {
  //Deploy contract
  const [deployer, account1, account2] = await ethers.getSigners();
  const contractFactory = new MyToken__factory(deployer);
  const contract = await contractFactory.deploy();
  const deployTransactionReceipt = await contract.deployTransaction.wait();

  console.log(
    `The Tokenized Votes Contract was deployed at the block ${deployTransactionReceipt.blockNumber}`
  );

  //mint tokens
  const mintTx = await contract.mint(account1.address, MINT_VALUE);
  const mintTxReceipt = await mintTx.wait();

  console.log(
    `Tokens minted for ${account1.address} at block ${mintTxReceipt.blockNumber}`
  );

  const tokenBalanceofAccount1 = await contract.balanceOf(account1.address);

  console.log(
    `Account 1 has a balance of ${ethers.utils.formatEther(
      tokenBalanceofAccount1
    )} Vote Tokens`
  );

  const mintTx2 = await contract.mint(account2.address, MINT_VALUE);
  const mintTxReceipt2 = await mintTx2.wait();

  console.log(
    `Tokens minted for ${account2.address} at block ${mintTxReceipt2.blockNumber}`
  );

  const tokenBalanceofAccount2 = await contract.balanceOf(account2.address);

  console.log(
    `Account 1 has a balance of ${ethers.utils.formatEther(
      tokenBalanceofAccount2
    )} Vote Tokens`
  );

  //check voting power
  let votePowerAccount1 = await contract.getVotes(account1.address);

  console.log(
    `Account 1 has a vote power of ${ethers.utils.formatEther(
      votePowerAccount1
    )}`
  );

  const delegateTx = await contract
    .connect(account1)
    .delegate(account1.address);
  const delegateTxReceipt = await delegateTx.wait();

  votePowerAccount1 = await contract.getVotes(account1.address);

  console.log(
    `Account 1 has a vote power of ${ethers.utils.formatEther(
      votePowerAccount1
    )}`
  );
  console.log(
    `Tokens delegated from ${account1.address} for ${
      account1.address
    } at block ${delegateTxReceipt.blockNumber}, for a cost of ${
      delegateTxReceipt.gasUsed
    } gas units, totalling a tx cost of ${delegateTxReceipt.gasUsed.mul(
      delegateTxReceipt.effectiveGasPrice
    )} Wei (${ethers.utils.formatEther(
      delegateTxReceipt.gasUsed.mul(delegateTxReceipt.effectiveGasPrice)
    )} ETH)`
  );
  //what else should happen
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
