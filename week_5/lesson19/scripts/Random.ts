import {ethers} from 'hardhat';
import { NotQuiteRandom } from "../typechain-types";
import { PseudoRandom } from "../typechain-types";
import { Random } from "../typechain-types";
import * as readline from 'node:readline';

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(
    "Select operation: \n Options: \n [1]: Random from block hash \n [2]: Toss a coin \n [3]: Message signature \n [4]: Random from a sealed seed \n [5]: Random from block hash plus a sealed seed \n [6]: Random from randao \n",
    (answer) => {
      console.log(`Selected: ${answer}`);
      const option = Number(answer);
      switch (option) {
        case 1:
          blockHashRandomness();
          break;
        case 2:
          tossCoin();
          break;
        case 3:
          signature();
          break;
        case 4:
          sealedSeed();
          break;
        case 5:
          randomSealedSeed();
          break;
        case 6:
          randao();
          break;
        default:
          console.log("Invalid");
          break;
      }
      rl.close();
    }
  );
}

async function blockHashRandomness() {
  const contractFactory = await ethers.getContractFactory("NotQuiteRandom");
  contractFactory.deploy().then(async (result) => {
    result.deployed().then(async (contract: NotQuiteRandom) => {
      const currentBlock = await ethers.provider.getBlock("latest");
      const randomNumber = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock.number}\nBlock hash: ${currentBlock.hash}\nRandom number from this block hash: ${randomNumber}`
      );
      await ethers.provider.send("evm_mine", [currentBlock.timestamp + 1]);
      const currentBlock2 = await ethers.provider.getBlock("latest");
      const randomNumber2 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock2.number}\nBlock hash: ${currentBlock2.hash}\nRandom number from this block hash: ${randomNumber2}`
      );
      await ethers.provider.send("evm_mine", [currentBlock2.timestamp + 1]);
      const currentBlock3 = await ethers.provider.getBlock("latest");
      const randomNumber3 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock3.number}\nBlock hash: ${currentBlock3.hash}\nRandom number from this block hash: ${randomNumber3}`
      );
      await ethers.provider.send("evm_mine", [currentBlock3.timestamp + 1]);
      const currentBlock4 = await ethers.provider.getBlock("latest");
      const randomNumber4 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock4.number}\nBlock hash: ${currentBlock4.hash}\nRandom number from this block hash: ${randomNumber4}`
      );
      await ethers.provider.send("evm_mine", [currentBlock4.timestamp + 1]);
      const currentBlock5 = await ethers.provider.getBlock("latest");
      const randomNumber5 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock5.number}\nBlock hash: ${currentBlock5.hash}\nRandom number from this block hash: ${randomNumber5}`
      );
    });
  });
}

async function tossCoin() {
  const contractFactory = await ethers.getContractFactory("NotQuiteRandom");
  contractFactory.deploy().then(async (result) => {
    result.deployed().then(async (contract: NotQuiteRandom) => {
      const currentBlock = await ethers.provider.getBlock("latest");
      const heads = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock.number}\nBlock hash: ${
          currentBlock.hash
        }\nThe coin landed as: ${heads ? "Heads" : "Tails"}`
      );
      await ethers.provider.send("evm_mine", [currentBlock.timestamp + 1]);
      const currentBlock2 = await ethers.provider.getBlock("latest");
      const heads2 = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock2.number}\nBlock hash: ${
          currentBlock2.hash
        }\nThe coin landed as: ${heads2 ? "Heads" : "Tails"}`
      );
      await ethers.provider.send("evm_mine", [currentBlock2.timestamp + 1]);
      const currentBlock3 = await ethers.provider.getBlock("latest");
      const heads3 = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock3.number}\nBlock hash: ${
          currentBlock3.hash
        }\nThe coin landed as: ${heads3 ? "Heads" : "Tails"}`
      );
      await ethers.provider.send("evm_mine", [currentBlock3.timestamp + 1]);
      const currentBlock4 = await ethers.provider.getBlock("latest");
      const heads4 = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock4.number}\nBlock hash: ${
          currentBlock4.hash
        }\nThe coin landed as: ${heads4 ? "Heads" : "Tails"}`
      );
      await ethers.provider.send("evm_mine", [currentBlock4.timestamp + 1]);
      const currentBlock5 = await ethers.provider.getBlock("latest");
      const heads5 = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock5.number}\nBlock hash: ${
          currentBlock5.hash
        }\nThe coin landed as: ${heads5 ? "Heads" : "Tails"}`
      );
    });
  });
}

async function signature() {
  const signers = await ethers.getSigners();
  const signer = signers[0];
  console.log(
    `Signing a message with the account of address ${signer.address}`
  );
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter a message to be signed:\n", async (answer) => {
    const signedMessage = await signer.signMessage(answer);
    console.log(`The signed message is:\n${signedMessage}`);
    rl.close();
    testSignature();
  });
}

async function testSignature() {
  console.log("Verifying signature\n");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter message signature:\n", (signature) => {
    rl.question("Enter message:\n", (message) => {
      const address = ethers.utils.verifyMessage(message, signature);
      console.log(`This message signature matches with address ${address}`);
      rl.question("Repeat? [Y/N]:\n", (answer) => {
        rl.close();
        if (answer.toLowerCase() === "y") {
          testSignature();
        }
      });
    });
  });
}

async function sealedSeed() {
  console.log("Deploying contract");
  const contractFactory = await ethers.getContractFactory("PseudoRandom");
  const contract: PseudoRandom = await contractFactory.deploy();
  await contract.deployed();
  const signers = await ethers.getSigners();
  const signer = signers[0];
  console.log(
    `Signing a message with the account of address ${signer.address}`
  );
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter a random seed to be signed:\n", async (seed) => {
    const signedMessage = await signer.signMessage(seed);
    rl.close();
    console.log(`The signed message is:\n${signedMessage}`);
    const sig = ethers.utils.splitSignature(signedMessage);
    console.log("Saving signature at contract");
    await contract.setSignature(sig.v, sig.r, sig.s);
    try {
      console.log("Trying to get a number with the original seed");
      const randomNumber = await contract.getRandomNumber(seed);
      console.log(`Random number result:\n${randomNumber}`);
      console.log("Trying to get a number without the original seed");
      const fakeSeed = "FAKE_SEED";
      const randomNumber2 = await contract.getRandomNumber(fakeSeed);
      console.log(`Random number result:\n${randomNumber2}`);
    } catch (error) {
      console.log("Operation failed");
    }
  });
}

async function randomSealedSeed() {
  console.log("Deploying contract");
  const contractFactory = await ethers.getContractFactory("PseudoRandom");
  const contract: PseudoRandom = await contractFactory.deploy();
  await contract.deployed();
  const signers = await ethers.getSigners();
  const signer = signers[0];
  console.log(
    `Signing a message with the account of address ${signer.address}`
  );
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter a random seed to be signed:\n", async (seed) => {
    const signedMessage = await signer.signMessage(seed);
    rl.close();
    console.log(`The signed message is:\n${signedMessage}`);
    const sig = ethers.utils.splitSignature(signedMessage);
    console.log("Saving signature at contract");
    await contract.setSignature(sig.v, sig.r, sig.s);
    try {
      console.log("Trying to get a number with the original seed");
      const randomNumber = await contract.getCombinedRandomNumber(seed);
      console.log(`Random number result:\n${randomNumber}`);
      console.log("Trying to get a number without the original seed");
      const fakeSeed = "FAKE_SEED";
      const randomNumber2 = await contract.getCombinedRandomNumber(fakeSeed);
      console.log(`Random number result:\n${randomNumber2}`);
    } catch (error) {
      console.log("Operation failed");
    }
  });
}

async function randao() {
  const contractFactory = await ethers.getContractFactory("Random");
  contractFactory.deploy().then(async (result) => {
    result.deployed().then(async (contract: Random) => {
      const currentBlock = await ethers.provider.getBlock("latest");
      const randomNumber = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock.number}\nBlock difficulty: ${currentBlock.difficulty}\nRandom number from this block difficulty: ${randomNumber}`
      );
      await ethers.provider.send("evm_mine", [currentBlock.timestamp + 1]);
      const currentBlock2 = await ethers.provider.getBlock("latest");
      const randomNumber2 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock2.number}\nBlock difficulty: ${currentBlock2.difficulty}\nRandom number from this block difficulty: ${randomNumber2}`
      );
      await ethers.provider.send("evm_mine", [currentBlock2.timestamp + 1]);
      const currentBlock3 = await ethers.provider.getBlock("latest");
      const randomNumber3 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock3.number}\nBlock difficulty: ${currentBlock3.difficulty}\nRandom number from this block difficulty: ${randomNumber3}`
      );
      await ethers.provider.send("evm_mine", [currentBlock3.timestamp + 1]);
      const currentBlock4 = await ethers.provider.getBlock("latest");
      const randomNumber4 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock4.number}\nBlock difficulty: ${currentBlock4.difficulty}\nRandom number from this block difficulty: ${randomNumber4}`
      );
      await ethers.provider.send("evm_mine", [currentBlock4.timestamp + 1]);
      const currentBlock5 = await ethers.provider.getBlock("latest");
      const randomNumber5 = await contract.getRandomNumber();
      console.log(
        `Block number: ${currentBlock5.number}\nBlock difficulty: ${currentBlock5.difficulty}\nRandom number from this block difficulty: ${randomNumber5}`
      );
    });
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

