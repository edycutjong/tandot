import { ethers, run } from "hardhat";

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

  // Verify contracts on Arbiscan (skip on localhost)
  const network = await ethers.provider.getNetwork();
  if (network.chainId !== 31337n) {
    console.log("\nWaiting 30s for block confirmations before verification...");
    await new Promise((resolve) => setTimeout(resolve, 30000));

    try {
      console.log("Verifying MockMXNB...");
      await run("verify:verify", {
        address: mxnbAddress,
        constructorArguments: [],
      });
      console.log("✅ MockMXNB verified");
    } catch (_err) {
      console.log("⚠️ MockMXNB verification failed (may already be verified)");
    }

    try {
      console.log("Verifying TandaEscrow...");
      await run("verify:verify", {
        address: escrowAddress,
        constructorArguments: [mxnbAddress],
      });
      console.log("✅ TandaEscrow verified");
    } catch (_err) {
      console.log("⚠️ TandaEscrow verification failed (may already be verified)");
    }
  }

  console.log("\n=============================================");
  console.log("Please update your .env.local with:");
  console.log(`NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=${escrowAddress}`);
  console.log(`NEXT_PUBLIC_MXNB_TOKEN_ADDRESS=${mxnbAddress}`);
  console.log("=============================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
