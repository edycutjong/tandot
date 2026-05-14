import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Mock MXNB (Only for testnet/demo)
  const MockMXNBFactory = await ethers.getContractFactory("MockMXNB");
  const mockMXNB = await MockMXNBFactory.deploy();
  await mockMXNB.waitForDeployment();
  const mxnbAddress = await mockMXNB.getAddress();
  
  console.log("MockMXNB deployed to:", mxnbAddress);

  // Deploy TandaEscrow
  const TandaEscrowFactory = await ethers.getContractFactory("TandaEscrow");
  const tandaEscrow = await TandaEscrowFactory.deploy(mxnbAddress);
  await tandaEscrow.waitForDeployment();
  const escrowAddress = await tandaEscrow.getAddress();

  console.log("TandaEscrow deployed to:", escrowAddress);

  console.log("\n=============================================");
  console.log("Please update your .env.local with:");
  console.log(`NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=${escrowAddress}`);
  console.log("=============================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
